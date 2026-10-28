import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { atsApi } from "@/lib/api-client";
import { useATSStore } from "@/stores/ats.store";
import { toast } from "@/stores/toast.store";
import type {
  ATSAnalysis,
  ATSAnalysisDetail,
  ATSAnalysisCreate,
  ATSAnalysisUpdate,
  ATSAnalysisSearchRequest,
  ATSAnalysisStats,
  ATSConfiguration,
  ATSConfigurationCreate,
  ATSConfigurationUpdate,
  ATSRuleSet,
  ATSRuleSetCreate,
  ATSRuleSetUpdate,
  ATSRule,
  ATSRuleCreate,
  ATSRuleUpdate,
  ATSRuleCategory,
  ATSRuleCategoryCreate,
  ATSRuleCategoryUpdate,
  ATSVersion,
  ATSComparison,
  ATSComparisonCreate,
  ATSHistory,
  ATSBenchmark,
  ATSReport,
  ATSReportCreate,
  ATSScan,
  ATSScanCreate,
  ATSBulkAction,
} from "@/types/ats";

export const atsKeys = {
  all: ["ats"] as const,
  analyses: () => [...atsKeys.all, "analyses"] as const,
  analysis: (id: string) => [...atsKeys.analyses(), id] as const,
  analysisVersions: (id: string) => [...atsKeys.analysis(id), "versions"] as const,
  analysisVersion: (id: string, vid: string) => [...atsKeys.analysisVersions(id), vid] as const,
  analysisComparisons: (id: string) => [...atsKeys.analysis(id), "comparisons"] as const,
  analysisComparison: (id: string, cid: string) => [...atsKeys.analysisComparisons(id), cid] as const,
  analysisHistory: (id: string) => [...atsKeys.analysis(id), "history"] as const,
  analysisReports: (id: string) => [...atsKeys.analysis(id), "reports"] as const,
  analysisReport: (id: string, rid: string) => [...atsKeys.analysisReports(id), rid] as const,
  analysisScans: (id: string) => [...atsKeys.analysis(id), "scans"] as const,
  analysisBenchmarks: (id: string) => [...atsKeys.analysis(id), "benchmarks"] as const,
  analysisStats: () => [...atsKeys.analyses(), "stats"] as const,
  search: (params: Record<string, unknown>) => [...atsKeys.analyses(), "search", params] as const,
  configurations: () => [...atsKeys.all, "configurations"] as const,
  configuration: (id: string) => [...atsKeys.configurations(), id] as const,
  ruleSets: () => [...atsKeys.all, "ruleSets"] as const,
  ruleSet: (id: string) => [...atsKeys.ruleSets(), id] as const,
  rules: () => [...atsKeys.all, "rules"] as const,
  rule: (id: string) => [...atsKeys.rules(), id] as const,
  ruleCategories: () => [...atsKeys.all, "ruleCategories"] as const,
};

// --- Analyses ---
export function useATSAnalyses(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: atsKeys.analyses(),
    queryFn: async () => {
      const { data } = await atsApi.getAnalyses(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useATSAnalysis(id: string) {
  const setActiveAnalysis = useATSStore((s) => s.setActiveAnalysis);
  const setActiveAnalysisId = useATSStore((s) => s.setActiveAnalysisId);

  return useQuery<ATSAnalysisDetail>({
    queryKey: atsKeys.analysis(id),
    queryFn: async () => {
      const { data } = await atsApi.getAnalysis(id);
      const analysis = data?.data as ATSAnalysisDetail;
      if (analysis) {
        setActiveAnalysis(analysis);
        setActiveAnalysisId(analysis.id);
      }
      return analysis;
    },
    enabled: !!id,
  });
}

export function useCreateATSAnalysis() {
  const queryClient = useQueryClient();
  const addAnalysis = useATSStore((s) => s.addAnalysis);

  return useMutation({
    mutationFn: async (data: ATSAnalysisCreate) => {
      const { data: res } = await atsApi.createAnalysis(data);
      return res.data as ATSAnalysis;
    },
    onSuccess: (analysis) => {
      addAnalysis(analysis);
      queryClient.invalidateQueries({ queryKey: atsKeys.analyses() });
      toast.success("ATS analysis created");
    },
  });
}

export function useUpdateATSAnalysis(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSAnalysisUpdate) => {
      const { data: res } = await atsApi.updateAnalysis(id, data);
      return res.data as ATSAnalysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analysis(id) });
      queryClient.invalidateQueries({ queryKey: atsKeys.analyses() });
      toast.success("Analysis updated");
    },
  });
}

export function useDeleteATSAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await atsApi.deleteAnalysis(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analyses() });
      toast.success("Analysis deleted");
    },
  });
}

export function useRunATSAnalysis() {
  const queryClient = useQueryClient();
  const setIsAnalyzing = useATSStore((s) => s.setIsAnalyzing);

  return useMutation({
    mutationFn: async ({ resumeId, jobId }: { resumeId: string; jobId?: string }) => {
      setIsAnalyzing(true);
      const { data: res } = await atsApi.runAnalysis(resumeId, jobId);
      return res.data as ATSAnalysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analyses() });
      toast.success("ATS analysis started");
    },
    onSettled: () => {
      setIsAnalyzing(false);
    },
  });
}

export function useRunBulkATSAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resumeIds, jobId }: { resumeIds: string[]; jobId?: string }) => {
      const { data: res } = await atsApi.runBulkAnalysis(resumeIds, jobId);
      return res.data as ATSAnalysis[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analyses() });
      toast.success("Bulk analysis started");
    },
  });
}

export function useSearchATSAnalyses() {
  return useMutation({
    mutationFn: async (params: ATSAnalysisSearchRequest) => {
      const { data } = await atsApi.searchAnalyses(params);
      return data;
    },
  });
}

export function useATSAnalysisStats() {
  return useQuery({
    queryKey: atsKeys.analysisStats(),
    queryFn: async () => {
      const { data } = await atsApi.getAnalysisStats();
      return data?.data as ATSAnalysisStats;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useBulkATSAnalysisAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSBulkAction) => {
      await atsApi.bulkAnalysisAction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analyses() });
      toast.success("Bulk action completed");
    },
  });
}

// --- Versions ---
export function useATSAnalysisVersions(analysisId: string) {
  const setVersions = useATSStore((s) => s.setVersions);

  return useQuery<ATSVersion[]>({
    queryKey: atsKeys.analysisVersions(analysisId),
    queryFn: async () => {
      const { data } = await atsApi.getVersions(analysisId);
      const versions = data?.data as ATSVersion[];
      if (versions) setVersions(versions);
      return versions;
    },
    enabled: !!analysisId,
  });
}

export function useATSAnalysisVersion(analysisId: string, versionId: string) {
  return useQuery<ATSVersion>({
    queryKey: atsKeys.analysisVersion(analysisId, versionId),
    queryFn: async () => {
      const { data } = await atsApi.getVersion(analysisId, versionId);
      return data?.data as ATSVersion;
    },
    enabled: !!analysisId && !!versionId,
  });
}

// --- Comparisons ---
export function useCreateATSComparison(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSComparisonCreate) => {
      const { data: res } = await atsApi.createComparison(analysisId, data);
      return res.data as ATSComparison;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analysisComparisons(analysisId) });
      toast.success("Comparison created");
    },
  });
}

export function useATSComparison(analysisId: string, comparisonId: string) {
  return useQuery<ATSComparison>({
    queryKey: atsKeys.analysisComparison(analysisId, comparisonId),
    queryFn: async () => {
      const { data } = await atsApi.getComparison(analysisId, comparisonId);
      return data?.data as ATSComparison;
    },
    enabled: !!analysisId && !!comparisonId,
  });
}

// --- History ---
export function useATSHistory(analysisId: string) {
  return useQuery<ATSHistory[]>({
    queryKey: atsKeys.analysisHistory(analysisId),
    queryFn: async () => {
      const { data } = await atsApi.getHistory(analysisId);
      return data?.data as ATSHistory[];
    },
    enabled: !!analysisId,
  });
}

// --- Reports ---
export function useCreateATSReport(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSReportCreate) => {
      const { data: res } = await atsApi.createReport(analysisId, data);
      return res.data as ATSReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analysisReports(analysisId) });
      toast.success("Report generated");
    },
  });
}

export function useATSReports(analysisId: string) {
  const setReports = useATSStore((s) => s.setReports);

  return useQuery<ATSReport[]>({
    queryKey: atsKeys.analysisReports(analysisId),
    queryFn: async () => {
      const { data } = await atsApi.getReports(analysisId);
      const reports = data?.data as ATSReport[];
      if (reports) setReports(reports);
      return reports;
    },
    enabled: !!analysisId,
  });
}

// --- Scans ---
export function useCreateATSScan(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSScanCreate) => {
      const { data: res } = await atsApi.createScan(analysisId, data);
      return res.data as ATSScan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.analysisScans(analysisId) });
      toast.success("Scan created");
    },
  });
}

export function useATSScans(analysisId: string) {
  const setScans = useATSStore((s) => s.setScans);

  return useQuery<ATSScan[]>({
    queryKey: atsKeys.analysisScans(analysisId),
    queryFn: async () => {
      const { data } = await atsApi.getScans(analysisId);
      const scans = data?.data as ATSScan[];
      if (scans) setScans(scans);
      return scans;
    },
    enabled: !!analysisId,
  });
}

// --- Benchmarks ---
export function useATSBenchmarks(analysisId: string) {
  return useQuery<ATSBenchmark[]>({
    queryKey: atsKeys.analysisBenchmarks(analysisId),
    queryFn: async () => {
      const { data } = await atsApi.getBenchmarks(analysisId);
      return data?.data as ATSBenchmark[];
    },
    enabled: !!analysisId,
  });
}

// --- Configurations ---
export function useATSConfigurations() {
  const setConfigurations = useATSStore((s) => s.setConfigurations);

  return useQuery({
    queryKey: atsKeys.configurations(),
    queryFn: async () => {
      const { data } = await atsApi.getConfigurations();
      const configs = data?.data as ATSConfiguration[];
      if (configs) setConfigurations(configs);
      return configs;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useATSConfiguration(id: string) {
  const setActiveConfiguration = useATSStore((s) => s.setActiveConfiguration);

  return useQuery<ATSConfiguration>({
    queryKey: atsKeys.configuration(id),
    queryFn: async () => {
      const { data } = await atsApi.getConfiguration(id);
      const config = data?.data as ATSConfiguration;
      if (config) setActiveConfiguration(config);
      return config;
    },
    enabled: !!id,
  });
}

export function useCreateATSConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSConfigurationCreate) => {
      const { data: res } = await atsApi.createConfiguration(data);
      return res.data as ATSConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.configurations() });
      toast.success("Configuration created");
    },
  });
}

export function useUpdateATSConfiguration(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSConfigurationUpdate) => {
      const { data: res } = await atsApi.updateConfiguration(id, data);
      return res.data as ATSConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.configuration(id) });
      queryClient.invalidateQueries({ queryKey: atsKeys.configurations() });
      toast.success("Configuration updated");
    },
  });
}

export function useDeleteATSConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await atsApi.deleteConfiguration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.configurations() });
      toast.success("Configuration deleted");
    },
  });
}

// --- Rule Sets ---
export function useATSRuleSets() {
  const setRuleSets = useATSStore((s) => s.setRuleSets);

  return useQuery({
    queryKey: atsKeys.ruleSets(),
    queryFn: async () => {
      const { data } = await atsApi.getRuleSets();
      const sets = data?.data as ATSRuleSet[];
      if (sets) setRuleSets(sets);
      return sets;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useATSRuleSet(id: string) {
  return useQuery<ATSRuleSet>({
    queryKey: atsKeys.ruleSet(id),
    queryFn: async () => {
      const { data } = await atsApi.getRuleSet(id);
      return data?.data as ATSRuleSet;
    },
    enabled: !!id,
  });
}

export function useCreateATSRuleSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSRuleSetCreate) => {
      const { data: res } = await atsApi.createRuleSet(data);
      return res.data as ATSRuleSet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleSets() });
      toast.success("Rule set created");
    },
  });
}

export function useUpdateATSRuleSet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSRuleSetUpdate) => {
      const { data: res } = await atsApi.updateRuleSet(id, data);
      return res.data as ATSRuleSet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleSet(id) });
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleSets() });
      toast.success("Rule set updated");
    },
  });
}

export function useDeleteATSRuleSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await atsApi.deleteRuleSet(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleSets() });
      toast.success("Rule set deleted");
    },
  });
}

// --- Rules ---
export function useATSRules(ruleSetId?: string) {
  const setRules = useATSStore((s) => s.setRules);

  return useQuery({
    queryKey: atsKeys.rules(),
    queryFn: async () => {
      const { data } = await atsApi.getRules(ruleSetId);
      const rules = data?.data as ATSRule[];
      if (rules) setRules(rules);
      return rules;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useATSRule(id: string) {
  return useQuery<ATSRule>({
    queryKey: atsKeys.rule(id),
    queryFn: async () => {
      const { data } = await atsApi.getRule(id);
      return data?.data as ATSRule;
    },
    enabled: !!id,
  });
}

export function useCreateATSRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSRuleCreate) => {
      const { data: res } = await atsApi.createRule(data);
      return res.data as ATSRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.rules() });
      toast.success("Rule created");
    },
  });
}

export function useUpdateATSRule(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSRuleUpdate) => {
      const { data: res } = await atsApi.updateRule(id, data);
      return res.data as ATSRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.rule(id) });
      queryClient.invalidateQueries({ queryKey: atsKeys.rules() });
      toast.success("Rule updated");
    },
  });
}

export function useDeleteATSRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await atsApi.deleteRule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.rules() });
      toast.success("Rule deleted");
    },
  });
}

// --- Rule Categories ---
export function useATSRuleCategories() {
  const setRuleCategories = useATSStore((s) => s.setRuleCategories);

  return useQuery({
    queryKey: atsKeys.ruleCategories(),
    queryFn: async () => {
      const { data } = await atsApi.getRuleCategories();
      const categories = data?.data as ATSRuleCategory[];
      if (categories) setRuleCategories(categories);
      return categories;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateATSRuleCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSRuleCategoryCreate) => {
      const { data: res } = await atsApi.createRuleCategory(data);
      return res.data as ATSRuleCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleCategories() });
      toast.success("Rule category created");
    },
  });
}

export function useUpdateATSRuleCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ATSRuleCategoryUpdate) => {
      const { data: res } = await atsApi.updateRuleCategory(id, data);
      return res.data as ATSRuleCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleCategories() });
      toast.success("Rule category updated");
    },
  });
}

export function useDeleteATSRuleCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await atsApi.deleteRuleCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atsKeys.ruleCategories() });
      toast.success("Rule category deleted");
    },
  });
}
