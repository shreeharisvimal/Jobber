import { create } from "zustand";
import type {
  AutosaveChange,
  ProfileSearchResult,
} from "@/types/career-profile";

interface CareerProfileState {
  profileId: string | null;
  setProfileId: (id: string) => void;

  hasUnsavedChanges: boolean;
  markDirty: () => void;
  markClean: () => void;

  pendingChanges: AutosaveChange[];
  addToPendingChanges: (change: AutosaveChange) => void;
  clearPendingChanges: () => void;
  isAutoSaving: boolean;
  lastAutoSavedAt: string | null;
  setAutoSaving: (saving: boolean) => void;
  setLastAutoSaved: (timestamp: string) => void;

  hasDraft: boolean;
  draftSavedAt: string | null;
  setHasDraft: (has: boolean, savedAt?: string) => void;

  activeSection: string;
  setActiveSection: (section: string) => void;

  isEditing: Record<string, boolean>;
  setEditing: (key: string, editing: boolean) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ProfileSearchResult[];
  setSearchResults: (results: ProfileSearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;

  importInProgress: boolean;
  setImportInProgress: (inProgress: boolean) => void;

  reset: () => void;
}

const initialState = {
  profileId: null,
  hasUnsavedChanges: false,
  pendingChanges: [],
  isAutoSaving: false,
  lastAutoSavedAt: null,
  hasDraft: false,
  draftSavedAt: null,
  activeSection: "summary",
  isEditing: {} as Record<string, boolean>,
  isSidebarOpen: true,
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  importInProgress: false,
};

export const useCareerProfileStore = create<CareerProfileState>((set) => ({
  ...initialState,

  setProfileId: (id) => set({ profileId: id }),

  markDirty: () => set({ hasUnsavedChanges: true }),
  markClean: () => set({ hasUnsavedChanges: false, pendingChanges: [] }),

  addToPendingChanges: (change) =>
    set((state) => ({
      pendingChanges: [...state.pendingChanges, change],
      hasUnsavedChanges: true,
    })),
  clearPendingChanges: () => set({ pendingChanges: [], hasUnsavedChanges: false }),

  setAutoSaving: (saving) => set({ isAutoSaving: saving }),
  setLastAutoSaved: (timestamp) => set({ lastAutoSavedAt: timestamp }),

  setHasDraft: (has, savedAt) =>
    set({ hasDraft: has, draftSavedAt: savedAt ?? null }),

  setActiveSection: (section) => set({ activeSection: section }),

  setEditing: (key, editing) =>
    set((state) => ({
      isEditing: { ...state.isEditing, [key]: editing },
    })),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),

  setImportInProgress: (inProgress) => set({ importInProgress: inProgress }),

  reset: () => set(initialState),
}));
