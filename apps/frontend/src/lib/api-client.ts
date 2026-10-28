import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import type {
  ApiResponse,
  PaginatedData,
} from "@/types/api";
import type {
  CareerProfile,
  CareerProfileFull,
  WorkExperience,
  WorkExperienceBullet,
  WorkExperienceSkill,
  WorkExperienceHighlight,
  Education,
  EducationBullet,
  Skill,
  SkillCategory,
  Certification,
  Project,
  ProjectBullet,
  ProjectSkill,
  Language,
  VolunteerExperience,
  Publication,
  Patent,
  Award,
  Recommendation,
  CareerGoal,
  CustomSection,
  ImportRecord,
  ImportConflict,
  ImportRequest,
  DraftData,
  AutosavePayload,
  AutosaveResponse,
  ProfileSearchRequest,
  ProfileSearchResult,
  ProfileStats,
  WorkExperienceCreate,
  EducationCreate,
  SkillCreate,
  CertificationCreate,
  ProjectCreate,
  LanguageCreate,
  VolunteerExperienceCreate,
  PublicationCreate,
  PatentCreate,
  AwardCreate,
  RecommendationCreate,
  CareerGoalCreate,
  CustomSectionCreate,
  ExportRequest,
  PaginationParams,
} from "@/types/career-profile";

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: Error | null, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post("/api/v1/auth/refresh", {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = data.data ?? data;

        useAuthStore.getState().setTokens({
          access_token,
          refresh_token,
          token_type: "Bearer",
          expires_in: 3600,
        });

        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const api = {
  get: <T>(url: string, config?: { params?: Record<string, unknown> }) =>
    apiClient.get<T>(url, config),
  post: <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data),
  put: <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data),
  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<T>(url, data),
  delete: <T>(url: string, config?: { params?: Record<string, unknown> }) =>
    apiClient.delete<T>(url, config),
};

export const careerProfileApi = {
  getCareerProfile: () =>
    api.get<ApiResponse<CareerProfileFull>>("/career-profile"),
  createOrUpdateCareerProfile: (data: Partial<CareerProfile>) =>
    api.post<ApiResponse<CareerProfile>>("/career-profile", data),
  updateCareerProfile: (data: Partial<CareerProfile>) =>
    api.put<ApiResponse<CareerProfile>>("/career-profile", data),
  deleteCareerProfile: () =>
    api.delete("/career-profile"),
  getCareerProfileStats: () =>
    api.get<ApiResponse<ProfileStats>>("/career-profile/stats"),

  getWorkExperiences: (params?: PaginationParams) =>
    api.get<PaginatedData<WorkExperience>>("/career-profile/work-experiences", { params: params as unknown as Record<string, unknown> }),
  createWorkExperience: (data: WorkExperienceCreate) =>
    api.post<ApiResponse<WorkExperience>>("/career-profile/work-experiences", data),
  getWorkExperience: (id: string) =>
    api.get<ApiResponse<WorkExperience>>(`/career-profile/work-experiences/${id}`),
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) =>
    api.put<ApiResponse<WorkExperience>>(`/career-profile/work-experiences/${id}`, data),
  deleteWorkExperience: (id: string) =>
    api.delete(`/career-profile/work-experiences/${id}`),
  reorderWorkExperiences: (orderedIds: string[]) =>
    api.post("/career-profile/work-experiences/reorder", { entity_type: "work_experience", ordered_ids: orderedIds }),
  addWorkExperienceBullet: (expId: string, data: { content: string }) =>
    api.post<ApiResponse<WorkExperienceBullet>>(`/career-profile/work-experiences/${expId}/bullets`, data),
  deleteWorkExperienceBullet: (expId: string, bulletId: string) =>
    api.delete(`/career-profile/work-experiences/${expId}/bullets/${bulletId}`),
  addWorkExperienceSkill: (expId: string, data: { skill_name: string }) =>
    api.post<ApiResponse<WorkExperienceSkill>>(`/career-profile/work-experiences/${expId}/skills`, data),
  deleteWorkExperienceSkill: (expId: string, skillId: string) =>
    api.delete(`/career-profile/work-experiences/${expId}/skills/${skillId}`),
  addWorkExperienceHighlight: (expId: string, data: { content: string; metric_value?: string; metric_type?: string }) =>
    api.post<ApiResponse<WorkExperienceHighlight>>(`/career-profile/work-experiences/${expId}/highlights`, data),
  deleteWorkExperienceHighlight: (expId: string, highlightId: string) =>
    api.delete(`/career-profile/work-experiences/${expId}/highlights/${highlightId}`),

  getEducations: (params?: PaginationParams) =>
    api.get<PaginatedData<Education>>("/career-profile/educations", { params: params as unknown as Record<string, unknown> }),
  createEducation: (data: EducationCreate) =>
    api.post<ApiResponse<Education>>("/career-profile/educations", data),
  getEducation: (id: string) =>
    api.get<ApiResponse<Education>>(`/career-profile/educations/${id}`),
  updateEducation: (id: string, data: Partial<Education>) =>
    api.put<ApiResponse<Education>>(`/career-profile/educations/${id}`, data),
  deleteEducation: (id: string) =>
    api.delete(`/career-profile/educations/${id}`),
  reorderEducations: (orderedIds: string[]) =>
    api.post("/career-profile/educations/reorder", { entity_type: "education", ordered_ids: orderedIds }),
  addEducationBullet: (eduId: string, data: { content: string; bullet_type?: string }) =>
    api.post<ApiResponse<EducationBullet>>(`/career-profile/educations/${eduId}/bullets`, data),
  deleteEducationBullet: (eduId: string, bulletId: string) =>
    api.delete(`/career-profile/educations/${eduId}/bullets/${bulletId}`),

  getSkills: (params?: PaginationParams) =>
    api.get<PaginatedData<Skill>>("/career-profile/skills", { params: params as unknown as Record<string, unknown> }),
  createSkill: (data: SkillCreate) =>
    api.post<ApiResponse<Skill>>("/career-profile/skills", data),
  updateSkill: (id: string, data: Partial<Skill>) =>
    api.put<ApiResponse<Skill>>(`/career-profile/skills/${id}`, data),
  deleteSkill: (id: string) =>
    api.delete(`/career-profile/skills/${id}`),
  reorderSkills: (orderedIds: string[]) =>
    api.post("/career-profile/skills/reorder", { entity_type: "skill", ordered_ids: orderedIds }),
  getSkillCategories: () =>
    api.get<ApiResponse<SkillCategory[]>>("/career-profile/skill-categories"),
  createSkillCategory: (data: { name: string }) =>
    api.post<ApiResponse<SkillCategory>>("/career-profile/skill-categories", data),
  updateSkillCategory: (id: string, data: { name: string }) =>
    api.put<ApiResponse<SkillCategory>>(`/career-profile/skill-categories/${id}`, data),
  deleteSkillCategory: (id: string) =>
    api.delete(`/career-profile/skill-categories/${id}`),

  getCertifications: (params?: PaginationParams) =>
    api.get<PaginatedData<Certification>>("/career-profile/certifications", { params: params as unknown as Record<string, unknown> }),
  createCertification: (data: CertificationCreate) =>
    api.post<ApiResponse<Certification>>("/career-profile/certifications", data),
  updateCertification: (id: string, data: Partial<Certification>) =>
    api.put<ApiResponse<Certification>>(`/career-profile/certifications/${id}`, data),
  deleteCertification: (id: string) =>
    api.delete(`/career-profile/certifications/${id}`),
  reorderCertifications: (orderedIds: string[]) =>
    api.post("/career-profile/certifications/reorder", { entity_type: "certification", ordered_ids: orderedIds }),

  getProjects: (params?: PaginationParams) =>
    api.get<PaginatedData<Project>>("/career-profile/projects", { params: params as unknown as Record<string, unknown> }),
  createProject: (data: ProjectCreate) =>
    api.post<ApiResponse<Project>>("/career-profile/projects", data),
  getProject: (id: string) =>
    api.get<ApiResponse<Project>>(`/career-profile/projects/${id}`),
  updateProject: (id: string, data: Partial<Project>) =>
    api.put<ApiResponse<Project>>(`/career-profile/projects/${id}`, data),
  deleteProject: (id: string) =>
    api.delete(`/career-profile/projects/${id}`),
  reorderProjects: (orderedIds: string[]) =>
    api.post("/career-profile/projects/reorder", { entity_type: "project", ordered_ids: orderedIds }),
  addProjectBullet: (projId: string, data: { content: string }) =>
    api.post<ApiResponse<ProjectBullet>>(`/career-profile/projects/${projId}/bullets`, data),
  deleteProjectBullet: (projId: string, bulletId: string) =>
    api.delete(`/career-profile/projects/${projId}/bullets/${bulletId}`),
  addProjectSkill: (projId: string, data: { skill_name: string }) =>
    api.post<ApiResponse<ProjectSkill>>(`/career-profile/projects/${projId}/skills`, data),
  deleteProjectSkill: (projId: string, skillId: string) =>
    api.delete(`/career-profile/projects/${projId}/skills/${skillId}`),

  getLanguages: (params?: PaginationParams) =>
    api.get<PaginatedData<Language>>("/career-profile/languages", { params: params as unknown as Record<string, unknown> }),
  createLanguage: (data: LanguageCreate) =>
    api.post<ApiResponse<Language>>("/career-profile/languages", data),
  updateLanguage: (id: string, data: Partial<Language>) =>
    api.put<ApiResponse<Language>>(`/career-profile/languages/${id}`, data),
  deleteLanguage: (id: string) =>
    api.delete(`/career-profile/languages/${id}`),
  reorderLanguages: (orderedIds: string[]) =>
    api.post("/career-profile/languages/reorder", { entity_type: "language", ordered_ids: orderedIds }),

  getVolunteerExperiences: (params?: PaginationParams) =>
    api.get<PaginatedData<VolunteerExperience>>("/career-profile/volunteer-experiences", { params: params as unknown as Record<string, unknown> }),
  createVolunteerExperience: (data: VolunteerExperienceCreate) =>
    api.post<ApiResponse<VolunteerExperience>>("/career-profile/volunteer-experiences", data),
  getVolunteerExperience: (id: string) =>
    api.get<ApiResponse<VolunteerExperience>>(`/career-profile/volunteer-experiences/${id}`),
  updateVolunteerExperience: (id: string, data: Partial<VolunteerExperience>) =>
    api.put<ApiResponse<VolunteerExperience>>(`/career-profile/volunteer-experiences/${id}`, data),
  deleteVolunteerExperience: (id: string) =>
    api.delete(`/career-profile/volunteer-experiences/${id}`),
  reorderVolunteerExperiences: (orderedIds: string[]) =>
    api.post("/career-profile/volunteer-experiences/reorder", { entity_type: "volunteer_experience", ordered_ids: orderedIds }),

  getPublications: (params?: PaginationParams) =>
    api.get<PaginatedData<Publication>>("/career-profile/publications", { params: params as unknown as Record<string, unknown> }),
  createPublication: (data: PublicationCreate) =>
    api.post<ApiResponse<Publication>>("/career-profile/publications", data),
  updatePublication: (id: string, data: Partial<Publication>) =>
    api.put<ApiResponse<Publication>>(`/career-profile/publications/${id}`, data),
  deletePublication: (id: string) =>
    api.delete(`/career-profile/publications/${id}`),
  reorderPublications: (orderedIds: string[]) =>
    api.post("/career-profile/publications/reorder", { entity_type: "publication", ordered_ids: orderedIds }),

  getPatents: (params?: PaginationParams) =>
    api.get<PaginatedData<Patent>>("/career-profile/patents", { params: params as unknown as Record<string, unknown> }),
  createPatent: (data: PatentCreate) =>
    api.post<ApiResponse<Patent>>("/career-profile/patents", data),
  updatePatent: (id: string, data: Partial<Patent>) =>
    api.put<ApiResponse<Patent>>(`/career-profile/patents/${id}`, data),
  deletePatent: (id: string) =>
    api.delete(`/career-profile/patents/${id}`),
  reorderPatents: (orderedIds: string[]) =>
    api.post("/career-profile/patents/reorder", { entity_type: "patent", ordered_ids: orderedIds }),

  getAwards: (params?: PaginationParams) =>
    api.get<PaginatedData<Award>>("/career-profile/awards", { params: params as unknown as Record<string, unknown> }),
  createAward: (data: AwardCreate) =>
    api.post<ApiResponse<Award>>("/career-profile/awards", data),
  updateAward: (id: string, data: Partial<Award>) =>
    api.put<ApiResponse<Award>>(`/career-profile/awards/${id}`, data),
  deleteAward: (id: string) =>
    api.delete(`/career-profile/awards/${id}`),
  reorderAwards: (orderedIds: string[]) =>
    api.post("/career-profile/awards/reorder", { entity_type: "award", ordered_ids: orderedIds }),

  getRecommendations: (params?: PaginationParams) =>
    api.get<PaginatedData<Recommendation>>("/career-profile/recommendations", { params: params as unknown as Record<string, unknown> }),
  createRecommendation: (data: RecommendationCreate) =>
    api.post<ApiResponse<Recommendation>>("/career-profile/recommendations", data),
  updateRecommendation: (id: string, data: Partial<Recommendation>) =>
    api.put<ApiResponse<Recommendation>>(`/career-profile/recommendations/${id}`, data),
  deleteRecommendation: (id: string) =>
    api.delete(`/career-profile/recommendations/${id}`),
  reorderRecommendations: (orderedIds: string[]) =>
    api.post("/career-profile/recommendations/reorder", { entity_type: "recommendation", ordered_ids: orderedIds }),

  getCareerGoals: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerGoal>>("/career-profile/goals", { params: params as unknown as Record<string, unknown> }),
  createCareerGoal: (data: CareerGoalCreate) =>
    api.post<ApiResponse<CareerGoal>>("/career-profile/goals", data),
  updateCareerGoal: (id: string, data: Partial<CareerGoal>) =>
    api.put<ApiResponse<CareerGoal>>(`/career-profile/goals/${id}`, data),
  deleteCareerGoal: (id: string) =>
    api.delete(`/career-profile/goals/${id}`),
  reorderCareerGoals: (orderedIds: string[]) =>
    api.post("/career-profile/goals/reorder", { entity_type: "career_goal", ordered_ids: orderedIds }),

  getCustomSections: (params?: PaginationParams) =>
    api.get<PaginatedData<CustomSection>>("/career-profile/custom-sections", { params: params as unknown as Record<string, unknown> }),
  createCustomSection: (data: CustomSectionCreate) =>
    api.post<ApiResponse<CustomSection>>("/career-profile/custom-sections", data),
  updateCustomSection: (id: string, data: Partial<CustomSection>) =>
    api.put<ApiResponse<CustomSection>>(`/career-profile/custom-sections/${id}`, data),
  deleteCustomSection: (id: string) =>
    api.delete(`/career-profile/custom-sections/${id}`),
  reorderCustomSections: (orderedIds: string[]) =>
    api.post("/career-profile/custom-sections/reorder", { entity_type: "custom_section", ordered_ids: orderedIds }),

  startImport: (data: ImportRequest) =>
    api.post<ApiResponse<ImportRecord>>("/career-profile/import", data),
  getImportStatus: (id: string) =>
    api.get<ApiResponse<ImportRecord>>(`/career-profile/import/${id}`),
  getImportConflicts: (id: string) =>
    api.get<ApiResponse<ImportConflict[]>>(`/career-profile/import/${id}/conflicts`),
  resolveImportConflicts: (id: string, resolutions: ImportConflict[]) =>
    api.post(`/career-profile/import/${id}/resolve`, { resolutions }),
  exportProfile: (data: ExportRequest) =>
    api.post<ApiResponse<Record<string, unknown>>>("/career-profile/export", data),

  autosave: (data: AutosavePayload) =>
    api.post<ApiResponse<AutosaveResponse>>("/career-profile/autosave", data),
  saveDraft: (data: DraftData) =>
    api.post<ApiResponse<DraftData>>("/career-profile/draft", data),
  getDraft: () =>
    api.get<ApiResponse<DraftData>>("/career-profile/draft"),
  discardDraft: () =>
    api.delete("/career-profile/draft"),

  searchProfile: (data: ProfileSearchRequest) =>
    api.post<ApiResponse<ProfileSearchResult[]>>("/career-profile/search", data),
};

import type {
  Resume,
  ResumeListItem,
  ResumeDetail,
  ResumeCreate,
  ResumeUpdate,
  ResumeVersion,
  ResumeSection,
  ResumeCustomization,
  ResumeTemplate,
  ResumeAnalytics,
  ResumeAnalyticsSummary,
  ResumeTag,
  ResumeCollection,
  ResumeShare,
  ResumeComment,
  ResumeExport,
  ResumeHistory,
  ResumeOptimization,
  ResumeFeedback,
  ResumeSearchRequest,
  ResumeBulkAction,
  ExportFormat,
} from "@/types/resume";
import type {
  AIRequest,
  AIExecution,
  AIProvider,
  AIModel,
  Prompt,
  PromptVersion,
  PromptExecution,
  AIUsage,
  AIUsageSummary,
  AIQuota,
  AISettings,
  AICacheEntry,
  AICacheStats,
  AIConversation,
  AIConversationDetail,
  AIMessage,
  AIArtifact,
  AIExecuteRequest,
  AIExecuteResponse,
  AIConversationCreate,
  AIConversationMessage,
  AIArtifactCreate,
  AISearchRequest,
  AITokenUsageTrend,
  AILatencyTrend,
  AICostTrend,
  AIModule,
} from "@/types/ai";

export const resumeApi = {
  getResumes: (params?: PaginationParams) =>
    api.get<PaginatedData<ResumeListItem>>("/resumes", { params: params as unknown as Record<string, unknown> }),
  createResume: (data: ResumeCreate) =>
    api.post<ApiResponse<Resume>>("/resumes", data),
  getResume: (id: string) =>
    api.get<ApiResponse<ResumeDetail>>(`/resumes/${id}`),
  updateResume: (id: string, data: ResumeUpdate) =>
    api.put<ApiResponse<Resume>>(`/resumes/${id}`, data),
  deleteResume: (id: string) =>
    api.delete(`/resumes/${id}`),
  publishResume: (id: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${id}/publish`),
  archiveResume: (id: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${id}/archive`),
  restoreResume: (id: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${id}/restore`),
  forkResume: (id: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${id}/fork`),
  duplicateResume: (id: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${id}/duplicate`),
  setDefaultResume: (id: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${id}/set-default`),

  getResumeVersions: (id: string) =>
    api.get<ApiResponse<ResumeVersion[]>>(`/resumes/${id}/versions`),
  getResumeVersion: (id: string, vid: string) =>
    api.get<ApiResponse<ResumeVersion>>(`/resumes/${id}/versions/${vid}`),
  createVersion: (id: string, data: { title: string; change_summary?: string }) =>
    api.post<ApiResponse<ResumeVersion>>(`/resumes/${id}/versions`, data),
  restoreVersion: (id: string, vid: string) =>
    api.post<ApiResponse<ResumeVersion>>(`/resumes/${id}/versions/${vid}/restore`),
  compareVersions: (id: string, leftId: string, rightId: string) =>
    api.get<ApiResponse<{ left: ResumeVersion; right: ResumeVersion; diff: Record<string, unknown> }>>(
      `/resumes/${id}/versions/compare`,
      { params: { left_id: leftId, right_id: rightId } }
    ),

  getResumeSections: (id: string) =>
    api.get<ApiResponse<ResumeSection[]>>(`/resumes/${id}/sections`),
  updateSection: (id: string, sectionId: string, data: Partial<ResumeSection>) =>
    api.put<ApiResponse<ResumeSection>>(`/resumes/${id}/sections/${sectionId}`, data),
  reorderSections: (id: string, orderedIds: string[]) =>
    api.post(`/resumes/${id}/sections/reorder`, { ordered_ids: orderedIds }),
  bulkUpdateSections: (id: string, updates: Array<{ section_id: string; data: Partial<ResumeSection> }>) =>
    api.post(`/resumes/${id}/sections/bulk`, { updates }),

  getResumeCustomizations: (id: string) =>
    api.get<ApiResponse<ResumeCustomization[]>>(`/resumes/${id}/customizations`),
  createCustomization: (id: string, data: Partial<ResumeCustomization>) =>
    api.post<ApiResponse<ResumeCustomization>>(`/resumes/${id}/customizations`, data),
  updateCustomization: (id: string, customizationId: string, data: Partial<ResumeCustomization>) =>
    api.put<ApiResponse<ResumeCustomization>>(`/resumes/${id}/customizations/${customizationId}`, data),
  bulkCustomizations: (id: string, customizations: Partial<ResumeCustomization>[]) =>
    api.post(`/resumes/${id}/customizations/bulk`, { customizations }),

  getTemplates: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<ResumeTemplate[]>>("/resume-templates", { params }),
  getTemplate: (id: string) =>
    api.get<ApiResponse<ResumeTemplate>>(`/resume-templates/${id}`),
  createTemplate: (data: Partial<ResumeTemplate>) =>
    api.post<ApiResponse<ResumeTemplate>>("/resume-templates", data),
  updateTemplate: (id: string, data: Partial<ResumeTemplate>) =>
    api.put<ApiResponse<ResumeTemplate>>(`/resume-templates/${id}`, data),
  deleteTemplate: (id: string) =>
    api.delete(`/resume-templates/${id}`),
  applyTemplate: (resumeId: string, templateId: string) =>
    api.post<ApiResponse<Resume>>(`/resumes/${resumeId}/apply-template`, { template_id: templateId }),

  getResumeAnalytics: (id: string) =>
    api.get<ApiResponse<ResumeAnalytics>>(`/resumes/${id}/analytics`),
  getAnalyticsSummary: () =>
    api.get<ApiResponse<ResumeAnalyticsSummary>>("/resumes/analytics/summary"),
  recordView: (id: string) =>
    api.post(`/resumes/${id}/analytics/view`),
  recordDownload: (id: string) =>
    api.post(`/resumes/${id}/analytics/download`),
  recordShare: (id: string) =>
    api.post(`/resumes/${id}/analytics/share`),

  getResumeTags: (id: string) =>
    api.get<ApiResponse<ResumeTag[]>>(`/resumes/${id}/tags`),
  addTags: (id: string, tags: Array<{ name: string; color?: string }>) =>
    api.post<ApiResponse<ResumeTag[]>>(`/resumes/${id}/tags`, { tags }),
  removeTag: (id: string, tagId: string) =>
    api.delete(`/resumes/${id}/tags/${tagId}`),

  getCollections: () =>
    api.get<ApiResponse<ResumeCollection[]>>("/resume-collections"),
  getCollection: (id: string) =>
    api.get<ApiResponse<ResumeCollection>>(`/resume-collections/${id}`),
  createCollection: (data: { name: string; description?: string }) =>
    api.post<ApiResponse<ResumeCollection>>("/resume-collections", data),
  updateCollection: (id: string, data: { name?: string; description?: string }) =>
    api.put<ApiResponse<ResumeCollection>>(`/resume-collections/${id}`, data),
  deleteCollection: (id: string) =>
    api.delete(`/resume-collections/${id}`),
  addToCollection: (collectionId: string, resumeId: string) =>
    api.post(`/resume-collections/${collectionId}/items`, { resume_id: resumeId }),
  removeFromCollection: (collectionId: string, resumeId: string) =>
    api.delete(`/resume-collections/${collectionId}/items/${resumeId}`),

  getResumeShares: (id: string) =>
    api.get<ApiResponse<ResumeShare[]>>(`/resumes/${id}/shares`),
  createShare: (id: string, data: { shared_with?: string; permission: "view" | "comment" | "edit"; expires_at?: string }) =>
    api.post<ApiResponse<ResumeShare>>(`/resumes/${id}/shares`, data),
  revokeShare: (id: string, shareId: string) =>
    api.delete(`/resumes/${id}/shares/${shareId}`),
  generatePublicLink: (id: string, expiresAt?: string) =>
    api.post<ApiResponse<{ share_token: string; url: string }>>(`/resumes/${id}/public-link`, { expires_at: expiresAt }),

  getResumeComments: (id: string) =>
    api.get<ApiResponse<ResumeComment[]>>(`/resumes/${id}/comments`),
  addComment: (id: string, data: { content: string; section_type?: string; entity_type?: string; entity_id?: string; parent_comment_id?: string; position?: { x: number; y: number } }) =>
    api.post<ApiResponse<ResumeComment>>(`/resumes/${id}/comments`, data),
  updateComment: (id: string, commentId: string, data: { content: string }) =>
    api.put<ApiResponse<ResumeComment>>(`/resumes/${id}/comments/${commentId}`, data),
  deleteComment: (id: string, commentId: string) =>
    api.delete(`/resumes/${id}/comments/${commentId}`),
  resolveComment: (id: string, commentId: string) =>
    api.post<ApiResponse<ResumeComment>>(`/resumes/${id}/comments/${commentId}/resolve`),

  exportResume: (id: string, format: ExportFormat, settings?: Record<string, unknown>, versionId?: string) =>
    api.post<ApiResponse<ResumeExport>>(`/resumes/${id}/export`, { format, settings, version_id: versionId }),
  getResumeExports: (id: string) =>
    api.get<ApiResponse<ResumeExport[]>>(`/resumes/${id}/exports`),

  getResumeHistory: (id: string) =>
    api.get<ApiResponse<ResumeHistory[]>>(`/resumes/${id}/history`),

  getResumeOptimizations: (id: string) =>
    api.get<ApiResponse<ResumeOptimization[]>>(`/resumes/${id}/optimizations`),
  acceptOptimization: (id: string, optimizationId: string) =>
    api.post<ApiResponse<ResumeOptimization>>(`/resumes/${id}/optimizations/${optimizationId}/accept`),
  rejectOptimization: (id: string, optimizationId: string) =>
    api.post<ApiResponse<ResumeOptimization>>(`/resumes/${id}/optimizations/${optimizationId}/reject`),
  applyOptimization: (id: string, optimizationId: string) =>
    api.post<ApiResponse<ResumeOptimization>>(`/resumes/${id}/optimizations/${optimizationId}/apply`),

  getResumeFeedback: (id: string) =>
    api.get<ApiResponse<ResumeFeedback[]>>(`/resumes/${id}/feedback`),
  submitFeedback: (id: string, data: { feedback_type: "rating" | "comment" | "suggestion" | "issue"; rating?: number; content?: string; section_type?: string; entity_type?: string; entity_id?: string }) =>
    api.post<ApiResponse<ResumeFeedback>>(`/resumes/${id}/feedback`, data),

  searchResumes: (params: ResumeSearchRequest) =>
    api.post<ApiResponse<ResumeListItem[]>>("/resumes/search", params),
  bulkAction: (data: ResumeBulkAction) =>
    api.post("/resumes/bulk", data),
};

export const aiApi = {
  execute: (data: AIExecuteRequest) =>
    api.post<ApiResponse<AIExecuteResponse>>("/ai/execute", data),
  executeStreaming: (data: AIExecuteRequest) =>
    api.post<ApiResponse<AIExecuteResponse>>("/ai/execute/stream", data),

  getRequests: (params?: PaginationParams) =>
    api.get<PaginatedData<AIRequest>>("/ai/requests", {
      params: params as unknown as Record<string, unknown>,
    }),
  searchRequests: (params: AISearchRequest) =>
    api.post<ApiResponse<AIRequest[]>>("/ai/requests/search", params),
  getRequest: (id: string) =>
    api.get<ApiResponse<AIRequest>>(`/ai/requests/${id}`),
  cancelRequest: (id: string) =>
    api.post<ApiResponse<AIRequest>>(`/ai/requests/${id}/cancel`),
  retryRequest: (id: string) =>
    api.post<ApiResponse<AIRequest>>(`/ai/requests/${id}/retry`),

  getExecutions: (requestId: string) =>
    api.get<ApiResponse<AIExecution[]>>(`/ai/requests/${requestId}/executions`),
  getExecution: (id: string) =>
    api.get<ApiResponse<AIExecution>>(`/ai/executions/${id}`),

  getProviders: () =>
    api.get<ApiResponse<AIProvider[]>>("/ai/providers"),
  getProvider: (id: string) =>
    api.get<ApiResponse<AIProvider>>(`/ai/providers/${id}`),
  updateProvider: (id: string, data: Partial<AIProvider>) =>
    api.put<ApiResponse<AIProvider>>(`/ai/providers/${id}`, data),
  toggleProvider: (id: string) =>
    api.post<ApiResponse<AIProvider>>(`/ai/providers/${id}/toggle`),

  getModels: (providerId?: string) =>
    api.get<ApiResponse<AIModel[]>>("/ai/models", {
      params: providerId ? { provider_id: providerId } : undefined,
    }),
  getModel: (id: string) =>
    api.get<ApiResponse<AIModel>>(`/ai/models/${id}`),
  updateModel: (id: string, data: Partial<AIModel>) =>
    api.put<ApiResponse<AIModel>>(`/ai/models/${id}`, data),
  toggleModel: (id: string) =>
    api.post<ApiResponse<AIModel>>(`/ai/models/${id}/toggle`),

  getPrompts: (params?: { module?: AIModule; category?: string }) =>
    api.get<ApiResponse<Prompt[]>>("/ai/prompts", {
      params: params as unknown as Record<string, unknown>,
    }),
  getPrompt: (id: string) =>
    api.get<ApiResponse<Prompt>>(`/ai/prompts/${id}`),
  getPromptBySlug: (slug: string) =>
    api.get<ApiResponse<Prompt>>(`/ai/prompts/slug/${slug}`),
  createPrompt: (data: Omit<Prompt, "id" | "created_at" | "updated_at">) =>
    api.post<ApiResponse<Prompt>>("/ai/prompts", data),
  updatePrompt: (id: string, data: Partial<Prompt>) =>
    api.put<ApiResponse<Prompt>>(`/ai/prompts/${id}`, data),
  deletePrompt: (id: string) =>
    api.delete(`/ai/prompts/${id}`),
  duplicatePrompt: (id: string, name?: string) =>
    api.post<ApiResponse<Prompt>>(`/ai/prompts/${id}/duplicate`, { name }),

  getPromptVersions: (promptId: string) =>
    api.get<ApiResponse<PromptVersion[]>>(`/ai/prompts/${promptId}/versions`),
  getPromptVersion: (promptId: string, versionId: string) =>
    api.get<ApiResponse<PromptVersion>>(`/ai/prompts/${promptId}/versions/${versionId}`),
  createPromptVersion: (promptId: string, data: Omit<PromptVersion, "id" | "prompt_id" | "created_at" | "updated_at">) =>
    api.post<ApiResponse<PromptVersion>>(`/ai/prompts/${promptId}/versions`, data),
  updatePromptVersion: (promptId: string, versionId: string, data: Partial<PromptVersion>) =>
    api.put<ApiResponse<PromptVersion>>(`/ai/prompts/${promptId}/versions/${versionId}`, data),
  publishPromptVersion: (promptId: string, versionId: string) =>
    api.post<ApiResponse<PromptVersion>>(`/ai/prompts/${promptId}/versions/${versionId}/publish`),
  archivePromptVersion: (promptId: string, versionId: string) =>
    api.post<ApiResponse<PromptVersion>>(`/ai/prompts/${promptId}/versions/${versionId}/archive`),
  rollbackPromptVersion: (promptId: string, versionId: string) =>
    api.post<ApiResponse<PromptVersion>>(`/ai/prompts/${promptId}/versions/${versionId}/rollback`),

  testPrompt: (promptId: string, data: { variables: Record<string, unknown>; provider?: string; model?: string; temperature?: number }) =>
    api.post<ApiResponse<PromptExecution>>(`/ai/prompts/${promptId}/test`, data),
  getPromptExecutions: (promptId: string) =>
    api.get<ApiResponse<PromptExecution[]>>(`/ai/prompts/${promptId}/executions`),

  getUsage: (params?: { module?: AIModule; date_from?: string; date_to?: string }) =>
    api.get<ApiResponse<AIUsage[]>>("/ai/usage", {
      params: params as unknown as Record<string, unknown>,
    }),
  getUsageSummary: (params?: { date_from?: string; date_to?: string }) =>
    api.get<ApiResponse<AIUsageSummary>>("/ai/usage/summary", {
      params: params as unknown as Record<string, unknown>,
    }),
  getTokenUsageTrend: (params?: { date_from?: string; date_to?: string }) =>
    api.get<ApiResponse<AITokenUsageTrend[]>>("/ai/usage/trends/tokens", {
      params: params as unknown as Record<string, unknown>,
    }),
  getLatencyTrend: (params?: { date_from?: string; date_to?: string }) =>
    api.get<ApiResponse<AILatencyTrend[]>>("/ai/usage/trends/latency", {
      params: params as unknown as Record<string, unknown>,
    }),
  getCostTrend: (params?: { date_from?: string; date_to?: string }) =>
    api.get<ApiResponse<AICostTrend[]>>("/ai/usage/trends/cost", {
      params: params as unknown as Record<string, unknown>,
    }),

  getQuota: () =>
    api.get<ApiResponse<AIQuota[]>>("/ai/quota"),
  getQuotaByModule: (module: AIModule) =>
    api.get<ApiResponse<AIQuota>>(`/ai/quota/${module}`),

  getSettings: () =>
    api.get<ApiResponse<AISettings>>("/ai/settings"),
  updateSettings: (data: Partial<AISettings>) =>
    api.put<ApiResponse<AISettings>>("/ai/settings", data),

  getCacheStats: () =>
    api.get<ApiResponse<AICacheStats>>("/ai/cache/stats"),
  getCacheEntries: (params?: PaginationParams) =>
    api.get<PaginatedData<AICacheEntry>>("/ai/cache", {
      params: params as unknown as Record<string, unknown>,
    }),
  clearCache: (module?: string) =>
    api.delete("/ai/cache", { params: module ? { module } : undefined }),
  deleteCacheEntry: (id: string) =>
    api.delete(`/ai/cache/${id}`),

  getConversations: (params?: { module?: AIModule }) =>
    api.get<ApiResponse<AIConversation[]>>("/ai/conversations", {
      params: params as unknown as Record<string, unknown>,
    }),
  getConversation: (id: string) =>
    api.get<ApiResponse<AIConversationDetail>>(`/ai/conversations/${id}`),
  createConversation: (data: AIConversationCreate) =>
    api.post<ApiResponse<AIConversation>>("/ai/conversations", data),
  updateConversation: (id: string, data: Partial<AIConversation>) =>
    api.put<ApiResponse<AIConversation>>(`/ai/conversations/${id}`, data),
  deleteConversation: (id: string) =>
    api.delete(`/ai/conversations/${id}`),
  archiveConversation: (id: string) =>
    api.post<ApiResponse<AIConversation>>(`/ai/conversations/${id}/archive`),
  sendMessage: (conversationId: string, data: AIConversationMessage) =>
    api.post<ApiResponse<AIMessage>>(`/ai/conversations/${conversationId}/messages`, data),

  getArtifacts: (params?: { module?: AIModule }) =>
    api.get<ApiResponse<AIArtifact[]>>("/ai/artifacts", {
      params: params as unknown as Record<string, unknown>,
    }),
  getArtifact: (id: string) =>
    api.get<ApiResponse<AIArtifact>>(`/ai/artifacts/${id}`),
  createArtifact: (data: AIArtifactCreate) =>
    api.post<ApiResponse<AIArtifact>>("/ai/artifacts", data),
  updateArtifact: (id: string, data: Partial<AIArtifact>) =>
    api.put<ApiResponse<AIArtifact>>(`/ai/artifacts/${id}`, data),
  deleteArtifact: (id: string) =>
    api.delete(`/ai/artifacts/${id}`),
  rateArtifact: (id: string, rating: number) =>
    api.post<ApiResponse<AIArtifact>>(`/ai/artifacts/${id}/rate`, { rating }),
  acceptArtifact: (id: string) =>
    api.post<ApiResponse<AIArtifact>>(`/ai/artifacts/${id}/accept`),
  rejectArtifact: (id: string) =>
    api.post<ApiResponse<AIArtifact>>(`/ai/artifacts/${id}/reject`),

  healthCheck: () =>
    api.get<ApiResponse<Record<string, unknown>>>("/ai/health"),
};

import type {
  Job,
  JobListItem,
  JobDetail,
  JobCreate,
  JobUpdate,
  JobSearchRequest,
  JobImportRequest,
  JobBulkAction,
  JobSearchStats,
  JobVersion,
  JobRequirement,
  RequiredSkill,
  Responsibility,
  Qualification,
  Benefit,
  JobCompensation,
  JobLocation,
  JobTag,
  Keyword,
  HiringManager,
  ApplicationMethod,
  ApplicationQuestion,
  JobAnalysis,
  JobScore,
  JobGap,
  JobRecommendation,
  SavedJob,
  FavoriteJob,
  JobCollection,
  JobCollectionItem,
  JobSourceEntity,
  JobImportRecord,
} from "@/types/job";

import type {
  ResumeOptimizationSession,
  ResumeOptimizationSessionCreate,
  ResumeOptimizationResult,
  ResumeSuggestion,
  ResumeSuggestionCreate,
  ResumeRewrite,
  ResumeKeywordSuggestion,
  ResumeBulletSuggestion,
  ResumeSummarySuggestion,
  ResumeHeadlineSuggestion,
  ResumeSectionSuggestion,
  ResumeSkillSuggestion,
  ResumeAchievementSuggestion,
  ResumeOptimizationRule,
  ResumeOptimizationRuleCreate,
  ResumeOptimizationRuleUpdate,
  ResumeOptimizationFeedback,
  ResumeOptimizationFeedbackCreate,
  ResumeOptimizationApproval,
  ResumeOptimizationArtifact,
  ResumeOptimizationComparison,
  ResumeOptimizationBulkAction,
  ResumeOptimizationStats,
  ResumeOptimizationHistory,
} from "@/types/resume-optimization";

import type {
  ATSAnalysis,
  ATSAnalysisDetail,
  ATSAnalysisCreate,
  ATSAnalysisUpdate,
  ATSAnalysisSearchRequest,
  ATSAnalysisStats,
  ATSConfiguration,
  ATSConfigurationCreate,
  ATSConfigurationUpdate,
  ATSRuleSet,
  ATSRuleSetCreate,
  ATSRuleSetUpdate,
  ATSRule,
  ATSRuleCreate,
  ATSRuleUpdate,
  ATSRuleCategory,
  ATSRuleCategoryCreate,
  ATSRuleCategoryUpdate,
  ATSVersion,
  ATSComparison,
  ATSComparisonCreate,
  ATSHistory,
  ATSBenchmark,
  ATSReport,
  ATSReportCreate,
  ATSScan,
  ATSScanCreate,
  ATSBulkAction,
  ATSPaginatedResponse,
  ATSApiResponse,
} from "@/types/ats";

import type {
  Company,
  CompanyCreate,
  CompanyUpdate,
  CompanyDetail,
  CompanyAlias,
  CompanyAliasCreate,
  CompanyAliasUpdate,
  CompanyIndustry,
  CompanyIndustryCreate,
  CompanyIndustryUpdate,
  CompanyOffice,
  CompanyOfficeCreate,
  CompanyOfficeUpdate,
  CompanyLocation,
  CompanyLocationCreate,
  CompanyLocationUpdate,
  CompanyCulture,
  CompanyCultureCreate,
  CompanyCultureUpdate,
  CompanyBenefit,
  CompanyBenefitCreate,
  CompanyBenefitUpdate,
  CompanyTechnology,
  CompanyTechnologyCreate,
  CompanyTechnologyUpdate,
  CompanyHiringProcess,
  CompanyHiringProcessCreate,
  CompanyHiringProcessUpdate,
  CompanyInterviewExperience,
  CompanyInterviewCreate,
  CompanyInterviewUpdate,
  CompanySalaryInsight,
  CompanySalaryCreate,
  CompanySalaryUpdate,
  CompanyReview,
  CompanyReviewCreate,
  CompanyReviewUpdate,
  CompanyNews,
  CompanyNewsCreate,
  CompanyNewsUpdate,
  CompanyFunding,
  CompanyFundingCreate,
  CompanyFundingUpdate,
  CompanyLeadership,
  CompanyLeadershipCreate,
  CompanyLeadershipUpdate,
  CompanyCompetitor,
  CompanyCompetitorCreate,
  CompanyCompetitorUpdate,
  CompanySocialLink,
  CompanySocialLinkCreate,
  CompanySocialLinkUpdate,
  CompanyDocument,
  CompanyDocumentCreate,
  CompanyDocumentUpdate,
  CompanyTag,
  CompanyTagCreate,
  CompanyTagUpdate,
  CompanySnapshot,
  CompanyScore,
  CompanyInsight,
  CompanyCollection,
  CompanyCollectionCreate,
  CompanyCollectionUpdate,
  CompanyCollectionItem,
  CompanyCollectionItemCreate,
  CompanyHistory,
  CompanyBookmark,
  CompanyFollow,
  CompanyFollower,
  CompanyAnalysis,
  CompanyAnalysisDetail,
  CompanyRecommendation,
  CompanyReport,
  CompanySearchRequest,
  CompanyRunAnalysisRequest,
  CompanyIntelApiResponse,
  CompanyIntelPaginatedResponse,
} from "@/types/company-intel";

import type {
  InterviewSession,
  InterviewSessionDetail,
  InterviewSessionCreate,
  InterviewSessionUpdate,
  InterviewStartRequest,
  InterviewPauseRequest,
  InterviewResumeRequest,
  InterviewFinishRequest,
  InterviewEvaluateRequest,
  InterviewFeedbackRequest,
  InterviewGenerateRequest,
  InterviewGenerateResponse,
  InterviewReportCreate,
  InterviewCompareRequest,
  InterviewSearchRequest,
  InterviewBulkAction,
  InterviewExportRequest,
  InterviewTemplate,
  InterviewQuestionBank,
  PaginatedResponse,
  ResponseBase,
} from "@/types/interview";
import type {
  Recruiter,
  RecruiterCreate,
  RecruiterUpdate,
  RecruiterDetail,
  RecruiterStats,
  RecruiterOrganization,
  RecruiterOrganizationCreate,
  RecruiterOrganizationUpdate,
  RecruiterDepartment,
  RecruiterDepartmentCreate,
  RecruiterContact,
  RecruiterContactCreate,
  RecruiterConversation,
  RecruiterConversationCreate,
  RecruiterEmail,
  RecruiterEmailCreate,
  RecruiterCall,
  RecruiterCallCreate,
  RecruiterMeeting,
  RecruiterMeetingCreate,
  RecruiterNote,
  RecruiterNoteCreate,
  RecruiterReminder,
  RecruiterReminderCreate,
  RecruiterFollowUp,
  RecruiterFollowUpCreate,
  RecruiterTask,
  RecruiterTaskCreate,
  RecruiterActivity,
  RecruiterActivityCreate,
  RecruiterAttachment,
  RecruiterAttachmentCreate,
  RecruiterTag,
  RecruiterTagCreate,
  RecruiterCollection,
  RecruiterCollectionCreate,
  RecruiterCollectionItem,
  RecruiterCollectionItemCreate,
  Application,
  ApplicationCreate,
  ApplicationUpdate,
  ApplicationDetail,
  ApplicationStage,
  ApplicationStageCreate,
  ApplicationHistory,
  ApplicationStatusRecord,
  ApplicationChecklist,
  ApplicationChecklistCreate,
  ApplicationTimeline,
  ApplicationDocument,
  ApplicationDocumentCreate,
  ApplicationOffer,
  ApplicationOfferCreate,
  ApplicationNegotiation,
  ApplicationNegotiationCreate,
  ApplicationFeedback,
  ApplicationFeedbackCreate,
  ApplicationDecision,
  ApplicationDecisionCreate,
  ApplicationAnalytics,
  Referral,
  ReferralCreate,
  NetworkingContact,
  NetworkingContactCreate,
  NetworkingEvent,
  NetworkingEventCreate,
  NetworkingReminder,
  NetworkingReminderCreate,
  NetworkingGoal,
  NetworkingGoalCreate,
  NetworkingAnalytics,
  CRMNotification,
  CRMReport,
  CRMSettings,
  CRMSettingsUpdate,
  CRMBookmark,
  CRMBookmarkCreate,
  CRMInsight,
  CRMRecommendation,
  CRMHistoryEntry,
  CRMSnapshot,
  CRMPaginatedResponse,
  CRMSearchRequest,
  CRMExportRequest,
  CRMBulkAction,
} from "@/types/crm";

export const atsApi = {
  // Analysis
  getAnalyses: (params?: Record<string, unknown>) =>
    api.get<ATSPaginatedResponse<ATSAnalysis>>("/ats/analyses", { params }),
  getAnalysis: (id: string) =>
    api.get<ATSApiResponse<ATSAnalysisDetail>>(`/ats/analyses/${id}`),
  createAnalysis: (data: ATSAnalysisCreate) =>
    api.post<ATSApiResponse<ATSAnalysis>>("/ats/analyses", data),
  updateAnalysis: (id: string, data: ATSAnalysisUpdate) =>
    api.put<ATSApiResponse<ATSAnalysis>>(`/ats/analyses/${id}`, data),
  deleteAnalysis: (id: string) =>
    api.delete(`/ats/analyses/${id}`),
  runAnalysis: (resumeId: string, jobId?: string) =>
    api.post<ATSApiResponse<ATSAnalysis>>("/ats/analyses/run", { resume_id: resumeId, job_id: jobId }),
  runBulkAnalysis: (resumeIds: string[], jobId?: string) =>
    api.post<ATSApiResponse<ATSAnalysis[]>>("/ats/analyses/run-bulk", { resume_ids: resumeIds, job_id: jobId }),
  searchAnalyses: (params: ATSAnalysisSearchRequest) =>
    api.post<ATSPaginatedResponse<ATSAnalysis>>("/ats/analyses/search", params),
  getAnalysisStats: () =>
    api.get<ATSApiResponse<ATSAnalysisStats>>("/ats/analyses/stats"),
  bulkAnalysisAction: (data: ATSBulkAction) =>
    api.post("/ats/analyses/bulk", data),

  // Versions
  getVersions: (analysisId: string) =>
    api.get<ATSApiResponse<ATSVersion[]>>(`/ats/analyses/${analysisId}/versions`),
  getVersion: (analysisId: string, versionId: string) =>
    api.get<ATSApiResponse<ATSVersion>>(`/ats/analyses/${analysisId}/versions/${versionId}`),

  // Comparisons
  createComparison: (analysisId: string, data: ATSComparisonCreate) =>
    api.post<ATSApiResponse<ATSComparison>>(`/ats/analyses/${analysisId}/compare`, data),
  getComparison: (analysisId: string, comparisonId: string) =>
    api.get<ATSApiResponse<ATSComparison>>(`/ats/analyses/${analysisId}/compare/${comparisonId}`),

  // History
  getHistory: (analysisId: string) =>
    api.get<ATSApiResponse<ATSHistory[]>>(`/ats/analyses/${analysisId}/history`),

  // Reports
  createReport: (analysisId: string, data: ATSReportCreate) =>
    api.post<ATSApiResponse<ATSReport>>(`/ats/analyses/${analysisId}/reports`, data),
  getReports: (analysisId: string) =>
    api.get<ATSApiResponse<ATSReport[]>>(`/ats/analyses/${analysisId}/reports`),
  getReport: (analysisId: string, reportId: string) =>
    api.get<ATSApiResponse<ATSReport>>(`/ats/analyses/${analysisId}/reports/${reportId}`),

  // Scans
  getScans: (analysisId: string) =>
    api.get<ATSApiResponse<ATSScan[]>>(`/ats/analyses/${analysisId}/scans`),
  createScan: (analysisId: string, data: ATSScanCreate) =>
    api.post<ATSApiResponse<ATSScan>>(`/ats/analyses/${analysisId}/scans`, data),

  // Benchmarks
  getBenchmarks: (analysisId: string) =>
    api.get<ATSApiResponse<ATSBenchmark[]>>(`/ats/analyses/${analysisId}/benchmarks`),

  // Configurations
  getConfigurations: () =>
    api.get<ATSApiResponse<ATSConfiguration[]>>("/ats/configurations"),
  getConfiguration: (id: string) =>
    api.get<ATSApiResponse<ATSConfiguration>>(`/ats/configurations/${id}`),
  createConfiguration: (data: ATSConfigurationCreate) =>
    api.post<ATSApiResponse<ATSConfiguration>>("/ats/configurations", data),
  updateConfiguration: (id: string, data: ATSConfigurationUpdate) =>
    api.put<ATSApiResponse<ATSConfiguration>>(`/ats/configurations/${id}`, data),
  deleteConfiguration: (id: string) =>
    api.delete(`/ats/configurations/${id}`),

  // Rule Sets
  getRuleSets: () =>
    api.get<ATSApiResponse<ATSRuleSet[]>>("/ats/rule-sets"),
  getRuleSet: (id: string) =>
    api.get<ATSApiResponse<ATSRuleSet>>(`/ats/rule-sets/${id}`),
  createRuleSet: (data: ATSRuleSetCreate) =>
    api.post<ATSApiResponse<ATSRuleSet>>("/ats/rule-sets", data),
  updateRuleSet: (id: string, data: ATSRuleSetUpdate) =>
    api.put<ATSApiResponse<ATSRuleSet>>(`/ats/rule-sets/${id}`, data),
  deleteRuleSet: (id: string) =>
    api.delete(`/ats/rule-sets/${id}`),

  // Rules
  getRules: (ruleSetId?: string) =>
    api.get<ATSApiResponse<ATSRule[]>>("/ats/rules", { params: ruleSetId ? { rule_set_id: ruleSetId } : undefined }),
  getRule: (id: string) =>
    api.get<ATSApiResponse<ATSRule>>(`/ats/rules/${id}`),
  createRule: (data: ATSRuleCreate) =>
    api.post<ATSApiResponse<ATSRule>>("/ats/rules", data),
  updateRule: (id: string, data: ATSRuleUpdate) =>
    api.put<ATSApiResponse<ATSRule>>(`/ats/rules/${id}`, data),
  deleteRule: (id: string) =>
    api.delete(`/ats/rules/${id}`),

  // Rule Categories
  getRuleCategories: () =>
    api.get<ATSApiResponse<ATSRuleCategory[]>>("/ats/rule-categories"),
  createRuleCategory: (data: ATSRuleCategoryCreate) =>
    api.post<ATSApiResponse<ATSRuleCategory>>("/ats/rule-categories", data),
  updateRuleCategory: (id: string, data: ATSRuleCategoryUpdate) =>
    api.put<ATSApiResponse<ATSRuleCategory>>(`/ats/rule-categories/${id}`, data),
  deleteRuleCategory: (id: string) =>
    api.delete(`/ats/rule-categories/${id}`),
};

export const companyIntelApi = {
  // ─── Company CRUD ───
  getCompanies: (params?: Record<string, unknown>) =>
    api.get<CompanyIntelPaginatedResponse<Company>>("/company-intelligence", { params }),
  getCompany: (id: string) =>
    api.get<CompanyIntelApiResponse<CompanyDetail>>(`/company-intelligence/${id}`),
  createCompany: (data: CompanyCreate) =>
    api.post<CompanyIntelApiResponse<Company>>("/company-intelligence", data),
  updateCompany: (id: string, data: CompanyUpdate) =>
    api.put<CompanyIntelApiResponse<Company>>(`/company-intelligence/${id}`, data),
  deleteCompany: (id: string) =>
    api.delete(`/company-intelligence/${id}`),
  searchCompanies: (params: CompanySearchRequest) =>
    api.post<CompanyIntelPaginatedResponse<Company>>("/company-intelligence/search", params),
  getCompanyStats: (id: string) =>
    api.get<CompanyIntelApiResponse<Record<string, unknown>>>(`/company-intelligence/${id}/stats`),
  getGlobalStats: () =>
    api.get<CompanyIntelApiResponse<Record<string, unknown>>>("/company-intelligence/stats"),

  // ─── Aliases ───
  getAliases: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyAlias[]>>(`/company-intelligence/${companyId}/aliases`),
  createAlias: (companyId: string, data: CompanyAliasCreate) =>
    api.post<CompanyIntelApiResponse<CompanyAlias>>(`/company-intelligence/${companyId}/aliases`, data),
  getAlias: (companyId: string, aliasId: string) =>
    api.get<CompanyIntelApiResponse<CompanyAlias>>(`/company-intelligence/${companyId}/aliases/${aliasId}`),
  updateAlias: (companyId: string, aliasId: string, data: CompanyAliasUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyAlias>>(`/company-intelligence/${companyId}/aliases/${aliasId}`, data),
  deleteAlias: (companyId: string, aliasId: string) =>
    api.delete(`/company-intelligence/${companyId}/aliases/${aliasId}`),

  // ─── Industries ───
  getIndustries: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyIndustry[]>>(`/company-intelligence/${companyId}/industries`),
  createIndustry: (companyId: string, data: CompanyIndustryCreate) =>
    api.post<CompanyIntelApiResponse<CompanyIndustry>>(`/company-intelligence/${companyId}/industries`, data),
  getIndustry: (companyId: string, industryId: string) =>
    api.get<CompanyIntelApiResponse<CompanyIndustry>>(`/company-intelligence/${companyId}/industries/${industryId}`),
  updateIndustry: (companyId: string, industryId: string, data: CompanyIndustryUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyIndustry>>(`/company-intelligence/${companyId}/industries/${industryId}`, data),
  deleteIndustry: (companyId: string, industryId: string) =>
    api.delete(`/company-intelligence/${companyId}/industries/${industryId}`),

  // ─── Offices ───
  getOffices: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyOffice[]>>(`/company-intelligence/${companyId}/offices`),
  createOffice: (companyId: string, data: CompanyOfficeCreate) =>
    api.post<CompanyIntelApiResponse<CompanyOffice>>(`/company-intelligence/${companyId}/offices`, data),
  getOffice: (companyId: string, officeId: string) =>
    api.get<CompanyIntelApiResponse<CompanyOffice>>(`/company-intelligence/${companyId}/offices/${officeId}`),
  updateOffice: (companyId: string, officeId: string, data: CompanyOfficeUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyOffice>>(`/company-intelligence/${companyId}/offices/${officeId}`, data),
  deleteOffice: (companyId: string, officeId: string) =>
    api.delete(`/company-intelligence/${companyId}/offices/${officeId}`),

  // ─── Locations ───
  getLocations: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyLocation[]>>(`/company-intelligence/${companyId}/locations`),
  createLocation: (companyId: string, data: CompanyLocationCreate) =>
    api.post<CompanyIntelApiResponse<CompanyLocation>>(`/company-intelligence/${companyId}/locations`, data),
  getLocation: (companyId: string, locationId: string) =>
    api.get<CompanyIntelApiResponse<CompanyLocation>>(`/company-intelligence/${companyId}/locations/${locationId}`),
  updateLocation: (companyId: string, locationId: string, data: CompanyLocationUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyLocation>>(`/company-intelligence/${companyId}/locations/${locationId}`, data),
  deleteLocation: (companyId: string, locationId: string) =>
    api.delete(`/company-intelligence/${companyId}/locations/${locationId}`),

  // ─── Cultures ───
  getCultures: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyCulture[]>>(`/company-intelligence/${companyId}/cultures`),
  createCulture: (companyId: string, data: CompanyCultureCreate) =>
    api.post<CompanyIntelApiResponse<CompanyCulture>>(`/company-intelligence/${companyId}/cultures`, data),
  getCulture: (companyId: string, cultureId: string) =>
    api.get<CompanyIntelApiResponse<CompanyCulture>>(`/company-intelligence/${companyId}/cultures/${cultureId}`),
  updateCulture: (companyId: string, cultureId: string, data: CompanyCultureUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyCulture>>(`/company-intelligence/${companyId}/cultures/${cultureId}`, data),
  deleteCulture: (companyId: string, cultureId: string) =>
    api.delete(`/company-intelligence/${companyId}/cultures/${cultureId}`),

  // ─── Benefits ───
  getBenefits: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyBenefit[]>>(`/company-intelligence/${companyId}/benefits`),
  createBenefit: (companyId: string, data: CompanyBenefitCreate) =>
    api.post<CompanyIntelApiResponse<CompanyBenefit>>(`/company-intelligence/${companyId}/benefits`, data),
  getBenefit: (companyId: string, benefitId: string) =>
    api.get<CompanyIntelApiResponse<CompanyBenefit>>(`/company-intelligence/${companyId}/benefits/${benefitId}`),
  updateBenefit: (companyId: string, benefitId: string, data: CompanyBenefitUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyBenefit>>(`/company-intelligence/${companyId}/benefits/${benefitId}`, data),
  deleteBenefit: (companyId: string, benefitId: string) =>
    api.delete(`/company-intelligence/${companyId}/benefits/${benefitId}`),

  // ─── Technologies ───
  getTechnologies: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyTechnology[]>>(`/company-intelligence/${companyId}/technologies`),
  createTechnology: (companyId: string, data: CompanyTechnologyCreate) =>
    api.post<CompanyIntelApiResponse<CompanyTechnology>>(`/company-intelligence/${companyId}/technologies`, data),
  getTechnology: (companyId: string, technologyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyTechnology>>(`/company-intelligence/${companyId}/technologies/${technologyId}`),
  updateTechnology: (companyId: string, technologyId: string, data: CompanyTechnologyUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyTechnology>>(`/company-intelligence/${companyId}/technologies/${technologyId}`, data),
  deleteTechnology: (companyId: string, technologyId: string) =>
    api.delete(`/company-intelligence/${companyId}/technologies/${technologyId}`),

  // ─── Hiring Processes ───
  getHiringProcesses: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyHiringProcess[]>>(`/company-intelligence/${companyId}/hiring-processes`),
  createHiringProcess: (companyId: string, data: CompanyHiringProcessCreate) =>
    api.post<CompanyIntelApiResponse<CompanyHiringProcess>>(`/company-intelligence/${companyId}/hiring-processes`, data),
  getHiringProcess: (companyId: string, processId: string) =>
    api.get<CompanyIntelApiResponse<CompanyHiringProcess>>(`/company-intelligence/${companyId}/hiring-processes/${processId}`),
  updateHiringProcess: (companyId: string, processId: string, data: CompanyHiringProcessUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyHiringProcess>>(`/company-intelligence/${companyId}/hiring-processes/${processId}`, data),
  deleteHiringProcess: (companyId: string, processId: string) =>
    api.delete(`/company-intelligence/${companyId}/hiring-processes/${processId}`),

  // ─── Tags ───
  getTags: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyTag[]>>(`/company-intelligence/${companyId}/tags`),
  createTag: (companyId: string, data: CompanyTagCreate) =>
    api.post<CompanyIntelApiResponse<CompanyTag>>(`/company-intelligence/${companyId}/tags`, data),
  getTag: (companyId: string, tagId: string) =>
    api.get<CompanyIntelApiResponse<CompanyTag>>(`/company-intelligence/${companyId}/tags/${tagId}`),
  updateTag: (companyId: string, tagId: string, data: CompanyTagUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyTag>>(`/company-intelligence/${companyId}/tags/${tagId}`, data),
  deleteTag: (companyId: string, tagId: string) =>
    api.delete(`/company-intelligence/${companyId}/tags/${tagId}`),

  // ─── Social Links ───
  getSocialLinks: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanySocialLink[]>>(`/company-intelligence/${companyId}/social-links`),
  createSocialLink: (companyId: string, data: CompanySocialLinkCreate) =>
    api.post<CompanyIntelApiResponse<CompanySocialLink>>(`/company-intelligence/${companyId}/social-links`, data),
  getSocialLink: (companyId: string, linkId: string) =>
    api.get<CompanyIntelApiResponse<CompanySocialLink>>(`/company-intelligence/${companyId}/social-links/${linkId}`),
  updateSocialLink: (companyId: string, linkId: string, data: CompanySocialLinkUpdate) =>
    api.put<CompanyIntelApiResponse<CompanySocialLink>>(`/company-intelligence/${companyId}/social-links/${linkId}`, data),
  deleteSocialLink: (companyId: string, linkId: string) =>
    api.delete(`/company-intelligence/${companyId}/social-links/${linkId}`),

  // ─── Documents ───
  getDocuments: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyDocument[]>>(`/company-intelligence/${companyId}/documents`),
  createDocument: (companyId: string, data: CompanyDocumentCreate) =>
    api.post<CompanyIntelApiResponse<CompanyDocument>>(`/company-intelligence/${companyId}/documents`, data),
  getDocument: (companyId: string, documentId: string) =>
    api.get<CompanyIntelApiResponse<CompanyDocument>>(`/company-intelligence/${companyId}/documents/${documentId}`),
  updateDocument: (companyId: string, documentId: string, data: CompanyDocumentUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyDocument>>(`/company-intelligence/${companyId}/documents/${documentId}`, data),
  deleteDocument: (companyId: string, documentId: string) =>
    api.delete(`/company-intelligence/${companyId}/documents/${documentId}`),

  // ─── Reviews ───
  getReviews: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyReview[]>>(`/company-intelligence/${companyId}/reviews`),
  createReview: (companyId: string, data: CompanyReviewCreate) =>
    api.post<CompanyIntelApiResponse<CompanyReview>>(`/company-intelligence/${companyId}/reviews`, data),
  getReview: (companyId: string, reviewId: string) =>
    api.get<CompanyIntelApiResponse<CompanyReview>>(`/company-intelligence/${companyId}/reviews/${reviewId}`),
  updateReview: (companyId: string, reviewId: string, data: CompanyReviewUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyReview>>(`/company-intelligence/${companyId}/reviews/${reviewId}`, data),
  deleteReview: (companyId: string, reviewId: string) =>
    api.delete(`/company-intelligence/${companyId}/reviews/${reviewId}`),

  // ─── Interviews ───
  getInterviews: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyInterviewExperience[]>>(`/company-intelligence/${companyId}/interviews`),
  createInterview: (companyId: string, data: CompanyInterviewCreate) =>
    api.post<CompanyIntelApiResponse<CompanyInterviewExperience>>(`/company-intelligence/${companyId}/interviews`, data),
  getInterview: (companyId: string, interviewId: string) =>
    api.get<CompanyIntelApiResponse<CompanyInterviewExperience>>(`/company-intelligence/${companyId}/interviews/${interviewId}`),
  updateInterview: (companyId: string, interviewId: string, data: CompanyInterviewUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyInterviewExperience>>(`/company-intelligence/${companyId}/interviews/${interviewId}`, data),
  deleteInterview: (companyId: string, interviewId: string) =>
    api.delete(`/company-intelligence/${companyId}/interviews/${interviewId}`),

  // ─── Salaries ───
  getSalaries: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanySalaryInsight[]>>(`/company-intelligence/${companyId}/salaries`),
  createSalary: (companyId: string, data: CompanySalaryCreate) =>
    api.post<CompanyIntelApiResponse<CompanySalaryInsight>>(`/company-intelligence/${companyId}/salaries`, data),
  getSalary: (companyId: string, salaryId: string) =>
    api.get<CompanyIntelApiResponse<CompanySalaryInsight>>(`/company-intelligence/${companyId}/salaries/${salaryId}`),
  updateSalary: (companyId: string, salaryId: string, data: CompanySalaryUpdate) =>
    api.put<CompanyIntelApiResponse<CompanySalaryInsight>>(`/company-intelligence/${companyId}/salaries/${salaryId}`, data),
  deleteSalary: (companyId: string, salaryId: string) =>
    api.delete(`/company-intelligence/${companyId}/salaries/${salaryId}`),

  // ─── News ───
  getNews: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyNews[]>>(`/company-intelligence/${companyId}/news`),
  createNews: (companyId: string, data: CompanyNewsCreate) =>
    api.post<CompanyIntelApiResponse<CompanyNews>>(`/company-intelligence/${companyId}/news`, data),
  getNewsItem: (companyId: string, newsId: string) =>
    api.get<CompanyIntelApiResponse<CompanyNews>>(`/company-intelligence/${companyId}/news/${newsId}`),
  updateNews: (companyId: string, newsId: string, data: CompanyNewsUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyNews>>(`/company-intelligence/${companyId}/news/${newsId}`, data),
  deleteNews: (companyId: string, newsId: string) =>
    api.delete(`/company-intelligence/${companyId}/news/${newsId}`),

  // ─── Funding ───
  getFunding: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyFunding[]>>(`/company-intelligence/${companyId}/funding`),
  createFunding: (companyId: string, data: CompanyFundingCreate) =>
    api.post<CompanyIntelApiResponse<CompanyFunding>>(`/company-intelligence/${companyId}/funding`, data),
  getFundingRound: (companyId: string, fundingId: string) =>
    api.get<CompanyIntelApiResponse<CompanyFunding>>(`/company-intelligence/${companyId}/funding/${fundingId}`),
  updateFunding: (companyId: string, fundingId: string, data: CompanyFundingUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyFunding>>(`/company-intelligence/${companyId}/funding/${fundingId}`, data),
  deleteFunding: (companyId: string, fundingId: string) =>
    api.delete(`/company-intelligence/${companyId}/funding/${fundingId}`),

  // ─── Leadership ───
  getLeadership: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyLeadership[]>>(`/company-intelligence/${companyId}/leadership`),
  createLeader: (companyId: string, data: CompanyLeadershipCreate) =>
    api.post<CompanyIntelApiResponse<CompanyLeadership>>(`/company-intelligence/${companyId}/leadership`, data),
  getLeader: (companyId: string, leadershipId: string) =>
    api.get<CompanyIntelApiResponse<CompanyLeadership>>(`/company-intelligence/${companyId}/leadership/${leadershipId}`),
  updateLeader: (companyId: string, leadershipId: string, data: CompanyLeadershipUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyLeadership>>(`/company-intelligence/${companyId}/leadership/${leadershipId}`, data),
  deleteLeader: (companyId: string, leadershipId: string) =>
    api.delete(`/company-intelligence/${companyId}/leadership/${leadershipId}`),

  // ─── Competitors ───
  getCompetitors: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyCompetitor[]>>(`/company-intelligence/${companyId}/competitors`),
  createCompetitor: (companyId: string, data: CompanyCompetitorCreate) =>
    api.post<CompanyIntelApiResponse<CompanyCompetitor>>(`/company-intelligence/${companyId}/competitors`, data),
  getCompetitor: (companyId: string, competitorId: string) =>
    api.get<CompanyIntelApiResponse<CompanyCompetitor>>(`/company-intelligence/${companyId}/competitors/${competitorId}`),
  updateCompetitor: (companyId: string, competitorId: string, data: CompanyCompetitorUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyCompetitor>>(`/company-intelligence/${companyId}/competitors/${competitorId}`, data),
  deleteCompetitor: (companyId: string, competitorId: string) =>
    api.delete(`/company-intelligence/${companyId}/competitors/${competitorId}`),

  // ─── Bookmarks ───
  getBookmarks: () =>
    api.get<CompanyIntelApiResponse<CompanyBookmark[]>>("/company-intelligence/bookmarks"),
  bookmarkCompany: (companyId: string) =>
    api.post<CompanyIntelApiResponse<CompanyBookmark>>(`/company-intelligence/${companyId}/bookmark`),
  unbookmarkCompany: (companyId: string) =>
    api.delete(`/company-intelligence/${companyId}/bookmark`),

  // ─── Follows ───
  getFollows: () =>
    api.get<CompanyIntelApiResponse<CompanyFollow[]>>("/company-intelligence/follows"),
  followCompany: (companyId: string) =>
    api.post<CompanyIntelApiResponse<CompanyFollow>>(`/company-intelligence/${companyId}/follow`),
  unfollowCompany: (companyId: string) =>
    api.delete(`/company-intelligence/${companyId}/follow`),
  getCompanyFollowers: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyFollower[]>>(`/company-intelligence/${companyId}/followers`),

  // ─── Collections ───
  getCollections: () =>
    api.get<CompanyIntelApiResponse<CompanyCollection[]>>("/company-intelligence/collections"),
  createCollection: (data: CompanyCollectionCreate) =>
    api.post<CompanyIntelApiResponse<CompanyCollection>>("/company-intelligence/collections", data),
  getCollection: (collectionId: string) =>
    api.get<CompanyIntelApiResponse<CompanyCollection>>(`/company-intelligence/collections/${collectionId}`),
  updateCollection: (collectionId: string, data: CompanyCollectionUpdate) =>
    api.put<CompanyIntelApiResponse<CompanyCollection>>(`/company-intelligence/collections/${collectionId}`, data),
  deleteCollection: (collectionId: string) =>
    api.delete(`/company-intelligence/collections/${collectionId}`),
  getCollectionItems: (collectionId: string) =>
    api.get<CompanyIntelApiResponse<CompanyCollectionItem[]>>(`/company-intelligence/collections/${collectionId}/items`),
  addToCollection: (collectionId: string, data: CompanyCollectionItemCreate) =>
    api.post<CompanyIntelApiResponse<CompanyCollectionItem>>(`/company-intelligence/collections/${collectionId}/items`, data),
  removeFromCollection: (collectionId: string, companyId: string) =>
    api.delete(`/company-intelligence/collections/${collectionId}/items/${companyId}`),

  // ─── Analysis ───
  runAnalysis: (companyId: string, data: CompanyRunAnalysisRequest) =>
    api.post<CompanyIntelApiResponse<CompanyAnalysis>>(`/company-intelligence/${companyId}/analysis/run`, data),
  getAnalyses: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyAnalysis[]>>(`/company-intelligence/${companyId}/analysis`),
  getAnalysis: (companyId: string, analysisId: string) =>
    api.get<CompanyIntelApiResponse<CompanyAnalysisDetail>>(`/company-intelligence/${companyId}/analysis/${analysisId}`),

  // ─── Insights ───
  getInsights: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyInsight[]>>(`/company-intelligence/${companyId}/insights`),

  // ─── Scores ───
  getScores: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyScore[]>>(`/company-intelligence/${companyId}/scores`),

  // ─── Snapshots ───
  getSnapshots: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanySnapshot[]>>(`/company-intelligence/${companyId}/snapshots`),

  // ─── Recommendations ───
  getRecommendations: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyRecommendation[]>>(`/company-intelligence/${companyId}/recommendations`),
  applyRecommendation: (companyId: string, recId: string) =>
    api.post<CompanyIntelApiResponse<CompanyRecommendation>>(`/company-intelligence/${companyId}/recommendations/${recId}/apply`),
  dismissRecommendation: (companyId: string, recId: string) =>
    api.post<CompanyIntelApiResponse<CompanyRecommendation>>(`/company-intelligence/${companyId}/recommendations/${recId}/dismiss`),

  // ─── Reports ───
  getReports: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyReport[]>>(`/company-intelligence/${companyId}/reports`),

  // ─── History ───
  getHistory: (companyId: string) =>
    api.get<CompanyIntelApiResponse<CompanyHistory[]>>(`/company-intelligence/${companyId}/history`),
};

export const resumeOptimizationApi = {
  // Sessions
  createSession: (data: ResumeOptimizationSessionCreate) =>
    api.post<ApiResponse<ResumeOptimizationSession>>("/resume-optimizations/sessions", data),
  getSessions: (resumeId?: string, offset?: number, limit?: number) =>
    api.get<ApiResponse<ResumeOptimizationSession[]>>("/resume-optimizations/sessions", { params: { resume_id: resumeId, offset, limit } }),
  getSession: (id: string) =>
    api.get<ApiResponse<ResumeOptimizationSession>>(`/resume-optimizations/sessions/${id}`),
  updateSession: (id: string, data: Partial<ResumeOptimizationSession>) =>
    api.put<ApiResponse<ResumeOptimizationSession>>(`/resume-optimizations/sessions/${id}`, data),
  deleteSession: (id: string) =>
    api.delete(`/resume-optimizations/sessions/${id}`),
  startSession: (id: string) =>
    api.post<ApiResponse<ResumeOptimizationSession>>(`/resume-optimizations/sessions/${id}/start`),
  completeSession: (id: string) =>
    api.post<ApiResponse<ResumeOptimizationSession>>(`/resume-optimizations/sessions/${id}/complete`),

  // Results
  createResult: (sessionId: string, data: Partial<ResumeOptimizationResult>) =>
    api.post<ApiResponse<ResumeOptimizationResult>>(`/resume-optimizations/sessions/${sessionId}/results`, data),
  getResults: (sessionId: string) =>
    api.get<ApiResponse<ResumeOptimizationResult[]>>(`/resume-optimizations/sessions/${sessionId}/results`),

  // Suggestions
  createSuggestion: (sessionId: string, data: ResumeSuggestionCreate) =>
    api.post<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/sessions/${sessionId}/suggestions`, data),
  getSuggestions: (sessionId: string, offset?: number, limit?: number) =>
    api.get<ApiResponse<ResumeSuggestion[]>>(`/resume-optimizations/sessions/${sessionId}/suggestions`, { params: { offset, limit } }),
  getSuggestion: (id: string) =>
    api.get<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/suggestions/${id}`),
  updateSuggestion: (id: string, data: Partial<ResumeSuggestion>) =>
    api.put<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/suggestions/${id}`, data),
  deleteSuggestion: (id: string) =>
    api.delete(`/resume-optimizations/suggestions/${id}`),
  acceptSuggestion: (id: string) =>
    api.post<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/suggestions/${id}/accept`),
  rejectSuggestion: (id: string) =>
    api.post<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/suggestions/${id}/reject`),
  applySuggestion: (id: string) =>
    api.post<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/suggestions/${id}/apply`),
  rollbackSuggestion: (id: string) =>
    api.post<ApiResponse<ResumeSuggestion>>(`/resume-optimizations/suggestions/${id}/rollback`),

  // Suggestion Details
  createRewrite: (suggestionId: string, data: Partial<ResumeRewrite>) =>
    api.post<ApiResponse<ResumeRewrite>>(`/resume-optimizations/suggestions/${suggestionId}/rewrite`, data),
  createKeywordSuggestion: (suggestionId: string, data: Partial<ResumeKeywordSuggestion>) =>
    api.post<ApiResponse<ResumeKeywordSuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/keyword`, data),
  createBulletSuggestion: (suggestionId: string, data: Partial<ResumeBulletSuggestion>) =>
    api.post<ApiResponse<ResumeBulletSuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/bullet`, data),
  createSummarySuggestion: (suggestionId: string, data: Partial<ResumeSummarySuggestion>) =>
    api.post<ApiResponse<ResumeSummarySuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/summary`, data),
  createHeadlineSuggestion: (suggestionId: string, data: Partial<ResumeHeadlineSuggestion>) =>
    api.post<ApiResponse<ResumeHeadlineSuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/headline`, data),
  createSectionSuggestion: (suggestionId: string, data: Partial<ResumeSectionSuggestion>) =>
    api.post<ApiResponse<ResumeSectionSuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/section`, data),
  createSkillSuggestion: (suggestionId: string, data: Partial<ResumeSkillSuggestion>) =>
    api.post<ApiResponse<ResumeSkillSuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/skill`, data),
  createAchievementSuggestion: (suggestionId: string, data: Partial<ResumeAchievementSuggestion>) =>
    api.post<ApiResponse<ResumeAchievementSuggestion>>(`/resume-optimizations/suggestions/${suggestionId}/achievement`, data),

  // Rules
  createRule: (data: ResumeOptimizationRuleCreate) =>
    api.post<ApiResponse<ResumeOptimizationRule>>("/resume-optimizations/rules", data),
  getRules: () =>
    api.get<ApiResponse<ResumeOptimizationRule[]>>("/resume-optimizations/rules"),
  getRule: (id: string) =>
    api.get<ApiResponse<ResumeOptimizationRule>>(`/resume-optimizations/rules/${id}`),
  updateRule: (id: string, data: ResumeOptimizationRuleUpdate) =>
    api.put<ApiResponse<ResumeOptimizationRule>>(`/resume-optimizations/rules/${id}`, data),
  deleteRule: (id: string) =>
    api.delete(`/resume-optimizations/rules/${id}`),

  // Feedback
  createFeedback: (suggestionId: string, data: ResumeOptimizationFeedbackCreate) =>
    api.post<ApiResponse<ResumeOptimizationFeedback>>(`/resume-optimizations/suggestions/${suggestionId}/feedback`, data),
  getFeedback: (suggestionId: string) =>
    api.get<ApiResponse<ResumeOptimizationFeedback[]>>(`/resume-optimizations/suggestions/${suggestionId}/feedback`),

  // Approvals
  createApproval: (sessionId: string, data: Partial<ResumeOptimizationApproval>) =>
    api.post<ApiResponse<ResumeOptimizationApproval>>(`/resume-optimizations/sessions/${sessionId}/approvals`, data),
  getApprovals: (sessionId: string) =>
    api.get<ApiResponse<ResumeOptimizationApproval[]>>(`/resume-optimizations/sessions/${sessionId}/approvals`),

  // History
  getSessionHistory: (sessionId: string) =>
    api.get<ApiResponse<ResumeOptimizationHistory[]>>(`/resume-optimizations/sessions/${sessionId}/history`),
  getSuggestionHistory: (suggestionId: string) =>
    api.get<ApiResponse<ResumeOptimizationHistory[]>>(`/resume-optimizations/suggestions/${suggestionId}/history`),

  // Artifacts
  createArtifact: (sessionId: string, data: Partial<ResumeOptimizationArtifact>) =>
    api.post<ApiResponse<ResumeOptimizationArtifact>>(`/resume-optimizations/sessions/${sessionId}/artifacts`, data),
  getArtifacts: (sessionId: string) =>
    api.get<ApiResponse<ResumeOptimizationArtifact[]>>(`/resume-optimizations/sessions/${sessionId}/artifacts`),

  // Comparisons
  createComparison: (sessionId: string, data: Partial<ResumeOptimizationComparison>) =>
    api.post<ApiResponse<ResumeOptimizationComparison>>(`/resume-optimizations/sessions/${sessionId}/comparisons`, data),
  getComparisons: (sessionId: string) =>
    api.get<ApiResponse<ResumeOptimizationComparison[]>>(`/resume-optimizations/sessions/${sessionId}/comparisons`),

  // Bulk
  bulkSuggestions: (data: ResumeOptimizationBulkAction) =>
    api.post<ApiResponse<{ count: number }>>("/resume-optimizations/suggestions/bulk", data),

  // Stats
  getStats: () =>
    api.get<ApiResponse<ResumeOptimizationStats>>("/resume-optimizations/stats"),
};

export const jobApi = {
  getJobs: (params?: PaginationParams) =>
    api.get<PaginatedData<JobListItem>>("/jobs", { params: params as unknown as Record<string, unknown> }),
  createJob: (data: JobCreate) =>
    api.post<ApiResponse<Job>>("/jobs", data),
  getJob: (id: string) =>
    api.get<ApiResponse<JobDetail>>(`/jobs/${id}`),
  updateJob: (id: string, data: JobUpdate) =>
    api.put<ApiResponse<Job>>(`/jobs/${id}`, data),
  deleteJob: (id: string) =>
    api.delete(`/jobs/${id}`),
  closeJob: (id: string) =>
    api.post<ApiResponse<Job>>(`/jobs/${id}/close`),
  duplicateJob: (id: string) =>
    api.post<ApiResponse<Job>>(`/jobs/${id}/duplicate`),

  searchJobs: (params: JobSearchRequest) =>
    api.post<ApiResponse<JobListItem[]>>("/jobs/search", params),
  getSearchStats: (params?: JobSearchRequest) =>
    api.get<ApiResponse<JobSearchStats>>("/jobs/search/stats", {
      params: params as unknown as Record<string, unknown>,
    }),
  bulkAction: (data: JobBulkAction) =>
    api.post("/jobs/bulk", data),

  saveJob: (id: string, notes?: string) =>
    api.post<ApiResponse<SavedJob>>(`/jobs/${id}/save`, { notes }),
  unsaveJob: (id: string) =>
    api.delete(`/jobs/${id}/save`),
  getSavedJobs: (params?: PaginationParams) =>
    api.get<PaginatedData<SavedJob>>("/jobs/saved", { params: params as unknown as Record<string, unknown> }),

  favoriteJob: (id: string) =>
    api.post<ApiResponse<FavoriteJob>>(`/jobs/${id}/favorite`),
  unfavoriteJob: (id: string) =>
    api.delete(`/jobs/${id}/favorite`),
  getFavoriteJobs: (params?: PaginationParams) =>
    api.get<PaginatedData<FavoriteJob>>("/jobs/favorites", { params: params as unknown as Record<string, unknown> }),

  importJob: (data: JobImportRequest) =>
    api.post<ApiResponse<Job>>("/jobs/import", data),
  getImportRecords: (params?: PaginationParams) =>
    api.get<PaginatedData<JobImportRecord>>("/jobs/imports", { params: params as unknown as Record<string, unknown> }),
  getImportRecord: (id: string) =>
    api.get<ApiResponse<JobImportRecord>>(`/jobs/imports/${id}`),

  getJobVersions: (id: string) =>
    api.get<ApiResponse<JobVersion[]>>(`/jobs/${id}/versions`),
  createJobVersion: (id: string, data: { change_summary?: string }) =>
    api.post<ApiResponse<JobVersion>>(`/jobs/${id}/versions`, data),
  restoreJobVersion: (id: string, versionId: string) =>
    api.post<ApiResponse<JobVersion>>(`/jobs/${id}/versions/${versionId}/restore`),

  getJobRequirements: (id: string) =>
    api.get<ApiResponse<JobRequirement[]>>(`/jobs/${id}/requirements`),
  addJobRequirement: (id: string, data: Partial<JobRequirement>) =>
    api.post<ApiResponse<JobRequirement>>(`/jobs/${id}/requirements`, data),
  updateJobRequirement: (id: string, reqId: string, data: Partial<JobRequirement>) =>
    api.put<ApiResponse<JobRequirement>>(`/jobs/${id}/requirements/${reqId}`, data),
  deleteJobRequirement: (id: string, reqId: string) =>
    api.delete(`/jobs/${id}/requirements/${reqId}`),

  getJobSkills: (id: string) =>
    api.get<ApiResponse<RequiredSkill[]>>(`/jobs/${id}/skills`),
  addJobSkill: (id: string, data: Partial<RequiredSkill>) =>
    api.post<ApiResponse<RequiredSkill>>(`/jobs/${id}/skills`, data),
  updateJobSkill: (id: string, skillId: string, data: Partial<RequiredSkill>) =>
    api.put<ApiResponse<RequiredSkill>>(`/jobs/${id}/skills/${skillId}`, data),
  deleteJobSkill: (id: string, skillId: string) =>
    api.delete(`/jobs/${id}/skills/${skillId}`),

  getJobResponsibilities: (id: string) =>
    api.get<ApiResponse<Responsibility[]>>(`/jobs/${id}/responsibilities`),
  addJobResponsibility: (id: string, data: Partial<Responsibility>) =>
    api.post<ApiResponse<Responsibility>>(`/jobs/${id}/responsibilities`, data),
  deleteJobResponsibility: (id: string, respId: string) =>
    api.delete(`/jobs/${id}/responsibilities/${respId}`),

  getJobQualifications: (id: string) =>
    api.get<ApiResponse<Qualification[]>>(`/jobs/${id}/qualifications`),
  addJobQualification: (id: string, data: Partial<Qualification>) =>
    api.post<ApiResponse<Qualification>>(`/jobs/${id}/qualifications`, data),
  deleteJobQualification: (id: string, qualId: string) =>
    api.delete(`/jobs/${id}/qualifications/${qualId}`),

  getJobBenefits: (id: string) =>
    api.get<ApiResponse<Benefit[]>>(`/jobs/${id}/benefits`),
  addJobBenefit: (id: string, data: Partial<Benefit>) =>
    api.post<ApiResponse<Benefit>>(`/jobs/${id}/benefits`, data),
  deleteJobBenefit: (id: string, benefitId: string) =>
    api.delete(`/jobs/${id}/benefits/${benefitId}`),

  getJobCompensation: (id: string) =>
    api.get<ApiResponse<JobCompensation>>(`/jobs/${id}/compensation`),
  upsertJobCompensation: (id: string, data: Partial<JobCompensation>) =>
    api.post<ApiResponse<JobCompensation>>(`/jobs/${id}/compensation`, data),

  getJobLocation: (id: string) =>
    api.get<ApiResponse<JobLocation>>(`/jobs/${id}/location`),
  upsertJobLocation: (id: string, data: Partial<JobLocation>) =>
    api.post<ApiResponse<JobLocation>>(`/jobs/${id}/location`, data),

  getJobTags: (id: string) =>
    api.get<ApiResponse<JobTag[]>>(`/jobs/${id}/tags`),
  addJobTags: (id: string, tags: Array<{ name: string; color?: string }>) =>
    api.post<ApiResponse<JobTag[]>>(`/jobs/${id}/tags`, { tags }),
  removeJobTag: (id: string, tagId: string) =>
    api.delete(`/jobs/${id}/tags/${tagId}`),

  getJobKeywords: (id: string) =>
    api.get<ApiResponse<Keyword[]>>(`/jobs/${id}/keywords`),

  getJobHiringManagers: (id: string) =>
    api.get<ApiResponse<HiringManager[]>>(`/jobs/${id}/hiring-managers`),
  addJobHiringManager: (id: string, data: Partial<HiringManager>) =>
    api.post<ApiResponse<HiringManager>>(`/jobs/${id}/hiring-managers`, data),
  deleteJobHiringManager: (id: string, managerId: string) =>
    api.delete(`/jobs/${id}/hiring-managers/${managerId}`),

  getJobApplicationMethods: (id: string) =>
    api.get<ApiResponse<ApplicationMethod[]>>(`/jobs/${id}/application-methods`),
  addJobApplicationMethod: (id: string, data: Partial<ApplicationMethod>) =>
    api.post<ApiResponse<ApplicationMethod>>(`/jobs/${id}/application-methods`, data),
  deleteJobApplicationMethod: (id: string, methodId: string) =>
    api.delete(`/jobs/${id}/application-methods/${methodId}`),

  getJobApplicationQuestions: (id: string) =>
    api.get<ApiResponse<ApplicationQuestion[]>>(`/jobs/${id}/application-questions`),

  getJobAnalyses: (id: string) =>
    api.get<ApiResponse<JobAnalysis[]>>(`/jobs/${id}/analyses`),
  getJobAnalysis: (id: string, analysisId: string) =>
    api.get<ApiResponse<JobAnalysis>>(`/jobs/${id}/analyses/${analysisId}`),
  runJobAnalysis: (id: string, analysisType: string) =>
    api.post<ApiResponse<JobAnalysis>>(`/jobs/${id}/analyses`, { analysis_type: analysisType }),

  getJobScores: (id: string) =>
    api.get<ApiResponse<JobScore[]>>(`/jobs/${id}/scores`),
  getJobGaps: (id: string) =>
    api.get<ApiResponse<JobGap[]>>(`/jobs/${id}/gaps`),
  getJobRecommendations: (id: string) =>
    api.get<ApiResponse<JobRecommendation[]>>(`/jobs/${id}/recommendations`),
  dismissJobRecommendation: (id: string, recId: string) =>
    api.post<ApiResponse<JobRecommendation>>(`/jobs/${id}/recommendations/${recId}/dismiss`),
  readJobRecommendation: (id: string, recId: string) =>
    api.post<ApiResponse<JobRecommendation>>(`/jobs/${id}/recommendations/${recId}/read`),

  getCollections: () =>
    api.get<ApiResponse<JobCollection[]>>("/job-collections"),
  getCollection: (id: string) =>
    api.get<ApiResponse<JobCollection>>(`/job-collections/${id}`),
  createCollection: (data: { name: string; description?: string }) =>
    api.post<ApiResponse<JobCollection>>("/job-collections", data),
  updateCollection: (id: string, data: { name?: string; description?: string }) =>
    api.put<ApiResponse<JobCollection>>(`/job-collections/${id}`, data),
  deleteCollection: (id: string) =>
    api.delete(`/job-collections/${id}`),
  addToCollection: (collectionId: string, jobId: string, notes?: string) =>
    api.post<ApiResponse<JobCollectionItem>>(`/job-collections/${collectionId}/items`, { job_id: jobId, notes }),
  removeFromCollection: (collectionId: string, jobId: string) =>
    api.delete(`/job-collections/${collectionId}/items/${jobId}`),

  getJobSources: () =>
    api.get<ApiResponse<JobSourceEntity[]>>("/job-sources"),
  getJobSource: (id: string) =>
    api.get<ApiResponse<JobSourceEntity>>(`/job-sources/${id}`),
  updateJobSource: (id: string, data: Partial<JobSourceEntity>) =>
    api.put<ApiResponse<JobSourceEntity>>(`/job-sources/${id}`, data),
};

export const interviewApi = {
  // Sessions
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<InterviewSession>>("/interviews", { params }),
  create: (data: InterviewSessionCreate) =>
    api.post<ResponseBase<InterviewSession>>("/interviews", data),
  get: (id: string) =>
    api.get<ResponseBase<InterviewSessionDetail>>(`/interviews/${id}`),
  update: (id: string, data: InterviewSessionUpdate) =>
    api.patch<ResponseBase<InterviewSession>>(`/interviews/${id}`, data),
  delete: (id: string) =>
    api.delete(`/interviews/${id}`),
  
  // Session control
  start: (id: string, data?: InterviewStartRequest) =>
    api.post<ResponseBase<InterviewSession>>(`/interviews/${id}/start`, data),
  pause: (id: string, data?: InterviewPauseRequest) =>
    api.post<ResponseBase<InterviewSession>>(`/interviews/${id}/pause`, data),
  resume: (id: string, data?: InterviewResumeRequest) =>
    api.post<ResponseBase<InterviewSession>>(`/interviews/${id}/resume`, data),
  finish: (id: string, data?: InterviewFinishRequest) =>
    api.post<ResponseBase<InterviewSession>>(`/interviews/${id}/finish`, data),
  
  // AI
  evaluate: (id: string, data?: InterviewEvaluateRequest) =>
    api.post<ResponseBase>(`/interviews/${id}/evaluate`, data),
  addFeedback: (id: string, data?: InterviewFeedbackRequest) =>
    api.post<ResponseBase>(`/interviews/${id}/feedback`, data),
  generate: (id: string, data: InterviewGenerateRequest) =>
    api.post<ResponseBase<InterviewGenerateResponse>>(`/interviews/${id}/generate`, data),
  
  // Analytics & Stats
  stats: () =>
    api.get<ResponseBase>("/interviews/stats"),
  analytics: () =>
    api.get<ResponseBase>("/interviews/analytics"),
  progress: () =>
    api.get<ResponseBase>("/interviews/progress"),
  sessionAnalytics: (id: string) =>
    api.get<ResponseBase>(`/interviews/${id}/analytics`),
  
  // History & Reports
  history: (id: string) =>
    api.get<ResponseBase>(`/interviews/${id}/history`),
  reports: (id: string) =>
    api.get<ResponseBase>(`/interviews/${id}/reports`),
  generateReport: (id: string, data: InterviewReportCreate) =>
    api.post<ResponseBase>(`/interviews/${id}/reports`, data),
  
  // Suggestions & Improvements
  suggestions: (id: string) =>
    api.get<ResponseBase>(`/interviews/${id}/suggestions`),
  improvements: (id: string) =>
    api.get<ResponseBase>(`/interviews/${id}/improvements`),
  applySuggestion: (suggestionId: string) =>
    api.post<ResponseBase>(`/interviews/suggestions/${suggestionId}/apply`),
  dismissSuggestion: (suggestionId: string) =>
    api.post<ResponseBase>(`/interviews/suggestions/${suggestionId}/dismiss`),
  
  // Questions
  questions: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/questions`),
  addQuestion: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/questions`, data),
  
  // Rounds
  rounds: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/rounds`),
  addRound: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/rounds`, data),
  
  // Answers
  answers: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/answers`),
  submitAnswer: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/answers`, data),
  
  // Evaluations & Feedback
  evaluations: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/evaluations`),
  feedbacks: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/feedbacks`),
  
  // Comparisons
  compare: (sessionId: string, data: InterviewCompareRequest) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/compare`, data),
  
  // Search & Bulk
  search: (data: InterviewSearchRequest) =>
    api.post<PaginatedResponse<InterviewSession>>("/interviews/search", data),
  bulk: (data: InterviewBulkAction) =>
    api.post<ResponseBase>("/interviews/bulk", data),
  export: (sessionId: string, data: InterviewExportRequest) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/export`, data),
  
  // Templates
  listTemplates: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<InterviewTemplate>>("/interviews/templates", { params }),
  createTemplate: (data: Record<string, unknown>) =>
    api.post<ResponseBase<InterviewTemplate>>("/interviews/templates", data),
  getTemplate: (id: string) =>
    api.get<ResponseBase<InterviewTemplate>>(`/interviews/templates/${id}`),
  updateTemplate: (id: string, data: Record<string, unknown>) =>
    api.patch<ResponseBase<InterviewTemplate>>(`/interviews/templates/${id}`, data),
  deleteTemplate: (id: string) =>
    api.delete(`/interviews/templates/${id}`),
  
  // Question Bank
  listQuestionBank: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<InterviewQuestionBank>>("/interviews/question-bank", { params }),
  createQuestion: (data: Record<string, unknown>) =>
    api.post<ResponseBase<InterviewQuestionBank>>("/interviews/question-bank", data),
  getQuestion: (id: string) =>
    api.get<ResponseBase<InterviewQuestionBank>>(`/interviews/question-bank/${id}`),
  updateQuestion: (id: string, data: Record<string, unknown>) =>
    api.patch<ResponseBase<InterviewQuestionBank>>(`/interviews/question-bank/${id}`, data),
  deleteQuestion: (id: string) =>
    api.delete(`/interviews/question-bank/${id}`),
  
  // Bookmarks
  bookmarks: () =>
    api.get<ResponseBase>("/interviews/bookmarks"),
  createBookmark: (data: Record<string, unknown>) =>
    api.post<ResponseBase>("/interviews/bookmarks", data),
  deleteBookmark: (id: string) =>
    api.delete(`/interviews/bookmarks/${id}`),
  
  // Tags
  tags: () =>
    api.get<ResponseBase>("/interviews/tags"),
  createTag: (data: Record<string, unknown>) =>
    api.post<ResponseBase>("/interviews/tags", data),
  deleteTag: (id: string) =>
    api.delete(`/interviews/tags/${id}`),
  
  // Collections
  collections: () =>
    api.get<ResponseBase>("/interviews/collections"),
  createCollection: (data: Record<string, unknown>) =>
    api.post<ResponseBase>("/interviews/collections", data),
  getCollection: (id: string) =>
    api.get<ResponseBase>(`/interviews/collections/${id}`),
  updateCollection: (id: string, data: Record<string, unknown>) =>
    api.patch<ResponseBase>(`/interviews/collections/${id}`, data),
  deleteCollection: (id: string) =>
    api.delete(`/interviews/collections/${id}`),
  addToCollection: (collectionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/collections/${collectionId}/items`, data),
  removeFromCollection: (collectionId: string, itemId: string) =>
    api.delete(`/interviews/collections/${collectionId}/items/${itemId}`),
  
  // Settings
  settings: () =>
    api.get<ResponseBase>("/interviews/settings"),
  updateSettings: (data: Record<string, unknown>) =>
    api.patch<ResponseBase>("/interviews/settings", data),
  
  // Practice Plans
  practicePlans: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/practice-plan`),
  createPracticePlan: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/practice-plan`, data),
  
  // Checklists
  checklists: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/checklists`),
  createChecklist: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/checklists`, data),
  
  // Simulations
  simulations: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/simulations`),
  createSimulation: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/simulations`, data),
  
  // Artifacts
  artifacts: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/artifacts`),
  createArtifact: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/artifacts`, data),
  
  // Company/Job Prep
  companyPrep: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/company-prep`),
  createCompanyPrep: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/company-prep`, data),
  jobPrep: (sessionId: string) =>
    api.get<ResponseBase>(`/interviews/${sessionId}/job-prep`),
  createJobPrep: (sessionId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/${sessionId}/job-prep`, data),
  
  // Recommendations
  recommendations: () =>
    api.get<ResponseBase>("/interviews/recommendations"),
  
  // Goals
  goals: () =>
    api.get<ResponseBase>("/interviews/goals"),
  createGoal: (data: Record<string, unknown>) =>
    api.post<ResponseBase>("/interviews/goals", data),
  updateGoal: (id: string, data: Record<string, unknown>) =>
    api.patch<ResponseBase>(`/interviews/goals/${id}`, data),
  milestones: (goalId: string) =>
    api.get<ResponseBase>(`/interviews/goals/${goalId}/milestones`),
  createMilestone: (goalId: string, data: Record<string, unknown>) =>
    api.post<ResponseBase>(`/interviews/goals/${goalId}/milestones`, data),
};

export const crmApi = {
  // --- Recruiters ---
  listRecruiters: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<Recruiter>>>("/recruiters", { params }),
  createRecruiter: (data: RecruiterCreate) =>
    api.post<ApiResponse<Recruiter>>("/recruiters", data),
  getRecruiterStats: () =>
    api.get<ApiResponse<RecruiterStats>>("/recruiters/stats"),
  searchRecruiters: (params: CRMSearchRequest) =>
    api.get<ApiResponse<CRMPaginatedResponse<Recruiter>>>("/recruiters/search", { params: params as Record<string, unknown> }),
  getRecruiter: (id: string) =>
    api.get<ApiResponse<RecruiterDetail>>(`/recruiters/${id}`),
  updateRecruiter: (id: string, data: RecruiterUpdate) =>
    api.put<ApiResponse<Recruiter>>(`/recruiters/${id}`, data),
  deleteRecruiter: (id: string) =>
    api.delete(`/recruiters/${id}`),

  // Recruiter contacts
  listRecruiterContacts: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterContact[]>>(`/recruiters/${recruiterId}/contacts`),
  createRecruiterContact: (recruiterId: string, data: RecruiterContactCreate) =>
    api.post<ApiResponse<RecruiterContact>>(`/recruiters/${recruiterId}/contacts`, data),

  // Recruiter conversations
  listRecruiterConversations: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterConversation[]>>(`/recruiters/${recruiterId}/conversations`),
  createRecruiterConversation: (recruiterId: string, data: RecruiterConversationCreate) =>
    api.post<ApiResponse<RecruiterConversation>>(`/recruiters/${recruiterId}/conversations`, data),

  // Recruiter emails
  listRecruiterEmails: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterEmail[]>>(`/recruiters/${recruiterId}/emails`),
  createRecruiterEmail: (recruiterId: string, data: RecruiterEmailCreate) =>
    api.post<ApiResponse<RecruiterEmail>>(`/recruiters/${recruiterId}/emails`, data),

  // Recruiter calls
  listRecruiterCalls: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterCall[]>>(`/recruiters/${recruiterId}/calls`),
  createRecruiterCall: (recruiterId: string, data: RecruiterCallCreate) =>
    api.post<ApiResponse<RecruiterCall>>(`/recruiters/${recruiterId}/calls`, data),

  // Recruiter meetings
  listRecruiterMeetings: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterMeeting[]>>(`/recruiters/${recruiterId}/meetings`),
  createRecruiterMeeting: (recruiterId: string, data: RecruiterMeetingCreate) =>
    api.post<ApiResponse<RecruiterMeeting>>(`/recruiters/${recruiterId}/meetings`, data),

  // Recruiter notes
  listRecruiterNotes: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterNote[]>>(`/recruiters/${recruiterId}/notes`),
  createRecruiterNote: (recruiterId: string, data: RecruiterNoteCreate) =>
    api.post<ApiResponse<RecruiterNote>>(`/recruiters/${recruiterId}/notes`, data),

  // Recruiter reminders
  listRecruiterReminders: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterReminder[]>>(`/recruiters/${recruiterId}/reminders`),
  createRecruiterReminder: (recruiterId: string, data: RecruiterReminderCreate) =>
    api.post<ApiResponse<RecruiterReminder>>(`/recruiters/${recruiterId}/reminders`, data),

  // Recruiter follow-ups
  listRecruiterFollowUps: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterFollowUp[]>>(`/recruiters/${recruiterId}/follow-ups`),
  createRecruiterFollowUp: (recruiterId: string, data: RecruiterFollowUpCreate) =>
    api.post<ApiResponse<RecruiterFollowUp>>(`/recruiters/${recruiterId}/follow-ups`, data),

  // Recruiter tasks
  listRecruiterTasks: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterTask[]>>(`/recruiters/${recruiterId}/tasks`),
  createRecruiterTask: (recruiterId: string, data: RecruiterTaskCreate) =>
    api.post<ApiResponse<RecruiterTask>>(`/recruiters/${recruiterId}/tasks`, data),

  // Recruiter activities
  listRecruiterActivities: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterActivity[]>>(`/recruiters/${recruiterId}/activities`),
  createRecruiterActivity: (recruiterId: string, data: RecruiterActivityCreate) =>
    api.post<ApiResponse<RecruiterActivity>>(`/recruiters/${recruiterId}/activities`, data),

  // Recruiter attachments
  listRecruiterAttachments: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterAttachment[]>>(`/recruiters/${recruiterId}/attachments`),
  createRecruiterAttachment: (recruiterId: string, data: RecruiterAttachmentCreate) =>
    api.post<ApiResponse<RecruiterAttachment>>(`/recruiters/${recruiterId}/attachments`, data),

  // Recruiter tags
  listRecruiterTags: (recruiterId: string) =>
    api.get<ApiResponse<RecruiterTag[]>>(`/recruiters/${recruiterId}/tags`),
  createRecruiterTag: (recruiterId: string, data: RecruiterTagCreate) =>
    api.post<ApiResponse<RecruiterTag>>(`/recruiters/${recruiterId}/tags`, data),

  // --- Organizations ---
  listOrganizations: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<RecruiterOrganization>>>("/recruiters/organizations", { params }),
  createOrganization: (data: RecruiterOrganizationCreate) =>
    api.post<ApiResponse<RecruiterOrganization>>("/recruiters/organizations", data),
  getOrganization: (id: string) =>
    api.get<ApiResponse<RecruiterOrganization>>(`/recruiters/organizations/${id}`),
  updateOrganization: (id: string, data: RecruiterOrganizationUpdate) =>
    api.put<ApiResponse<RecruiterOrganization>>(`/recruiters/organizations/${id}`, data),
  deleteOrganization: (id: string) =>
    api.delete(`/recruiters/organizations/${id}`),

  // Organization departments
  listOrganizationDepartments: (orgId: string) =>
    api.get<ApiResponse<RecruiterDepartment[]>>(`/recruiters/organizations/${orgId}/departments`),
  createOrganizationDepartment: (orgId: string, data: RecruiterDepartmentCreate) =>
    api.post<ApiResponse<RecruiterDepartment>>(`/recruiters/organizations/${orgId}/departments`, data),

  // --- Collections ---
  listCollections: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<RecruiterCollection>>>("/recruiters/collections", { params }),
  createCollection: (data: RecruiterCollectionCreate) =>
    api.post<ApiResponse<RecruiterCollection>>("/recruiters/collections", data),
  getCollection: (id: string) =>
    api.get<ApiResponse<RecruiterCollection>>(`/recruiters/collections/${id}`),
  updateCollection: (id: string, data: Partial<RecruiterCollection>) =>
    api.put<ApiResponse<RecruiterCollection>>(`/recruiters/collections/${id}`, data),
  deleteCollection: (id: string) =>
    api.delete(`/recruiters/collections/${id}`),
  addToCollection: (collectionId: string, data: RecruiterCollectionItemCreate) =>
    api.post<ApiResponse<RecruiterCollectionItem>>(`/recruiters/collections/${collectionId}/items`, data),
  removeFromCollection: (collectionId: string, itemId: string) =>
    api.delete(`/recruiters/collections/${collectionId}/items/${itemId}`),

  // --- Applications ---
  listApplications: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<Application>>>("/applications", { params }),
  createApplication: (data: ApplicationCreate) =>
    api.post<ApiResponse<Application>>("/applications", data),
  getApplicationStats: () =>
    api.get<ApiResponse<Record<string, unknown>>>("/applications/stats"),
  getApplicationAnalytics: () =>
    api.get<ApiResponse<ApplicationAnalytics>>("/applications/analytics"),
  getApplication: (id: string) =>
    api.get<ApiResponse<ApplicationDetail>>(`/applications/${id}`),
  updateApplication: (id: string, data: ApplicationUpdate) =>
    api.patch<ApiResponse<Application>>(`/applications/${id}`, data),
  deleteApplication: (id: string) =>
    api.delete(`/applications/${id}`),

  // Application stages
  listApplicationStages: (appId: string) =>
    api.get<ApiResponse<ApplicationStage[]>>(`/applications/${appId}/stages`),
  createApplicationStage: (appId: string, data: ApplicationStageCreate) =>
    api.post<ApiResponse<ApplicationStage>>(`/applications/${appId}/stages`, data),
  updateApplicationStage: (appId: string, stageId: string, data: Partial<ApplicationStage>) =>
    api.patch<ApiResponse<ApplicationStage>>(`/applications/${appId}/stages/${stageId}`, data),
  deleteApplicationStage: (appId: string, stageId: string) =>
    api.delete(`/applications/${appId}/stages/${stageId}`),

  // Application history
  listApplicationHistory: (appId: string) =>
    api.get<ApiResponse<ApplicationHistory[]>>(`/applications/${appId}/history`),
  createApplicationHistory: (appId: string, data: Partial<ApplicationHistory>) =>
    api.post<ApiResponse<ApplicationHistory>>(`/applications/${appId}/history`, data),

  // Application statuses
  listApplicationStatuses: (appId: string) =>
    api.get<ApiResponse<ApplicationStatusRecord[]>>(`/applications/${appId}/statuses`),
  createApplicationStatus: (appId: string, data: Partial<ApplicationStatusRecord>) =>
    api.post<ApiResponse<ApplicationStatusRecord>>(`/applications/${appId}/statuses`, data),

  // Application checklists
  listApplicationChecklists: (appId: string) =>
    api.get<ApiResponse<ApplicationChecklist[]>>(`/applications/${appId}/checklists`),
  createApplicationChecklist: (appId: string, data: ApplicationChecklistCreate) =>
    api.post<ApiResponse<ApplicationChecklist>>(`/applications/${appId}/checklists`, data),
  updateApplicationChecklist: (appId: string, checklistId: string, data: Partial<ApplicationChecklist>) =>
    api.patch<ApiResponse<ApplicationChecklist>>(`/applications/${appId}/checklists/${checklistId}`, data),
  deleteApplicationChecklist: (appId: string, checklistId: string) =>
    api.delete(`/applications/${appId}/checklists/${checklistId}`),

  // Application timeline
  listApplicationTimeline: (appId: string) =>
    api.get<ApiResponse<ApplicationTimeline[]>>(`/applications/${appId}/timeline`),
  createApplicationTimeline: (appId: string, data: Partial<ApplicationTimeline>) =>
    api.post<ApiResponse<ApplicationTimeline>>(`/applications/${appId}/timeline`, data),

  // Application documents
  listApplicationDocuments: (appId: string) =>
    api.get<ApiResponse<ApplicationDocument[]>>(`/applications/${appId}/documents`),
  createApplicationDocument: (appId: string, data: ApplicationDocumentCreate) =>
    api.post<ApiResponse<ApplicationDocument>>(`/applications/${appId}/documents`, data),
  updateApplicationDocument: (appId: string, docId: string, data: Partial<ApplicationDocument>) =>
    api.patch<ApiResponse<ApplicationDocument>>(`/applications/${appId}/documents/${docId}`, data),
  deleteApplicationDocument: (appId: string, docId: string) =>
    api.delete(`/applications/${appId}/documents/${docId}`),

  // Application offers
  listApplicationOffers: (appId: string) =>
    api.get<ApiResponse<ApplicationOffer[]>>(`/applications/${appId}/offers`),
  createApplicationOffer: (appId: string, data: ApplicationOfferCreate) =>
    api.post<ApiResponse<ApplicationOffer>>(`/applications/${appId}/offers`, data),
  updateApplicationOffer: (appId: string, offerId: string, data: Partial<ApplicationOffer>) =>
    api.patch<ApiResponse<ApplicationOffer>>(`/applications/${appId}/offers/${offerId}`, data),

  // Application negotiations
  listApplicationNegotiations: (appId: string) =>
    api.get<ApiResponse<ApplicationNegotiation[]>>(`/applications/${appId}/negotiations`),
  createApplicationNegotiation: (appId: string, data: ApplicationNegotiationCreate) =>
    api.post<ApiResponse<ApplicationNegotiation>>(`/applications/${appId}/negotiations`, data),
  updateApplicationNegotiation: (appId: string, negId: string, data: Partial<ApplicationNegotiation>) =>
    api.patch<ApiResponse<ApplicationNegotiation>>(`/applications/${appId}/negotiations/${negId}`, data),

  // Application feedback
  listApplicationFeedback: (appId: string) =>
    api.get<ApiResponse<ApplicationFeedback[]>>(`/applications/${appId}/feedback`),
  createApplicationFeedback: (appId: string, data: ApplicationFeedbackCreate) =>
    api.post<ApiResponse<ApplicationFeedback>>(`/applications/${appId}/feedback`, data),

  // Application decisions
  listApplicationDecisions: (appId: string) =>
    api.get<ApiResponse<ApplicationDecision[]>>(`/applications/${appId}/decisions`),
  createApplicationDecision: (appId: string, data: ApplicationDecisionCreate) =>
    api.post<ApiResponse<ApplicationDecision>>(`/applications/${appId}/decisions`, data),

  // --- Referrals ---
  listReferrals: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<Referral>>>("/recruiters/referrals", { params }),
  createReferral: (data: ReferralCreate) =>
    api.post<ApiResponse<Referral>>("/recruiters/referrals", data),
  getReferral: (id: string) =>
    api.get<ApiResponse<Referral>>(`/recruiters/referrals/${id}`),
  updateReferral: (id: string, data: Partial<Referral>) =>
    api.put<ApiResponse<Referral>>(`/recruiters/referrals/${id}`, data),
  deleteReferral: (id: string) =>
    api.delete(`/recruiters/referrals/${id}`),

  // --- Networking Contacts ---
  listNetworkingContacts: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<NetworkingContact>>>("/networking/contacts", { params }),
  createNetworkingContact: (data: NetworkingContactCreate) =>
    api.post<ApiResponse<NetworkingContact>>("/networking/contacts", data),
  searchNetworkingContacts: (params: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<NetworkingContact>>>("/networking/contacts/search", { params }),
  getNetworkingContact: (id: string) =>
    api.get<ApiResponse<NetworkingContact>>(`/networking/contacts/${id}`),
  updateNetworkingContact: (id: string, data: Partial<NetworkingContact>) =>
    api.patch<ApiResponse<NetworkingContact>>(`/networking/contacts/${id}`, data),
  deleteNetworkingContact: (id: string) =>
    api.delete(`/networking/contacts/${id}`),

  // Networking contact conversations
  listNetworkingContactConversations: (contactId: string) =>
    api.get<ApiResponse<Record<string, unknown>[]>>(`/networking/contacts/${contactId}/conversations`),
  createNetworkingContactConversation: (contactId: string, data: Record<string, unknown>) =>
    api.post<ApiResponse<Record<string, unknown>>>(`/networking/contacts/${contactId}/conversations`, data),

  // Networking contact activities
  listNetworkingContactActivities: (contactId: string) =>
    api.get<ApiResponse<Record<string, unknown>[]>>(`/networking/contacts/${contactId}/activities`),
  createNetworkingContactActivity: (contactId: string, data: Record<string, unknown>) =>
    api.post<ApiResponse<Record<string, unknown>>>(`/networking/contacts/${contactId}/activities`, data),

  // --- Networking Events ---
  listNetworkingEvents: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<NetworkingEvent>>>("/networking/events", { params }),
  createNetworkingEvent: (data: NetworkingEventCreate) =>
    api.post<ApiResponse<NetworkingEvent>>("/networking/events", data),
  getNetworkingEvent: (id: string) =>
    api.get<ApiResponse<NetworkingEvent>>(`/networking/events/${id}`),
  updateNetworkingEvent: (id: string, data: Partial<NetworkingEvent>) =>
    api.patch<ApiResponse<NetworkingEvent>>(`/networking/events/${id}`, data),
  deleteNetworkingEvent: (id: string) =>
    api.delete(`/networking/events/${id}`),

  // --- Networking Reminders ---
  listNetworkingReminders: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<NetworkingReminder>>>("/networking/reminders", { params }),
  createNetworkingReminder: (data: NetworkingReminderCreate) =>
    api.post<ApiResponse<NetworkingReminder>>("/networking/reminders", data),
  getNetworkingReminder: (id: string) =>
    api.get<ApiResponse<NetworkingReminder>>(`/networking/reminders/${id}`),
  updateNetworkingReminder: (id: string, data: Partial<NetworkingReminder>) =>
    api.patch<ApiResponse<NetworkingReminder>>(`/networking/reminders/${id}`, data),
  deleteNetworkingReminder: (id: string) =>
    api.delete(`/networking/reminders/${id}`),

  // --- Networking Goals ---
  listNetworkingGoals: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<NetworkingGoal>>>("/networking/goals", { params }),
  createNetworkingGoal: (data: NetworkingGoalCreate) =>
    api.post<ApiResponse<NetworkingGoal>>("/networking/goals", data),
  getNetworkingGoal: (id: string) =>
    api.get<ApiResponse<NetworkingGoal>>(`/networking/goals/${id}`),
  updateNetworkingGoal: (id: string, data: Partial<NetworkingGoal>) =>
    api.patch<ApiResponse<NetworkingGoal>>(`/networking/goals/${id}`, data),
  deleteNetworkingGoal: (id: string) =>
    api.delete(`/networking/goals/${id}`),

  // --- Networking Analytics ---
  getNetworkingAnalytics: () =>
    api.get<ApiResponse<NetworkingAnalytics>>("/networking/analytics"),

  // --- CRM Notifications ---
  listNotifications: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<CRMNotification>>>("/networking/notifications", { params }),
  createNotification: (data: Partial<CRMNotification>) =>
    api.post<ApiResponse<CRMNotification>>("/networking/notifications", data),
  markNotificationRead: (id: string) =>
    api.patch<ApiResponse<CRMNotification>>(`/networking/notifications/${id}/read`),
  dismissNotification: (id: string) =>
    api.delete(`/networking/notifications/${id}`),

  // --- CRM Reports ---
  listReports: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<CRMReport>>>("/networking/reports", { params }),
  createReport: (data: Partial<CRMReport>) =>
    api.post<ApiResponse<CRMReport>>("/networking/reports", data),

  // --- CRM Settings ---
  getSettings: () =>
    api.get<ApiResponse<CRMSettings>>("/networking/settings"),
  updateSettings: (data: CRMSettingsUpdate) =>
    api.patch<ApiResponse<CRMSettings>>("/networking/settings", data),

  // --- CRM Bookmarks ---
  listBookmarks: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<CRMPaginatedResponse<CRMBookmark>>>("/networking/bookmarks", { params }),
  createBookmark: (data: CRMBookmarkCreate) =>
    api.post<ApiResponse<CRMBookmark>>("/networking/bookmarks", data),
  deleteBookmark: (id: string) =>
    api.delete(`/networking/bookmarks/${id}`),

  // --- CRM Insights ---
  listInsights: () =>
    api.get<ApiResponse<CRMInsight[]>>("/networking/insights"),
  dismissInsight: (id: string) =>
    api.patch<ApiResponse<CRMInsight>>(`/networking/insights/${id}/dismiss`),
  applyInsight: (id: string) =>
    api.patch<ApiResponse<CRMInsight>>(`/networking/insights/${id}/apply`),

  // --- CRM Recommendations ---
  listRecommendations: () =>
    api.get<ApiResponse<CRMRecommendation[]>>("/networking/recommendations"),
  applyRecommendation: (id: string) =>
    api.patch<ApiResponse<CRMRecommendation>>(`/networking/recommendations/${id}/apply`),

  // --- CRM History ---
  listHistory: () =>
    api.get<ApiResponse<CRMHistoryEntry[]>>("/networking/history"),

  // --- CRM Snapshots ---
  listSnapshots: () =>
    api.get<ApiResponse<CRMSnapshot[]>>("/networking/snapshots"),
  createSnapshot: (data: Partial<CRMSnapshot>) =>
    api.post<ApiResponse<CRMSnapshot>>("/networking/snapshots", data),

  // --- CRM Export ---
  exportData: (data: CRMExportRequest) =>
    api.post<ApiResponse<{ url: string; format: string }>>("/networking/export", data),

  // --- CRM Bulk ---
  bulkAction: (data: CRMBulkAction) =>
    api.post<ApiResponse<Record<string, unknown>>>("/networking/bulk", data),
};

export const emailApi = {
  // --- Accounts ---
  listAccounts: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailAccount>>>("/email/accounts", { params }),
  getAccount: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailAccount>>(`/email/accounts/${id}`),
  createAccount: (data: import("@/types/email").EmailAccountCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailAccount>>("/email/accounts", data),
  updateAccount: (id: string, data: import("@/types/email").EmailAccountUpdate) =>
    api.put<ApiResponse<import("@/types/email").EmailAccount>>(`/email/accounts/${id}`, data),
  deleteAccount: (id: string) =>
    api.delete(`/email/accounts/${id}`),

  // --- Stats ---
  getStats: () =>
    api.get<ApiResponse<import("@/types/email").EmailStats>>("/email/stats"),

  // --- Messages ---
  listMessages: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailMessage>>>("/email/messages", { params }),
  getMessage: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailMessage>>(`/email/messages/${id}`),
  createMessage: (data: import("@/types/email").EmailMessageCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailMessage>>("/email/messages", data),
  deleteMessage: (id: string) =>
    api.delete(`/email/messages/${id}`),
  sendEmail: (data: import("@/types/email").EmailMessageCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailMessage>>("/email/messages/send", data),
  bulkSendEmail: (data: { messages: import("@/types/email").EmailMessageCreate[] }) =>
    api.post<ApiResponse<import("@/types/email").EmailMessage[]>>("/email/messages/bulk-send", data),
  markAsRead: (id: string) =>
    api.patch<ApiResponse<import("@/types/email").EmailMessage>>(`/email/messages/${id}/read`),
  toggleStar: (id: string) =>
    api.patch<ApiResponse<import("@/types/email").EmailMessage>>(`/email/messages/${id}/star`),
  searchMessages: (params: import("@/types/email").EmailSearchRequest) =>
    api.post<ApiResponse<import("@/types/email").EmailSearchResult>>("/email/messages/search", params),
  trackOpen: (id: string) =>
    api.post<ApiResponse<void>>(`/email/messages/${id}/track-open`),
  trackClick: (id: string, url: string) =>
    api.post<ApiResponse<void>>(`/email/messages/${id}/track-click`, { url }),
  getEmailHistory: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailHistoryEntry[]>>(`/email/messages/${id}/history`),

  // --- Templates ---
  listTemplates: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailTemplate>>>("/email/templates", { params }),
  getTemplate: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailTemplate>>(`/email/templates/${id}`),
  createTemplate: (data: import("@/types/email").EmailTemplateCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailTemplate>>("/email/templates", data),
  updateTemplate: (id: string, data: import("@/types/email").EmailTemplateUpdate) =>
    api.put<ApiResponse<import("@/types/email").EmailTemplate>>(`/email/templates/${id}`, data),
  deleteTemplate: (id: string) =>
    api.delete(`/email/templates/${id}`),
  cloneTemplate: (id: string) =>
    api.post<ApiResponse<import("@/types/email").EmailTemplate>>(`/email/templates/${id}/clone`),
  restoreTemplateVersion: (templateId: string, versionId: string) =>
    api.post<ApiResponse<import("@/types/email").EmailTemplate>>(`/email/templates/${templateId}/versions/${versionId}/restore`),

  // --- Threads ---
  listThreads: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailThread>>>("/email/threads", { params }),
  getThread: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailThread>>(`/email/threads/${id}`),
  deleteThread: (id: string) =>
    api.delete(`/email/threads/${id}`),

  // --- Drafts ---
  listDrafts: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailDraft>>>("/email/drafts", { params }),
  getDraft: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailDraft>>(`/email/drafts/${id}`),
  createDraft: (data: import("@/types/email").EmailDraftCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailDraft>>("/email/drafts", data),
  updateDraft: (id: string, data: import("@/types/email").EmailDraftUpdate) =>
    api.put<ApiResponse<import("@/types/email").EmailDraft>>(`/email/drafts/${id}`, data),
  deleteDraft: (id: string) =>
    api.delete(`/email/drafts/${id}`),
  sendDraft: (id: string) =>
    api.post<ApiResponse<import("@/types/email").EmailMessage>>(`/email/drafts/${id}/send`),

  // --- Campaigns ---
  listCampaigns: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailCampaign>>>("/email/campaigns", { params }),
  getCampaign: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailCampaign>>(`/email/campaigns/${id}`),
  createCampaign: (data: import("@/types/email").EmailCampaignCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaign>>("/email/campaigns", data),
  updateCampaign: (id: string, data: import("@/types/email").EmailCampaignUpdate) =>
    api.put<ApiResponse<import("@/types/email").EmailCampaign>>(`/email/campaigns/${id}`, data),
  deleteCampaign: (id: string) =>
    api.delete(`/email/campaigns/${id}`),
  startCampaign: (id: string) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaign>>(`/email/campaigns/${id}/start`),
  pauseCampaign: (id: string) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaign>>(`/email/campaigns/${id}/pause`),
  resumeCampaign: (id: string) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaign>>(`/email/campaigns/${id}/resume`),
  cancelCampaign: (id: string) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaign>>(`/email/campaigns/${id}/cancel`),
  addCampaignRecipient: (campaignId: string, data: import("@/types/email").EmailCampaignRecipientCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaignRecipient>>(`/email/campaigns/${campaignId}/recipients`, data),
  addCampaignStep: (campaignId: string, data: Partial<import("@/types/email").EmailCampaignStep>) =>
    api.post<ApiResponse<import("@/types/email").EmailCampaignStep>>(`/email/campaigns/${campaignId}/steps`, data),

  // --- Sequences ---
  listSequences: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailSequence>>>("/email/sequences", { params }),
  getSequence: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailSequence>>(`/email/sequences/${id}`),
  createSequence: (data: import("@/types/email").EmailSequenceCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailSequence>>("/email/sequences", data),
  updateSequence: (id: string, data: import("@/types/email").EmailSequenceUpdate) =>
    api.put<ApiResponse<import("@/types/email").EmailSequence>>(`/email/sequences/${id}`, data),
  deleteSequence: (id: string) =>
    api.delete(`/email/sequences/${id}`),
  addSequenceStep: (sequenceId: string, data: Partial<import("@/types/email").EmailSequenceStep>) =>
    api.post<ApiResponse<import("@/types/email").EmailSequenceStep>>(`/email/sequences/${sequenceId}/steps`, data),
  enrollInSequence: (sequenceId: string, data: import("@/types/email").EmailSequenceEnrollmentCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailSequenceEnrollment>>(`/email/sequences/${sequenceId}/enroll`, data),
  pauseEnrollment: (sequenceId: string, enrollmentId: string) =>
    api.post<ApiResponse<import("@/types/email").EmailSequenceEnrollment>>(`/email/sequences/${sequenceId}/enrollments/${enrollmentId}/pause`),
  resumeEnrollment: (sequenceId: string, enrollmentId: string) =>
    api.post<ApiResponse<import("@/types/email").EmailSequenceEnrollment>>(`/email/sequences/${sequenceId}/enrollments/${enrollmentId}/resume`),
  unenroll: (sequenceId: string, enrollmentId: string) =>
    api.post<ApiResponse<import("@/types/email").EmailSequenceEnrollment>>(`/email/sequences/${sequenceId}/enrollments/${enrollmentId}/unenroll`),

  // --- Labels ---
  listLabels: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailLabel[]>>("/email/labels", { params }),
  getLabel: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailLabel>>(`/email/labels/${id}`),
  createLabel: (data: import("@/types/email").EmailLabelCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailLabel>>("/email/labels", data),
  updateLabel: (id: string, data: Partial<import("@/types/email").EmailLabel>) =>
    api.put<ApiResponse<import("@/types/email").EmailLabel>>(`/email/labels/${id}`, data),
  deleteLabel: (id: string) =>
    api.delete(`/email/labels/${id}`),

  // --- Suppressions ---
  listSuppressions: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailSuppression>>>("/email/suppressions", { params }),
  getSuppression: (id: string) =>
    api.get<ApiResponse<import("@/types/email").EmailSuppression>>(`/email/suppressions/${id}`),
  createSuppression: (data: import("@/types/email").EmailSuppressionCreate) =>
    api.post<ApiResponse<import("@/types/email").EmailSuppression>>("/email/suppressions", data),
  deleteSuppression: (id: string) =>
    api.delete(`/email/suppressions/${id}`),

  // --- AI Assist ---
  aiAssist: (data: { prompt: string; context?: Record<string, unknown> }) =>
    api.post<ApiResponse<{ content: string }>>("/email/ai-assist", data),

  // --- Notifications ---
  listNotifications: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<import("@/types/email").EmailPaginatedResponse<import("@/types/email").EmailNotification>>>("/email/notifications", { params }),
  markNotificationRead: (id: string) =>
    api.patch<ApiResponse<import("@/types/email").EmailNotification>>(`/email/notifications/${id}/read`),
};

import type {
  Portfolio,
  PortfolioCreate,
  PortfolioUpdate,
  PortfolioDetail,
  PortfolioTemplate,
  PortfolioTemplateCreate,
  PortfolioTemplateUpdate,
  PortfolioTheme,
  PortfolioThemeCreate,
  PortfolioThemeUpdate,
  PortfolioSection,
  PortfolioSectionCreate,
  PortfolioSectionUpdate,
  PortfolioSectionItem,
  PortfolioSectionItemCreate,
  PortfolioSectionItemUpdate,
  PortfolioProject,
  PortfolioProjectCreate,
  PortfolioProjectUpdate,
  PortfolioCaseStudy,
  PortfolioCaseStudyCreate,
  PortfolioCaseStudyUpdate,
  PortfolioAsset,
  PortfolioAssetCreate,
  PortfolioCertification,
  PortfolioCertificationCreate,
  PortfolioPublication,
  PortfolioPublicationCreate,
  PortfolioAward,
  PortfolioAwardCreate,
  PortfolioTestimonial,
  PortfolioTestimonialCreate,
  PortfolioTimeline,
  PortfolioTimelineCreate,
  PortfolioContact,
  PortfolioContactCreate,
  PortfolioFormSubmission,
  PortfolioShare,
  PortfolioShareCreate,
  PortfolioQRCode,
  PortfolioQRCodeCreate,
  PortfolioSEO,
  PortfolioSEOUpdate,
  PortfolioVersion,
  PortfolioTag,
  PortfolioRecommendation,
  PortfolioExport,
  PortfolioExportRequest,
  PortfolioDeployment,
  PortfolioDashboardStats,
  PortfolioPaginatedResponse,
  PortfolioSearchRequest,
  PortfolioBulkAction,
  PortfolioAIAssistRequest,
  PortfolioAIResult,
  PortfolioNotification,
  PortfolioSettings,
  PortfolioSettingsUpdate,
  PortfolioHistory,
  PortfolioAnalytics,
  PortfolioComparison,
} from "@/types/portfolio";

export const portfolioApi = {
  // --- Portfolios ---
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PortfolioPaginatedResponse<Portfolio>>>("/portfolio", { params }),
  get: (id: string) =>
    api.get<ApiResponse<PortfolioDetail>>(`/portfolio/${id}`),
  create: (data: PortfolioCreate) =>
    api.post<ApiResponse<Portfolio>>("/portfolio", data),
  update: (id: string, data: PortfolioUpdate) =>
    api.put<ApiResponse<Portfolio>>(`/portfolio/${id}`, data),
  delete: (id: string) =>
    api.delete(`/portfolio/${id}`),
  search: (params: PortfolioSearchRequest) =>
    api.post<ApiResponse<Portfolio[]>>("/portfolio/search", params),
  getStats: () =>
    api.get<ApiResponse<PortfolioDashboardStats>>("/portfolio/stats"),
  bulkAction: (data: PortfolioBulkAction) =>
    api.post<ApiResponse<{ count: number }>>("/portfolio/bulk", data),
  publish: (id: string) =>
    api.post<ApiResponse<Portfolio>>(`/portfolio/${id}/publish`),
  unpublish: (id: string) =>
    api.post<ApiResponse<Portfolio>>(`/portfolio/${id}/unpublish`),
  archive: (id: string) =>
    api.post<ApiResponse<Portfolio>>(`/portfolio/${id}/archive`),
  clone: (id: string, data?: { title?: string }) =>
    api.post<ApiResponse<Portfolio>>(`/portfolio/${id}/clone`, data),

  // --- Sections ---
  listSections: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioSection[]>>(`/portfolio/${portfolioId}/sections`),
  createSection: (portfolioId: string, data: PortfolioSectionCreate) =>
    api.post<ApiResponse<PortfolioSection>>(`/portfolio/${portfolioId}/sections`, data),
  updateSection: (portfolioId: string, sectionId: string, data: PortfolioSectionUpdate) =>
    api.put<ApiResponse<PortfolioSection>>(`/portfolio/${portfolioId}/sections/${sectionId}`, data),
  deleteSection: (portfolioId: string, sectionId: string) =>
    api.delete(`/portfolio/${portfolioId}/sections/${sectionId}`),
  reorderSections: (portfolioId: string, orderedIds: string[]) =>
    api.post(`/portfolio/${portfolioId}/sections/reorder`, { ordered_ids: orderedIds }),

  // --- Section Items ---
  listSectionItems: (portfolioId: string, sectionId: string) =>
    api.get<ApiResponse<PortfolioSectionItem[]>>(`/portfolio/${portfolioId}/sections/${sectionId}/items`),
  createSectionItem: (portfolioId: string, sectionId: string, data: PortfolioSectionItemCreate) =>
    api.post<ApiResponse<PortfolioSectionItem>>(`/portfolio/${portfolioId}/sections/${sectionId}/items`, data),
  updateSectionItem: (portfolioId: string, sectionId: string, itemId: string, data: PortfolioSectionItemUpdate) =>
    api.put<ApiResponse<PortfolioSectionItem>>(`/portfolio/${portfolioId}/sections/${sectionId}/items/${itemId}`, data),
  deleteSectionItem: (portfolioId: string, sectionId: string, itemId: string) =>
    api.delete(`/portfolio/${portfolioId}/sections/${sectionId}/items/${itemId}`),

  // --- Projects ---
  listProjects: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioProject[]>>(`/portfolio/${portfolioId}/projects`),
  createProject: (portfolioId: string, data: PortfolioProjectCreate) =>
    api.post<ApiResponse<PortfolioProject>>(`/portfolio/${portfolioId}/projects`, data),
  getProject: (portfolioId: string, projectId: string) =>
    api.get<ApiResponse<PortfolioProject>>(`/portfolio/${portfolioId}/projects/${projectId}`),
  updateProject: (portfolioId: string, projectId: string, data: PortfolioProjectUpdate) =>
    api.put<ApiResponse<PortfolioProject>>(`/portfolio/${portfolioId}/projects/${projectId}`, data),
  deleteProject: (portfolioId: string, projectId: string) =>
    api.delete(`/portfolio/${portfolioId}/projects/${projectId}`),

  // --- Case Studies ---
  listCaseStudies: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioCaseStudy[]>>(`/portfolio/${portfolioId}/case-studies`),
  createCaseStudy: (portfolioId: string, data: PortfolioCaseStudyCreate) =>
    api.post<ApiResponse<PortfolioCaseStudy>>(`/portfolio/${portfolioId}/case-studies`, data),
  updateCaseStudy: (portfolioId: string, caseStudyId: string, data: PortfolioCaseStudyUpdate) =>
    api.put<ApiResponse<PortfolioCaseStudy>>(`/portfolio/${portfolioId}/case-studies/${caseStudyId}`, data),
  deleteCaseStudy: (portfolioId: string, caseStudyId: string) =>
    api.delete(`/portfolio/${portfolioId}/case-studies/${caseStudyId}`),

  // --- Assets ---
  listAssets: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioAsset[]>>(`/portfolio/${portfolioId}/assets`),
  createAsset: (portfolioId: string, data: PortfolioAssetCreate) =>
    api.post<ApiResponse<PortfolioAsset>>(`/portfolio/${portfolioId}/assets`, data),
  deleteAsset: (portfolioId: string, assetId: string) =>
    api.delete(`/portfolio/${portfolioId}/assets/${assetId}`),

  // --- Testimonials ---
  listTestimonials: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioTestimonial[]>>(`/portfolio/${portfolioId}/testimonials`),
  createTestimonial: (portfolioId: string, data: PortfolioTestimonialCreate) =>
    api.post<ApiResponse<PortfolioTestimonial>>(`/portfolio/${portfolioId}/testimonials`, data),
  deleteTestimonial: (portfolioId: string, testimonialId: string) =>
    api.delete(`/portfolio/${portfolioId}/testimonials/${testimonialId}`),

  // --- Publications ---
  listPublications: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioPublication[]>>(`/portfolio/${portfolioId}/publications`),
  createPublication: (portfolioId: string, data: PortfolioPublicationCreate) =>
    api.post<ApiResponse<PortfolioPublication>>(`/portfolio/${portfolioId}/publications`, data),
  deletePublication: (portfolioId: string, publicationId: string) =>
    api.delete(`/portfolio/${portfolioId}/publications/${publicationId}`),

  // --- Awards ---
  listAwards: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioAward[]>>(`/portfolio/${portfolioId}/awards`),
  createAward: (portfolioId: string, data: PortfolioAwardCreate) =>
    api.post<ApiResponse<PortfolioAward>>(`/portfolio/${portfolioId}/awards`, data),
  deleteAward: (portfolioId: string, awardId: string) =>
    api.delete(`/portfolio/${portfolioId}/awards/${awardId}`),

  // --- Certifications ---
  listCertifications: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioCertification[]>>(`/portfolio/${portfolioId}/certifications`),
  createCertification: (portfolioId: string, data: PortfolioCertificationCreate) =>
    api.post<ApiResponse<PortfolioCertification>>(`/portfolio/${portfolioId}/certifications`, data),
  deleteCertification: (portfolioId: string, certId: string) =>
    api.delete(`/portfolio/${portfolioId}/certifications/${certId}`),

  // --- Timeline ---
  listTimeline: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioTimeline[]>>(`/portfolio/${portfolioId}/timeline`),
  createTimeline: (portfolioId: string, data: PortfolioTimelineCreate) =>
    api.post<ApiResponse<PortfolioTimeline>>(`/portfolio/${portfolioId}/timeline`, data),
  deleteTimeline: (portfolioId: string, timelineId: string) =>
    api.delete(`/portfolio/${portfolioId}/timeline/${timelineId}`),

  // --- Contacts ---
  listContacts: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioContact[]>>(`/portfolio/${portfolioId}/contacts`),
  createContact: (portfolioId: string, data: PortfolioContactCreate) =>
    api.post<ApiResponse<PortfolioContact>>(`/portfolio/${portfolioId}/contacts`, data),
  deleteContact: (portfolioId: string, contactId: string) =>
    api.delete(`/portfolio/${portfolioId}/contacts/${contactId}`),

  // --- Form Submissions ---
  listFormSubmissions: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioFormSubmission[]>>(`/portfolio/${portfolioId}/form-submissions`),

  // --- Versions ---
  listVersions: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioVersion[]>>(`/portfolio/${portfolioId}/versions`),
  createVersion: (portfolioId: string, data: { label?: string; change_summary?: string }) =>
    api.post<ApiResponse<PortfolioVersion>>(`/portfolio/${portfolioId}/versions`, data),
  restoreVersion: (portfolioId: string, versionId: string) =>
    api.post<ApiResponse<Portfolio>>(`/portfolio/${portfolioId}/versions/${versionId}/restore`),

  // --- Shares ---
  listShares: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioShare[]>>(`/portfolio/${portfolioId}/shares`),
  createShare: (portfolioId: string, data: PortfolioShareCreate) =>
    api.post<ApiResponse<PortfolioShare>>(`/portfolio/${portfolioId}/shares`, data),
  revokeShare: (portfolioId: string, shareId: string) =>
    api.delete(`/portfolio/${portfolioId}/shares/${shareId}`),

  // --- QR Codes ---
  generateQRCode: (portfolioId: string, data?: PortfolioQRCodeCreate) =>
    api.post<ApiResponse<PortfolioQRCode>>(`/portfolio/${portfolioId}/qr-code`, data),

  // --- SEO ---
  getSEO: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioSEO>>(`/portfolio/${portfolioId}/seo`),
  updateSEO: (portfolioId: string, data: PortfolioSEOUpdate) =>
    api.put<ApiResponse<PortfolioSEO>>(`/portfolio/${portfolioId}/seo`, data),

  // --- Deploy ---
  listDeployments: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioDeployment[]>>(`/portfolio/${portfolioId}/deployments`),
  deploy: (portfolioId: string, data?: { version_id?: string }) =>
    api.post<ApiResponse<PortfolioDeployment>>(`/portfolio/${portfolioId}/deploy`, data),

  // --- Analytics ---
  getAnalytics: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioAnalytics[]>>(`/portfolio/${portfolioId}/analytics`),

  // --- Templates ---
  listTemplates: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PortfolioTemplate[]>>("/portfolio/templates", { params }),
  getTemplate: (id: string) =>
    api.get<ApiResponse<PortfolioTemplate>>(`/portfolio/templates/${id}`),
  createTemplate: (data: PortfolioTemplateCreate) =>
    api.post<ApiResponse<PortfolioTemplate>>("/portfolio/templates", data),
  updateTemplate: (id: string, data: PortfolioTemplateUpdate) =>
    api.put<ApiResponse<PortfolioTemplate>>(`/portfolio/templates/${id}`, data),
  deleteTemplate: (id: string) =>
    api.delete(`/portfolio/templates/${id}`),

  // --- Themes ---
  listThemes: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PortfolioTheme[]>>("/portfolio/themes", { params }),
  getTheme: (id: string) =>
    api.get<ApiResponse<PortfolioTheme>>(`/portfolio/themes/${id}`),
  createTheme: (data: PortfolioThemeCreate) =>
    api.post<ApiResponse<PortfolioTheme>>("/portfolio/themes", data),
  updateTheme: (id: string, data: PortfolioThemeUpdate) =>
    api.put<ApiResponse<PortfolioTheme>>(`/portfolio/themes/${id}`, data),
  deleteTheme: (id: string) =>
    api.delete(`/portfolio/themes/${id}`),

  // --- Recommendations ---
  listRecommendations: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioRecommendation[]>>(`/portfolio/${portfolioId}/recommendations`),
  dismissRecommendation: (portfolioId: string, recId: string) =>
    api.post<ApiResponse<PortfolioRecommendation>>(`/portfolio/${portfolioId}/recommendations/${recId}/dismiss`),
  applyRecommendation: (portfolioId: string, recId: string) =>
    api.post<ApiResponse<PortfolioRecommendation>>(`/portfolio/${portfolioId}/recommendations/${recId}/apply`),

  // --- Optimizations ---
  listOptimizations: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioOptimization[]>>(`/portfolio/${portfolioId}/optimizations`),

  // --- Tags ---
  listTags: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioTag[]>>(`/portfolio/${portfolioId}/tags`),
  addTags: (portfolioId: string, tags: Array<{ tag: string; category?: string }>) =>
    api.post<ApiResponse<PortfolioTag[]>>(`/portfolio/${portfolioId}/tags`, { tags }),
  removeTag: (portfolioId: string, tagId: string) =>
    api.delete(`/portfolio/${portfolioId}/tags/${tagId}`),

  // --- AI Assist ---
  aiAssist: (portfolioId: string, data: PortfolioAIAssistRequest) =>
    api.post<ApiResponse<PortfolioAIResult>>(`/portfolio/${portfolioId}/ai-assist`, data),

  // --- Export ---
  exportPortfolio: (portfolioId: string, data: PortfolioExportRequest) =>
    api.post<ApiResponse<PortfolioExport>>(`/portfolio/${portfolioId}/export`, data),

  // --- Comparisons ---
  createComparison: (data: { portfolio_a_id: string; portfolio_b_id: string; name?: string }) =>
    api.post<ApiResponse<PortfolioComparison>>("/portfolio/comparisons", data),
  listComparisons: () =>
    api.get<ApiResponse<PortfolioComparison[]>>("/portfolio/comparisons"),

  // --- History ---
  listHistory: (portfolioId: string) =>
    api.get<ApiResponse<PortfolioHistory[]>>(`/portfolio/${portfolioId}/history`),

  // --- Settings ---
  getSettings: () =>
    api.get<ApiResponse<PortfolioSettings>>("/portfolio/settings"),
  updateSettings: (data: PortfolioSettingsUpdate) =>
    api.put<ApiResponse<PortfolioSettings>>("/portfolio/settings", data),

  // --- Notifications ---
  listNotifications: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PortfolioPaginatedResponse<PortfolioNotification>>>("/portfolio/notifications", { params }),
  markNotificationRead: (id: string) =>
    api.patch<ApiResponse<PortfolioNotification>>(`/portfolio/notifications/${id}/read`),
};

import type {
  DashboardStats,
  CareerCoachSession,
  CareerAssessment,
  CareerHealthScore,
  CareerReadinessScore,
  CareerScoreHistory,
  CareerRecommendation,
  CareerGoal,
  CareerMilestone,
  CareerRoadmap,
  CareerReview,
  CareerReport,
  CareerInsight,
  CareerOpportunity,
  CareerTrend,
  CareerSkillGap,
  CareerRisk,
  CareerAlert,
  CareerNotification,
  CareerConversation,
  CareerMessage,
  CareerLearningRecommendation,
  CareerPriority,
  CareerHistory,
  CareerActionPlan,
  CareerDigest,
  CareerSettings,
} from "@/types/career-coach";

export const careerCoachApi = {
  // Dashboard
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>("/career-coach/dashboard"),

  // Sessions
  createSession: (data: Partial<CareerCoachSession>) =>
    api.post<ApiResponse<CareerCoachSession>>("/career-coach/sessions", data),
  getSessions: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerCoachSession>>("/career-coach/sessions", { params: params as unknown as Record<string, unknown> }),
  getSession: (id: string) =>
    api.get<ApiResponse<CareerCoachSession>>(`/career-coach/sessions/${id}`),
  deleteSession: (id: string) =>
    api.delete(`/career-coach/sessions/${id}`),

  // Assessments
  createAssessment: (data: Partial<CareerAssessment>) =>
    api.post<ApiResponse<CareerAssessment>>("/career-coach/assessments", data),
  getAssessments: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerAssessment>>("/career-coach/assessments", { params: params as unknown as Record<string, unknown> }),
  runAssessment: () =>
    api.post<ApiResponse<CareerAssessment>>("/career-coach/assessments/run"),
  getAssessment: (id: string) =>
    api.get<ApiResponse<CareerAssessment>>(`/career-coach/assessments/${id}`),

  // Health Scores
  getHealthScores: () =>
    api.get<ApiResponse<CareerHealthScore[]>>("/career-coach/health-scores"),

  // Readiness Scores
  getReadinessScores: () =>
    api.get<ApiResponse<CareerReadinessScore[]>>("/career-coach/readiness-scores"),

  // Score History
  getScoreHistory: (scoreType: string) =>
    api.get<ApiResponse<CareerScoreHistory[]>>("/career-coach/score-history", { params: { score_type: scoreType } }),

  // Recommendations
  generateRecommendations: () =>
    api.post<ApiResponse<CareerRecommendation[]>>("/career-coach/recommendations/generate"),
  getRecommendations: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerRecommendation>>("/career-coach/recommendations", { params: params as unknown as Record<string, unknown> }),
  acceptRecommendation: (id: string) =>
    api.post<ApiResponse<CareerRecommendation>>(`/career-coach/recommendations/${id}/accept`),
  dismissRecommendation: (id: string) =>
    api.post<ApiResponse<CareerRecommendation>>(`/career-coach/recommendations/${id}/dismiss`),
  completeRecommendation: (id: string) =>
    api.post<ApiResponse<CareerRecommendation>>(`/career-coach/recommendations/${id}/complete`),

  // Goals
  createGoal: (data: Partial<CareerGoal>) =>
    api.post<ApiResponse<CareerGoal>>("/career-coach/goals", data),
  getGoals: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerGoal>>("/career-coach/goals", { params: params as unknown as Record<string, unknown> }),
  getGoal: (id: string) =>
    api.get<ApiResponse<CareerGoal>>(`/career-coach/goals/${id}`),
  updateGoal: (id: string, data: Partial<CareerGoal>) =>
    api.patch<ApiResponse<CareerGoal>>(`/career-coach/goals/${id}`, data),
  deleteGoal: (id: string) =>
    api.delete(`/career-coach/goals/${id}`),
  completeMilestone: (goalId: string, milestoneId: string) =>
    api.post<ApiResponse<CareerMilestone>>(`/career-coach/goals/${goalId}/milestones/${milestoneId}/complete`),
  checkGoalDeadlines: () =>
    api.post<void>("/career-coach/goals/check-deadlines"),

  // Roadmaps
  generateRoadmap: (data: Partial<CareerRoadmap>) =>
    api.post<ApiResponse<CareerRoadmap>>("/career-coach/roadmaps/generate", data),
  getRoadmaps: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerRoadmap>>("/career-coach/roadmaps", { params: params as unknown as Record<string, unknown> }),
  getRoadmap: (id: string) =>
    api.get<ApiResponse<CareerRoadmap>>(`/career-coach/roadmaps/${id}`),
  updateRoadmap: (id: string, data: Partial<CareerRoadmap>) =>
    api.put<ApiResponse<CareerRoadmap>>(`/career-coach/roadmaps/${id}`, data),
  deleteRoadmap: (id: string) =>
    api.delete(`/career-coach/roadmaps/${id}`),

  // Reviews
  generateReview: (data: Partial<CareerReview>) =>
    api.post<ApiResponse<CareerReview>>("/career-coach/reviews/generate", data),
  getReviews: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerReview>>("/career-coach/reviews", { params: params as unknown as Record<string, unknown> }),
  getReview: (id: string) =>
    api.get<ApiResponse<CareerReview>>(`/career-coach/reviews/${id}`),
  updateReview: (id: string, data: Partial<CareerReview>) =>
    api.patch<ApiResponse<CareerReview>>(`/career-coach/reviews/${id}`, data),

  // Reports
  generateReport: (data: Partial<CareerReport>) =>
    api.post<ApiResponse<CareerReport>>("/career-coach/reports/generate", data),
  getReports: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerReport>>("/career-coach/reports", { params: params as unknown as Record<string, unknown> }),
  getReport: (id: string) =>
    api.get<ApiResponse<CareerReport>>(`/career-coach/reports/${id}`),

  // Insights
  getInsights: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerInsight>>("/career-coach/insights", { params: params as unknown as Record<string, unknown> }),

  // Opportunities
  getOpportunities: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerOpportunity>>("/career-coach/opportunities", { params: params as unknown as Record<string, unknown> }),

  // Trends
  getTrends: () =>
    api.get<ApiResponse<CareerTrend[]>>("/career-coach/trends"),

  // Skill Gaps
  getSkillGaps: () =>
    api.get<ApiResponse<CareerSkillGap[]>>("/career-coach/skill-gaps"),

  // Risks
  getRisks: () =>
    api.get<ApiResponse<CareerRisk[]>>("/career-coach/risks"),

  // Alerts
  getAlerts: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerAlert>>("/career-coach/alerts", { params: params as unknown as Record<string, unknown> }),
  updateAlert: (id: string, data: Partial<CareerAlert>) =>
    api.patch<ApiResponse<CareerAlert>>(`/career-coach/alerts/${id}`, data),

  // Notifications
  getNotifications: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerNotification>>("/career-coach/notifications", { params: params as unknown as Record<string, unknown> }),
  markNotificationRead: (id: string) =>
    api.patch<ApiResponse<CareerNotification>>(`/career-coach/notifications/${id}/read`),
  markAllNotificationsRead: () =>
    api.post<void>("/career-coach/notifications/read-all"),

  // Conversations
  createConversation: (data: Partial<CareerConversation>) =>
    api.post<ApiResponse<CareerConversation>>("/career-coach/conversations", data),
  getConversations: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerConversation>>("/career-coach/conversations", { params: params as unknown as Record<string, unknown> }),
  getConversation: (id: string) =>
    api.get<ApiResponse<CareerConversation>>(`/career-coach/conversations/${id}`),
  sendMessage: (conversationId: string, data: Partial<CareerMessage>) =>
    api.post<ApiResponse<CareerMessage>>(`/career-coach/conversations/${conversationId}/messages`, data),

  // Learning
  getLearning: () =>
    api.get<ApiResponse<CareerLearningRecommendation[]>>("/career-coach/learning"),

  // Priorities
  getPriorities: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerPriority>>("/career-coach/priorities", { params: params as unknown as Record<string, unknown> }),
  createPriority: (data: Partial<CareerPriority>) =>
    api.post<ApiResponse<CareerPriority>>("/career-coach/priorities", data),

  // History
  getHistory: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerHistory>>("/career-coach/history", { params: params as unknown as Record<string, unknown> }),

  // Action Plans
  createActionPlan: (data: Partial<CareerActionPlan>) =>
    api.post<ApiResponse<CareerActionPlan>>("/career-coach/action-plans", data),
  getActionPlans: (params?: PaginationParams) =>
    api.get<PaginatedData<CareerActionPlan>>("/career-coach/action-plans", { params: params as unknown as Record<string, unknown> }),
  getActionPlan: (id: string) =>
    api.get<ApiResponse<CareerActionPlan>>(`/career-coach/action-plans/${id}`),
  updateActionPlan: (id: string, data: Partial<CareerActionPlan>) =>
    api.patch<ApiResponse<CareerActionPlan>>(`/career-coach/action-plans/${id}`, data),
  deleteActionPlan: (id: string) =>
    api.delete(`/career-coach/action-plans/${id}`),

  // Digests
  generateDigest: () =>
    api.post<ApiResponse<CareerDigest>>("/career-coach/digests/generate"),

  // Settings
  getSettings: () =>
    api.get<ApiResponse<CareerSettings>>("/career-coach/settings"),
  updateSettings: (data: Partial<CareerSettings>) =>
    api.put<ApiResponse<CareerSettings>>("/career-coach/settings", data),
};

import type {
  AnalyticsDashboardStats,
  AnalyticsDashboard,
  AnalyticsWidget,
  AnalyticsReport,
  AnalyticsMetric,
  AnalyticsKPI,
  AnalyticsTrend,
  AnalyticsBenchmark,
  AnalyticsComparison,
  AnalyticsForecast,
  AnalyticsInsight,
  AnalyticsRecommendation,
  AnalyticsAlert,
  AnalyticsExport,
  AnalyticsSettings,
  AnalyticsNotification,
  AnalyticsHistory,
} from "@/types/analytics";

export const analyticsApi = {
  // Dashboard
  getDashboard: () =>
    api.get<ApiResponse<AnalyticsDashboardStats>>("/analytics/dashboard"),
  getCrossModule: () =>
    api.get<ApiResponse<Record<string, unknown>>>("/analytics/cross-module"),

  // Dashboards
  createDashboard: (data: Partial<AnalyticsDashboard>) =>
    api.post<ApiResponse<AnalyticsDashboard>>("/analytics/dashboards", data),
  getDashboards: (params?: PaginationParams) =>
    api.get<PaginatedData<AnalyticsDashboard>>("/analytics/dashboards", { params: params as unknown as Record<string, unknown> }),
  getDashboard: (id: string) =>
    api.get<ApiResponse<AnalyticsDashboard>>(`/analytics/dashboards/${id}`),
  updateDashboard: (id: string, data: Partial<AnalyticsDashboard>) =>
    api.patch<ApiResponse<AnalyticsDashboard>>(`/analytics/dashboards/${id}`, data),
  deleteDashboard: (id: string) =>
    api.delete(`/analytics/dashboards/${id}`),

  // Widgets
  createWidget: (data: Partial<AnalyticsWidget>) =>
    api.post<ApiResponse<AnalyticsWidget>>("/analytics/widgets", data),
  getWidgets: (params?: PaginationParams & { dashboard_id?: string }) =>
    api.get<PaginatedData<AnalyticsWidget>>("/analytics/widgets", { params: params as unknown as Record<string, unknown> }),
  updateWidget: (id: string, data: Partial<AnalyticsWidget>) =>
    api.patch<ApiResponse<AnalyticsWidget>>(`/analytics/widgets/${id}`, data),
  deleteWidget: (id: string) =>
    api.delete(`/analytics/widgets/${id}`),

  // Reports
  createReport: (data: Partial<AnalyticsReport>) =>
    api.post<ApiResponse<AnalyticsReport>>("/analytics/reports", data),
  getReports: (params?: PaginationParams) =>
    api.get<PaginatedData<AnalyticsReport>>("/analytics/reports", { params: params as unknown as Record<string, unknown> }),
  getReport: (id: string) =>
    api.get<ApiResponse<AnalyticsReport>>(`/analytics/reports/${id}`),
  updateReport: (id: string, data: Partial<AnalyticsReport>) =>
    api.patch<ApiResponse<AnalyticsReport>>(`/analytics/reports/${id}`, data),
  deleteReport: (id: string) =>
    api.delete(`/analytics/reports/${id}`),
  generateReport: (id: string) =>
    api.post<ApiResponse<AnalyticsReport>>(`/analytics/reports/${id}/generate`),

  // Metrics
  createMetric: (data: Partial<AnalyticsMetric>) =>
    api.post<ApiResponse<AnalyticsMetric>>("/analytics/metrics", data),
  getMetrics: (params?: PaginationParams & { metric_type?: string; source_module?: string }) =>
    api.get<PaginatedData<AnalyticsMetric>>("/analytics/metrics", { params: params as unknown as Record<string, unknown> }),
  getMetric: (id: string) =>
    api.get<ApiResponse<AnalyticsMetric>>(`/analytics/metrics/${id}`),

  // KPIs
  createKPI: (data: Partial<AnalyticsKPI>) =>
    api.post<ApiResponse<AnalyticsKPI>>("/analytics/kpis", data),
  getKPIs: (params?: PaginationParams & { category?: string }) =>
    api.get<PaginatedData<AnalyticsKPI>>("/analytics/kpis", { params: params as unknown as Record<string, unknown> }),
  getKPI: (id: string) =>
    api.get<ApiResponse<AnalyticsKPI>>(`/analytics/kpis/${id}`),
  updateKPI: (id: string, data: Partial<AnalyticsKPI>) =>
    api.patch<ApiResponse<AnalyticsKPI>>(`/analytics/kpis/${id}`, data),
  deleteKPI: (id: string) =>
    api.delete(`/analytics/kpis/${id}`),

  // Trends
  createTrend: (data: Partial<AnalyticsTrend>) =>
    api.post<ApiResponse<AnalyticsTrend>>("/analytics/trends", data),
  getTrends: (params?: PaginationParams & { trend_type?: string; source_module?: string }) =>
    api.get<PaginatedData<AnalyticsTrend>>("/analytics/trends", { params: params as unknown as Record<string, unknown> }),
  getTrend: (id: string) =>
    api.get<ApiResponse<AnalyticsTrend>>(`/analytics/trends/${id}`),

  // Benchmarks
  createBenchmark: (data: Partial<AnalyticsBenchmark>) =>
    api.post<ApiResponse<AnalyticsBenchmark>>("/analytics/benchmarks", data),
  getBenchmarks: (params?: PaginationParams & { benchmark_type?: string }) =>
    api.get<PaginatedData<AnalyticsBenchmark>>("/analytics/benchmarks", { params: params as unknown as Record<string, unknown> }),
  getBenchmark: (id: string) =>
    api.get<ApiResponse<AnalyticsBenchmark>>(`/analytics/benchmarks/${id}`),

  // Comparisons
  createComparison: (data: Partial<AnalyticsComparison>) =>
    api.post<ApiResponse<AnalyticsComparison>>("/analytics/comparisons", data),
  getComparisons: (params?: PaginationParams) =>
    api.get<PaginatedData<AnalyticsComparison>>("/analytics/comparisons", { params: params as unknown as Record<string, unknown> }),
  getComparison: (id: string) =>
    api.get<ApiResponse<AnalyticsComparison>>(`/analytics/comparisons/${id}`),

  // Forecasts
  createForecast: (data: Partial<AnalyticsForecast>) =>
    api.post<ApiResponse<AnalyticsForecast>>("/analytics/forecasts", data),
  getForecasts: (params?: PaginationParams) =>
    api.get<PaginatedData<AnalyticsForecast>>("/analytics/forecasts", { params: params as unknown as Record<string, unknown> }),
  getForecast: (id: string) =>
    api.get<ApiResponse<AnalyticsForecast>>(`/analytics/forecasts/${id}`),

  // Insights
  getInsights: (params?: PaginationParams & { is_read?: boolean; insight_type?: string }) =>
    api.get<PaginatedData<AnalyticsInsight>>("/analytics/insights", { params: params as unknown as Record<string, unknown> }),
  getInsight: (id: string) =>
    api.get<ApiResponse<AnalyticsInsight>>(`/analytics/insights/${id}`),
  markInsightRead: (id: string) =>
    api.patch<ApiResponse<AnalyticsInsight>>(`/analytics/insights/${id}/read`),
  dismissInsight: (id: string) =>
    api.patch<ApiResponse<AnalyticsInsight>>(`/analytics/insights/${id}/dismiss`),

  // Recommendations
  getRecommendations: (params?: PaginationParams & { status?: string; category?: string }) =>
    api.get<PaginatedData<AnalyticsRecommendation>>("/analytics/recommendations", { params: params as unknown as Record<string, unknown> }),
  getRecommendation: (id: string) =>
    api.get<ApiResponse<AnalyticsRecommendation>>(`/analytics/recommendations/${id}`),
  acceptRecommendation: (id: string) =>
    api.post<ApiResponse<AnalyticsRecommendation>>(`/analytics/recommendations/${id}/accept`),
  dismissRecommendation: (id: string) =>
    api.post<ApiResponse<AnalyticsRecommendation>>(`/analytics/recommendations/${id}/dismiss`),
  completeRecommendation: (id: string) =>
    api.post<ApiResponse<AnalyticsRecommendation>>(`/analytics/recommendations/${id}/complete`),

  // Alerts
  getAlerts: (params?: PaginationParams & { is_read?: boolean }) =>
    api.get<PaginatedData<AnalyticsAlert>>("/analytics/alerts", { params: params as unknown as Record<string, unknown> }),
  markAlertRead: (id: string) =>
    api.patch<ApiResponse<AnalyticsAlert>>(`/analytics/alerts/${id}/read`),
  dismissAlert: (id: string) =>
    api.patch<ApiResponse<AnalyticsAlert>>(`/analytics/alerts/${id}/dismiss`),

  // Exports
  createExport: (data: Partial<AnalyticsExport>) =>
    api.post<ApiResponse<AnalyticsExport>>("/analytics/exports", data),
  getExports: (params?: PaginationParams) =>
    api.get<PaginatedData<AnalyticsExport>>("/analytics/exports", { params: params as unknown as Record<string, unknown> }),
  getExport: (id: string) =>
    api.get<ApiResponse<AnalyticsExport>>(`/analytics/exports/${id}`),

  // Settings
  getSettings: () =>
    api.get<ApiResponse<AnalyticsSettings>>("/analytics/settings"),
  updateSettings: (data: Partial<AnalyticsSettings>) =>
    api.put<ApiResponse<AnalyticsSettings>>("/analytics/settings", data),

  // Notifications
  getNotifications: (params?: PaginationParams & { is_read?: boolean }) =>
    api.get<PaginatedData<AnalyticsNotification>>("/analytics/notifications", { params: params as unknown as Record<string, unknown> }),
  markNotificationRead: (id: string) =>
    api.patch<ApiResponse<AnalyticsNotification>>(`/analytics/notifications/${id}/read`),
  markAllNotificationsRead: () =>
    api.post<void>("/analytics/notifications/read-all"),

  // History
  getHistory: (params?: PaginationParams & { entity_type?: string }) =>
    api.get<PaginatedData<AnalyticsHistory>>("/analytics/history", { params: params as unknown as Record<string, unknown> }),
};

export { apiClient };
