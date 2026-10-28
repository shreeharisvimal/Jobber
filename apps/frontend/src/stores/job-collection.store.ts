import { create } from "zustand";
import type { JobCollection, JobCollectionItem } from "@/types/job";

interface JobCollectionState {
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;

  activeCollection: JobCollection | null;
  setActiveCollection: (collection: JobCollection | null) => void;

  collections: JobCollection[];
  setCollections: (collections: JobCollection[]) => void;

  items: JobCollectionItem[];
  setItems: (items: JobCollectionItem[]) => void;
  addItem: (item: JobCollectionItem) => void;
  removeItem: (jobId: string) => void;
  reorderItems: (orderedIds: string[]) => void;

  isCreating: boolean;
  setIsCreating: (creating: boolean) => void;

  editingCollectionId: string | null;
  setEditingCollectionId: (id: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  sortBy: string;
  sortOrder: "asc" | "desc";
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;

  reset: () => void;
}

const initialState = {
  activeCollectionId: null,
  activeCollection: null,
  collections: [],
  items: [],
  isCreating: false,
  editingCollectionId: null,
  searchQuery: "",
  sortBy: "sort_order",
  sortOrder: "asc" as const,
};

export const useJobCollectionStore = create<JobCollectionState>((set) => ({
  ...initialState,

  setActiveCollectionId: (id) => set({ activeCollectionId: id }),

  setActiveCollection: (collection) =>
    set({
      activeCollection: collection,
      activeCollectionId: collection?.id ?? null,
      items: collection?.items ?? [],
    }),

  setCollections: (collections) => set({ collections }),

  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (jobId) =>
    set((state) => ({
      items: state.items.filter((item) => item.job_id !== jobId),
    })),
  reorderItems: (orderedIds) =>
    set((state) => {
      const itemMap = new Map(state.items.map((item) => [item.id, item]));
      return {
        items: orderedIds
          .map((id, index) => {
            const item = itemMap.get(id);
            return item ? { ...item, sort_order: index } : null;
          })
          .filter(Boolean) as JobCollectionItem[],
      };
    }),

  setIsCreating: (creating) => set({ isCreating: creating }),
  setEditingCollectionId: (id) => set({ editingCollectionId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSort: (sortBy, sortOrder = "asc") => set({ sortBy, sortOrder }),

  reset: () => set(initialState),
}));
