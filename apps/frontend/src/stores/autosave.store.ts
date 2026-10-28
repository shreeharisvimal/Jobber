import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AutosaveChange } from "@/types/career-profile";

interface AutosaveState {
  autosaveInterval: number;
  setAutosaveInterval: (interval: number) => void;
  lastSaved: string | null;
  setLastSaved: (timestamp: string) => void;

  queue: AutosaveChange[];
  addToQueue: (change: AutosaveChange) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;

  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  retryCount: number;
  incrementRetry: () => void;
  resetRetry: () => void;

  maxRetries: number;
  debounceMs: number;
}

export const useAutosaveStore = create<AutosaveState>()(
  persist(
    (set) => ({
      autosaveInterval: 30000,
      setAutosaveInterval: (interval) => set({ autosaveInterval: interval }),
      lastSaved: null,
      setLastSaved: (timestamp) => set({ lastSaved: timestamp }),

      queue: [],
      addToQueue: (change) =>
        set((state) => ({ queue: [...state.queue, change] })),
      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter(
            (c) => !(c.entity_type === id && c.entity_id === id)
          ),
        })),
      clearQueue: () => set({ queue: [] }),

      isSaving: false,
      setIsSaving: (saving) => set({ isSaving: saving }),
      error: null,
      setError: (error) => set({ error }),
      retryCount: 0,
      incrementRetry: () =>
        set((state) => ({ retryCount: state.retryCount + 1 })),
      resetRetry: () => set({ retryCount: 0 }),

      maxRetries: 3,
      debounceMs: 2000,
    }),
    {
      name: "jobber-autosave",
      partialize: (state) => ({
        queue: state.queue,
        lastSaved: state.lastSaved,
      }),
    }
  )
);
