import { create } from "zustand";
import type { ResumeTemplate, TemplateCategory } from "@/types/resume";

interface ResumeTemplateState {
  selectedTemplate: ResumeTemplate | null;
  setSelectedTemplate: (template: ResumeTemplate | null) => void;

  previewTemplate: ResumeTemplate | null;
  setPreviewTemplate: (template: ResumeTemplate | null) => void;

  previewMode: "grid" | "list";
  setPreviewMode: (mode: "grid" | "list") => void;

  filterCategory: TemplateCategory | null;
  setFilterCategory: (category: TemplateCategory | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isGalleryOpen: boolean;
  toggleGallery: () => void;
  setGalleryOpen: (open: boolean) => void;

  customTemplates: ResumeTemplate[];
  setCustomTemplates: (templates: ResumeTemplate[]) => void;

  reset: () => void;
}

const initialState = {
  selectedTemplate: null,
  previewTemplate: null,
  previewMode: "grid" as const,
  filterCategory: null,
  searchQuery: "",
  isGalleryOpen: false,
  customTemplates: [],
};

export const useResumeTemplateStore = create<ResumeTemplateState>((set) => ({
  ...initialState,

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  setPreviewTemplate: (template) => set({ previewTemplate: template }),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  setFilterCategory: (category) => set({ filterCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleGallery: () =>
    set((state) => ({ isGalleryOpen: !state.isGalleryOpen })),
  setGalleryOpen: (open) => set({ isGalleryOpen: open }),

  setCustomTemplates: (templates) => set({ customTemplates: templates }),

  reset: () => set(initialState),
}));
