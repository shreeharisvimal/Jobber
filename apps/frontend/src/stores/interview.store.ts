import { create } from "zustand";

interface InterviewState {
  filters: {
    search: string;
    status: string;
    sessionType: string;
    difficulty: string;
    mode: string;
    minScore: number;
    maxScore: number;
    dateFrom: string;
    dateTo: string;
    tags: string[];
    sortBy: string;
    sortOrder: string;
    page: number;
    perPage: number;
  };
  setFilters: (filters: Partial<InterviewState["filters"]>) => void;
  resetFilters: () => void;

  selectedSessionIds: string[];
  toggleSessionSelection: (id: string) => void;
  clearSelection: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  activeQuestionIndex: number;
  setActiveQuestionIndex: (index: number) => void;

  isTimerRunning: boolean;
  setTimerRunning: (running: boolean) => void;
  timeElapsed: number;
  setTimeElapsed: (seconds: number) => void;

  generateDialogOpen: boolean;
  setGenerateDialogOpen: (open: boolean) => void;

  settings: {
    defaultSessionType: string;
    defaultDifficulty: string;
    defaultMode: string;
    defaultDurationMinutes: number;
    defaultQuestionsPerSession: number;
    autoEvaluate: boolean;
    autoGenerateFollowUps: boolean;
    showTimer: boolean;
    showConfidence: boolean;
    preferredAiProvider: string;
    preferredAiModel: string;
    defaultTemperature: number;
    defaultMaxTokens: number;
    notificationsEnabled: boolean;
  };
  updateSettings: (settings: Partial<InterviewState["settings"]>) => void;

  simulationMode: boolean;
  setSimulationMode: (mode: boolean) => void;
  simulationStep: number;
  setSimulationStep: (step: number) => void;
}

const defaultFilters = {
  search: "",
  status: "",
  sessionType: "",
  difficulty: "",
  mode: "",
  minScore: 0,
  maxScore: 10,
  dateFrom: "",
  dateTo: "",
  tags: [],
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  perPage: 20,
};

const defaultSettings = {
  defaultSessionType: "mixed",
  defaultDifficulty: "medium",
  defaultMode: "untimed",
  defaultDurationMinutes: 30,
  defaultQuestionsPerSession: 10,
  autoEvaluate: true,
  autoGenerateFollowUps: true,
  showTimer: true,
  showConfidence: true,
  preferredAiProvider: "openai",
  preferredAiModel: "gpt-4",
  defaultTemperature: 0.7,
  defaultMaxTokens: 4096,
  notificationsEnabled: true,
};

export const useInterviewStore = create<InterviewState>((set) => ({
  filters: { ...defaultFilters },
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectedSessionIds: [],
  toggleSessionSelection: (id) =>
    set((state) => ({
      selectedSessionIds: state.selectedSessionIds.includes(id)
        ? state.selectedSessionIds.filter((i) => i !== id)
        : [...state.selectedSessionIds, id],
    })),
  clearSelection: () => set({ selectedSessionIds: [] }),

  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeQuestionIndex: 0,
  setActiveQuestionIndex: (index) => set({ activeQuestionIndex: index }),

  isTimerRunning: false,
  setTimerRunning: (running) => set({ isTimerRunning: running }),
  timeElapsed: 0,
  setTimeElapsed: (seconds) => set({ timeElapsed: seconds }),

  generateDialogOpen: false,
  setGenerateDialogOpen: (open) => set({ generateDialogOpen: open }),

  settings: { ...defaultSettings },
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  simulationMode: false,
  setSimulationMode: (mode) => set({ simulationMode: mode }),
  simulationStep: 0,
  setSimulationStep: (step) => set({ simulationStep: step }),
}));
