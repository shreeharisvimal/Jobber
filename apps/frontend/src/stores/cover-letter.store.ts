import { create } from "zustand";
import type {
  CoverLetterStatus,
  CoverLetterTone,
  CoverLetterStyle,
  CoverLetterSettings,
} from "@/types/cover-letter";

interface CoverLetterState {
  filters: {
    search: string;
    status: CoverLetterStatus | null;
    tone: CoverLetterTone | null;
    style: CoverLetterStyle | null;
    min_score: number | null;
    max_score: number | null;
    date_from: string | null;
    date_to: string | null;
    tags: string[];
    sort_by: string;
    sort_order: "asc" | "desc";
    page: number;
    per_page: number;
  };
  setFilters: (filters: Partial<CoverLetterState["filters"]>) => void;
  resetFilters: () => void;

  selectedLetterIds: string[];
  setSelectedLetterIds: (ids: string[]) => void;
  toggleLetterSelection: (id: string) => void;
  clearSelection: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  activeEditorVersion: string | null;
  setActiveEditorVersion: (id: string | null) => void;

  comparisonLeftVersionId: string | null;
  comparisonRightVersionId: string | null;
  setComparisonLeftVersionId: (id: string | null) => void;
  setComparisonRightVersionId: (id: string | null) => void;

  generateDialogOpen: boolean;
  setGenerateDialogOpen: (open: boolean) => void;

  settings: CoverLetterSettings;
  updateSettings: (partial: Partial<CoverLetterSettings>) => void;
}

const defaultFilters = {
  search: "",
  status: null,
  tone: null,
  style: null,
  min_score: null,
  max_score: null,
  date_from: null,
  date_to: null,
  tags: [] as string[],
  sort_by: "updated_at",
  sort_order: "desc" as const,
  page: 1,
  per_page: 20,
};

const defaultSettings: CoverLetterSettings = {
  default_tone: "professional",
  default_style: "standard",
  default_temperature: 0.7,
  max_tokens: 2000,
  auto_generate: false,
  auto_optimize: false,
  signature_name: "",
  signature_title: "",
  signature_email: "",
  signature_phone: "",
  signature_linkedin: "",
  ai_provider: "openai",
  ai_model: "gpt-4",
};

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
  filters: { ...defaultFilters },
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectedLetterIds: [],
  setSelectedLetterIds: (ids) => set({ selectedLetterIds: ids }),
  toggleLetterSelection: (id) =>
    set((state) => ({
      selectedLetterIds: state.selectedLetterIds.includes(id)
        ? state.selectedLetterIds.filter((i) => i !== id)
        : [...state.selectedLetterIds, id],
    })),
  clearSelection: () => set({ selectedLetterIds: [] }),

  activeTab: "editor",
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeEditorVersion: null,
  setActiveEditorVersion: (id) => set({ activeEditorVersion: id }),

  comparisonLeftVersionId: null,
  comparisonRightVersionId: null,
  setComparisonLeftVersionId: (id) => set({ comparisonLeftVersionId: id }),
  setComparisonRightVersionId: (id) => set({ comparisonRightVersionId: id }),

  generateDialogOpen: false,
  setGenerateDialogOpen: (open) => set({ generateDialogOpen: open }),

  settings: { ...defaultSettings },
  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),
}));
