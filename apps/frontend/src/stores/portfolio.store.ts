import { create } from "zustand";

const defaultPortfolioFilters = {
  search: "",
  status: "",
  visibility: "",
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

const defaultThemeFilters = {
  search: "",
  sortBy: "created_at",
  sortOrder: "desc" as const,
  page: 1,
  perPage: 20,
};

const defaultProjectFilters = {
  search: "",
  sortBy: "sort_order",
  sortOrder: "asc" as const,
  page: 1,
  perPage: 50,
};

const defaultSettings = {
  defaultVisibility: "private" as const,
  showResumeLink: true,
  showContactForm: true,
  showSocialLinks: true,
  allowDownloads: true,
  trackVisitors: true,
  emailNotifications: true,
};

interface PortfolioState {
  portfolioFilters: {
    search: string;
    status: string;
    visibility: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setPortfolioFilters: (filters: Partial<PortfolioState["portfolioFilters"]>) => void;
  resetPortfolioFilters: () => void;

  templateFilters: {
    search: string;
    category: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setTemplateFilters: (filters: Partial<PortfolioState["templateFilters"]>) => void;
  resetTemplateFilters: () => void;

  themeFilters: {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setThemeFilters: (filters: Partial<PortfolioState["themeFilters"]>) => void;
  resetThemeFilters: () => void;

  projectFilters: {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    perPage: number;
  };
  setProjectFilters: (filters: Partial<PortfolioState["projectFilters"]>) => void;
  resetProjectFilters: () => void;

  selectedPortfolioIds: string[];
  togglePortfolioSelection: (id: string) => void;
  clearPortfolioSelection: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  builderOpen: boolean;
  setBuilderOpen: (open: boolean) => void;
  activeSection: string | null;
  setActiveSection: (sectionId: string | null) => void;

  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  previewData: Record<string, unknown> | null;
  setPreviewData: (data: Record<string, unknown> | null) => void;

  settings: {
    defaultVisibility: "public" | "private" | "password_protected" | "unlisted";
    showResumeLink: boolean;
    showContactForm: boolean;
    showSocialLinks: boolean;
    allowDownloads: boolean;
    trackVisitors: boolean;
    emailNotifications: boolean;
  };
  updateSettings: (settings: Partial<PortfolioState["settings"]>) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolioFilters: { ...defaultPortfolioFilters },
  setPortfolioFilters: (filters) =>
    set((state) => ({
      portfolioFilters: { ...state.portfolioFilters, ...filters },
    })),
  resetPortfolioFilters: () => set({ portfolioFilters: { ...defaultPortfolioFilters } }),

  templateFilters: { ...defaultTemplateFilters },
  setTemplateFilters: (filters) =>
    set((state) => ({
      templateFilters: { ...state.templateFilters, ...filters },
    })),
  resetTemplateFilters: () => set({ templateFilters: { ...defaultTemplateFilters } }),

  themeFilters: { ...defaultThemeFilters },
  setThemeFilters: (filters) =>
    set((state) => ({
      themeFilters: { ...state.themeFilters, ...filters },
    })),
  resetThemeFilters: () => set({ themeFilters: { ...defaultThemeFilters } }),

  projectFilters: { ...defaultProjectFilters },
  setProjectFilters: (filters) =>
    set((state) => ({
      projectFilters: { ...state.projectFilters, ...filters },
    })),
  resetProjectFilters: () => set({ projectFilters: { ...defaultProjectFilters } }),

  selectedPortfolioIds: [],
  togglePortfolioSelection: (id) =>
    set((state) => ({
      selectedPortfolioIds: state.selectedPortfolioIds.includes(id)
        ? state.selectedPortfolioIds.filter((i) => i !== id)
        : [...state.selectedPortfolioIds, id],
    })),
  clearPortfolioSelection: () => set({ selectedPortfolioIds: [] }),

  activeTab: "portfolios",
  setActiveTab: (tab) => set({ activeTab: tab }),

  builderOpen: false,
  setBuilderOpen: (open) => set({ builderOpen: open }),
  activeSection: null,
  setActiveSection: (sectionId) => set({ activeSection: sectionId }),

  previewMode: false,
  setPreviewMode: (mode) => set({ previewMode: mode }),
  previewData: null,
  setPreviewData: (data) => set({ previewData: data }),

  settings: { ...defaultSettings },
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
}));
