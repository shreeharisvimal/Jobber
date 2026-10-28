import { useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { careerProfileApi } from "@/lib/api-client";
import { useCareerProfileStore } from "@/stores/career-profile.store";
import { useAutosaveStore } from "@/stores/autosave.store";
import { toast } from "@/stores/toast.store";
import type {
  CareerProfile,
  CareerProfileFull,
  WorkExperience,
  WorkExperienceCreate,
  Education,
  EducationCreate,
  Skill,
  SkillCreate,
  SkillCategory,
  Certification,
  CertificationCreate,
  Project,
  ProjectCreate,
  Language,
  LanguageCreate,
  VolunteerExperience,
  VolunteerExperienceCreate,
  Publication,
  PublicationCreate,
  Patent,
  PatentCreate,
  Award,
  AwardCreate,
  Recommendation,
  RecommendationCreate,
  CareerGoal,
  CareerGoalCreate,
  CustomSection,
  CustomSectionCreate,
  ImportRecord,
  ImportConflict,
  DraftData,
  AutosavePayload,
  ProfileSearchResult,
  ProfileStats,
  PaginationParams,
} from "@/types/career-profile";

export const careerProfileKeys = {
  all: ["careerProfile"] as const,
  profile: () => [...careerProfileKeys.all, "profile"] as const,
  stats: () => [...careerProfileKeys.all, "stats"] as const,
  workExperiences: () => [...careerProfileKeys.all, "workExperiences"] as const,
  workExperience: (id: string) => [...careerProfileKeys.workExperiences(), id] as const,
  educations: () => [...careerProfileKeys.all, "educations"] as const,
  education: (id: string) => [...careerProfileKeys.educations(), id] as const,
  skills: () => [...careerProfileKeys.all, "skills"] as const,
  skillCategories: () => [...careerProfileKeys.all, "skillCategories"] as const,
  certifications: () => [...careerProfileKeys.all, "certifications"] as const,
  projects: () => [...careerProfileKeys.all, "projects"] as const,
  project: (id: string) => [...careerProfileKeys.projects(), id] as const,
  languages: () => [...careerProfileKeys.all, "languages"] as const,
  volunteerExperiences: () => [...careerProfileKeys.all, "volunteerExperiences"] as const,
  publications: () => [...careerProfileKeys.all, "publications"] as const,
  patents: () => [...careerProfileKeys.all, "patents"] as const,
  awards: () => [...careerProfileKeys.all, "awards"] as const,
  recommendations: () => [...careerProfileKeys.all, "recommendations"] as const,
  careerGoals: () => [...careerProfileKeys.all, "careerGoals"] as const,
  customSections: () => [...careerProfileKeys.all, "customSections"] as const,
  import: (id: string) => [...careerProfileKeys.all, "import", id] as const,
  draft: () => [...careerProfileKeys.all, "draft"] as const,
  search: (query: string) => [...careerProfileKeys.all, "search", query] as const,
};

export function useCareerProfile() {
  const setProfileId = useCareerProfileStore((s) => s.setProfileId);

  return useQuery<CareerProfileFull>({
    queryKey: careerProfileKeys.profile(),
    queryFn: async () => {
      const { data } = await careerProfileApi.getCareerProfile();
      if (data?.data) setProfileId(data.data.id);
      return data?.data as CareerProfileFull;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateCareerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CareerProfile>) =>
      careerProfileApi.updateCareerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.profile() });
      toast.success("Profile updated");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}

export function useDeleteCareerProfile() {
  const queryClient = useQueryClient();
  const reset = useCareerProfileStore((s) => s.reset);

  return useMutation({
    mutationFn: () => careerProfileApi.deleteCareerProfile(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: careerProfileKeys.all });
      reset();
      toast.success("Profile deleted");
    },
    onError: () => {
      toast.error("Failed to delete profile");
    },
  });
}

export function useCareerProfileStats() {
  return useQuery<ProfileStats>({
    queryKey: careerProfileKeys.stats(),
    queryFn: async () => {
      const { data } = await careerProfileApi.getCareerProfileStats();
      return data?.data as ProfileStats;
    },
    staleTime: 60 * 1000,
  });
}

export function useWorkExperiences(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.workExperiences(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getWorkExperiences(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkExperienceCreate) =>
      careerProfileApi.createWorkExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Work experience added");
    },
    onError: () => {
      toast.error("Failed to add work experience");
    },
  });
}

export function useWorkExperience(id: string) {
  return useQuery<WorkExperience>({
    queryKey: careerProfileKeys.workExperience(id),
    queryFn: async () => {
      const { data } = await careerProfileApi.getWorkExperience(id);
      return data?.data as WorkExperience;
    },
    enabled: !!id,
  });
}

export function useUpdateWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkExperience> }) =>
      careerProfileApi.updateWorkExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.profile() });
      toast.success("Work experience updated");
    },
    onError: () => {
      toast.error("Failed to update work experience");
    },
  });
}

export function useDeleteWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteWorkExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Work experience deleted");
    },
    onError: () => {
      toast.error("Failed to delete work experience");
    },
  });
}

export function useReorderWorkExperiences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderWorkExperiences(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
    },
    onError: () => {
      toast.error("Failed to reorder work experiences");
    },
  });
}

export function useAddWorkExperienceBullet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expId, data }: { expId: string; data: { content: string } }) =>
      careerProfileApi.addWorkExperienceBullet(expId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      toast.success("Bullet added");
    },
    onError: () => {
      toast.error("Failed to add bullet");
    },
  });
}

export function useDeleteWorkExperienceBullet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expId, bulletId }: { expId: string; bulletId: string }) =>
      careerProfileApi.deleteWorkExperienceBullet(expId, bulletId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      toast.success("Bullet deleted");
    },
    onError: () => {
      toast.error("Failed to delete bullet");
    },
  });
}

export function useAddWorkExperienceSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expId, data }: { expId: string; data: { skill_name: string } }) =>
      careerProfileApi.addWorkExperienceSkill(expId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      toast.success("Skill added");
    },
    onError: () => {
      toast.error("Failed to add skill");
    },
  });
}

export function useDeleteWorkExperienceSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expId, skillId }: { expId: string; skillId: string }) =>
      careerProfileApi.deleteWorkExperienceSkill(expId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      toast.success("Skill removed");
    },
    onError: () => {
      toast.error("Failed to remove skill");
    },
  });
}

export function useAddWorkExperienceHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expId,
      data,
    }: {
      expId: string;
      data: { content: string; metric_value?: string; metric_type?: string };
    }) => careerProfileApi.addWorkExperienceHighlight(expId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      toast.success("Highlight added");
    },
    onError: () => {
      toast.error("Failed to add highlight");
    },
  });
}

export function useDeleteWorkExperienceHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expId, highlightId }: { expId: string; highlightId: string }) =>
      careerProfileApi.deleteWorkExperienceHighlight(expId, highlightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.workExperiences() });
      toast.success("Highlight deleted");
    },
    onError: () => {
      toast.error("Failed to delete highlight");
    },
  });
}

export function useEducations(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.educations(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getEducations(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EducationCreate) =>
      careerProfileApi.createEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.educations() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Education added");
    },
    onError: () => {
      toast.error("Failed to add education");
    },
  });
}

export function useEducation(id: string) {
  return useQuery<Education>({
    queryKey: careerProfileKeys.education(id),
    queryFn: async () => {
      const { data } = await careerProfileApi.getEducation(id);
      return data?.data as Education;
    },
    enabled: !!id,
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Education> }) =>
      careerProfileApi.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.educations() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.profile() });
      toast.success("Education updated");
    },
    onError: () => {
      toast.error("Failed to update education");
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.educations() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Education deleted");
    },
    onError: () => {
      toast.error("Failed to delete education");
    },
  });
}

export function useReorderEducations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderEducations(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.educations() });
    },
    onError: () => {
      toast.error("Failed to reorder educations");
    },
  });
}

export function useAddEducationBullet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eduId,
      data,
    }: {
      eduId: string;
      data: { content: string; bullet_type?: string };
    }) => careerProfileApi.addEducationBullet(eduId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.educations() });
      toast.success("Bullet added");
    },
    onError: () => {
      toast.error("Failed to add bullet");
    },
  });
}

export function useDeleteEducationBullet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eduId, bulletId }: { eduId: string; bulletId: string }) =>
      careerProfileApi.deleteEducationBullet(eduId, bulletId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.educations() });
      toast.success("Bullet deleted");
    },
    onError: () => {
      toast.error("Failed to delete bullet");
    },
  });
}

export function useSkills(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.skills(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getSkills(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SkillCreate) => careerProfileApi.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skills() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Skill added");
    },
    onError: () => {
      toast.error("Failed to add skill");
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Skill> }) =>
      careerProfileApi.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skills() });
      toast.success("Skill updated");
    },
    onError: () => {
      toast.error("Failed to update skill");
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skills() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Skill deleted");
    },
    onError: () => {
      toast.error("Failed to delete skill");
    },
  });
}

export function useReorderSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderSkills(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skills() });
    },
    onError: () => {
      toast.error("Failed to reorder skills");
    },
  });
}

export function useSkillCategories() {
  return useQuery<SkillCategory[]>({
    queryKey: careerProfileKeys.skillCategories(),
    queryFn: async () => {
      const { data } = await careerProfileApi.getSkillCategories();
      return (data?.data as SkillCategory[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSkillCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      careerProfileApi.createSkillCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skillCategories() });
      toast.success("Category created");
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
}

export function useUpdateSkillCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      careerProfileApi.updateSkillCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skillCategories() });
      toast.success("Category updated");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
}

export function useDeleteSkillCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteSkillCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.skillCategories() });
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
}

export function useCertifications(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.certifications(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getCertifications(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CertificationCreate) =>
      careerProfileApi.createCertification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.certifications() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Certification added");
    },
    onError: () => {
      toast.error("Failed to add certification");
    },
  });
}

export function useUpdateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Certification> }) =>
      careerProfileApi.updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.certifications() });
      toast.success("Certification updated");
    },
    onError: () => {
      toast.error("Failed to update certification");
    },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteCertification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.certifications() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Certification deleted");
    },
    onError: () => {
      toast.error("Failed to delete certification");
    },
  });
}

export function useReorderCertifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderCertifications(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.certifications() });
    },
    onError: () => {
      toast.error("Failed to reorder certifications");
    },
  });
}

export function useProjects(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.projects(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getProjects(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => careerProfileApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Project added");
    },
    onError: () => {
      toast.error("Failed to add project");
    },
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: careerProfileKeys.project(id),
    queryFn: async () => {
      const { data } = await careerProfileApi.getProject(id);
      return data?.data as Project;
    },
    enabled: !!id,
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      careerProfileApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.profile() });
      toast.success("Project updated");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Project deleted");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
}

export function useAddProjectBullet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projId, data }: { projId: string; data: { content: string } }) =>
      careerProfileApi.addProjectBullet(projId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      toast.success("Bullet added");
    },
    onError: () => {
      toast.error("Failed to add bullet");
    },
  });
}

export function useDeleteProjectBullet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projId, bulletId }: { projId: string; bulletId: string }) =>
      careerProfileApi.deleteProjectBullet(projId, bulletId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      toast.success("Bullet deleted");
    },
    onError: () => {
      toast.error("Failed to delete bullet");
    },
  });
}

export function useAddProjectSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projId, data }: { projId: string; data: { skill_name: string } }) =>
      careerProfileApi.addProjectSkill(projId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      toast.success("Skill added");
    },
    onError: () => {
      toast.error("Failed to add skill");
    },
  });
}

export function useDeleteProjectSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projId, skillId }: { projId: string; skillId: string }) =>
      careerProfileApi.deleteProjectSkill(projId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.projects() });
      toast.success("Skill removed");
    },
    onError: () => {
      toast.error("Failed to remove skill");
    },
  });
}

export function useLanguages(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.languages(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getLanguages(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LanguageCreate) => careerProfileApi.createLanguage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.languages() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Language added");
    },
    onError: () => {
      toast.error("Failed to add language");
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Language> }) =>
      careerProfileApi.updateLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.languages() });
      toast.success("Language updated");
    },
    onError: () => {
      toast.error("Failed to update language");
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteLanguage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.languages() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Language deleted");
    },
    onError: () => {
      toast.error("Failed to delete language");
    },
  });
}

export function useReorderLanguages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderLanguages(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.languages() });
    },
    onError: () => {
      toast.error("Failed to reorder languages");
    },
  });
}

export function useVolunteerExperiences(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.volunteerExperiences(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getVolunteerExperiences(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateVolunteerExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VolunteerExperienceCreate) =>
      careerProfileApi.createVolunteerExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.volunteerExperiences() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Volunteer experience added");
    },
    onError: () => {
      toast.error("Failed to add volunteer experience");
    },
  });
}

export function useUpdateVolunteerExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<VolunteerExperience>;
    }) => careerProfileApi.updateVolunteerExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.volunteerExperiences() });
      toast.success("Volunteer experience updated");
    },
    onError: () => {
      toast.error("Failed to update volunteer experience");
    },
  });
}

export function useDeleteVolunteerExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      careerProfileApi.deleteVolunteerExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.volunteerExperiences() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Volunteer experience deleted");
    },
    onError: () => {
      toast.error("Failed to delete volunteer experience");
    },
  });
}

export function useReorderVolunteerExperiences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderVolunteerExperiences(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.volunteerExperiences() });
    },
    onError: () => {
      toast.error("Failed to reorder volunteer experiences");
    },
  });
}

export function usePublications(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.publications(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getPublications(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PublicationCreate) =>
      careerProfileApi.createPublication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.publications() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Publication added");
    },
    onError: () => {
      toast.error("Failed to add publication");
    },
  });
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Publication> }) =>
      careerProfileApi.updatePublication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.publications() });
      toast.success("Publication updated");
    },
    onError: () => {
      toast.error("Failed to update publication");
    },
  });
}

export function useDeletePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deletePublication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.publications() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Publication deleted");
    },
    onError: () => {
      toast.error("Failed to delete publication");
    },
  });
}

export function useReorderPublications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderPublications(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.publications() });
    },
    onError: () => {
      toast.error("Failed to reorder publications");
    },
  });
}

export function usePatents(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.patents(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getPatents(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePatent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatentCreate) => careerProfileApi.createPatent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.patents() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Patent added");
    },
    onError: () => {
      toast.error("Failed to add patent");
    },
  });
}

export function useUpdatePatent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patent> }) =>
      careerProfileApi.updatePatent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.patents() });
      toast.success("Patent updated");
    },
    onError: () => {
      toast.error("Failed to update patent");
    },
  });
}

export function useDeletePatent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deletePatent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.patents() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Patent deleted");
    },
    onError: () => {
      toast.error("Failed to delete patent");
    },
  });
}

export function useReorderPatents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderPatents(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.patents() });
    },
    onError: () => {
      toast.error("Failed to reorder patents");
    },
  });
}

export function useAwards(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.awards(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getAwards(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AwardCreate) => careerProfileApi.createAward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.awards() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Award added");
    },
    onError: () => {
      toast.error("Failed to add award");
    },
  });
}

export function useUpdateAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Award> }) =>
      careerProfileApi.updateAward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.awards() });
      toast.success("Award updated");
    },
    onError: () => {
      toast.error("Failed to update award");
    },
  });
}

export function useDeleteAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteAward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.awards() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Award deleted");
    },
    onError: () => {
      toast.error("Failed to delete award");
    },
  });
}

export function useReorderAwards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderAwards(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.awards() });
    },
    onError: () => {
      toast.error("Failed to reorder awards");
    },
  });
}

export function useRecommendations(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.recommendations(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getRecommendations(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecommendationCreate) =>
      careerProfileApi.createRecommendation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.recommendations() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Recommendation added");
    },
    onError: () => {
      toast.error("Failed to add recommendation");
    },
  });
}

export function useUpdateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Recommendation> }) =>
      careerProfileApi.updateRecommendation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.recommendations() });
      toast.success("Recommendation updated");
    },
    onError: () => {
      toast.error("Failed to update recommendation");
    },
  });
}

export function useDeleteRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteRecommendation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.recommendations() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Recommendation deleted");
    },
    onError: () => {
      toast.error("Failed to delete recommendation");
    },
  });
}

export function useReorderRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderRecommendations(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.recommendations() });
    },
    onError: () => {
      toast.error("Failed to reorder recommendations");
    },
  });
}

export function useCareerGoals(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.careerGoals(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getCareerGoals(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCareerGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CareerGoalCreate) =>
      careerProfileApi.createCareerGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.careerGoals() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Career goal added");
    },
    onError: () => {
      toast.error("Failed to add career goal");
    },
  });
}

export function useUpdateCareerGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CareerGoal> }) =>
      careerProfileApi.updateCareerGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.careerGoals() });
      toast.success("Career goal updated");
    },
    onError: () => {
      toast.error("Failed to update career goal");
    },
  });
}

export function useDeleteCareerGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteCareerGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.careerGoals() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Career goal deleted");
    },
    onError: () => {
      toast.error("Failed to delete career goal");
    },
  });
}

export function useReorderCareerGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderCareerGoals(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.careerGoals() });
    },
    onError: () => {
      toast.error("Failed to reorder career goals");
    },
  });
}

export function useCustomSections(params?: PaginationParams) {
  return useQuery({
    queryKey: [...careerProfileKeys.customSections(), params],
    queryFn: async () => {
      const { data } = await careerProfileApi.getCustomSections(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCustomSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomSectionCreate) =>
      careerProfileApi.createCustomSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.customSections() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Custom section added");
    },
    onError: () => {
      toast.error("Failed to add custom section");
    },
  });
}

export function useUpdateCustomSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomSection> }) =>
      careerProfileApi.updateCustomSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.customSections() });
      toast.success("Custom section updated");
    },
    onError: () => {
      toast.error("Failed to update custom section");
    },
  });
}

export function useDeleteCustomSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerProfileApi.deleteCustomSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.customSections() });
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.stats() });
      toast.success("Custom section deleted");
    },
    onError: () => {
      toast.error("Failed to delete custom section");
    },
  });
}

export function useReorderCustomSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      careerProfileApi.reorderCustomSections(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.customSections() });
    },
    onError: () => {
      toast.error("Failed to reorder custom sections");
    },
  });
}

export function useStartImport() {
  const queryClient = useQueryClient();
  const setImportInProgress = useCareerProfileStore((s) => s.setImportInProgress);

  return useMutation({
    mutationFn: (data: { import_type: string; data: Record<string, unknown> }) =>
      careerProfileApi.startImport(data as { import_type: "linkedin" | "resume_json" | "resume_pdf" | "manual_json"; data: Record<string, unknown> }),
    onSuccess: (response) => {
      const importId = response?.data?.data?.id;
      if (importId) {
        queryClient.invalidateQueries({ queryKey: careerProfileKeys.import(importId) });
      }
      setImportInProgress(true);
      toast.success("Import started");
    },
    onError: () => {
      setImportInProgress(false);
      toast.error("Failed to start import");
    },
  });
}

export function useImportStatus(id: string) {
  return useQuery<ImportRecord>({
    queryKey: careerProfileKeys.import(id),
    queryFn: async () => {
      const { data } = await careerProfileApi.getImportStatus(id);
      return data?.data as ImportRecord;
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 2000;
    },
  });
}

export function useImportConflicts(id: string) {
  return useQuery<ImportConflict[]>({
    queryKey: [...careerProfileKeys.import(id), "conflicts"],
    queryFn: async () => {
      const { data } = await careerProfileApi.getImportConflicts(id);
      return (data?.data as ImportConflict[]) ?? [];
    },
    enabled: !!id,
  });
}

export function useResolveImportConflicts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      resolutions,
    }: {
      id: string;
      resolutions: ImportConflict[];
    }) => careerProfileApi.resolveImportConflicts(id, resolutions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.all });
      toast.success("Conflicts resolved");
    },
    onError: () => {
      toast.error("Failed to resolve conflicts");
    },
  });
}

export function useExportProfile() {
  return useMutation({
    mutationFn: (data: { format: string; sections?: string[] }) =>
      careerProfileApi.exportProfile(data as { format: "json" | "structured" | "resume_engine"; sections?: string[] }),
    onSuccess: () => {
      toast.success("Profile exported");
    },
    onError: () => {
      toast.error("Failed to export profile");
    },
  });
}

export function useAutosave() {
  const queryClient = useQueryClient();
  const setAutoSaving = useCareerProfileStore((s) => s.setAutoSaving);
  const setLastAutoSaved = useCareerProfileStore((s) => s.setLastAutoSaved);
  const pendingChanges = useCareerProfileStore((s) => s.pendingChanges);
  const clearPendingChanges = useCareerProfileStore((s) => s.clearPendingChanges);

  const { setIsSaving, setError, incrementRetry, resetRetry, retryCount, maxRetries, lastSaved, setLastSaved } =
    useAutosaveStore();

  const pendingChangesRef = useRef(pendingChanges);
  pendingChangesRef.current = pendingChanges;

  const mutation = useMutation({
    mutationFn: (payload: AutosavePayload) => careerProfileApi.autosave(payload),
    onSuccess: () => {
      clearPendingChanges();
      setAutoSaving(false);
      setLastAutoSaved(new Date().toISOString());
      setLastSaved(new Date().toISOString());
      setIsSaving(false);
      setError(null);
      resetRetry();
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.profile() });
    },
    onError: () => {
      setIsSaving(false);
      setAutoSaving(false);
      if (retryCount < maxRetries) {
        incrementRetry();
        setError(`Retry ${retryCount + 1}/${maxRetries}`);
      } else {
        setError("Autosave failed after max retries");
        toast.error("Autosave failed. Your changes may not be saved.");
      }
    },
  });

  const save = useCallback(() => {
    const currentChanges = pendingChangesRef.current;
    if (currentChanges.length === 0 || mutation.isPending) return;

    setAutoSaving(true);
    setIsSaving(true);
    mutation.mutate({ changes: currentChanges });
  }, [mutation, setAutoSaving, setIsSaving]);

  const autosaveInterval = useAutosaveStore((s) => s.autosaveInterval);
  const hasUnsavedChanges = useCareerProfileStore((s) => s.hasUnsavedChanges);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setInterval(save, autosaveInterval);
    return () => clearInterval(timer);
  }, [hasUnsavedChanges, autosaveInterval, save]);

  return {
    save,
    isSaving: mutation.isPending || useAutosaveStore.getState().isSaving,
    error: useAutosaveStore.getState().error,
    lastSaved,
  };
}

export function useSaveDraft() {
  const queryClient = useQueryClient();
  const setHasDraft = useCareerProfileStore((s) => s.setHasDraft);

  return useMutation({
    mutationFn: (data: DraftData) => careerProfileApi.saveDraft(data),
    onSuccess: (response) => {
      const savedAt = response?.data?.data?.saved_at ?? new Date().toISOString();
      setHasDraft(true, savedAt);
      queryClient.invalidateQueries({ queryKey: careerProfileKeys.draft() });
      toast.success("Draft saved");
    },
    onError: () => {
      toast.error("Failed to save draft");
    },
  });
}

export function useDraft() {
  return useQuery<DraftData>({
    queryKey: careerProfileKeys.draft(),
    queryFn: async () => {
      const { data } = await careerProfileApi.getDraft();
      return data?.data as DraftData;
    },
    staleTime: 60 * 1000,
  });
}

export function useDiscardDraft() {
  const queryClient = useQueryClient();
  const setHasDraft = useCareerProfileStore((s) => s.setHasDraft);

  return useMutation({
    mutationFn: () => careerProfileApi.discardDraft(),
    onSuccess: () => {
      setHasDraft(false);
      queryClient.removeQueries({ queryKey: careerProfileKeys.draft() });
      toast.success("Draft discarded");
    },
    onError: () => {
      toast.error("Failed to discard draft");
    },
  });
}

export function useProfileSearch(query: string) {
  const setSearchResults = useCareerProfileStore((s) => s.setSearchResults);
  const setIsSearching = useCareerProfileStore((s) => s.setIsSearching);

  return useQuery<ProfileSearchResult[]>({
    queryKey: careerProfileKeys.search(query),
    queryFn: async () => {
      setIsSearching(true);
      const { data } = await careerProfileApi.searchProfile({ query });
      const results = (data?.data as ProfileSearchResult[]) ?? [];
      setSearchResults(results);
      setIsSearching(false);
      return results;
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}
