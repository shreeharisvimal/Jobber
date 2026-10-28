import { create } from "zustand";
import type {
  CompanySearchRequest,
  CompanySize,
} from "@/types/company-intel";

interface CompanyIntelState {
  filters: {
    search: string;
    industry: string | null;
    company_size: CompanySize | null;
    min_score: number | null;
    max_score: number | null;
    headquarters_country: string | null;
    tags: string[];
    sort_by: string;
    sort_order: "asc" | "desc";
    page: number;
    per_page: number;
  };
  setFilters: (filters: Partial<CompanyIntelState["filters"]>) => void;
  resetFilters: () => void;

  selectedCompanyIds: string[];
  setSelectedCompanyIds: (ids: string[]) => void;
  toggleCompanySelection: (id: string) => void;
  clearSelection: () => void;

  comparisonCompanyId: string | null;
  setComparisonCompanyId: (id: string | null) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const defaultFilters = {
  search: "",
  industry: null,
  company_size: null,
  min_score: null,
  max_score: null,
  headquarters_country: null,
  tags: [] as string[],
  sort_by: "overall_score",
  sort_order: "desc" as const,
  page: 1,
  per_page: 20,
};

export const useCompanyIntelStore = create<CompanyIntelState>((set) => ({
  filters: { ...defaultFilters },
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectedCompanyIds: [],
  setSelectedCompanyIds: (ids) => set({ selectedCompanyIds: ids }),
  toggleCompanySelection: (id) =>
    set((state) => ({
      selectedCompanyIds: state.selectedCompanyIds.includes(id)
        ? state.selectedCompanyIds.filter((i) => i !== id)
        : [...state.selectedCompanyIds, id],
    })),
  clearSelection: () => set({ selectedCompanyIds: [] }),

  comparisonCompanyId: null,
  setComparisonCompanyId: (id) => set({ comparisonCompanyId: id }),

  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),

  searchHistory: [],
  addSearchHistory: (query) =>
    set((state) => ({
      searchHistory: [
        query,
        ...state.searchHistory.filter((q) => q !== query),
      ].slice(0, 10),
    })),
  clearSearchHistory: () => set({ searchHistory: [] }),
}));
