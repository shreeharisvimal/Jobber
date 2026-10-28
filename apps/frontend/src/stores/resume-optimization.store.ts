import { create } from "zustand";
import type {
  ResumeOptimizationSession,
  ResumeSuggestion,
  ResumeOptimizationResult,
  ResumeOptimizationRule,
  ResumeOptimizationHistory,
  ResumeOptimizationApproval,
  ResumeOptimizationFeedback,
  ResumeOptimizationArtifact,
  ResumeOptimizationComparison,
  SuggestionStatus,
  SuggestionType,
  SessionStatus,
  Severity,
} from "@/types/resume-optimization";

interface FiltersState {
  status: SuggestionStatus | null;
  type: SuggestionType | null;
  severity: Severity | null;
  sessionStatus: SessionStatus | null;
  search: string;
}

interface ResumeOptimizationState {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;

  sessions: ResumeOptimizationSession[];
  setSessions: (sessions: ResumeOptimizationSession[]) => void;
  addSession: (session: ResumeOptimizationSession) => void;
  updateSession: (id: string, data: Partial<ResumeOptimizationSession>) => void;

  activeSession: ResumeOptimizationSession | null;
  setActiveSession: (session: ResumeOptimizationSession | null) => void;

  suggestions: ResumeSuggestion[];
  setSuggestions: (suggestions: ResumeSuggestion[]) => void;
  addSuggestion: (suggestion: ResumeSuggestion) => void;
  updateSuggestion: (id: string, data: Partial<ResumeSuggestion>) => void;
  removeSuggestion: (id: string) => void;

  activeSuggestion: ResumeSuggestion | null;
  setActiveSuggestion: (suggestion: ResumeSuggestion | null) => void;

  results: ResumeOptimizationResult[];
  setResults: (results: ResumeOptimizationResult[]) => void;

  rules: ResumeOptimizationRule[];
  setRules: (rules: ResumeOptimizationRule[]) => void;

  history: ResumeOptimizationHistory[];
  setHistory: (history: ResumeOptimizationHistory[]) => void;

  feedback: ResumeOptimizationFeedback[];
  setFeedback: (feedback: ResumeOptimizationFeedback[]) => void;

  approvals: ResumeOptimizationApproval[];
  setApprovals: (approvals: ResumeOptimizationApproval[]) => void;

  artifacts: ResumeOptimizationArtifact[];
  setArtifacts: (artifacts: ResumeOptimizationArtifact[]) => void;

  comparisons: ResumeOptimizationComparison[];
  setComparisons: (comparisons: ResumeOptimizationComparison[]) => void;

  isOptimizing: boolean;
  setIsOptimizing: (optimizing: boolean) => void;

  filters: FiltersState;
  setFilters: (filters: Partial<FiltersState>) => void;
  resetFilters: () => void;

  selectedSuggestionIds: string[];
  toggleSuggestionSelection: (id: string) => void;
  selectAllSuggestions: () => void;
  clearSelection: () => void;

  reset: () => void;
}

const initialFilters: FiltersState = {
  status: null,
  type: null,
  severity: null,
  sessionStatus: null,
  search: "",
};

const initialState = {
  activeSessionId: null,
  sessions: [],
  activeSession: null,
  suggestions: [],
  activeSuggestion: null,
  results: [],
  rules: [],
  history: [],
  feedback: [],
  approvals: [],
  artifacts: [],
  comparisons: [],
  isOptimizing: false,
  filters: { ...initialFilters },
  selectedSuggestionIds: [],
};

export const useResumeOptimizationStore = create<ResumeOptimizationState>((set) => ({
  ...initialState,

  setActiveSessionId: (id) => set({ activeSessionId: id }),

  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
  updateSession: (id, data) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...data } : s)),
      activeSession: state.activeSession?.id === id ? { ...state.activeSession, ...data } : state.activeSession,
    })),

  setActiveSession: (session) => set({ activeSession: session }),

  setSuggestions: (suggestions) => set({ suggestions }),
  addSuggestion: (suggestion) => set((state) => ({ suggestions: [suggestion, ...state.suggestions] })),
  updateSuggestion: (id, data) =>
    set((state) => ({
      suggestions: state.suggestions.map((s) => (s.id === id ? { ...s, ...data } : s)),
      activeSuggestion: state.activeSuggestion?.id === id ? { ...state.activeSuggestion, ...data } : state.activeSuggestion,
    })),
  removeSuggestion: (id) =>
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
      selectedSuggestionIds: state.selectedSuggestionIds.filter((sid) => sid !== id),
    })),

  setActiveSuggestion: (suggestion) => set({ activeSuggestion: suggestion }),

  setResults: (results) => set({ results }),
  setRules: (rules) => set({ rules }),
  setHistory: (history) => set({ history }),
  setFeedback: (feedback) => set({ feedback }),
  setApprovals: (approvals) => set({ approvals }),
  setArtifacts: (artifacts) => set({ artifacts }),
  setComparisons: (comparisons) => set({ comparisons }),

  setIsOptimizing: (optimizing) => set({ isOptimizing: optimizing }),

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: { ...initialFilters } }),

  toggleSuggestionSelection: (id) =>
    set((state) => ({
      selectedSuggestionIds: state.selectedSuggestionIds.includes(id)
        ? state.selectedSuggestionIds.filter((sid) => sid !== id)
        : [...state.selectedSuggestionIds, id],
    })),
  selectAllSuggestions: () =>
    set((state) => ({
      selectedSuggestionIds: state.suggestions.map((s) => s.id),
    })),
  clearSelection: () => set({ selectedSuggestionIds: [] }),

  reset: () => set(initialState),
}));
