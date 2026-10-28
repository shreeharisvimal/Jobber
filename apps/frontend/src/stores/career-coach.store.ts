import { create } from "zustand";
import type {
  GoalStatus,
  RecommendationCategory,
  RecommendationImpact,
  PriorityType,
  InsightType,
} from "@/types/career-coach";

interface CareerCoachState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: {
    status: string[];
    category: string[];
    impact: string[];
    priority: string[];
    type: string[];
  };
  setFilters: (filters: Partial<CareerCoachState["filters"]>) => void;
  resetFilters: () => void;
  viewMode: "list" | "grid" | "dashboard";
  setViewMode: (mode: "list" | "grid" | "dashboard") => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  dashboardRefreshCounter: number;
  incrementRefresh: () => void;
  reset: () => void;
}

const defaultFilters: CareerCoachState["filters"] = {
  status: [],
  category: [],
  impact: [],
  priority: [],
  type: [],
};

export const useCareerCoachStore = create<CareerCoachState>((set) => ({
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),

  filters: { ...defaultFilters },
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  viewMode: "dashboard",
  setViewMode: (mode) => set({ viewMode: mode }),

  sortBy: "created_at",
  sortOrder: "desc",
  setSort: (sortBy, sortOrder = "desc") => set({ sortBy, sortOrder }),

  selectedIds: [],
  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    })),
  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  dashboardRefreshCounter: 0,
  incrementRefresh: () =>
    set((state) => ({
      dashboardRefreshCounter: state.dashboardRefreshCounter + 1,
    })),

  reset: () =>
    set({
      activeTab: "overview",
      filters: { ...defaultFilters },
      viewMode: "dashboard",
      sortBy: "created_at",
      sortOrder: "desc",
      selectedIds: [],
      dashboardRefreshCounter: 0,
    }),
}));
