import { create } from "zustand";
import type {
  JobListItem,
  JobSearchRequest,
  JobSearchStats,
  EmploymentType,
  ExperienceLevel,
  JobStatus,
} from "@/types/job";

interface JobSearchState {
  query: string;
  setQuery: (query: string) => void;

  filters: {
    company: string;
    location: string;
    skills: string[];
    salary_min: number | null;
    salary_max: number | null;
    remote: boolean | null;
    employment_type: EmploymentType[];
    experience_level: ExperienceLevel[];
    tags: string[];
    industry: string;
    source: string;
    status: JobStatus[];
    date_from: string;
    date_to: string;
  };
  setFilters: (filters: Partial<JobSearchState["filters"]>) => void;
  resetFilters: () => void;

  sortBy: string;
  sortOrder: "asc" | "desc";
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;

  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  results: JobListItem[];
  setResults: (results: JobListItem[]) => void;
  appendResults: (results: JobListItem[]) => void;

  total: number;
  setTotal: (total: number) => void;

  stats: JobSearchStats | null;
  setStats: (stats: JobSearchStats | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  hasSearched: boolean;
  setHasSearched: (searched: boolean) => void;

  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  toSearchRequest: () => JobSearchRequest;
  reset: () => void;
}

const initialFilters = {
  company: "",
  location: "",
  skills: [],
  salary_min: null,
  salary_max: null,
  remote: null,
  employment_type: [],
  experience_level: [],
  tags: [],
  industry: "",
  source: "",
  status: [],
  date_from: "",
  date_to: "",
};

const initialState = {
  query: "",
  filters: initialFilters,
  sortBy: "relevance",
  sortOrder: "desc" as const,
  page: 1,
  perPage: 20,
  results: [],
  total: 0,
  stats: null,
  isLoading: false,
  hasSearched: false,
  recentSearches: [],
};

export const useJobSearchStore = create<JobSearchState>((set, get) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: initialFilters }),

  setSort: (sortBy, sortOrder = "desc") => set({ sortBy, sortOrder }),

  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }),

  setResults: (results) => set({ results }),
  appendResults: (results) =>
    set((state) => ({ results: [...state.results, ...results] })),

  setTotal: (total) => set({ total }),

  setStats: (stats) => set({ stats }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setHasSearched: (searched) => set({ hasSearched: searched }),

  addRecentSearch: (query) =>
    set((state) => {
      const filtered = state.recentSearches.filter((q) => q !== query);
      return { recentSearches: [query, ...filtered].slice(0, 10) };
    }),
  clearRecentSearches: () => set({ recentSearches: [] }),

  toSearchRequest: () => {
    const state = get();
    return {
      query: state.query || undefined,
      company: state.filters.company || undefined,
      location: state.filters.location || undefined,
      skills: state.filters.skills.length ? state.filters.skills : undefined,
      salary_min: state.filters.salary_min ?? undefined,
      salary_max: state.filters.salary_max ?? undefined,
      remote: state.filters.remote ?? undefined,
      employment_type: state.filters.employment_type.length
        ? state.filters.employment_type[0]
        : undefined,
      experience_level: state.filters.experience_level.length
        ? state.filters.experience_level[0]
        : undefined,
      tags: state.filters.tags.length ? state.filters.tags : undefined,
      industry: state.filters.industry || undefined,
      source: state.filters.source || undefined,
      status: state.filters.status.length
        ? state.filters.status[0]
        : undefined,
      date_from: state.filters.date_from || undefined,
      date_to: state.filters.date_to || undefined,
      sort_by: state.sortBy,
      sort_order: state.sortOrder,
      offset: (state.page - 1) * state.perPage,
      limit: state.perPage,
    };
  },

  reset: () => set(initialState),
}));
