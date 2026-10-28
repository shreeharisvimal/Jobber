import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeOptimizationApi } from "@/lib/api-client";
import { useResumeOptimizationStore } from "@/stores/resume-optimization.store";
import { toast } from "@/stores/toast.store";
import type {
  ResumeOptimizationSession,
  ResumeOptimizationSessionCreate,
  ResumeSuggestion,
  ResumeSuggestionCreate,
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
  ResumeOptimizationResult,
} from "@/types/resume-optimization";

export const resumeOptimizationKeys = {
  all: ["resume-optimization"] as const,
  sessions: () => [...resumeOptimizationKeys.all, "sessions"] as const,
  session: (id: string) => [...resumeOptimizationKeys.sessions(), id] as const,
  sessionResults: (id: string) => [...resumeOptimizationKeys.session(id), "results"] as const,
  sessionHistory: (id: string) => [...resumeOptimizationKeys.session(id), "history"] as const,
  sessionApprovals: (id: string) => [...resumeOptimizationKeys.session(id), "approvals"] as const,
  sessionArtifacts: (id: string) => [...resumeOptimizationKeys.session(id), "artifacts"] as const,
  sessionComparisons: (id: string) => [...resumeOptimizationKeys.session(id), "comparisons"] as const,
  suggestions: (sessionId: string) => [...resumeOptimizationKeys.sessions(), sessionId, "suggestions"] as const,
  suggestion: (id: string) => [...resumeOptimizationKeys.all, "suggestions", id] as const,
  suggestionFeedback: (id: string) => [...resumeOptimizationKeys.suggestion(id), "feedback"] as const,
  suggestionHistory: (id: string) => [...resumeOptimizationKeys.suggestion(id), "history"] as const,
  rules: () => [...resumeOptimizationKeys.all, "rules"] as const,
  rule: (id: string) => [...resumeOptimizationKeys.rules(), id] as const,
  stats: () => [...resumeOptimizationKeys.all, "stats"] as const,
};

// === Sessions ===
export function useResumeOptimizationSessions(resumeId?: string) {
  return useQuery({
    queryKey: resumeOptimizationKeys.sessions(),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getSessions(resumeId);
      return data?.data as ResumeOptimizationSession[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useResumeOptimizationSession(id: string) {
  const setActiveSession = useResumeOptimizationStore((s) => s.setActiveSession);

  return useQuery<ResumeOptimizationSession>({
    queryKey: resumeOptimizationKeys.session(id),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getSession(id);
      const session = data?.data as ResumeOptimizationSession;
      if (session) setActiveSession(session);
      return session;
    },
    enabled: !!id,
  });
}

export function useCreateResumeOptimizationSession() {
  const queryClient = useQueryClient();
  const addSession = useResumeOptimizationStore((s) => s.addSession);

  return useMutation({
    mutationFn: async (data: ResumeOptimizationSessionCreate) => {
      const { data: res } = await resumeOptimizationApi.createSession(data);
      return res.data as ResumeOptimizationSession;
    },
    onSuccess: (session) => {
      addSession(session);
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.sessions() });
      toast.success("Optimization session created");
    },
  });
}

export function useUpdateResumeOptimizationSession(id: string) {
  const queryClient = useQueryClient();
  const updateSession = useResumeOptimizationStore((s) => s.updateSession);

  return useMutation({
    mutationFn: async (data: Partial<ResumeOptimizationSession>) => {
      const { data: res } = await resumeOptimizationApi.updateSession(id, data);
      return res.data as ResumeOptimizationSession;
    },
    onSuccess: (session) => {
      updateSession(id, session);
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.session(id) });
      toast.success("Session updated");
    },
  });
}

export function useDeleteResumeOptimizationSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await resumeOptimizationApi.deleteSession(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.sessions() });
      toast.success("Session deleted");
    },
  });
}

export function useStartResumeOptimizationSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await resumeOptimizationApi.startSession(id);
      return data?.data as ResumeOptimizationSession;
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.session(session.id) });
      toast.success("Session started");
    },
  });
}

export function useCompleteResumeOptimizationSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await resumeOptimizationApi.completeSession(id);
      return data?.data as ResumeOptimizationSession;
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.session(session.id) });
      toast.success("Session completed");
    },
  });
}

// === Results ===
export function useResumeOptimizationResults(sessionId: string) {
  const setResults = useResumeOptimizationStore((s) => s.setResults);

  return useQuery<ResumeOptimizationResult[]>({
    queryKey: resumeOptimizationKeys.sessionResults(sessionId),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getResults(sessionId);
      const results = data?.data as ResumeOptimizationResult[];
      if (results) setResults(results);
      return results;
    },
    enabled: !!sessionId,
  });
}

// === Suggestions ===
export function useResumeSuggestions(sessionId: string) {
  const setSuggestions = useResumeOptimizationStore((s) => s.setSuggestions);

  return useQuery({
    queryKey: resumeOptimizationKeys.suggestions(sessionId),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getSuggestions(sessionId);
      const suggestions = data?.data as ResumeSuggestion[];
      if (suggestions) setSuggestions(suggestions);
      return suggestions;
    },
    enabled: !!sessionId,
    staleTime: 30 * 1000,
  });
}

export function useResumeSuggestion(id: string) {
  const setActiveSuggestion = useResumeOptimizationStore((s) => s.setActiveSuggestion);

  return useQuery<ResumeSuggestion>({
    queryKey: resumeOptimizationKeys.suggestion(id),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getSuggestion(id);
      const suggestion = data?.data as ResumeSuggestion;
      if (suggestion) setActiveSuggestion(suggestion);
      return suggestion;
    },
    enabled: !!id,
  });
}

export function useCreateResumeSuggestion(sessionId: string) {
  const queryClient = useQueryClient();
  const addSuggestion = useResumeOptimizationStore((s) => s.addSuggestion);

  return useMutation({
    mutationFn: async (data: ResumeSuggestionCreate) => {
      const { data: res } = await resumeOptimizationApi.createSuggestion(sessionId, data);
      return res.data as ResumeSuggestion;
    },
    onSuccess: (suggestion) => {
      addSuggestion(suggestion);
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.suggestions(sessionId) });
    },
  });
}

export function useAcceptResumeSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await resumeOptimizationApi.acceptSuggestion(id);
      return data?.data as ResumeSuggestion;
    },
    onSuccess: (suggestion) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.suggestions(suggestion.session_id) });
      toast.success("Suggestion accepted");
    },
  });
}

export function useRejectResumeSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await resumeOptimizationApi.rejectSuggestion(id);
      return data?.data as ResumeSuggestion;
    },
    onSuccess: (suggestion) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.suggestions(suggestion.session_id) });
      toast.success("Suggestion rejected");
    },
  });
}

export function useApplyResumeSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await resumeOptimizationApi.applySuggestion(id);
      return data?.data as ResumeSuggestion;
    },
    onSuccess: (suggestion) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.suggestions(suggestion.session_id) });
      toast.success("Suggestion applied");
    },
  });
}

export function useRollbackResumeSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await resumeOptimizationApi.rollbackSuggestion(id);
      return data?.data as ResumeSuggestion;
    },
    onSuccess: (suggestion) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.suggestions(suggestion.session_id) });
      toast.success("Suggestion rolled back");
    },
  });
}

// === Rules ===
export function useResumeOptimizationRules() {
  const setRules = useResumeOptimizationStore((s) => s.setRules);

  return useQuery({
    queryKey: resumeOptimizationKeys.rules(),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getRules();
      const rules = data?.data as ResumeOptimizationRule[];
      if (rules) setRules(rules);
      return rules;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateResumeOptimizationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResumeOptimizationRuleCreate) => {
      const { data: res } = await resumeOptimizationApi.createRule(data);
      return res.data as ResumeOptimizationRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.rules() });
      toast.success("Rule created");
    },
  });
}

export function useUpdateResumeOptimizationRule(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResumeOptimizationRuleUpdate) => {
      const { data: res } = await resumeOptimizationApi.updateRule(id, data);
      return res.data as ResumeOptimizationRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.rule(id) });
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.rules() });
      toast.success("Rule updated");
    },
  });
}

export function useDeleteResumeOptimizationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await resumeOptimizationApi.deleteRule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.rules() });
      toast.success("Rule deleted");
    },
  });
}

// === Feedback ===
export function useCreateResumeOptimizationFeedback(suggestionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResumeOptimizationFeedbackCreate) => {
      const { data: res } = await resumeOptimizationApi.createFeedback(suggestionId, data);
      return res.data as ResumeOptimizationFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.suggestionFeedback(suggestionId) });
      toast.success("Feedback submitted");
    },
  });
}

// === Approvals ===
export function useCreateResumeOptimizationApproval(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ResumeOptimizationApproval>) => {
      const { data: res } = await resumeOptimizationApi.createApproval(sessionId, data);
      return res.data as ResumeOptimizationApproval;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.sessionApprovals(sessionId) });
      toast.success("Approval recorded");
    },
  });
}

// === History ===
export function useResumeOptimizationSessionHistory(sessionId: string) {
  const setHistory = useResumeOptimizationStore((s) => s.setHistory);

  return useQuery<ResumeOptimizationHistory[]>({
    queryKey: resumeOptimizationKeys.sessionHistory(sessionId),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getSessionHistory(sessionId);
      const history = data?.data as ResumeOptimizationHistory[];
      if (history) setHistory(history);
      return history;
    },
    enabled: !!sessionId,
  });
}

// === Artifacts ===
export function useResumeOptimizationArtifacts(sessionId: string) {
  const setArtifacts = useResumeOptimizationStore((s) => s.setArtifacts);

  return useQuery<ResumeOptimizationArtifact[]>({
    queryKey: resumeOptimizationKeys.sessionArtifacts(sessionId),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getArtifacts(sessionId);
      const artifacts = data?.data as ResumeOptimizationArtifact[];
      if (artifacts) setArtifacts(artifacts);
      return artifacts;
    },
    enabled: !!sessionId,
  });
}

// === Comparisons ===
export function useResumeOptimizationComparisons(sessionId: string) {
  const setComparisons = useResumeOptimizationStore((s) => s.setComparisons);

  return useQuery<ResumeOptimizationComparison[]>({
    queryKey: resumeOptimizationKeys.sessionComparisons(sessionId),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getComparisons(sessionId);
      const comparisons = data?.data as ResumeOptimizationComparison[];
      if (comparisons) setComparisons(comparisons);
      return comparisons;
    },
    enabled: !!sessionId,
  });
}

// === Bulk ===
export function useBulkResumeOptimizationAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResumeOptimizationBulkAction) => {
      const { data: res } = await resumeOptimizationApi.bulkSuggestions(data);
      return res.data as { count: number };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: resumeOptimizationKeys.all });
      toast.success(`${result.count} suggestions updated`);
    },
  });
}

// === Stats ===
export function useResumeOptimizationStats() {
  return useQuery({
    queryKey: resumeOptimizationKeys.stats(),
    queryFn: async () => {
      const { data } = await resumeOptimizationApi.getStats();
      return data?.data as ResumeOptimizationStats;
    },
    staleTime: 10 * 60 * 1000,
  });
}
