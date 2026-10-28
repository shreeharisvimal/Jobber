import { create } from "zustand";
import type { ResumeCustomization } from "@/types/resume";

interface ResumeCustomizationState {
  activeCustomizations: ResumeCustomization[];
  setActiveCustomizations: (customizations: ResumeCustomization[]) => void;

  pendingChanges: Map<string, Partial<ResumeCustomization>>;
  addPendingChange: (entityId: string, change: Partial<ResumeCustomization>) => void;
  removePendingChange: (entityId: string) => void;
  clearPendingChanges: () => void;

  activeEntityOverride: {
    entityType: string;
    entityId: string;
  } | null;
  setActiveEntityOverride: (entityType: string, entityId: string) => void;
  clearActiveEntityOverride: () => void;

  isCustomizationPanelOpen: boolean;
  toggleCustomizationPanel: () => void;
  setCustomizationPanelOpen: (open: boolean) => void;

  editingEntityId: string | null;
  setEditingEntityId: (id: string | null) => void;

  reset: () => void;
}

const initialState = {
  activeCustomizations: [],
  pendingChanges: new Map<string, Partial<ResumeCustomization>>(),
  activeEntityOverride: null,
  isCustomizationPanelOpen: false,
  editingEntityId: null,
};

export const useResumeCustomizationStore = create<ResumeCustomizationState>((set) => ({
  ...initialState,

  setActiveCustomizations: (customizations) =>
    set({ activeCustomizations: customizations }),

  addPendingChange: (entityId, change) =>
    set((state) => {
      const newPending = new Map(state.pendingChanges);
      newPending.set(entityId, { ...newPending.get(entityId), ...change });
      return { pendingChanges: newPending };
    }),
  removePendingChange: (entityId) =>
    set((state) => {
      const newPending = new Map(state.pendingChanges);
      newPending.delete(entityId);
      return { pendingChanges: newPending };
    }),
  clearPendingChanges: () => set({ pendingChanges: new Map() }),

  setActiveEntityOverride: (entityType, entityId) =>
    set({ activeEntityOverride: { entityType, entityId } }),
  clearActiveEntityOverride: () => set({ activeEntityOverride: null }),

  toggleCustomizationPanel: () =>
    set((state) => ({
      isCustomizationPanelOpen: !state.isCustomizationPanelOpen,
    })),
  setCustomizationPanelOpen: (open) =>
    set({ isCustomizationPanelOpen: open }),

  setEditingEntityId: (id) => set({ editingEntityId: id }),

  reset: () => set(initialState),
}));
