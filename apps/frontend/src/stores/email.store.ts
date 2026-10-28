import { create } from "zustand";

const defaultMessageFilters = {
  search: "",
  status: "",
  direction: "",
  folder: "",
  isRead: null as boolean | null,
  sortBy: "created_at",
  sortOrder: "desc" as const,
  page: 1,
  perPage: 20,
};

const defaultTemplateFilters = {
  search: "",
  category: "",
  sortBy: "created_at",
  sortOrder: "desc" as const,
  page: 1,
  perPage: 20,
};

const defaultCampaignFilters = {
  search: "",
  status: "",
  sortBy: "created_at",
  sortOrder: "desc" as const,
  page: 1,
  perPage: 20,
};

const defaultSequenceFilters = {
  search: "",
  status: "",
  page: 1,
  perPage: 20,
};

const defaultThreadFilters = {
  search: "",
  folder: "",
  isRead: null as boolean | null,
  page: 1,
  perPage: 20,
};

const defaultSettings = {
  defaultSignature: "",
  trackOpens: true,
  trackClicks: true,
  dailyLimit: 200,
  monthlyLimit: 5000,
};

interface EmailState {
  messageFilters: {
    search: string;
    status: string;
    direction: string;
    folder: string;
    isRead: boolean | null;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setMessageFilters: (filters: Partial<EmailState["messageFilters"]>) => void;
  resetMessageFilters: () => void;

  templateFilters: {
    search: string;
    category: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setTemplateFilters: (filters: Partial<EmailState["templateFilters"]>) => void;
  resetTemplateFilters: () => void;

  campaignFilters: {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setCampaignFilters: (filters: Partial<EmailState["campaignFilters"]>) => void;
  resetCampaignFilters: () => void;

  sequenceFilters: {
    search: string;
    status: string;
    page: number;
    perPage: number;
  };
  setSequenceFilters: (filters: Partial<EmailState["sequenceFilters"]>) => void;
  resetSequenceFilters: () => void;

  threadFilters: {
    search: string;
    folder: string;
    isRead: boolean | null;
    page: number;
    perPage: number;
  };
  setThreadFilters: (filters: Partial<EmailState["threadFilters"]>) => void;
  resetThreadFilters: () => void;

  selectedMessageIds: string[];
  toggleMessageSelection: (id: string) => void;
  clearMessageSelection: () => void;

  selectedTemplateIds: string[];
  toggleTemplateSelection: (id: string) => void;
  clearTemplateSelection: () => void;

  selectedCampaignIds: string[];
  toggleCampaignSelection: (id: string) => void;
  clearCampaignSelection: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  composeOpen: boolean;
  setComposeOpen: (open: boolean) => void;
  composeDraft: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    templateId: string | null;
  } | null;
  setComposeDraft: (draft: EmailState["composeDraft"]) => void;
  clearComposeDraft: () => void;

  settings: {
    defaultSignature: string;
    trackOpens: boolean;
    trackClicks: boolean;
    dailyLimit: number;
    monthlyLimit: number;
  };
  updateSettings: (settings: Partial<EmailState["settings"]>) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  messageFilters: { ...defaultMessageFilters },
  setMessageFilters: (filters) =>
    set((state) => ({
      messageFilters: { ...state.messageFilters, ...filters },
    })),
  resetMessageFilters: () => set({ messageFilters: { ...defaultMessageFilters } }),

  templateFilters: { ...defaultTemplateFilters },
  setTemplateFilters: (filters) =>
    set((state) => ({
      templateFilters: { ...state.templateFilters, ...filters },
    })),
  resetTemplateFilters: () => set({ templateFilters: { ...defaultTemplateFilters } }),

  campaignFilters: { ...defaultCampaignFilters },
  setCampaignFilters: (filters) =>
    set((state) => ({
      campaignFilters: { ...state.campaignFilters, ...filters },
    })),
  resetCampaignFilters: () => set({ campaignFilters: { ...defaultCampaignFilters } }),

  sequenceFilters: { ...defaultSequenceFilters },
  setSequenceFilters: (filters) =>
    set((state) => ({
      sequenceFilters: { ...state.sequenceFilters, ...filters },
    })),
  resetSequenceFilters: () => set({ sequenceFilters: { ...defaultSequenceFilters } }),

  threadFilters: { ...defaultThreadFilters },
  setThreadFilters: (filters) =>
    set((state) => ({
      threadFilters: { ...state.threadFilters, ...filters },
    })),
  resetThreadFilters: () => set({ threadFilters: { ...defaultThreadFilters } }),

  selectedMessageIds: [],
  toggleMessageSelection: (id) =>
    set((state) => ({
      selectedMessageIds: state.selectedMessageIds.includes(id)
        ? state.selectedMessageIds.filter((i) => i !== id)
        : [...state.selectedMessageIds, id],
    })),
  clearMessageSelection: () => set({ selectedMessageIds: [] }),

  selectedTemplateIds: [],
  toggleTemplateSelection: (id) =>
    set((state) => ({
      selectedTemplateIds: state.selectedTemplateIds.includes(id)
        ? state.selectedTemplateIds.filter((i) => i !== id)
        : [...state.selectedTemplateIds, id],
    })),
  clearTemplateSelection: () => set({ selectedTemplateIds: [] }),

  selectedCampaignIds: [],
  toggleCampaignSelection: (id) =>
    set((state) => ({
      selectedCampaignIds: state.selectedCampaignIds.includes(id)
        ? state.selectedCampaignIds.filter((i) => i !== id)
        : [...state.selectedCampaignIds, id],
    })),
  clearCampaignSelection: () => set({ selectedCampaignIds: [] }),

  activeTab: "inbox",
  setActiveTab: (tab) => set({ activeTab: tab }),

  composeOpen: false,
  setComposeOpen: (open) => set({ composeOpen: open }),
  composeDraft: null,
  setComposeDraft: (draft) => set({ composeDraft: draft }),
  clearComposeDraft: () => set({ composeDraft: null }),

  settings: { ...defaultSettings },
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
}));
