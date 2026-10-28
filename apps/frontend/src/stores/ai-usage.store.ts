import { create } from "zustand";
import type { AIModule } from "@/types/ai";

interface AIUsageState {
  dateRange: { from: string | null; to: string | null };
  setDateRange: (range: { from: string | null; to: string | null }) => void;

  selectedModule: AIModule | null;
  setSelectedModule: (module: AIModule | null) => void;

  selectedProvider: string | null;
  setSelectedProvider: (provider: string | null) => void;

  selectedPeriod: "day" | "week" | "month";
  setSelectedPeriod: (period: "day" | "week" | "month") => void;

  comparisonEnabled: boolean;
  setComparisonEnabled: (enabled: boolean) => void;

  comparisonDateRange: { from: string | null; to: string | null };
  setComparisonDateRange: (range: {
    from: string | null;
    to: string | null;
  }) => void;

  showCostBreakdown: boolean;
  toggleCostBreakdown: () => void;

  showTokenBreakdown: boolean;
  toggleTokenBreakdown: () => void;

  reset: () => void;
}

const initialState = {
  dateRange: { from: null, to: null },
  selectedModule: null,
  selectedProvider: null,
  selectedPeriod: "month" as const,
  comparisonEnabled: false,
  comparisonDateRange: { from: null, to: null },
  showCostBreakdown: false,
  showTokenBreakdown: false,
};

export const useAIUsageStore = create<AIUsageState>((set) => ({
  ...initialState,

  setDateRange: (range) => set({ dateRange: range }),

  setSelectedModule: (module) => set({ selectedModule: module }),

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  setComparisonEnabled: (enabled) => set({ comparisonEnabled: enabled }),

  setComparisonDateRange: (range) => set({ comparisonDateRange: range }),

  toggleCostBreakdown: () =>
    set((state) => ({ showCostBreakdown: !state.showCostBreakdown })),

  toggleTokenBreakdown: () =>
    set((state) => ({ showTokenBreakdown: !state.showTokenBreakdown })),

  reset: () => set(initialState),
}));
