import { create } from "zustand";

interface CRMState {
  // Recruiter filters
  recruiterFilters: {
    search: string;
    status: string;
    priority: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    perPage: number;
  };
  setRecruiterFilters: (filters: Partial<CRMState["recruiterFilters"]>) => void;
  resetRecruiterFilters: () => void;

  // Application filters
  applicationFilters: {
    search: string;
    status: string;
    stage: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    perPage: number;
  };
  setApplicationFilters: (filters: Partial<CRMState["applicationFilters"]>) => void;
  resetApplicationFilters: () => void;

  // Selection
  selectedRecruiterIds: string[];
  toggleRecruiterSelection: (id: string) => void;
  clearRecruiterSelection: () => void;

  selectedApplicationIds: string[];
  toggleApplicationSelection: (id: string) => void;
  clearApplicationSelection: () => void;

  // Active tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Settings
  settings: {
    defaultPipelineStages: string[];
    autoFollowUpDays: number;
    reminderDaysBefore: number;
    emailNotifications: boolean;
    weeklyDigest: boolean;
    autoStageProgression: boolean;
    preferredAiProvider: string;
    preferredAiModel: string;
    defaultCurrency: string;
    calendarIntegration: string;
  };
  updateSettings: (settings: Partial<CRMState["settings"]>) => void;
}

const defaultRecruiterFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  perPage: 20,
};

const defaultApplicationFilters = {
  search: "",
  status: "",
  stage: "",
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  perPage: 20,
};

const defaultSettings = {
  defaultPipelineStages: ["Applied", "Screening", "Interview", "Offer", "Hired"],
  autoFollowUpDays: 7,
  reminderDaysBefore: 3,
  emailNotifications: true,
  weeklyDigest: true,
  autoStageProgression: false,
  preferredAiProvider: "openai",
  preferredAiModel: "gpt-4",
  defaultCurrency: "USD",
  calendarIntegration: "google",
};

export const useCRMStore = create<CRMState>((set) => ({
  recruiterFilters: { ...defaultRecruiterFilters },
  setRecruiterFilters: (filters) =>
    set((state) => ({
      recruiterFilters: { ...state.recruiterFilters, ...filters },
    })),
  resetRecruiterFilters: () => set({ recruiterFilters: { ...defaultRecruiterFilters } }),

  applicationFilters: { ...defaultApplicationFilters },
  setApplicationFilters: (filters) =>
    set((state) => ({
      applicationFilters: { ...state.applicationFilters, ...filters },
    })),
  resetApplicationFilters: () => set({ applicationFilters: { ...defaultApplicationFilters } }),

  selectedRecruiterIds: [],
  toggleRecruiterSelection: (id) =>
    set((state) => ({
      selectedRecruiterIds: state.selectedRecruiterIds.includes(id)
        ? state.selectedRecruiterIds.filter((i) => i !== id)
        : [...state.selectedRecruiterIds, id],
    })),
  clearRecruiterSelection: () => set({ selectedRecruiterIds: [] }),

  selectedApplicationIds: [],
  toggleApplicationSelection: (id) =>
    set((state) => ({
      selectedApplicationIds: state.selectedApplicationIds.includes(id)
        ? state.selectedApplicationIds.filter((i) => i !== id)
        : [...state.selectedApplicationIds, id],
    })),
  clearApplicationSelection: () => set({ selectedApplicationIds: [] }),

  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),

  settings: { ...defaultSettings },
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
}));
