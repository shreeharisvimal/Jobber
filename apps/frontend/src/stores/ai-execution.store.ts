import { create } from "zustand";
import type { AIExecutionStatus } from "@/types/ai";

interface AIExecutionState {
  selectedExecutionId: string | null;
  setSelectedExecutionId: (id: string | null) => void;

  isDetailPanelOpen: boolean;
  toggleDetailPanel: () => void;
  setDetailPanelOpen: (open: boolean) => void;

  filterRequestId: string | null;
  setFilterRequestId: (id: string | null) => void;

  filterStatus: AIExecutionStatus | null;
  setFilterStatus: (status: AIExecutionStatus | null) => void;

  filterProvider: string | null;
  setFilterProvider: (provider: string | null) => void;

  filterModel: string | null;
  setFilterModel: (model: string | null) => void;

  sortBy: string;
  setSortBy: (sort: string) => void;

  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;

  showRawRequest: boolean;
  toggleRawRequest: () => void;

  showRawResponse: boolean;
  toggleRawResponse: () => void;

  reset: () => void;
}

const initialState = {
  selectedExecutionId: null,
  isDetailPanelOpen: false,
  filterRequestId: null,
  filterStatus: null,
  filterProvider: null,
  filterModel: null,
  sortBy: "created_at",
  sortOrder: "desc" as const,
  showRawRequest: false,
  showRawResponse: false,
};

export const useAIExecutionStore = create<AIExecutionState>((set) => ({
  ...initialState,

  setSelectedExecutionId: (id) => set({ selectedExecutionId: id }),

  toggleDetailPanel: () =>
    set((state) => ({ isDetailPanelOpen: !state.isDetailPanelOpen })),
  setDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),

  setFilterRequestId: (id) => set({ filterRequestId: id }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setFilterProvider: (provider) => set({ filterProvider: provider }),

  setFilterModel: (model) => set({ filterModel: model }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setSortOrder: (order) => set({ sortOrder: order }),

  toggleRawRequest: () =>
    set((state) => ({ showRawRequest: !state.showRawRequest })),

  toggleRawResponse: () =>
    set((state) => ({ showRawResponse: !state.showRawResponse })),

  reset: () => set(initialState),
}));
