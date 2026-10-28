import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "@/lib/api-client";
import { useResumeStore } from "@/stores/resume.store";
import { toast } from "@/stores/toast.store";
import type {
  ResumeDetail,
  ResumeCreate,
  ResumeUpdate,
  ResumeVersion,
  ResumeSection,
  ResumeCustomization,
  ResumeTemplate,
  ResumeAnalytics,
  ResumeAnalyticsSummary,
  ResumeTag,
  ResumeCollection,
  ResumeShare,
  ResumeComment,
  ResumeExport,
  ResumeHistory,
  ResumeOptimization,
  ResumeFeedback,
  ResumeSearchRequest,
  ResumeBulkAction,
  ExportFormat,
} from "@/types/resume";

export const resumeKeys = {
  all: ["resumes"] as const,
  lists: () => [...resumeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...resumeKeys.lists(), params] as const,
  details: () => [...resumeKeys.all, "detail"] as const,
  detail: (id: string) => [...resumeKeys.details(), id] as const,
  versions: (id: string) => [...resumeKeys.detail(id), "versions"] as const,
  version: (id: string, vid: string) => [...resumeKeys.versions(id), vid] as const,
  sections: (id: string) => [...resumeKeys.detail(id), "sections"] as const,
  customizations: (id: string) => [...resumeKeys.detail(id), "customizations"] as const,
  templates: () => [...resumeKeys.all, "templates"] as const,
  template: (id: string) => [...resumeKeys.templates(), id] as const,
  analytics: (id: string) => [...resumeKeys.detail(id), "analytics"] as const,
  analyticsSummary: () => [...resumeKeys.all, "analyticsSummary"] as const,
  tags: (id: string) => [...resumeKeys.detail(id), "tags"] as const,
  collections: () => [...resumeKeys.all, "collections"] as const,
  collection: (id: string) => [...resumeKeys.collections(), id] as const,
  shares: (id: string) => [...resumeKeys.detail(id), "shares"] as const,
  comments: (id: string) => [...resumeKeys.detail(id), "comments"] as const,
  exports: (id: string) => [...resumeKeys.detail(id), "exports"] as const,
  history: (id: string) => [...resumeKeys.detail(id), "history"] as const,
  optimizations: (id: string) => [...resumeKeys.detail(id), "optimizations"] as const,
  feedback: (id: string) => [...resumeKeys.detail(id), "feedback"] as const,
  search: (params: Record<string, unknown>) => [...resumeKeys.all, "search", params] as const,
};

interface PaginationParams {
  page?: number;
  per_page?: number;
}

export function useResumes(params?: PaginationParams) {
  return useQuery({
    queryKey: resumeKeys.list(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await resumeApi.getResumes(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useResume(id: string) {
  const setActiveResumeId = useResumeStore((s) => s.setActiveResumeId);

  return useQuery<ResumeDetail>({
    queryKey: resumeKeys.detail(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResume(id);
      if (data?.data) setActiveResumeId(data.data.id);
      return data?.data as ResumeDetail;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResumeCreate) => resumeApi.createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume created");
    },
    onError: () => {
      toast.error("Failed to create resume");
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResumeUpdate }) =>
      resumeApi.updateResume(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume updated");
    },
    onError: () => {
      toast.error("Failed to update resume");
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const reset = useResumeStore((s) => s.reset);

  return useMutation({
    mutationFn: (id: string) => resumeApi.deleteResume(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: resumeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      reset();
      toast.success("Resume deleted");
    },
    onError: () => {
      toast.error("Failed to delete resume");
    },
  });
}

export function usePublishResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.publishResume(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume published");
    },
    onError: () => {
      toast.error("Failed to publish resume");
    },
  });
}

export function useArchiveResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.archiveResume(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume archived");
    },
    onError: () => {
      toast.error("Failed to archive resume");
    },
  });
}

export function useRestoreResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.restoreResume(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume restored");
    },
    onError: () => {
      toast.error("Failed to restore resume");
    },
  });
}

export function useForkResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.forkResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume forked");
    },
    onError: () => {
      toast.error("Failed to fork resume");
    },
  });
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.duplicateResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Resume duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate resume");
    },
  });
}

export function useSetDefaultResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.setDefaultResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Default resume set");
    },
    onError: () => {
      toast.error("Failed to set default resume");
    },
  });
}

export function useResumeVersions(id: string) {
  return useQuery<ResumeVersion[]>({
    queryKey: resumeKeys.versions(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeVersions(id);
      return (data?.data as ResumeVersion[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useResumeVersion(id: string, vid: string) {
  return useQuery<ResumeVersion>({
    queryKey: resumeKeys.version(id, vid),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeVersion(id, vid);
      return data?.data as ResumeVersion;
    },
    enabled: !!id && !!vid,
  });
}

export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; change_summary?: string } }) =>
      resumeApi.createVersion(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.versions(variables.id) });
      toast.success("Version created");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });
}

export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vid }: { id: string; vid: string }) =>
      resumeApi.restoreVersion(id, vid),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.versions(variables.id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
      toast.success("Version restored");
    },
    onError: () => {
      toast.error("Failed to restore version");
    },
  });
}

export function useCompareVersions() {
  return useMutation({
    mutationFn: ({ id, leftId, rightId }: { id: string; leftId: string; rightId: string }) =>
      resumeApi.compareVersions(id, leftId, rightId),
    onError: () => {
      toast.error("Failed to compare versions");
    },
  });
}

export function useResumeSections(id: string) {
  return useQuery<ResumeSection[]>({
    queryKey: resumeKeys.sections(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeSections(id);
      return (data?.data as ResumeSection[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      sectionId,
      data,
    }: {
      resumeId: string;
      sectionId: string;
      data: Partial<ResumeSection>;
    }) => resumeApi.updateSection(resumeId, sectionId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.sections(variables.resumeId) });
      toast.success("Section updated");
    },
    onError: () => {
      toast.error("Failed to update section");
    },
  });
}

export function useReorderSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      orderedIds,
    }: {
      resumeId: string;
      orderedIds: string[];
    }) => resumeApi.reorderSections(resumeId, orderedIds),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.sections(variables.resumeId) });
    },
    onError: () => {
      toast.error("Failed to reorder sections");
    },
  });
}

export function useBulkUpdateSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      updates,
    }: {
      resumeId: string;
      updates: Array<{ section_id: string; data: Partial<ResumeSection> }>;
    }) => resumeApi.bulkUpdateSections(resumeId, updates),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.sections(variables.resumeId) });
      toast.success("Sections updated");
    },
    onError: () => {
      toast.error("Failed to update sections");
    },
  });
}

export function useResumeCustomizations(id: string) {
  return useQuery<ResumeCustomization[]>({
    queryKey: resumeKeys.customizations(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeCustomizations(id);
      return (data?.data as ResumeCustomization[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCustomization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      data,
    }: {
      resumeId: string;
      data: Partial<ResumeCustomization>;
    }) => resumeApi.createCustomization(resumeId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.customizations(variables.resumeId),
      });
      toast.success("Customization added");
    },
    onError: () => {
      toast.error("Failed to add customization");
    },
  });
}

export function useUpdateCustomization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      customizationId,
      data,
    }: {
      resumeId: string;
      customizationId: string;
      data: Partial<ResumeCustomization>;
    }) => resumeApi.updateCustomization(resumeId, customizationId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.customizations(variables.resumeId),
      });
      toast.success("Customization updated");
    },
    onError: () => {
      toast.error("Failed to update customization");
    },
  });
}

export function useBulkCustomizations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      customizations,
    }: {
      resumeId: string;
      customizations: Partial<ResumeCustomization>[];
    }) => resumeApi.bulkCustomizations(resumeId, customizations),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.customizations(variables.resumeId),
      });
      toast.success("Customizations updated");
    },
    onError: () => {
      toast.error("Failed to update customizations");
    },
  });
}

export function useResumeTemplates(params?: Record<string, unknown>) {
  return useQuery<ResumeTemplate[]>({
    queryKey: [...resumeKeys.templates(), params],
    queryFn: async () => {
      const { data } = await resumeApi.getTemplates(params);
      return (data?.data as ResumeTemplate[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useResumeTemplate(id: string) {
  return useQuery<ResumeTemplate>({
    queryKey: resumeKeys.template(id),
    queryFn: async () => {
      const { data } = await resumeApi.getTemplate(id);
      return data?.data as ResumeTemplate;
    },
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ResumeTemplate>) => resumeApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.templates() });
      toast.success("Template created");
    },
    onError: () => {
      toast.error("Failed to create template");
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeTemplate> }) =>
      resumeApi.updateTemplate(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.template(variables.id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.templates() });
      toast.success("Template updated");
    },
    onError: () => {
      toast.error("Failed to update template");
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.templates() });
      toast.success("Template deleted");
    },
    onError: () => {
      toast.error("Failed to delete template");
    },
  });
}

export function useApplyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      templateId,
    }: {
      resumeId: string;
      templateId: string;
    }) => resumeApi.applyTemplate(resumeId, templateId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.resumeId) });
      toast.success("Template applied");
    },
    onError: () => {
      toast.error("Failed to apply template");
    },
  });
}

export function useResumeAnalytics(id: string) {
  return useQuery<ResumeAnalytics>({
    queryKey: resumeKeys.analytics(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeAnalytics(id);
      return data?.data as ResumeAnalytics;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useResumeAnalyticsSummary() {
  return useQuery<ResumeAnalyticsSummary>({
    queryKey: resumeKeys.analyticsSummary(),
    queryFn: async () => {
      const { data } = await resumeApi.getAnalyticsSummary();
      return data?.data as ResumeAnalyticsSummary;
    },
    staleTime: 60 * 1000,
  });
}

export function useRecordView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.recordView(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.analytics(id) });
    },
  });
}

export function useRecordDownload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.recordDownload(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.analytics(id) });
    },
  });
}

export function useRecordShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.recordShare(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.analytics(id) });
    },
  });
}

export function useResumeTags(id: string) {
  return useQuery<ResumeTag[]>({
    queryKey: resumeKeys.tags(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeTags(id);
      return (data?.data as ResumeTag[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      tags,
    }: {
      resumeId: string;
      tags: Array<{ name: string; color?: string }>;
    }) => resumeApi.addTags(resumeId, tags),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.tags(variables.resumeId) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.resumeId) });
      toast.success("Tags added");
    },
    onError: () => {
      toast.error("Failed to add tags");
    },
  });
}

export function useRemoveTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      tagId,
    }: {
      resumeId: string;
      tagId: string;
    }) => resumeApi.removeTag(resumeId, tagId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.tags(variables.resumeId) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.resumeId) });
      toast.success("Tag removed");
    },
    onError: () => {
      toast.error("Failed to remove tag");
    },
  });
}

export function useResumeCollections() {
  return useQuery<ResumeCollection[]>({
    queryKey: resumeKeys.collections(),
    queryFn: async () => {
      const { data } = await resumeApi.getCollections();
      return (data?.data as ResumeCollection[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useResumeCollection(id: string) {
  return useQuery<ResumeCollection>({
    queryKey: resumeKeys.collection(id),
    queryFn: async () => {
      const { data } = await resumeApi.getCollection(id);
      return data?.data as ResumeCollection;
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      resumeApi.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.collections() });
      toast.success("Collection created");
    },
    onError: () => {
      toast.error("Failed to create collection");
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string };
    }) => resumeApi.updateCollection(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.collection(variables.id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.collections() });
      toast.success("Collection updated");
    },
    onError: () => {
      toast.error("Failed to update collection");
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.collections() });
      toast.success("Collection deleted");
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });
}

export function useAddToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      resumeId,
    }: {
      collectionId: string;
      resumeId: string;
    }) => resumeApi.addToCollection(collectionId, resumeId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.collection(variables.collectionId),
      });
      toast.success("Resume added to collection");
    },
    onError: () => {
      toast.error("Failed to add resume to collection");
    },
  });
}

export function useRemoveFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      resumeId,
    }: {
      collectionId: string;
      resumeId: string;
    }) => resumeApi.removeFromCollection(collectionId, resumeId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.collection(variables.collectionId),
      });
      toast.success("Resume removed from collection");
    },
    onError: () => {
      toast.error("Failed to remove resume from collection");
    },
  });
}

export function useResumeShares(id: string) {
  return useQuery<ResumeShare[]>({
    queryKey: resumeKeys.shares(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeShares(id);
      return (data?.data as ResumeShare[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      data,
    }: {
      resumeId: string;
      data: {
        shared_with?: string;
        permission: "view" | "comment" | "edit";
        expires_at?: string;
      };
    }) => resumeApi.createShare(resumeId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.shares(variables.resumeId) });
      toast.success("Share created");
    },
    onError: () => {
      toast.error("Failed to create share");
    },
  });
}

export function useRevokeShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      shareId,
    }: {
      resumeId: string;
      shareId: string;
    }) => resumeApi.revokeShare(resumeId, shareId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.shares(variables.resumeId) });
      toast.success("Share revoked");
    },
    onError: () => {
      toast.error("Failed to revoke share");
    },
  });
}

export function useGeneratePublicLink() {
  return useMutation({
    mutationFn: ({
      resumeId,
      expiresAt,
    }: {
      resumeId: string;
      expiresAt?: string;
    }) => resumeApi.generatePublicLink(resumeId, expiresAt),
    onSuccess: () => {
      toast.success("Public link generated");
    },
    onError: () => {
      toast.error("Failed to generate public link");
    },
  });
}

export function useResumeComments(id: string) {
  return useQuery<ResumeComment[]>({
    queryKey: resumeKeys.comments(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeComments(id);
      return (data?.data as ResumeComment[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      data,
    }: {
      resumeId: string;
      data: {
        content: string;
        section_type?: string;
        entity_type?: string;
        entity_id?: string;
        parent_comment_id?: string;
        position?: { x: number; y: number };
      };
    }) => resumeApi.addComment(resumeId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.comments(variables.resumeId),
      });
      toast.success("Comment added");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      commentId,
      data,
    }: {
      resumeId: string;
      commentId: string;
      data: { content: string };
    }) => resumeApi.updateComment(resumeId, commentId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.comments(variables.resumeId),
      });
      toast.success("Comment updated");
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      commentId,
    }: {
      resumeId: string;
      commentId: string;
    }) => resumeApi.deleteComment(resumeId, commentId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.comments(variables.resumeId),
      });
      toast.success("Comment deleted");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
}

export function useResolveComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      commentId,
    }: {
      resumeId: string;
      commentId: string;
    }) => resumeApi.resolveComment(resumeId, commentId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.comments(variables.resumeId),
      });
      toast.success("Comment resolved");
    },
    onError: () => {
      toast.error("Failed to resolve comment");
    },
  });
}

export function useExportResume() {
  return useMutation({
    mutationFn: ({
      resumeId,
      format,
      settings,
      versionId,
    }: {
      resumeId: string;
      format: ExportFormat;
      settings?: Record<string, unknown>;
      versionId?: string;
    }) => resumeApi.exportResume(resumeId, format, settings, versionId),
    onSuccess: () => {
      toast.success("Export started");
    },
    onError: () => {
      toast.error("Failed to start export");
    },
  });
}

export function useResumeExports(id: string) {
  return useQuery<ResumeExport[]>({
    queryKey: resumeKeys.exports(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeExports(id);
      return (data?.data as ResumeExport[]) ?? [];
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchInterval: (query) => {
      const exports = query.state.data;
      const hasInProgress = exports?.some(
        (e) => e.status === "pending" || e.status === "processing"
      );
      return hasInProgress ? 3000 : false;
    },
  });
}

export function useResumeHistory(id: string) {
  return useQuery<ResumeHistory[]>({
    queryKey: resumeKeys.history(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeHistory(id);
      return (data?.data as ResumeHistory[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useResumeOptimizations(id: string) {
  return useQuery<ResumeOptimization[]>({
    queryKey: resumeKeys.optimizations(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeOptimizations(id);
      return (data?.data as ResumeOptimization[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAcceptOptimization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      optimizationId,
    }: {
      resumeId: string;
      optimizationId: string;
    }) => resumeApi.acceptOptimization(resumeId, optimizationId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.optimizations(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.resumeId),
      });
      toast.success("Optimization accepted");
    },
    onError: () => {
      toast.error("Failed to accept optimization");
    },
  });
}

export function useRejectOptimization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      optimizationId,
    }: {
      resumeId: string;
      optimizationId: string;
    }) => resumeApi.rejectOptimization(resumeId, optimizationId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.optimizations(variables.resumeId),
      });
      toast.success("Optimization rejected");
    },
    onError: () => {
      toast.error("Failed to reject optimization");
    },
  });
}

export function useApplyOptimization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      optimizationId,
    }: {
      resumeId: string;
      optimizationId: string;
    }) => resumeApi.applyOptimization(resumeId, optimizationId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.optimizations(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(variables.resumeId),
      });
      toast.success("Optimization applied");
    },
    onError: () => {
      toast.error("Failed to apply optimization");
    },
  });
}

export function useResumeFeedback(id: string) {
  return useQuery<ResumeFeedback[]>({
    queryKey: resumeKeys.feedback(id),
    queryFn: async () => {
      const { data } = await resumeApi.getResumeFeedback(id);
      return (data?.data as ResumeFeedback[]) ?? [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resumeId,
      data,
    }: {
      resumeId: string;
      data: {
        feedback_type: "rating" | "comment" | "suggestion" | "issue";
        rating?: number;
        content?: string;
        section_type?: string;
        entity_type?: string;
        entity_id?: string;
      };
    }) => resumeApi.submitFeedback(resumeId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: resumeKeys.feedback(variables.resumeId),
      });
      toast.success("Feedback submitted");
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });
}

export function useResumeSearch(params: ResumeSearchRequest) {
  return useQuery({
    queryKey: resumeKeys.search(params as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await resumeApi.searchResumes(params);
      return data;
    },
    enabled: !!(params.query && params.query.length >= 2),
    staleTime: 30 * 1000,
  });
}

export function useBulkResumeAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResumeBulkAction) => resumeApi.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      toast.success("Bulk action completed");
    },
    onError: () => {
      toast.error("Failed to perform bulk action");
    },
  });
}
