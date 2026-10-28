import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { portfolioApi } from "@/lib/api-client";
import type {
  Portfolio,
  PortfolioCreate,
  PortfolioUpdate,
  PortfolioTemplate,
  PortfolioTemplateCreate,
  PortfolioTemplateUpdate,
  PortfolioTheme,
  PortfolioThemeCreate,
  PortfolioThemeUpdate,
  PortfolioSection,
  PortfolioSectionCreate,
  PortfolioSectionUpdate,
  PortfolioSectionItem,
  PortfolioSectionItemCreate,
  PortfolioSectionItemUpdate,
  PortfolioProject,
  PortfolioProjectCreate,
  PortfolioProjectUpdate,
  PortfolioCaseStudy,
  PortfolioCaseStudyCreate,
  PortfolioCaseStudyUpdate,
  PortfolioAsset,
  PortfolioAssetCreate,
  PortfolioTestimonial,
  PortfolioTestimonialCreate,
  PortfolioPublication,
  PortfolioPublicationCreate,
  PortfolioAward,
  PortfolioAwardCreate,
  PortfolioCertification,
  PortfolioCertificationCreate,
  PortfolioTimeline,
  PortfolioTimelineCreate,
  PortfolioContact,
  PortfolioContactCreate,
  PortfolioShare,
  PortfolioShareCreate,
  PortfolioSEO,
  PortfolioSEOUpdate,
  PortfolioVersion,
  PortfolioTag,
  PortfolioRecommendation,
  PortfolioFormSubmission,
  PortfolioDashboardStats,
  PortfolioPaginatedResponse,
  PortfolioNotification,
  PortfolioAIResult,
  PortfolioExport,
  PortfolioExportFormat,
  PortfolioDeployment,
  PortfolioQRCode,
  PortfolioQRCodeCreate,
} from "@/types/portfolio";

export const portfolioKeys = {
  all: ["portfolio"] as const,

  portfolios: () => [...portfolioKeys.all, "portfolios"] as const,
  portfolioLists: () => [...portfolioKeys.portfolios(), "list"] as const,
  portfolioList: (filters: Record<string, unknown>) => [...portfolioKeys.portfolioLists(), filters] as const,
  portfolioDetails: () => [...portfolioKeys.portfolios(), "detail"] as const,
  portfolioDetail: (id: string) => [...portfolioKeys.portfolioDetails(), id] as const,

  stats: () => [...portfolioKeys.all, "stats"] as const,

  templates: () => [...portfolioKeys.all, "templates"] as const,
  templateLists: () => [...portfolioKeys.templates(), "list"] as const,
  templateList: (filters: Record<string, unknown>) => [...portfolioKeys.templateLists(), filters] as const,
  templateDetails: () => [...portfolioKeys.templates(), "detail"] as const,
  templateDetail: (id: string) => [...portfolioKeys.templateDetails(), id] as const,

  themes: () => [...portfolioKeys.all, "themes"] as const,
  themeLists: () => [...portfolioKeys.themes(), "list"] as const,
  themeList: (filters: Record<string, unknown>) => [...portfolioKeys.themeLists(), filters] as const,
  themeDetails: () => [...portfolioKeys.themes(), "detail"] as const,
  themeDetail: (id: string) => [...portfolioKeys.themeDetails(), id] as const,

  sections: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "sections"] as const,
  projects: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "projects"] as const,
  projectDetail: (id: string) => [...portfolioKeys.all, "project", id] as const,
  assets: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "assets"] as const,
  versions: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "versions"] as const,
  shares: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "shares"] as const,
  tags: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "tags"] as const,
  analytics: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "analytics"] as const,
  seo: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "seo"] as const,
  history: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "history"] as const,
  recommendations: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "recommendations"] as const,
  contacts: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "contacts"] as const,
  formSubmissions: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "formSubmissions"] as const,
  testimonials: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "testimonials"] as const,
  publications: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "publications"] as const,
  awards: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "awards"] as const,
  certifications: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "certifications"] as const,
  timelines: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "timelines"] as const,
  deployments: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "deployments"] as const,
  qrCodes: (portfolioId: string) => [...portfolioKeys.portfolioDetail(portfolioId), "qrCodes"] as const,

  notifications: () => [...portfolioKeys.all, "notifications"] as const,
  notificationList: (filters: Record<string, unknown>) => [...portfolioKeys.notifications(), filters] as const,

  search: (params: Record<string, unknown>) => [...portfolioKeys.all, "search", params] as const,
};

// --- Portfolio Hooks ---

export function usePortfolios() {
  const filters = usePortfolioStore((s) => s.portfolioFilters);
  return useQuery({
    queryKey: portfolioKeys.portfolioList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<PortfolioPaginatedResponse<Portfolio>> => {
      const res = await portfolioApi.listPortfolios({
        page: filters.page,
        per_page: filters.perPage,
        status: filters.status || undefined,
        visibility: filters.visibility || undefined,
        search: filters.search || undefined,
      });
      return res.data.data!;
    },
  });
}

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: portfolioKeys.portfolioDetail(id),
    queryFn: async (): Promise<Portfolio> => {
      const res = await portfolioApi.getPortfolio(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreatePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PortfolioCreate) => {
      const res = await portfolioApi.createPortfolio(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function useUpdatePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioUpdate }) => {
      const res = await portfolioApi.updatePortfolio(id, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioDetail(variables.id) });
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function useDeletePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deletePortfolio(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function usePublishPortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await portfolioApi.publishPortfolio(id);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioDetail(variables) });
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function useUnpublishPortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await portfolioApi.unpublishPortfolio(id);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioDetail(variables) });
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function useArchivePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await portfolioApi.archivePortfolio(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function useClonePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title?: string }) => {
      const res = await portfolioApi.clonePortfolio(id, title ? { title } : undefined);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

export function usePortfolioStats() {
  return useQuery({
    queryKey: portfolioKeys.stats(),
    queryFn: async (): Promise<PortfolioDashboardStats> => {
      const res = await portfolioApi.getStats();
      return res.data.data!;
    },
  });
}

export function useBulkPortfolioAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { action: string; portfolio_ids: string[] }) => {
      const res = await portfolioApi.bulkAction(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioLists() });
    },
  });
}

// --- Template Hooks ---

export function usePortfolioTemplates() {
  const filters = usePortfolioStore((s) => s.templateFilters);
  return useQuery({
    queryKey: portfolioKeys.templateList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<PortfolioPaginatedResponse<PortfolioTemplate>> => {
      const res = await portfolioApi.listTemplates({
        page: filters.page,
        per_page: filters.perPage,
      });
      return res.data.data!;
    },
  });
}

export function usePortfolioTemplate(id: string) {
  return useQuery({
    queryKey: portfolioKeys.templateDetail(id),
    queryFn: async (): Promise<PortfolioTemplate> => {
      const res = await portfolioApi.getTemplate(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreatePortfolioTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PortfolioTemplateCreate) => {
      const res = await portfolioApi.createTemplate(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.templateLists() });
    },
  });
}

export function useUpdatePortfolioTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioTemplateUpdate }) => {
      const res = await portfolioApi.updateTemplate(id, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.templateDetail(variables.id) });
      qc.invalidateQueries({ queryKey: portfolioKeys.templateLists() });
    },
  });
}

export function useDeletePortfolioTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deleteTemplate(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.templateLists() });
    },
  });
}

// --- Theme Hooks ---

export function usePortfolioThemes() {
  const filters = usePortfolioStore((s) => s.themeFilters);
  return useQuery({
    queryKey: portfolioKeys.themeList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<PortfolioPaginatedResponse<PortfolioTheme>> => {
      const res = await portfolioApi.listThemes({
        page: filters.page,
        per_page: filters.perPage,
      });
      return res.data.data!;
    },
  });
}

export function usePortfolioTheme(id: string) {
  return useQuery({
    queryKey: portfolioKeys.themeDetail(id),
    queryFn: async (): Promise<PortfolioTheme> => {
      const res = await portfolioApi.getTheme(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreatePortfolioTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PortfolioThemeCreate) => {
      const res = await portfolioApi.createTheme(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.themeLists() });
    },
  });
}

export function useUpdatePortfolioTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioThemeUpdate }) => {
      const res = await portfolioApi.updateTheme(id, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.themeDetail(variables.id) });
      qc.invalidateQueries({ queryKey: portfolioKeys.themeLists() });
    },
  });
}

export function useDeletePortfolioTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deleteTheme(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.themeLists() });
    },
  });
}

// --- Section Hooks ---

export function usePortfolioSections(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.sections(portfolioId),
    queryFn: async (): Promise<PortfolioSection[]> => {
      const res = await portfolioApi.listSections(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioSectionCreate }) => {
      const res = await portfolioApi.createSection(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.sections(variables.portfolioId) });
    },
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioSectionUpdate }) => {
      const res = await portfolioApi.updateSection(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deleteSection(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- Project Hooks ---

export function usePortfolioProjects(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.projects(portfolioId),
    queryFn: async (): Promise<PortfolioProject[]> => {
      const res = await portfolioApi.listProjects(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioProjectCreate }) => {
      const res = await portfolioApi.createProject(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.projects(variables.portfolioId) });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioProjectUpdate }) => {
      const res = await portfolioApi.updateProject(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deleteProject(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- Asset Hooks ---

export function usePortfolioAssets(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.assets(portfolioId),
    queryFn: async (): Promise<PortfolioAsset[]> => {
      const res = await portfolioApi.listAssets(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioAssetCreate }) => {
      const res = await portfolioApi.createAsset(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.assets(variables.portfolioId) });
    },
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deleteAsset(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- Version Hooks ---

export function usePortfolioVersions(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.versions(portfolioId),
    queryFn: async (): Promise<PortfolioVersion[]> => {
      const res = await portfolioApi.listVersions(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, label }: { portfolioId: string; label?: string }) => {
      const res = await portfolioApi.createVersion(portfolioId, { label });
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.versions(variables.portfolioId) });
    },
  });
}

export function useRestoreVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, versionId }: { portfolioId: string; versionId: string }) => {
      const res = await portfolioApi.restoreVersion(portfolioId, versionId);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.portfolioDetail(variables.portfolioId) });
      qc.invalidateQueries({ queryKey: portfolioKeys.versions(variables.portfolioId) });
    },
  });
}

// --- Share Hooks ---

export function usePortfolioShares(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.shares(portfolioId),
    queryFn: async (): Promise<PortfolioShare[]> => {
      const res = await portfolioApi.listShares(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioShareCreate }) => {
      const res = await portfolioApi.createShare(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.shares(variables.portfolioId) });
    },
  });
}

export function useDeleteShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.deleteShare(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- Tag Hooks ---

export function usePortfolioTags(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.tags(portfolioId),
    queryFn: async (): Promise<PortfolioTag[]> => {
      const res = await portfolioApi.listTags(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useAddTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, tag }: { portfolioId: string; tag: string }) => {
      const res = await portfolioApi.addTag(portfolioId, { tag });
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.tags(variables.portfolioId) });
    },
  });
}

export function useRemoveTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.removeTag(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- SEO Hooks ---

export function usePortfolioSEO(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.seo(portfolioId),
    queryFn: async (): Promise<PortfolioSEO> => {
      const res = await portfolioApi.getSEO(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useUpdateSEO() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioSEOUpdate }) => {
      const res = await portfolioApi.updateSEO(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.seo(variables.portfolioId) });
    },
  });
}

// --- Analytics Hooks ---

export function usePortfolioAnalytics(portfolioId: string, params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: [...portfolioKeys.analytics(portfolioId), params],
    queryFn: async () => {
      const res = await portfolioApi.getAnalytics(portfolioId, params);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

// --- Recommendation Hooks ---

export function usePortfolioRecommendations(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.recommendations(portfolioId),
    queryFn: async (): Promise<PortfolioRecommendation[]> => {
      const res = await portfolioApi.listRecommendations(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useDismissRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await portfolioApi.dismissRecommendation(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- Notification Hooks ---

export function usePortfolioNotifications() {
  const filters = usePortfolioStore((s) => s.portfolioFilters);
  return useQuery({
    queryKey: portfolioKeys.notificationList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<PortfolioPaginatedResponse<PortfolioNotification>> => {
      const res = await portfolioApi.listNotifications({
        page: filters.page,
        per_page: filters.perPage,
      });
      return res.data.data!;
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await portfolioApi.markNotificationRead(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.notifications() });
    },
  });
}

// --- Form Submission Hooks ---

export function usePortfolioFormSubmissions(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.formSubmissions(portfolioId),
    queryFn: async (): Promise<PortfolioFormSubmission[]> => {
      const res = await portfolioApi.listFormSubmissions(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useMarkSubmissionRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await portfolioApi.markSubmissionRead(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

// --- Deployment Hooks ---

export function usePortfolioDeployments(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.deployments(portfolioId),
    queryFn: async (): Promise<PortfolioDeployment[]> => {
      const res = await portfolioApi.listDeployments(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useDeployPortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (portfolioId: string) => {
      const res = await portfolioApi.deployPortfolio(portfolioId);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.deployments(variables) });
    },
  });
}

// --- QR Code Hooks ---

export function usePortfolioQRCodes(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.qrCodes(portfolioId),
    queryFn: async (): Promise<PortfolioQRCode[]> => {
      const res = await portfolioApi.listQRCodes(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useGenerateQRCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data?: PortfolioQRCodeCreate }) => {
      const res = await portfolioApi.generateQRCode(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.qrCodes(variables.portfolioId) });
    },
  });
}

// --- Export Hooks ---

export function useExportPortfolio() {
  return useMutation({
    mutationFn: async ({ portfolioId, format, options }: { portfolioId: string; format: PortfolioExportFormat; options?: Record<string, unknown> }) => {
      const res = await portfolioApi.exportPortfolio(portfolioId, { format, options });
      return res.data.data!;
    },
  });
}

// --- AI Hooks ---

export function usePortfolioAIAssist() {
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: { request_type: string; prompt?: string } }) => {
      const res = await portfolioApi.aiAssist(portfolioId, data);
      return res.data.data!;
    },
  });
}

// --- Testimonial Hooks ---

export function usePortfolioTestimonials(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.testimonials(portfolioId),
    queryFn: async () => {
      const res = await portfolioApi.listTestimonials(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioTestimonialCreate }) => {
      const res = await portfolioApi.createTestimonial(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.testimonials(variables.portfolioId) });
    },
  });
}

// --- Publication Hooks ---

export function usePortfolioPublications(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.publications(portfolioId),
    queryFn: async () => {
      const res = await portfolioApi.listPublications(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreatePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioPublicationCreate }) => {
      const res = await portfolioApi.createPublication(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.publications(variables.portfolioId) });
    },
  });
}

// --- Award Hooks ---

export function usePortfolioAwards(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.awards(portfolioId),
    queryFn: async () => {
      const res = await portfolioApi.listAwards(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateAward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioAwardCreate }) => {
      const res = await portfolioApi.createAward(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.awards(variables.portfolioId) });
    },
  });
}

// --- Certification Hooks ---

export function usePortfolioCertifications(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.certifications(portfolioId),
    queryFn: async () => {
      const res = await portfolioApi.listCertifications(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioCertificationCreate }) => {
      const res = await portfolioApi.createCertification(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.certifications(variables.portfolioId) });
    },
  });
}

// --- Contact Hooks ---

export function usePortfolioContacts(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.contacts(portfolioId),
    queryFn: async () => {
      const res = await portfolioApi.listContacts(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, data }: { portfolioId: string; data: PortfolioContactCreate }) => {
      const res = await portfolioApi.createContact(portfolioId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.contacts(variables.portfolioId) });
    },
  });
}

// --- History Hooks ---

export function usePortfolioHistory(portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.history(portfolioId),
    queryFn: async () => {
      const res = await portfolioApi.listHistory(portfolioId);
      return res.data.data!;
    },
    enabled: !!portfolioId,
  });
}
