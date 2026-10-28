import { create } from "zustand";
import type { ResumeSection } from "@/types/resume";

interface ResumeState {
  activeResumeId: string | null;
  setActiveResumeId: (id: string | null) => void;

  activeSection: string;
  setActiveSection: (section: string) => void;

  activeSectionData: ResumeSection | null;
  setActiveSectionData: (section: ResumeSection | null) => void;

  isEditing: Record<string, boolean>;
  setEditing: (key: string, editing: boolean) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  isPreviewMode: boolean;
  setPreviewMode: (mode: boolean) => void;

  hasUnsavedChanges: boolean;
  markDirty: () => void;
  markClean: () => void;

  pendingChanges: Record<string, unknown>[];
  addPendingChange: (change: Record<string, unknown>) => void;
  clearPendingChanges: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  viewMode: "edit" | "preview" | "split";
  setViewMode: (mode: "edit" | "preview" | "split") => void;

  reset: () => void;
}

const initialState = {
  activeResumeId: null,
  activeSection: "summary",
  activeSectionData: null,
  isEditing: {} as Record<string, boolean>,
  isSidebarOpen: true,
  isPreviewMode: false,
  hasUnsavedChanges: false,
  pendingChanges: [],
  searchQuery: "",
  viewMode: "edit" as const,
};

export const useResumeStore = create<ResumeState>((set) => ({
  ...initialState,

  setActiveResumeId: (id) => set({ activeResumeId: id }),

  setActiveSection: (section) => set({ activeSection: section }),

  setActiveSectionData: (section) => set({ activeSectionData: section }),

  setEditing: (key, editing) =>
    set((state) => ({
      isEditing: { ...state.isEditing, [key]: editing },
    })),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setPreviewMode: (mode) => set({ isPreviewMode: mode }),

  markDirty: () => set({ hasUnsavedChanges: true }),
  markClean: () => set({ hasUnsavedChanges: false, pendingChanges: [] }),

  addPendingChange: (change) =>
    set((state) => ({
      pendingChanges: [...state.pendingChanges, change],
      hasUnsavedChanges: true,
    })),
  clearPendingChanges: () => set({ pendingChanges: [], hasUnsavedChanges: false }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set({ viewMode: mode }),

  reset: () => set(initialState),
}));
