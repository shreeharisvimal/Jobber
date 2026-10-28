import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCoverLetterStore } from "@/stores/cover-letter.store";
import type {
  CoverLetter,
  CoverLetterVersion,
  CoverLetterSuggestion,
  CoverLetterRewrite,
  CoverLetterOptimization,
  CoverLetterApproval,
  CoverLetterShare,
  CoverLetterComment,
  CoverLetterTemplate,
  CoverLetterCollection,
  CoverLetterCollectionDetail,
  CoverLetterCollectionCreate,
  CoverLetterCollectionUpdate,
  CoverLetterHistory,
  CoverLetterReport,
  CoverLetterAnalytics,
  CoverLetterStats,
  CoverLetterSettings,
  CoverLetterSettingsUpdate,
  CoverLetterGenerateRequest,
  CoverLetterGenerateResponse,
  CoverLetterCreate,
  CoverLetterUpdate,
  CoverLetterTemplateCreate,
  CoverLetterTemplateUpdate,
  CoverLetterShareCreate,
  CoverLetterCommentCreate,
  PaginatedResponse,
} from "@/types/cover-letter";

export const coverLetterKeys = {
  all: ["cover-letter"] as const,
  letters: () => [...coverLetterKeys.all, "letters"] as const,
  letter: (id: string) => [...coverLetterKeys.letters(), id] as const,
  letterDetail: (id: string) => [...coverLetterKeys.letter(id), "detail"] as const,
  versions: (id: string) => [...coverLetterKeys.letter(id), "versions"] as const,
  suggestions: (id: string) => [...coverLetterKeys.letter(id), "suggestions"] as const,
  rewrites: (id: string) => [...coverLetterKeys.letter(id), "rewrites"] as const,
  optimizations: (id: string) => [...coverLetterKeys.letter(id), "optimizations"] as const,
  approvals: (id: string) => [...coverLetterKeys.letter(id), "approvals"] as const,
  shares: (id: string) => [...coverLetterKeys.letter(id), "shares"] as const,
  comments: (id: string) => [...coverLetterKeys.letter(id), "comments"] as const,
  history: (id: string) => [...coverLetterKeys.letter(id), "history"] as const,
  reports: (id: string) => [...coverLetterKeys.letter(id), "reports"] as const,
  analytics: (id: string) => [...coverLetterKeys.letter(id), "analytics"] as const,
  search: (params: Record<string, unknown>) => [...coverLetterKeys.letters(), "search", params] as const,
  stats: () => [...coverLetterKeys.all, "stats"] as const,
  templates: () => [...coverLetterKeys.all, "templates"] as const,
  template: (id: string) => [...coverLetterKeys.templates(), id] as const,
  collections: () => [...coverLetterKeys.all, "collections"] as const,
  collection: (id: string) => [...coverLetterKeys.collections(), id] as const,
  settings: () => [...coverLetterKeys.all, "settings"] as const,
};

function mockApi<T>(data: T, delay = 500): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}

// --- Cover Letters ---

export function useCoverLetters() {
  const filters = useCoverLetterStore((s) => s.filters);
  return useQuery({
    queryKey: coverLetterKeys.search(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<PaginatedResponse<CoverLetter>> => {
      const res = await mockApi<{ data: PaginatedResponse<CoverLetter> }>({
        data: { data: [], total: 0, page: filters.page, per_page: filters.per_page, total_pages: 0 },
      });
      return res.data;
    },
  });
}

export function useCoverLetterDetail(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.letterDetail(id),
    queryFn: async (): Promise<CoverLetter> => {
      const res = await mockApi<{ data: CoverLetter }>({} as CoverLetter);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CoverLetterCreate) => {
      const res = await mockApi<{ data: CoverLetter }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          content: "",
          status: "draft",
          overall_score: null,
          ats_score: null,
          tone_score: null,
          clarity_score: null,
          impact_score: null,
          relevance_score: null,
          version: 1,
          is_bookmarked: false,
          is_current: true,
          template_name: null,
          tags: data.tags ?? [],
          metadata: null,
          word_count: 0,
          char_count: 0,
          view_count: 0,
          share_count: 0,
          export_count: 0,
          rating: null,
          approval_status: "none",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as CoverLetter,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}

export function useUpdateCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: CoverLetterUpdate }) => {
      const res = await mockApi<{ data: CoverLetter }>({} as CoverLetter);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}

export function useDeleteCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}

// --- Generate ---

export function useGenerateCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: CoverLetterGenerateRequest) => {
      const res = await mockApi<{ data: CoverLetterGenerateResponse }>({
        data: {
          content: "Generated cover letter content would appear here.",
          title: `Application to ${request.company_name}`,
          score: 78,
          suggestions: [],
        },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}

// --- Versions ---

export function useCoverLetterVersions(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.versions(id),
    queryFn: async (): Promise<CoverLetterVersion[]> => {
      const res = await mockApi<{ data: CoverLetterVersion[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useSaveAsVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, change_summary: _change_summary }: { id: string; change_summary?: string }) => {
      const res = await mockApi<{ data: CoverLetterVersion }>({} as CoverLetterVersion);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.versions(variables.id) });
    },
  });
}

export function useSetCurrentVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId, versionId }: { letterId: string; versionId: string }) => {
      await mockApi({ success: true }, 200);
      return { letterId, versionId };
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.versions(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

// --- Suggestions ---

export function useCoverLetterSuggestions(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.suggestions(id),
    queryFn: async (): Promise<CoverLetterSuggestion[]> => {
      const res = await mockApi<{ data: CoverLetterSuggestion[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useApplySuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, suggestionId: _suggestionId }: { letterId: string; suggestionId: string }) => {
      const res = await mockApi<{ data: CoverLetterSuggestion }>({} as CoverLetterSuggestion);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.suggestions(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

export function useDismissSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, suggestionId: _suggestionId }: { letterId: string; suggestionId: string }) => {
      const res = await mockApi<{ data: CoverLetterSuggestion }>({} as CoverLetterSuggestion);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.suggestions(variables.letterId) });
    },
  });
}

// --- Rewrites ---

export function useCoverLetterRewrites(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.rewrites(id),
    queryFn: async (): Promise<CoverLetterRewrite[]> => {
      const res = await mockApi<{ data: CoverLetterRewrite[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useApplyRewrite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, rewriteId: _rewriteId }: { letterId: string; rewriteId: string }) => {
      const res = await mockApi<{ data: CoverLetterRewrite }>({} as CoverLetterRewrite);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.rewrites(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

export function useUndoRewrite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, rewriteId: _rewriteId }: { letterId: string; rewriteId: string }) => {
      const res = await mockApi<{ data: CoverLetterRewrite }>({} as CoverLetterRewrite);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.rewrites(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

// --- Optimizations ---

export function useCoverLetterOptimizations(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.optimizations(id),
    queryFn: async (): Promise<CoverLetterOptimization[]> => {
      const res = await mockApi<{ data: CoverLetterOptimization[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useApplyOptimization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, optimizationId: _optimizationId }: { letterId: string; optimizationId: string }) => {
      const res = await mockApi<{ data: CoverLetterOptimization }>({} as CoverLetterOptimization);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.optimizations(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

// --- Approvals ---

export function useCoverLetterApprovals(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.approvals(id),
    queryFn: async (): Promise<CoverLetterApproval[]> => {
      const res = await mockApi<{ data: CoverLetterApproval[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useSubmitForApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, reviewer: _reviewer }: { letterId: string; reviewer?: string }) => {
      const res = await mockApi<{ data: CoverLetterApproval }>({} as CoverLetterApproval);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.approvals(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

export function useApproveLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, approvalId: _approvalId, notes: _notes }: { letterId: string; approvalId: string; notes?: string }) => {
      const res = await mockApi<{ data: CoverLetterApproval }>({} as CoverLetterApproval);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.approvals(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

export function useRejectLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, approvalId: _approvalId, notes: _notes }: { letterId: string; approvalId: string; notes?: string }) => {
      const res = await mockApi<{ data: CoverLetterApproval }>({} as CoverLetterApproval);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.approvals(variables.letterId) });
      qc.invalidateQueries({ queryKey: coverLetterKeys.letterDetail(variables.letterId) });
    },
  });
}

// --- Shares ---

export function useCoverLetterShares(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.shares(id),
    queryFn: async (): Promise<CoverLetterShare[]> => {
      const res = await mockApi<{ data: CoverLetterShare[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId, data }: { letterId: string; data: CoverLetterShareCreate }) => {
      const res = await mockApi<{ data: CoverLetterShare }>({
        data: {
          id: crypto.randomUUID(),
          cover_letter_id: letterId,
          share_token: crypto.randomUUID().slice(0, 8),
          share_url: `https://example.com/shared/${crypto.randomUUID().slice(0, 8)}`,
          access_count: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          ...data,
        } as CoverLetterShare,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.shares(variables.letterId) });
    },
  });
}

export function useRevokeShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId, shareId }: { letterId: string; shareId: string }) => {
      await mockApi({ success: true }, 200);
      return { letterId, shareId };
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.shares(variables.letterId) });
    },
  });
}

// --- Comments ---

export function useCoverLetterComments(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.comments(id),
    queryFn: async (): Promise<CoverLetterComment[]> => {
      const res = await mockApi<{ data: CoverLetterComment[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId, data }: { letterId: string; data: CoverLetterCommentCreate }) => {
      const res = await mockApi<{ data: CoverLetterComment }>({
        data: {
          id: crypto.randomUUID(),
          cover_letter_id: letterId,
          user_id: "current",
          user_name: "Current User",
          position_start: null,
          position_end: null,
          selected_text: null,
          parent_id: null,
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as CoverLetterComment,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.comments(variables.letterId) });
    },
  });
}

export function useResolveComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ letterId: _letterId, commentId: _commentId }: { letterId: string; commentId: string }) => {
      const res = await mockApi<{ data: CoverLetterComment }>({} as CoverLetterComment);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.comments(variables.letterId) });
    },
  });
}

// --- History ---

export function useCoverLetterHistory(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.history(id),
    queryFn: async (): Promise<CoverLetterHistory[]> => {
      const res = await mockApi<{ data: CoverLetterHistory[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

// --- Reports ---

export function useCoverLetterReports(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.reports(id),
    queryFn: async (): Promise<CoverLetterReport[]> => {
      const res = await mockApi<{ data: CoverLetterReport[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

// --- Analytics ---

export function useCoverLetterAnalytics(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.analytics(id),
    queryFn: async (): Promise<CoverLetterAnalytics> => {
      const res = await mockApi<{ data: CoverLetterAnalytics }>({
        data: {
          view_count: 0,
          share_count: 0,
          export_count: 0,
          average_rating: null,
          rating_count: 0,
          comment_count: 0,
          top_tones: [],
          score_trend: [],
        },
      });
      return res.data;
    },
    enabled: !!id,
  });
}

// --- Stats ---

export function useCoverLetterStats() {
  return useQuery({
    queryKey: coverLetterKeys.stats(),
    queryFn: async (): Promise<CoverLetterStats> => {
      const res = await mockApi<{ data: CoverLetterStats }>({
        data: {
          total_letters: 0,
          generated_count: 0,
          approved_count: 0,
          average_score: null,
          total_templates: 0,
          total_collections: 0,
          recent_activity: [],
          tone_distribution: {} as Record<string, number>,
          status_distribution: {} as Record<string, number>,
        },
      });
      return res.data;
    },
  });
}

// --- Templates ---

export function useCoverLetterTemplates() {
  return useQuery({
    queryKey: coverLetterKeys.templates(),
    queryFn: async (): Promise<CoverLetterTemplate[]> => {
      const res = await mockApi<{ data: CoverLetterTemplate[] }>([]);
      return res.data;
    },
  });
}

export function useCoverLetterTemplate(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.template(id),
    queryFn: async (): Promise<CoverLetterTemplate> => {
      const res = await mockApi<{ data: CoverLetterTemplate }>({} as CoverLetterTemplate);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CoverLetterTemplateCreate) => {
      const res = await mockApi<{ data: CoverLetterTemplate }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          placeholders: [],
          tags: [],
          is_public: false,
          usage_count: 0,
          rating: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as CoverLetterTemplate,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.templates() });
    },
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: CoverLetterTemplateUpdate }) => {
      const res = await mockApi<{ data: CoverLetterTemplate }>({} as CoverLetterTemplate);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.templates() });
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
      qc.invalidateQueries({ queryKey: coverLetterKeys.templates() });
    },
  });
}

// --- Collections ---

export function useCoverLetterCollections() {
  return useQuery({
    queryKey: coverLetterKeys.collections(),
    queryFn: async (): Promise<CoverLetterCollection[]> => {
      const res = await mockApi<{ data: CoverLetterCollection[] }>([]);
      return res.data;
    },
  });
}

export function useCoverLetterCollectionDetail(id: string) {
  return useQuery({
    queryKey: coverLetterKeys.collection(id),
    queryFn: async (): Promise<CoverLetterCollectionDetail> => {
      const res = await mockApi<{ data: CoverLetterCollectionDetail }>(
        {} as CoverLetterCollectionDetail,
      );
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateCoverLetterCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CoverLetterCollectionCreate) => {
      const res = await mockApi<{ data: CoverLetterCollection }>({
        data: {
          id: crypto.randomUUID(),
          user_id: "current",
          letter_count: 0,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        } as CoverLetterCollection,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.collections() });
    },
  });
}

export function useUpdateCoverLetterCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data: _data }: { id: string; data: CoverLetterCollectionUpdate }) => {
      const res = await mockApi<{ data: CoverLetterCollection }>({} as CoverLetterCollection);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.collections() });
    },
  });
}

export function useDeleteCoverLetterCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.collections() });
    },
  });
}

export function useAddToCoverLetterCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, coverLetterId }: { collectionId: string; coverLetterId: string }) => {
      await mockApi({ success: true }, 200);
      return { collectionId, coverLetterId };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.collections() });
    },
  });
}

export function useRemoveFromCoverLetterCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, coverLetterId }: { collectionId: string; coverLetterId: string }) => {
      await mockApi({ success: true }, 200);
      return { collectionId, coverLetterId };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.collections() });
    },
  });
}

// --- Settings ---

export function useCoverLetterSettings() {
  return useQuery({
    queryKey: coverLetterKeys.settings(),
    queryFn: async (): Promise<CoverLetterSettings> => {
      const res = await mockApi<{ data: CoverLetterSettings }>({
        data: {
          default_tone: "professional",
          default_style: "standard",
          default_temperature: 0.7,
          max_tokens: 2000,
          auto_generate: false,
          auto_optimize: false,
          signature_name: "",
          signature_title: "",
          signature_email: "",
          signature_phone: "",
          signature_linkedin: "",
          ai_provider: "openai",
          ai_model: "gpt-4",
        },
      });
      return res.data;
    },
  });
}

export function useUpdateCoverLetterSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: CoverLetterSettingsUpdate) => {
      const res = await mockApi<{ data: CoverLetterSettings }>({} as CoverLetterSettings);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.settings() });
    },
  });
}

// --- Bookmarks ---

export function useBookmarkCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (letterId: string) => {
      await mockApi({ success: true }, 200);
      return letterId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}

export function useUnbookmarkCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (letterId: string) => {
      await mockApi({ success: true }, 200);
      return letterId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}

// --- Compare Versions ---

export function useCompareVersions() {
  return useQuery({
    queryKey: coverLetterKeys.all,
    queryFn: async () => {
      return null;
    },
    enabled: false,
  });
}
