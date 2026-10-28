import { create } from "zustand";

interface AIPromptState {
  activePromptId: string | null;
  setActivePromptId: (id: string | null) => void;

  activeVersionId: string | null;
  setActiveVersionId: (id: string | null) => void;

  isPreviewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  togglePreviewMode: () => void;

  isTestMode: boolean;
  setTestMode: (mode: boolean) => void;

  testVariables: Record<string, unknown>;
  setTestVariable: (name: string, value: unknown) => void;
  clearTestVariables: () => void;

  renderedSystemPrompt: string;
  setRenderedSystemPrompt: (prompt: string) => void;

  renderedUserPrompt: string;
  setRenderedUserPrompt: (prompt: string) => void;

  testResult: string | null;
  setTestResult: (result: string | null) => void;

  isTestRunning: boolean;
  setIsTestRunning: (running: boolean) => void;

  isDiffView: boolean;
  setDiffView: (diff: boolean) => void;

  selectedComparisonVersionId: string | null;
  setSelectedComparisonVersionId: (id: string | null) => void;

  filterModule: string | null;
  setFilterModule: (module: string | null) => void;

  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  reset: () => void;
}

const initialState = {
  activePromptId: null,
  activeVersionId: null,
  isPreviewMode: false,
  isTestMode: false,
  testVariables: {} as Record<string, unknown>,
  renderedSystemPrompt: "",
  renderedUserPrompt: "",
  testResult: null,
  isTestRunning: false,
  isDiffView: false,
  selectedComparisonVersionId: null,
  filterModule: null,
  filterStatus: null,
  searchQuery: "",
};

export const useAIPromptStore = create<AIPromptState>((set) => ({
  ...initialState,

  setActivePromptId: (id) => set({ activePromptId: id }),

  setActiveVersionId: (id) => set({ activeVersionId: id }),

  setPreviewMode: (mode) => set({ isPreviewMode: mode }),
  togglePreviewMode: () =>
    set((state) => ({ isPreviewMode: !state.isPreviewMode })),

  setTestMode: (mode) => set({ isTestMode: mode }),

  setTestVariable: (name, value) =>
    set((state) => ({
      testVariables: { ...state.testVariables, [name]: value },
    })),
  clearTestVariables: () => set({ testVariables: {} }),

  setRenderedSystemPrompt: (prompt) => set({ renderedSystemPrompt: prompt }),

  setRenderedUserPrompt: (prompt) => set({ renderedUserPrompt: prompt }),

  setTestResult: (result) => set({ testResult: result }),

  setIsTestRunning: (running) => set({ isTestRunning: running }),

  setDiffView: (diff) => set({ isDiffView: diff }),

  setSelectedComparisonVersionId: (id) =>
    set({ selectedComparisonVersionId: id }),

  setFilterModule: (module) => set({ filterModule: module }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  reset: () => set(initialState),
}));
