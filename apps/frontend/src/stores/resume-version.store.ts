import { create } from "zustand";
import type { ResumeVersion } from "@/types/resume";

interface ResumeVersionState {
  currentVersion: ResumeVersion | null;
  setCurrentVersion: (version: ResumeVersion | null) => void;

  comparingVersions: [ResumeVersion | null, ResumeVersion | null];
  setComparingVersions: (left: ResumeVersion | null, right: ResumeVersion | null) => void;
  clearComparison: () => void;

  isVersionHistoryOpen: boolean;
  toggleVersionHistory: () => void;
  setVersionHistoryOpen: (open: boolean) => void;

  selectedVersionId: string | null;
  setSelectedVersionId: (id: string | null) => void;

  isComparing: boolean;
  setIsComparing: (comparing: boolean) => void;

  reset: () => void;
}

const initialState = {
  currentVersion: null,
  comparingVersions: [null, null] as [ResumeVersion | null, ResumeVersion | null],
  isVersionHistoryOpen: false,
  selectedVersionId: null,
  isComparing: false,
};

export const useResumeVersionStore = create<ResumeVersionState>((set) => ({
  ...initialState,

  setCurrentVersion: (version) => set({ currentVersion: version }),

  setComparingVersions: (left, right) =>
    set({ comparingVersions: [left, right], isComparing: true }),
  clearComparison: () =>
    set({ comparingVersions: [null, null], isComparing: false }),

  toggleVersionHistory: () =>
    set((state) => ({ isVersionHistoryOpen: !state.isVersionHistoryOpen })),
  setVersionHistoryOpen: (open) => set({ isVersionHistoryOpen: open }),

  setSelectedVersionId: (id) => set({ selectedVersionId: id }),

  setIsComparing: (comparing) => set({ isComparing: comparing }),

  reset: () => set(initialState),
}));
