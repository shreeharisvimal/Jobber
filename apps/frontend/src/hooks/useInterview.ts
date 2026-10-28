import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInterviewStore } from "@/stores/interview.store";
import type {
  InterviewSession,
  InterviewSessionCreate,
  InterviewSessionUpdate,
  InterviewSessionDetail,
  InterviewTemplate,
  InterviewQuestionBank,
  InterviewGenerateRequest,
  InterviewCompareRequest,
  InterviewSearchRequest,
  InterviewBulkAction,
  InterviewExportRequest,
  InterviewReport,
  InterviewBookmark,
  InterviewTag,
  InterviewCollection,
  InterviewSettings,
  InterviewRecommendation,
  InterviewPracticePlan,
  InterviewChecklist,
  InterviewSimulation,
  InterviewArtifact,
  InterviewCompanyPreparation,
  InterviewJobPreparation,
  InterviewProgress,
  InterviewGoal,
  InterviewMilestone,
  InterviewAnalytics,
  InterviewStats,
  InterviewPaginatedResponse,
} from "@/types/interview";

// Query key factory
export const interviewKeys = {
  all: ["interviews"] as const,
  lists: () => [...interviewKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...interviewKeys.lists(), filters] as const,
  details: () => [...interviewKeys.all, "detail"] as const,
  detail: (id: string) => [...interviewKeys.details(), id] as const,
  stats: () => [...interviewKeys.all, "stats"] as const,
  analytics: () => [...interviewKeys.all, "analytics"] as const,
  progress: () => [...interviewKeys.all, "progress"] as const,
  sessionAnalytics: (id: string) => [...interviewKeys.all, "sessionAnalytics", id] as const,
  history: (id: string) => [...interviewKeys.all, "history", id] as const,
  reports: (id: string) => [...interviewKeys.all, "reports", id] as const,
  suggestions: (id: string) => [...interviewKeys.all, "suggestions", id] as const,
  improvements: (id: string) => [...interviewKeys.all, "improvements", id] as const,
  questions: (id: string) => [...interviewKeys.all, "questions", id] as const,
  rounds: (id: string) => [...interviewKeys.all, "rounds", id] as const,
  answers: (id: string) => [...interviewKeys.all, "answers", id] as const,
  evaluations: (id: string) => [...interviewKeys.all, "evaluations", id] as const,
  feedbacks: (id: string) => [...interviewKeys.all, "feedbacks", id] as const,
  templates: () => [...interviewKeys.all, "templates"] as const,
  templateDetail: (id: string) => [...interviewKeys.templates(), id] as const,
  questionBank: () => [...interviewKeys.all, "questionBank"] as const,
  bookmarks: () => [...interviewKeys.all, "bookmarks"] as const,
  tags: (sessionId?: string) => [...interviewKeys.all, "tags", sessionId] as const,
  collections: () => [...interviewKeys.all, "collections"] as const,
  collectionDetail: (id: string) => [...interviewKeys.collections(), id] as const,
  settings: () => [...interviewKeys.all, "settings"] as const,
  recommendations: () => [...interviewKeys.all, "recommendations"] as const,
  practicePlans: (id: string) => [...interviewKeys.all, "practicePlans", id] as const,
  checklists: (id: string) => [...interviewKeys.all, "checklists", id] as const,
  simulations: (id: string) => [...interviewKeys.all, "simulations", id] as const,
  artifacts: (id: string) => [...interviewKeys.all, "artifacts", id] as const,
  companyPrep: (id: string) => [...interviewKeys.all, "companyPrep", id] as const,
  jobPrep: (id: string) => [...interviewKeys.all, "jobPrep", id] as const,
  goals: () => [...interviewKeys.all, "goals"] as const,
  milestones: (goalId: string) => [...interviewKeys.all, "milestones", goalId] as const,
};

function mockApi<T>(data: T, delay = 500): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}

// --- Core Session Hooks ---

export function useInterviews() {
  const filters = useInterviewStore((s) => s.filters);
  return useQuery({
    queryKey: interviewKeys.list(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<InterviewPaginatedResponse<InterviewSession>> => {
      const res = await mockApi<{ data: InterviewPaginatedResponse<InterviewSession> }>({
        data: { data: [], total: 0, page: filters.page, per_page: filters.perPage, total_pages: 0 },
      });
      return res.data;
    },
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: interviewKeys.detail(id),
    queryFn: async (): Promise<InterviewSessionDetail> => {
      const res = await mockApi<{ data: InterviewSessionDetail }>({} as InterviewSessionDetail);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: InterviewSessionCreate) => {
      const res = await mockApi<{ data: InterviewSession }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          title: "",
          status: "draft",
          session_type: "mixed",
          difficulty: "medium",
          mode: "untimed",
          total_questions: 0,
          answered_questions: 0,
          overall_score: null,
          is_bookmarked: false,
          tags: data.tags ?? [],
          metadata: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewSession,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useUpdateInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: InterviewSessionUpdate }) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useDeleteInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

// --- Session Control Hooks ---

export function useStartInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables) });
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function usePauseInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables) });
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useResumeInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables) });
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useFinishInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables) });
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
      qc.invalidateQueries({ queryKey: interviewKeys.stats() });
    },
  });
}

// --- AI Hooks ---

export function useEvaluateInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId: _sessionId, data: _data }: { sessionId: string; data?: Record<string, unknown> }) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables.sessionId) });
      qc.invalidateQueries({ queryKey: interviewKeys.evaluations(variables.sessionId) });
    },
  });
}

export function useAddFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId: _sessionId, data: _data }: { sessionId: string; data: { content: string; rating?: number; type?: string } }) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.feedbacks(variables.sessionId) });
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables.sessionId) });
    },
  });
}

export function useGenerateQuestions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_request: InterviewGenerateRequest) => {
      const res = await mockApi<{ data: InterviewSession }>({} as InterviewSession);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
      qc.invalidateQueries({ queryKey: interviewKeys.questionBank() });
    },
  });
}

// --- Data Hooks ---

export function useInterviewStats() {
  return useQuery({
    queryKey: interviewKeys.stats(),
    queryFn: async (): Promise<InterviewStats> => {
      const res = await mockApi<{ data: InterviewStats }>({
        data: {
          total_sessions: 0,
          completed_sessions: 0,
          average_score: null,
          total_questions: 0,
          total_templates: 0,
          total_collections: 0,
          recent_activity: [],
          score_distribution: {},
          difficulty_distribution: {},
          type_distribution: {},
        },
      });
      return res.data;
    },
  });
}

export function useInterviewAnalytics() {
  return useQuery({
    queryKey: interviewKeys.analytics(),
    queryFn: async (): Promise<InterviewAnalytics> => {
      const res = await mockApi<{ data: InterviewAnalytics }>({
        data: {
          view_count: 0,
          share_count: 0,
          export_count: 0,
          average_rating: null,
          rating_count: 0,
          feedback_count: 0,
          top_topics: [],
          score_trend: [],
          practice_time_minutes: 0,
          streak_days: 0,
        },
      });
      return res.data;
    },
  });
}

export function useInterviewProgress() {
  return useQuery({
    queryKey: interviewKeys.progress(),
    queryFn: async (): Promise<InterviewProgress> => {
      const res = await mockApi<{ data: InterviewProgress }>({
        data: {
          goals_completed: 0,
          goals_total: 0,
          milestones_completed: 0,
          milestones_total: 0,
          practice_hours: 0,
          improvement_rate: 0,
          weekly_progress: [],
        },
      });
      return res.data;
    },
  });
}

export function useInterviewHistory(id: string) {
  return useQuery({
    queryKey: interviewKeys.history(id),
    queryFn: async (): Promise<InterviewSession[]> => {
      const res = await mockApi<{ data: InterviewSession[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewReports(id: string) {
  return useQuery({
    queryKey: interviewKeys.reports(id),
    queryFn: async (): Promise<InterviewReport[]> => {
      const res = await mockApi<{ data: InterviewReport[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId: _sessionId, type: _type }: { sessionId: string; type?: string }) => {
      const res = await mockApi<{ data: InterviewReport }>({} as InterviewReport);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.reports(variables.sessionId) });
    },
  });
}

export function useInterviewSuggestions(id: string) {
  return useQuery({
    queryKey: interviewKeys.suggestions(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewImprovements(id: string) {
  return useQuery({
    queryKey: interviewKeys.improvements(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewQuestions(id: string) {
  return useQuery({
    queryKey: interviewKeys.questions(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewRounds(id: string) {
  return useQuery({
    queryKey: interviewKeys.rounds(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewAnswers(id: string) {
  return useQuery({
    queryKey: interviewKeys.answers(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewEvaluations(id: string) {
  return useQuery({
    queryKey: interviewKeys.evaluations(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useInterviewFeedbacks(id: string) {
  return useQuery({
    queryKey: interviewKeys.feedbacks(id),
    queryFn: async (): Promise<unknown[]> => {
      const res = await mockApi<{ data: unknown[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

// --- Action Hooks ---

export function useApplySuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId: _sessionId, suggestionId: _suggestionId }: { sessionId: string; suggestionId: string }) => {
      const res = await mockApi<{ data: unknown }>({});
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.suggestions(variables.sessionId) });
      qc.invalidateQueries({ queryKey: interviewKeys.detail(variables.sessionId) });
    },
  });
}

export function useDismissSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId: _sessionId, suggestionId: _suggestionId }: { sessionId: string; suggestionId: string }) => {
      const res = await mockApi<{ data: unknown }>({});
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.suggestions(variables.sessionId) });
    },
  });
}

export function useCompareInterviews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_request: InterviewCompareRequest) => {
      const res = await mockApi<{ data: unknown }>({});
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useSearchInterviews() {
  return useMutation({
    mutationFn: async (_request: InterviewSearchRequest) => {
      const res = await mockApi<{ data: InterviewPaginatedResponse<InterviewSession> }>({
        data: { data: [], total: 0, page: 1, per_page: 20, total_pages: 0 },
      });
      return res.data;
    },
  });
}

export function useBulkDeleteInterviews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (action: InterviewBulkAction) => {
      await mockApi({ success: true }, 200);
      return action;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useExportInterview() {
  return useMutation({
    mutationFn: async (request: InterviewExportRequest) => {
      const res = await mockApi<{ data: { url: string; format: string } }>({
        data: { url: "https://example.com/export", format: request.format || "pdf" },
      });
      return res.data;
    },
  });
}

// --- Template Hooks ---

export function useInterviewTemplates() {
  return useQuery({
    queryKey: interviewKeys.templates(),
    queryFn: async (): Promise<InterviewTemplate[]> => {
      const res = await mockApi<{ data: InterviewTemplate[] }>([]);
      return res.data;
    },
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewTemplate>) => {
      const res = await mockApi<{ data: InterviewTemplate }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          name: "",
          description: "",
          session_type: "mixed",
          difficulty: "medium",
          mode: "untimed",
          questions: [],
          tags: [],
          is_public: false,
          usage_count: 0,
          rating: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewTemplate,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.templates() });
    },
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: Partial<InterviewTemplate> }) => {
      const res = await mockApi<{ data: InterviewTemplate }>({} as InterviewTemplate);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.templates() });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.templates() });
    },
  });
}

// --- Question Bank Hooks ---

export function useQuestionBank() {
  return useQuery({
    queryKey: interviewKeys.questionBank(),
    queryFn: async (): Promise<InterviewQuestionBank[]> => {
      const res = await mockApi<{ data: InterviewQuestionBank[] }>([]);
      return res.data;
    },
  });
}

export function useCreateQuestionBankQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewQuestionBank>) => {
      const res = await mockApi<{ data: InterviewQuestionBank }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          question: "",
          category: "general",
          difficulty: "medium",
          tags: [],
          is_custom: true,
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewQuestionBank,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.questionBank() });
    },
  });
}

export function useUpdateQuestionBankQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: Partial<InterviewQuestionBank> }) => {
      const res = await mockApi<{ data: InterviewQuestionBank }>({} as InterviewQuestionBank);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.questionBank() });
    },
  });
}

export function useDeleteQuestionBankQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.questionBank() });
    },
  });
}

// --- Bookmark/Tag/Collection Hooks ---

export function useInterviewBookmarks() {
  return useQuery({
    queryKey: interviewKeys.bookmarks(),
    queryFn: async (): Promise<InterviewBookmark[]> => {
      const res = await mockApi<{ data: InterviewBookmark[] }>([]);
      return res.data;
    },
  });
}

export function useCreateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId: _sessionId, notes: _notes }: { sessionId: string; notes?: string }) => {
      const res = await mockApi<{ data: InterviewBookmark }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          session_id: "",
          notes: "",
          created_at: new Date().toISOString(),
        } as InterviewBookmark,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.bookmarks() });
    },
  });
}

export function useDeleteBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.bookmarks() });
    },
  });
}

export function useInterviewTags(sessionId?: string) {
  return useQuery({
    queryKey: interviewKeys.tags(sessionId),
    queryFn: async (): Promise<InterviewTag[]> => {
      const res = await mockApi<{ data: InterviewTag[] }>([]);
      return res.data;
    },
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; color?: string; sessionId?: string }) => {
      const res = await mockApi<{ data: InterviewTag }>({
        data: {
          id: crypto.randomUUID(),
          name: "",
          color: "#3B82F6",
          session_ids: data.sessionId ? [data.sessionId] : [],
          created_at: new Date().toISOString(),
          ...data,
        } as InterviewTag,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: interviewKeys.tags(variables.sessionId) });
    },
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.tags() });
    },
  });
}

export function useInterviewCollections() {
  return useQuery({
    queryKey: interviewKeys.collections(),
    queryFn: async (): Promise<InterviewCollection[]> => {
      const res = await mockApi<{ data: InterviewCollection[] }>([]);
      return res.data;
    },
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; sessionIds?: string[] }) => {
      const res = await mockApi<{ data: InterviewCollection }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          name: "",
          description: "",
          session_count: 0,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewCollection,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.collections() });
    },
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: Partial<InterviewCollection> }) => {
      const res = await mockApi<{ data: InterviewCollection }>({} as InterviewCollection);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.collections() });
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.collections() });
    },
  });
}

// --- Settings ---

export function useInterviewSettings() {
  return useQuery({
    queryKey: interviewKeys.settings(),
    queryFn: async (): Promise<InterviewSettings> => {
      const res = await mockApi<{ data: InterviewSettings }>({
        data: {
          default_session_type: "mixed",
          default_difficulty: "medium",
          default_mode: "untimed",
          default_duration_minutes: 30,
          default_questions_per_session: 10,
          auto_evaluate: true,
          auto_generate_follow_ups: true,
          show_timer: true,
          show_confidence: true,
          preferred_ai_provider: "openai",
          preferred_ai_model: "gpt-4",
          default_temperature: 0.7,
          default_max_tokens: 4096,
          notifications_enabled: true,
        },
      });
      return res.data;
    },
  });
}

export function useUpdateInterviewSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: Partial<InterviewSettings>) => {
      const res = await mockApi<{ data: InterviewSettings }>({} as InterviewSettings);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.settings() });
    },
  });
}

// --- Other Resource Hooks ---

export function useInterviewPracticePlans(id: string) {
  return useQuery({
    queryKey: interviewKeys.practicePlans(id),
    queryFn: async (): Promise<InterviewPracticePlan[]> => {
      const res = await mockApi<{ data: InterviewPracticePlan[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreatePracticePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewPracticePlan>) => {
      const res = await mockApi<{ data: InterviewPracticePlan }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          session_id: "",
          title: "",
          description: "",
          tasks: [],
          status: "pending",
          due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewPracticePlan,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.session_id) {
        qc.invalidateQueries({ queryKey: interviewKeys.practicePlans(variables.session_id) });
      }
    },
  });
}

export function useInterviewChecklists(id: string) {
  return useQuery({
    queryKey: interviewKeys.checklists(id),
    queryFn: async (): Promise<InterviewChecklist[]> => {
      const res = await mockApi<{ data: InterviewChecklist[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewChecklist>) => {
      const res = await mockApi<{ data: InterviewChecklist }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          session_id: "",
          title: "",
          items: [],
          completed_count: 0,
          total_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewChecklist,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.session_id) {
        qc.invalidateQueries({ queryKey: interviewKeys.checklists(variables.session_id) });
      }
    },
  });
}

export function useInterviewSimulations(id: string) {
  return useQuery({
    queryKey: interviewKeys.simulations(id),
    queryFn: async (): Promise<InterviewSimulation[]> => {
      const res = await mockApi<{ data: InterviewSimulation[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateSimulation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewSimulation>) => {
      const res = await mockApi<{ data: InterviewSimulation }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          session_id: "",
          scenario: "",
          role: "",
          company_name: "",
          difficulty: "medium",
          status: "pending",
          steps: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewSimulation,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.session_id) {
        qc.invalidateQueries({ queryKey: interviewKeys.simulations(variables.session_id) });
      }
    },
  });
}

export function useInterviewArtifacts(id: string) {
  return useQuery({
    queryKey: interviewKeys.artifacts(id),
    queryFn: async (): Promise<InterviewArtifact[]> => {
      const res = await mockApi<{ data: InterviewArtifact[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateArtifact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewArtifact>) => {
      const res = await mockApi<{ data: InterviewArtifact }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          session_id: "",
          name: "",
          type: "notes",
          content: "",
          file_url: null,
          file_size: null,
          mime_type: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewArtifact,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.session_id) {
        qc.invalidateQueries({ queryKey: interviewKeys.artifacts(variables.session_id) });
      }
    },
  });
}

export function useCompanyPrep(id: string) {
  return useQuery({
    queryKey: interviewKeys.companyPrep(id),
    queryFn: async (): Promise<InterviewCompanyPreparation> => {
      const res = await mockApi<{ data: InterviewCompanyPreparation }>({} as InterviewCompanyPreparation);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateCompanyPrep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewCompanyPreparation>) => {
      const res = await mockApi<{ data: InterviewCompanyPreparation }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          company_name: "",
          industry: "",
          size: "",
          culture: "",
          values: [],
          recent_news: [],
          interview_process: "",
          common_questions: [],
          tips: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewCompanyPreparation,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useJobPrep(id: string) {
  return useQuery({
    queryKey: interviewKeys.jobPrep(id),
    queryFn: async (): Promise<InterviewJobPreparation> => {
      const res = await mockApi<{ data: InterviewJobPreparation }>({} as InterviewJobPreparation);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateJobPrep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewJobPreparation>) => {
      const res = await mockApi<{ data: InterviewJobPreparation }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          job_id: "",
          job_title: "",
          company_name: "",
          required_skills: [],
          preferred_skills: [],
          key_responsibilities: [],
          preparation_areas: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewJobPreparation,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.lists() });
    },
  });
}

export function useInterviewRecommendations() {
  return useQuery({
    queryKey: interviewKeys.recommendations(),
    queryFn: async (): Promise<InterviewRecommendation[]> => {
      const res = await mockApi<{ data: InterviewRecommendation[] }>([]);
      return res.data;
    },
  });
}

export function useInterviewGoals() {
  return useQuery({
    queryKey: interviewKeys.goals(),
    queryFn: async (): Promise<InterviewGoal[]> => {
      const res = await mockApi<{ data: InterviewGoal[] }>([]);
      return res.data;
    },
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewGoal>) => {
      const res = await mockApi<{ data: InterviewGoal }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          title: "",
          description: "",
          target_date: null,
          status: "in_progress",
          progress: 0,
          milestones: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewGoal,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.goals() });
    },
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: Partial<InterviewGoal> }) => {
      const res = await mockApi<{ data: InterviewGoal }>({} as InterviewGoal);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: interviewKeys.goals() });
    },
  });
}

export function useMilestones(goalId: string) {
  return useQuery({
    queryKey: interviewKeys.milestones(goalId),
    queryFn: async (): Promise<InterviewMilestone[]> => {
      const res = await mockApi<{ data: InterviewMilestone[] }>([]);
      return res.data;
    },
    enabled: !!goalId,
  });
}

export function useCreateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InterviewMilestone>) => {
      const res = await mockApi<{ data: InterviewMilestone }>({
        data: {
          id: crypto.randomUUID(),
          goal_id: "",
          title: "",
          description: "",
          status: "pending",
          due_date: null,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as InterviewMilestone,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.goal_id) {
        qc.invalidateQueries({ queryKey: interviewKeys.milestones(variables.goal_id) });
      }
      qc.invalidateQueries({ queryKey: interviewKeys.goals() });
    },
  });
}
