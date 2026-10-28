import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/lib/api-client";
import { useJobStore } from "@/stores/job.store";
import { useJobSearchStore } from "@/stores/job-search.store";
import { useJobImportStore } from "@/stores/job-import.store";
import { useJobCollectionStore } from "@/stores/job-collection.store";
import { useJobAnalysisStore } from "@/stores/job-analysis.store";
import { toast } from "@/stores/toast.store";
import type {
  JobDetail,
  JobCreate,
  JobUpdate,
  JobSearchRequest,
  JobImportRequest,
  JobBulkAction,
  JobVersion,
  JobRequirement,
  RequiredSkill,
  Responsibility,
  Qualification,
  Benefit,
  JobCompensation,
  JobLocation,
  JobTag,
  HiringManager,
  ApplicationMethod,
  ApplicationQuestion,
  JobAnalysis,
  JobScore,
  JobGap,
  JobRecommendation,
  JobCollection,
} from "@/types/job";

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  search: (params: Record<string, unknown>) => [...jobKeys.all, "search", params] as const,
  searchStats: (params?: Record<string, unknown>) => [...jobKeys.all, "searchStats", params] as const,
  saved: () => [...jobKeys.all, "saved"] as const,
  favorites: () => [...jobKeys.all, "favorites"] as const,
  versions: (id: string) => [...jobKeys.detail(id), "versions"] as const,
  requirements: (id: string) => [...jobKeys.detail(id), "requirements"] as const,
  skills: (id: string) => [...jobKeys.detail(id), "skills"] as const,
  responsibilities: (id: string) => [...jobKeys.detail(id), "responsibilities"] as const,
  qualifications: (id: string) => [...jobKeys.detail(id), "qualifications"] as const,
  benefits: (id: string) => [...jobKeys.detail(id), "benefits"] as const,
  compensation: (id: string) => [...jobKeys.detail(id), "compensation"] as const,
  location: (id: string) => [...jobKeys.detail(id), "location"] as const,
  tags: (id: string) => [...jobKeys.detail(id), "tags"] as const,
  keywords: (id: string) => [...jobKeys.detail(id), "keywords"] as const,
  hiringManagers: (id: string) => [...jobKeys.detail(id), "hiringManagers"] as const,
  applicationMethods: (id: string) => [...jobKeys.detail(id), "applicationMethods"] as const,
  applicationQuestions: (id: string) => [...jobKeys.detail(id), "applicationQuestions"] as const,
  analyses: (id: string) => [...jobKeys.detail(id), "analyses"] as const,
  analysis: (id: string, analysisId: string) => [...jobKeys.analyses(id), analysisId] as const,
  scores: (id: string) => [...jobKeys.detail(id), "scores"] as const,
  gaps: (id: string) => [...jobKeys.detail(id), "gaps"] as const,
  recommendations: (id: string) => [...jobKeys.detail(id), "recommendations"] as const,
  collections: () => [...jobKeys.all, "collections"] as const,
  collection: (id: string) => [...jobKeys.collections(), id] as const,
  imports: () => [...jobKeys.all, "imports"] as const,
  import: (id: string) => [...jobKeys.imports(), id] as const,
  sources: () => [...jobKeys.all, "sources"] as const,
};

interface PaginationParams {
  page?: number;
  per_page?: number;
}

export function useJobs(params?: PaginationParams) {
  return useQuery({
    queryKey: jobKeys.list(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await jobApi.getJobs(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useJob(id: string) {
  const setActiveJob = useJobStore((s) => s.setActiveJob);

  return useQuery<JobDetail>({
    queryKey: jobKeys.detail(id),
    queryFn: async () => {
      const { data } = await jobApi.getJob(id);
      if (data?.data) setActiveJob(data.data);
      return data?.data as JobDetail;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobCreate) => jobApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job created");
    },
    onError: () => {
      toast.error("Failed to create job");
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: JobUpdate }) =>
      jobApi.updateJob(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job updated");
    },
    onError: () => {
      toast.error("Failed to update job");
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const reset = useJobStore((s) => s.reset);

  return useMutation({
    mutationFn: (id: string) => jobApi.deleteJob(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      reset();
      toast.success("Job deleted");
    },
    onError: () => {
      toast.error("Failed to delete job");
    },
  });
}

export function useCloseJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.closeJob(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job closed");
    },
    onError: () => {
      toast.error("Failed to close job");
    },
  });
}

export function useDuplicateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.duplicateJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate job");
    },
  });
}

export function useSearchJobs() {
  const queryClient = useQueryClient();
  const setResults = useJobSearchStore((s) => s.setResults);
  const setTotal = useJobSearchStore((s) => s.setTotal);
  const setIsLoading = useJobSearchStore((s) => s.setIsLoading);
  const setHasSearched = useJobSearchStore((s) => s.setHasSearched);

  return useMutation({
    mutationFn: (params: JobSearchRequest) => jobApi.searchJobs(params),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (response) => {
      const results = response.data?.data ?? [];
      setResults(results);
      setTotal(results.length);
      setHasSearched(true);
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: jobKeys.searchStats() });
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Search failed");
    },
  });
}

export function useJobSearchStats(params?: JobSearchRequest) {
  return useQuery({
    queryKey: jobKeys.searchStats(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await jobApi.getSearchStats(params);
      return data?.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useBulkJobAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobBulkAction) => jobApi.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.saved() });
      queryClient.invalidateQueries({ queryKey: jobKeys.favorites() });
      toast.success("Bulk action completed");
    },
    onError: () => {
      toast.error("Bulk action failed");
    },
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      jobApi.saveJob(id, notes),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.saved() });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job saved");
    },
    onError: () => {
      toast.error("Failed to save job");
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.unsaveJob(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.saved() });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job unsaved");
    },
    onError: () => {
      toast.error("Failed to unsave job");
    },
  });
}

export function useSavedJobs(params?: PaginationParams) {
  return useQuery({
    queryKey: jobKeys.saved(),
    queryFn: async () => {
      const { data } = await jobApi.getSavedJobs(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFavoriteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.favoriteJob(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job favorited");
    },
    onError: () => {
      toast.error("Failed to favorite job");
    },
  });
}

export function useUnfavoriteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.unfavoriteJob(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      toast.success("Job unfavorited");
    },
    onError: () => {
      toast.error("Failed to unfavorite job");
    },
  });
}

export function useFavoriteJobs(params?: PaginationParams) {
  return useQuery({
    queryKey: jobKeys.favorites(),
    queryFn: async () => {
      const { data } = await jobApi.getFavoriteJobs(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useImportJob() {
  const queryClient = useQueryClient();
  const setStatus = useJobImportStore((s) => s.setStatus);
  const addImportedJob = useJobImportStore((s) => s.addImportedJob);
  const addError = useJobImportStore((s) => s.addError);

  return useMutation({
    mutationFn: (data: JobImportRequest) => jobApi.importJob(data),
    onMutate: () => {
      setStatus("processing");
    },
    onSuccess: (response) => {
      const job = response.data?.data;
      if (job) {
        addImportedJob(job);
        setStatus("completed");
        queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
        toast.success("Job imported");
      }
    },
    onError: (error: Error) => {
      setStatus("failed");
      addError(error.message);
      toast.error("Failed to import job");
    },
  });
}

export function useImportRecords(params?: PaginationParams) {
  return useQuery({
    queryKey: jobKeys.imports(),
    queryFn: async () => {
      const { data } = await jobApi.getImportRecords(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useImportRecord(id: string) {
  const setActiveRecord = useJobImportStore((s) => s.setActiveRecord);

  return useQuery({
    queryKey: jobKeys.import(id),
    queryFn: async () => {
      const { data } = await jobApi.getImportRecord(id);
      if (data?.data) setActiveRecord(data.data);
      return data?.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useJobVersions(id: string) {
  return useQuery({
    queryKey: jobKeys.versions(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobVersions(id);
      return data?.data as JobVersion[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateJobVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { change_summary?: string } }) =>
      jobApi.createJobVersion(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.versions(variables.id) });
      toast.success("Version created");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });
}

export function useRestoreJobVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, versionId }: { id: string; versionId: string }) =>
      jobApi.restoreJobVersion(id, versionId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.versions(variables.id) });
      toast.success("Version restored");
    },
    onError: () => {
      toast.error("Failed to restore version");
    },
  });
}

export function useJobRequirements(id: string) {
  return useQuery({
    queryKey: jobKeys.requirements(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobRequirements(id);
      return data?.data as JobRequirement[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobRequirement> }) =>
      jobApi.addJobRequirement(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.requirements(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      toast.success("Requirement added");
    },
    onError: () => {
      toast.error("Failed to add requirement");
    },
  });
}

export function useUpdateJobRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reqId, data }: { id: string; reqId: string; data: Partial<JobRequirement> }) =>
      jobApi.updateJobRequirement(id, reqId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.requirements(variables.id) });
      toast.success("Requirement updated");
    },
    onError: () => {
      toast.error("Failed to update requirement");
    },
  });
}

export function useDeleteJobRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reqId }: { id: string; reqId: string }) =>
      jobApi.deleteJobRequirement(id, reqId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.requirements(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      toast.success("Requirement deleted");
    },
    onError: () => {
      toast.error("Failed to delete requirement");
    },
  });
}

export function useJobSkills(id: string) {
  return useQuery({
    queryKey: jobKeys.skills(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobSkills(id);
      return data?.data as RequiredSkill[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RequiredSkill> }) =>
      jobApi.addJobSkill(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.skills(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      toast.success("Skill added");
    },
    onError: () => {
      toast.error("Failed to add skill");
    },
  });
}

export function useDeleteJobSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skillId }: { id: string; skillId: string }) =>
      jobApi.deleteJobSkill(id, skillId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.skills(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      toast.success("Skill removed");
    },
    onError: () => {
      toast.error("Failed to remove skill");
    },
  });
}

export function useJobResponsibilities(id: string) {
  return useQuery({
    queryKey: jobKeys.responsibilities(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobResponsibilities(id);
      return data?.data as Responsibility[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobResponsibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Responsibility> }) =>
      jobApi.addJobResponsibility(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.responsibilities(variables.id) });
      toast.success("Responsibility added");
    },
    onError: () => {
      toast.error("Failed to add responsibility");
    },
  });
}

export function useDeleteJobResponsibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, respId }: { id: string; respId: string }) =>
      jobApi.deleteJobResponsibility(id, respId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.responsibilities(variables.id) });
      toast.success("Responsibility deleted");
    },
    onError: () => {
      toast.error("Failed to delete responsibility");
    },
  });
}

export function useJobQualifications(id: string) {
  return useQuery({
    queryKey: jobKeys.qualifications(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobQualifications(id);
      return data?.data as Qualification[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Qualification> }) =>
      jobApi.addJobQualification(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.qualifications(variables.id) });
      toast.success("Qualification added");
    },
    onError: () => {
      toast.error("Failed to add qualification");
    },
  });
}

export function useDeleteJobQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, qualId }: { id: string; qualId: string }) =>
      jobApi.deleteJobQualification(id, qualId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.qualifications(variables.id) });
      toast.success("Qualification deleted");
    },
    onError: () => {
      toast.error("Failed to delete qualification");
    },
  });
}

export function useJobBenefits(id: string) {
  return useQuery({
    queryKey: jobKeys.benefits(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobBenefits(id);
      return data?.data as Benefit[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobBenefit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Benefit> }) =>
      jobApi.addJobBenefit(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.benefits(variables.id) });
      toast.success("Benefit added");
    },
    onError: () => {
      toast.error("Failed to add benefit");
    },
  });
}

export function useDeleteJobBenefit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, benefitId }: { id: string; benefitId: string }) =>
      jobApi.deleteJobBenefit(id, benefitId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.benefits(variables.id) });
      toast.success("Benefit deleted");
    },
    onError: () => {
      toast.error("Failed to delete benefit");
    },
  });
}

export function useJobCompensation(id: string) {
  return useQuery({
    queryKey: jobKeys.compensation(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobCompensation(id);
      return data?.data as JobCompensation | null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertJobCompensation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobCompensation> }) =>
      jobApi.upsertJobCompensation(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.compensation(variables.id) });
      toast.success("Compensation updated");
    },
    onError: () => {
      toast.error("Failed to update compensation");
    },
  });
}

export function useJobLocation(id: string) {
  return useQuery({
    queryKey: jobKeys.location(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobLocation(id);
      return data?.data as JobLocation | null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertJobLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobLocation> }) =>
      jobApi.upsertJobLocation(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.location(variables.id) });
      toast.success("Location updated");
    },
    onError: () => {
      toast.error("Failed to update location");
    },
  });
}

export function useJobTags(id: string) {
  return useQuery({
    queryKey: jobKeys.tags(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobTags(id);
      return data?.data as JobTag[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: Array<{ name: string; color?: string }> }) =>
      jobApi.addJobTags(id, tags),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.tags(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      toast.success("Tags added");
    },
    onError: () => {
      toast.error("Failed to add tags");
    },
  });
}

export function useRemoveJobTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagId }: { id: string; tagId: string }) =>
      jobApi.removeJobTag(id, tagId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.tags(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      toast.success("Tag removed");
    },
    onError: () => {
      toast.error("Failed to remove tag");
    },
  });
}

export function useJobKeywords(id: string) {
  return useQuery({
    queryKey: jobKeys.keywords(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobKeywords(id);
      return data?.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobHiringManagers(id: string) {
  return useQuery({
    queryKey: jobKeys.hiringManagers(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobHiringManagers(id);
      return data?.data as HiringManager[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobHiringManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HiringManager> }) =>
      jobApi.addJobHiringManager(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.hiringManagers(variables.id) });
      toast.success("Hiring manager added");
    },
    onError: () => {
      toast.error("Failed to add hiring manager");
    },
  });
}

export function useDeleteJobHiringManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, managerId }: { id: string; managerId: string }) =>
      jobApi.deleteJobHiringManager(id, managerId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.hiringManagers(variables.id) });
      toast.success("Hiring manager removed");
    },
    onError: () => {
      toast.error("Failed to remove hiring manager");
    },
  });
}

export function useJobApplicationMethods(id: string) {
  return useQuery({
    queryKey: jobKeys.applicationMethods(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobApplicationMethods(id);
      return data?.data as ApplicationMethod[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddJobApplicationMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApplicationMethod> }) =>
      jobApi.addJobApplicationMethod(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.applicationMethods(variables.id) });
      toast.success("Application method added");
    },
    onError: () => {
      toast.error("Failed to add application method");
    },
  });
}

export function useDeleteJobApplicationMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, methodId }: { id: string; methodId: string }) =>
      jobApi.deleteJobApplicationMethod(id, methodId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.applicationMethods(variables.id) });
      toast.success("Application method removed");
    },
    onError: () => {
      toast.error("Failed to remove application method");
    },
  });
}

export function useJobApplicationQuestions(id: string) {
  return useQuery({
    queryKey: jobKeys.applicationQuestions(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobApplicationQuestions(id);
      return data?.data as ApplicationQuestion[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobAnalyses(id: string) {
  const setAnalyses = useJobAnalysisStore((s) => s.setAnalyses);

  return useQuery({
    queryKey: jobKeys.analyses(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobAnalyses(id);
      const analyses = data?.data as JobAnalysis[];
      setAnalyses(analyses);
      return analyses;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobAnalysisDetail(id: string, analysisId: string) {
  return useQuery({
    queryKey: jobKeys.analysis(id, analysisId),
    queryFn: async () => {
      const { data } = await jobApi.getJobAnalysis(id, analysisId);
      return data?.data as JobAnalysis;
    },
    enabled: !!id && !!analysisId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRunJobAnalysis() {
  const queryClient = useQueryClient();
  const setIsAnalyzing = useJobAnalysisStore((s) => s.setIsAnalyzing);
  const addAnalysis = useJobAnalysisStore((s) => s.addAnalysis);

  return useMutation({
    mutationFn: ({ id, analysisType }: { id: string; analysisType: string }) =>
      jobApi.runJobAnalysis(id, analysisType),
    onMutate: () => {
      setIsAnalyzing(true);
    },
    onSuccess: (response) => {
      const analysis = response.data?.data;
      if (analysis) addAnalysis(analysis);
      setIsAnalyzing(false);
      queryClient.invalidateQueries({ queryKey: jobKeys.analyses(analysis?.job_id ?? "") });
      toast.success("Analysis started");
    },
    onError: () => {
      setIsAnalyzing(false);
      toast.error("Failed to start analysis");
    },
  });
}

export function useJobScores(id: string) {
  const setScores = useJobAnalysisStore((s) => s.setScores);

  return useQuery({
    queryKey: jobKeys.scores(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobScores(id);
      const scores = data?.data as JobScore[];
      setScores(scores);
      return scores;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobGaps(id: string) {
  const setGaps = useJobAnalysisStore((s) => s.setGaps);

  return useQuery({
    queryKey: jobKeys.gaps(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobGaps(id);
      const gaps = data?.data as JobGap[];
      setGaps(gaps);
      return gaps;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobRecommendations(id: string) {
  const setRecommendations = useJobAnalysisStore((s) => s.setRecommendations);

  return useQuery({
    queryKey: jobKeys.recommendations(id),
    queryFn: async () => {
      const { data } = await jobApi.getJobRecommendations(id);
      const recs = data?.data as JobRecommendation[];
      setRecommendations(recs);
      return recs;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDismissJobRecommendation() {
  const queryClient = useQueryClient();
  const dismissRecommendation = useJobAnalysisStore((s) => s.dismissRecommendation);

  return useMutation({
    mutationFn: ({ id, recId }: { id: string; recId: string }) =>
      jobApi.dismissJobRecommendation(id, recId),
    onSuccess: (_response, variables) => {
      dismissRecommendation(variables.recId);
      queryClient.invalidateQueries({ queryKey: jobKeys.recommendations(variables.id) });
      toast.success("Recommendation dismissed");
    },
    onError: () => {
      toast.error("Failed to dismiss recommendation");
    },
  });
}

export function useReadJobRecommendation() {
  const queryClient = useQueryClient();
  const markRecommendationRead = useJobAnalysisStore((s) => s.markRecommendationRead);

  return useMutation({
    mutationFn: ({ id, recId }: { id: string; recId: string }) =>
      jobApi.readJobRecommendation(id, recId),
    onSuccess: (_response, variables) => {
      markRecommendationRead(variables.recId);
      queryClient.invalidateQueries({ queryKey: jobKeys.recommendations(variables.id) });
    },
    onError: () => {
      toast.error("Failed to mark recommendation as read");
    },
  });
}

export function useJobCollections() {
  return useQuery({
    queryKey: jobKeys.collections(),
    queryFn: async () => {
      const { data } = await jobApi.getCollections();
      return data?.data as JobCollection[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobCollection(id: string) {
  const setActiveCollection = useJobCollectionStore((s) => s.setActiveCollection);

  return useQuery({
    queryKey: jobKeys.collection(id),
    queryFn: async () => {
      const { data } = await jobApi.getCollection(id);
      if (data?.data) setActiveCollection(data.data);
      return data?.data as JobCollection;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateJobCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      jobApi.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.collections() });
      toast.success("Collection created");
    },
    onError: () => {
      toast.error("Failed to create collection");
    },
  });
}

export function useUpdateJobCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      jobApi.updateCollection(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.collection(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.collections() });
      toast.success("Collection updated");
    },
    onError: () => {
      toast.error("Failed to update collection");
    },
  });
}

export function useDeleteJobCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.collections() });
      toast.success("Collection deleted");
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });
}

export function useAddToJobCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, jobId, notes }: { collectionId: string; jobId: string; notes?: string }) =>
      jobApi.addToCollection(collectionId, jobId, notes),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.collection(variables.collectionId) });
      toast.success("Job added to collection");
    },
    onError: () => {
      toast.error("Failed to add job to collection");
    },
  });
}

export function useRemoveFromJobCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, jobId }: { collectionId: string; jobId: string }) =>
      jobApi.removeFromCollection(collectionId, jobId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.collection(variables.collectionId) });
      toast.success("Job removed from collection");
    },
    onError: () => {
      toast.error("Failed to remove job from collection");
    },
  });
}

export function useJobSources() {
  return useQuery({
    queryKey: jobKeys.sources(),
    queryFn: async () => {
      const { data } = await jobApi.getJobSources();
      return data?.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}
