import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompanyIntelStore } from "@/stores/company-intel.store";
import type {
  Company,
  CompanyListItem,
  CompanyDetail,
  CompanyReview,
  CompanyInterview,
  CompanySalary,
  CompanyCollection,
  CompanyCollectionDetail,
  CompanyCollectionCreate,
  CompanyCollectionUpdate,
  CompanySearchRequest,
  CompanyStats,
  CompanyBookmarks,
  CompanyComparison,
  PaginatedResponse,
} from "@/types/company-intel";

export const companyIntelKeys = {
  all: ["company-intel"] as const,
  companies: () => [...companyIntelKeys.all, "companies"] as const,
  company: (id: string) => [...companyIntelKeys.companies(), id] as const,
  companyDetail: (id: string) => [...companyIntelKeys.company(id), "detail"] as const,
  companyReviews: (id: string) => [...companyIntelKeys.company(id), "reviews"] as const,
  companyInterviews: (id: string) => [...companyIntelKeys.company(id), "interviews"] as const,
  companySalaries: (id: string) => [...companyIntelKeys.company(id), "salaries"] as const,
  search: (params: Record<string, unknown>) => [...companyIntelKeys.companies(), "search", params] as const,
  stats: () => [...companyIntelKeys.all, "stats"] as const,
  collections: () => [...companyIntelKeys.all, "collections"] as const,
  collection: (id: string) => [...companyIntelKeys.collections(), id] as const,
  bookmarks: () => [...companyIntelKeys.all, "bookmarks"] as const,
  comparison: (a: string, b: string) => [...companyIntelKeys.all, "comparison", a, b] as const,
};

function mockApi<T>(data: T, delay = 500): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}

// --- Companies ---

export function useCompanySearch() {
  const filters = useCompanyIntelStore((s) => s.filters);
  return useQuery({
    queryKey: companyIntelKeys.search(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<PaginatedResponse<CompanyListItem>> => {
      const res = await mockApi<{ data: PaginatedResponse<CompanyListItem> }>({
        data: [],
        total: 0,
        page: filters.page,
        per_page: filters.per_page,
        total_pages: 0,
      });
      return res.data;
    },
  });
}

export function useCompanyDetail(id: string) {
  return useQuery({
    queryKey: companyIntelKeys.companyDetail(id),
    queryFn: async (): Promise<CompanyDetail> => {
      const res = await mockApi<{ data: CompanyDetail }>({} as CompanyDetail);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCompanyReviews(id: string) {
  return useQuery({
    queryKey: companyIntelKeys.companyReviews(id),
    queryFn: async (): Promise<CompanyReview[]> => {
      const res = await mockApi<{ data: CompanyReview[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCompanyInterviews(id: string) {
  return useQuery({
    queryKey: companyIntelKeys.companyInterviews(id),
    queryFn: async (): Promise<CompanyInterview[]> => {
      const res = await mockApi<{ data: CompanyInterview[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCompanySalaries(id: string) {
  return useQuery({
    queryKey: companyIntelKeys.companySalaries(id),
    queryFn: async (): Promise<CompanySalary[]> => {
      const res = await mockApi<{ data: CompanySalary[] }>([]);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCompanyStats() {
  return useQuery({
    queryKey: companyIntelKeys.stats(),
    queryFn: async (): Promise<CompanyStats> => {
      const res = await mockApi<{ data: CompanyStats }>({
        total_companies: 0,
        average_score: 0,
        active_analyses: 0,
        total_reviews: 0,
        total_collections: 0,
        industry_distribution: {},
        score_distribution: {},
        recent_activity: [],
      });
      return res.data;
    },
  });
}

export function useBookmarkCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (companyId: string) => {
      await mockApi({ success: true }, 200);
      return companyId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.bookmarks() });
    },
  });
}

export function useUnbookmarkCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (companyId: string) => {
      await mockApi({ success: true }, 200);
      return companyId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.bookmarks() });
    },
  });
}

export function useFollowCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (companyId: string) => {
      await mockApi({ success: true }, 200);
      return companyId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.bookmarks() });
    },
  });
}

export function useUnfollowCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (companyId: string) => {
      await mockApi({ success: true }, 200);
      return companyId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.bookmarks() });
    },
  });
}

export function useBookmarks() {
  return useQuery({
    queryKey: companyIntelKeys.bookmarks(),
    queryFn: async (): Promise<CompanyBookmarks> => {
      const res = await mockApi<{ data: CompanyBookmarks }>({
        bookmarked_companies: [],
        followed_companies: [],
      });
      return res.data;
    },
  });
}

export function useCompanyComparison(companyAId: string, companyBId: string) {
  return useQuery({
    queryKey: companyIntelKeys.comparison(companyAId, companyBId),
    queryFn: async (): Promise<CompanyComparison> => {
      const res = await mockApi<{ data: CompanyComparison }>({} as CompanyComparison);
      return res.data;
    },
    enabled: !!companyAId && !!companyBId,
  });
}

// --- Collections ---

export function useCompanyCollections() {
  return useQuery({
    queryKey: companyIntelKeys.collections(),
    queryFn: async (): Promise<CompanyCollection[]> => {
      const res = await mockApi<{ data: CompanyCollection[] }>([]);
      return res.data;
    },
  });
}

export function useCompanyCollection(id: string) {
  return useQuery({
    queryKey: companyIntelKeys.collection(id),
    queryFn: async (): Promise<CompanyCollectionDetail> => {
      const res = await mockApi<{ data: CompanyCollectionDetail }>(
        {} as CompanyCollectionDetail,
      );
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateCompanyCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CompanyCollectionCreate) => {
      const res = await mockApi<{ data: CompanyCollection }>({
        id: crypto.randomUUID(),
        user_id: "current",
        company_count: 0,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      } as CompanyCollection);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.collections() });
    },
  });
}

export function useUpdateCompanyCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CompanyCollectionUpdate }) => {
      const res = await mockApi<{ data: CompanyCollection }>(
        {} as CompanyCollection,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.collections() });
    },
  });
}

export function useDeleteCompanyCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await mockApi({ success: true }, 200);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.collections() });
    },
  });
}

export function useAddToCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, companyId }: { collectionId: string; companyId: string }) => {
      await mockApi({ success: true }, 200);
      return { collectionId, companyId };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.collections() });
    },
  });
}

export function useRemoveFromCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, companyId }: { collectionId: string; companyId: string }) => {
      await mockApi({ success: true }, 200);
      return { collectionId, companyId };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companyIntelKeys.collections() });
    },
  });
}
