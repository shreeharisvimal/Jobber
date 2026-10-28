import { create } from "zustand";
import type {
  JobDetail,
  JobStatus,
  EmploymentType,
  RemoteStatus,
  ExperienceLevel,
} from "@/types/job";

interface JobState {
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;

  activeJob: JobDetail | null;
  setActiveJob: (job: JobDetail | null) => void;

  isEditing: Record<string, boolean>;
  setEditing: (key: string, editing: boolean) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  isDetailPanelOpen: boolean;
  toggleDetailPanel: () => void;
  setDetailPanelOpen: (open: boolean) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  hasUnsavedChanges: boolean;
  markDirty: () => void;
  markClean: () => void;

  pendingChanges: Record<string, unknown>;
  addPendingChange: (key: string, value: unknown) => void;
  clearPendingChanges: () => void;

  filters: {
    status: JobStatus[];
    employment_type: EmploymentType[];
    remote_status: RemoteStatus[];
    experience_level: ExperienceLevel[];
    tags: string[];
  };
  setFilters: (filters: Partial<JobState["filters"]>) => void;
  resetFilters: () => void;

  viewMode: "list" | "grid" | "detail";
  setViewMode: (mode: "list" | "grid" | "detail") => void;

  sortBy: string;
  sortOrder: "asc" | "desc";
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;

  selectedJobIds: string[];
  toggleJobSelection: (id: string) => void;
  selectAllJobs: (ids: string[]) => void;
  clearSelection: () => void;

  reset: () => void;
}

const initialFilters = {
  status: [],
  employment_type: [],
  remote_status: [],
  experience_level: [],
  tags: [],
};

const initialState = {
  activeJobId: null,
  activeJob: null,
  isEditing: {} as Record<string, boolean>,
  isSidebarOpen: true,
  isDetailPanelOpen: false,
  activeTab: "overview",
  hasUnsavedChanges: false,
  pendingChanges: {} as Record<string, unknown>,
  filters: initialFilters,
  viewMode: "list" as const,
  sortBy: "created_at",
  sortOrder: "desc" as const,
  selectedJobIds: [],
};

export const useJobStore = create<JobState>((set) => ({
  ...initialState,

  setActiveJobId: (id) => set({ activeJobId: id }),

  setActiveJob: (job) => set({ activeJob: job, activeJobId: job?.id ?? null }),

  setEditing: (key, editing) =>
    set((state) => ({
      isEditing: { ...state.isEditing, [key]: editing },
    })),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleDetailPanel: () => set((state) => ({ isDetailPanelOpen: !state.isDetailPanelOpen })),
  setDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  markDirty: () => set({ hasUnsavedChanges: true }),
  markClean: () => set({ hasUnsavedChanges: false, pendingChanges: {} }),

  addPendingChange: (key, value) =>
    set((state) => ({
      pendingChanges: { ...state.pendingChanges, [key]: value },
      hasUnsavedChanges: true,
    })),
  clearPendingChanges: () => set({ pendingChanges: {}, hasUnsavedChanges: false }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: initialFilters }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSort: (sortBy, sortOrder = "desc") => set({ sortBy, sortOrder }),

  toggleJobSelection: (id) =>
    set((state) => ({
      selectedJobIds: state.selectedJobIds.includes(id)
        ? state.selectedJobIds.filter((jid) => jid !== id)
        : [...state.selectedJobIds, id],
    })),
  selectAllJobs: (ids) => set({ selectedJobIds: ids }),
  clearSelection: () => set({ selectedJobIds: [] }),

  reset: () => set(initialState),
}));
