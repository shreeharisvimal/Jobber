import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api-client";
import { toast } from "@/stores/toast.store";

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: () => [...analyticsKeys.all, "dashboard"] as const,
  crossModule: () => [...analyticsKeys.all, "cross-module"] as const,
  dashboards: (params?: Record<string, unknown>) => [...analyticsKeys.all, "dashboards", params] as const,
  dashboard_detail: (id: string) => [...analyticsKeys.all, "dashboard", id] as const,
  widgets: (params?: Record<string, unknown>) => [...analyticsKeys.all, "widgets", params] as const,
  reports: (params?: Record<string, unknown>) => [...analyticsKeys.all, "reports", params] as const,
  report: (id: string) => [...analyticsKeys.all, "report", id] as const,
  metrics: (params?: Record<string, unknown>) => [...analyticsKeys.all, "metrics", params] as const,
  metric: (id: string) => [...analyticsKeys.all, "metric", id] as const,
  kpis: (params?: Record<string, unknown>) => [...analyticsKeys.all, "kpis", params] as const,
  kpi: (id: string) => [...analyticsKeys.all, "kpi", id] as const,
  trends: (params?: Record<string, unknown>) => [...analyticsKeys.all, "trends", params] as const,
  trend: (id: string) => [...analyticsKeys.all, "trend", id] as const,
  benchmarks: (params?: Record<string, unknown>) => [...analyticsKeys.all, "benchmarks", params] as const,
  benchmark: (id: string) => [...analyticsKeys.all, "benchmark", id] as const,
  comparisons: (params?: Record<string, unknown>) => [...analyticsKeys.all, "comparisons", params] as const,
  comparison: (id: string) => [...analyticsKeys.all, "comparison", id] as const,
  forecasts: (params?: Record<string, unknown>) => [...analyticsKeys.all, "forecasts", params] as const,
  forecast: (id: string) => [...analyticsKeys.all, "forecast", id] as const,
  insights: (params?: Record<string, unknown>) => [...analyticsKeys.all, "insights", params] as const,
  insight: (id: string) => [...analyticsKeys.all, "insight", id] as const,
  recommendations: (params?: Record<string, unknown>) => [...analyticsKeys.all, "recommendations", params] as const,
  recommendation: (id: string) => [...analyticsKeys.all, "recommendation", id] as const,
  alerts: (params?: Record<string, unknown>) => [...analyticsKeys.all, "alerts", params] as const,
  exports: (params?: Record<string, unknown>) => [...analyticsKeys.all, "exports", params] as const,
  export_detail: (id: string) => [...analyticsKeys.all, "export", id] as const,
  settings: () => [...analyticsKeys.all, "settings"] as const,
  notifications: (params?: Record<string, unknown>) => [...analyticsKeys.all, "notifications", params] as const,
  history: (params?: Record<string, unknown>) => [...analyticsKeys.all, "history", params] as const,
};

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => analyticsApi.getDashboard(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsCrossModule() {
  return useQuery({
    queryKey: analyticsKeys.crossModule(),
    queryFn: () => analyticsApi.getCrossModule(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsDashboards(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.dashboards(params),
    queryFn: () => analyticsApi.getDashboards(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsDashboardDetail(id: string) {
  return useQuery({
    queryKey: analyticsKeys.dashboard_detail(id),
    queryFn: () => analyticsApi.getDashboardDetail(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useAnalyticsWidgets(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.widgets(params),
    queryFn: () => analyticsApi.getWidgets(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsReports(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.reports(params),
    queryFn: () => analyticsApi.getReports(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsReport(id: string) {
  return useQuery({
    queryKey: analyticsKeys.report(id),
    queryFn: () => analyticsApi.getReport(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useAnalyticsMetrics(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.metrics(params),
    queryFn: () => analyticsApi.getMetrics(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsKPIs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.kpis(params),
    queryFn: () => analyticsApi.getKPIs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsKPI(id: string) {
  return useQuery({
    queryKey: analyticsKeys.kpi(id),
    queryFn: () => analyticsApi.getKPI(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useAnalyticsTrends(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.trends(params),
    queryFn: () => analyticsApi.getTrends(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsBenchmarks(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.benchmarks(params),
    queryFn: () => analyticsApi.getBenchmarks(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsComparisons(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.comparisons(params),
    queryFn: () => analyticsApi.getComparisons(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsForecasts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.forecasts(params),
    queryFn: () => analyticsApi.getForecasts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsInsights(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.insights(params),
    queryFn: () => analyticsApi.getInsights(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsInsight(id: string) {
  return useQuery({
    queryKey: analyticsKeys.insight(id),
    queryFn: () => analyticsApi.getInsight(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useAnalyticsRecommendations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.recommendations(params),
    queryFn: () => analyticsApi.getRecommendations(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsAlerts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.alerts(params),
    queryFn: () => analyticsApi.getAlerts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsExports(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.exports(params),
    queryFn: () => analyticsApi.getExports(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsSettings() {
  return useQuery({
    queryKey: analyticsKeys.settings(),
    queryFn: () => analyticsApi.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsNotifications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.notifications(params),
    queryFn: () => analyticsApi.getNotifications(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsHistory(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: analyticsKeys.history(params),
    queryFn: () => analyticsApi.getHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAnalyticsDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.create(data),
    onSuccess: () => {
      toast.success("Dashboard created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboards() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create dashboard");
    },
  });
}

export function useUpdateAnalyticsDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => analyticsApi.update({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("Dashboard updated successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboard_detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboards() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update dashboard");
    },
  });
}

export function useDeleteAnalyticsDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.delete(id),
    onSuccess: () => {
      toast.success("Dashboard deleted successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboards() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete dashboard");
    },
  });
}

export function useCreateAnalyticsWidget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createWidget(data),
    onSuccess: () => {
      toast.success("Widget created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.widgets() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create widget");
    },
  });
}

export function useUpdateAnalyticsWidget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => analyticsApi.updateWidget({ id, data }),
    onSuccess: () => {
      toast.success("Widget updated successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.widgets() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update widget");
    },
  });
}

export function useDeleteAnalyticsWidget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.deleteWidget(id),
    onSuccess: () => {
      toast.success("Widget deleted successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.widgets() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete widget");
    },
  });
}

export function useCreateAnalyticsReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createReport(data),
    onSuccess: () => {
      toast.success("Report created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.reports() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create report");
    },
  });
}

export function useUpdateAnalyticsReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => analyticsApi.updateReport({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("Report updated successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.report(variables.id) });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.reports() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update report");
    },
  });
}

export function useDeleteAnalyticsReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.deleteReport(id),
    onSuccess: () => {
      toast.success("Report deleted successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.reports() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete report");
    },
  });
}

export function useGenerateAnalyticsReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.generateReport(id),
    onSuccess: () => {
      toast.success("Report generation started");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.reports() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate report");
    },
  });
}

export function useCreateAnalyticsMetric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createMetric(data),
    onSuccess: () => {
      toast.success("Metric created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.metrics() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create metric");
    },
  });
}

export function useCreateAnalyticsKPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createKPI(data),
    onSuccess: () => {
      toast.success("KPI created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.kpis() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create KPI");
    },
  });
}

export function useUpdateAnalyticsKPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => analyticsApi.updateKPI({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("KPI updated successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.kpi(variables.id) });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.kpis() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update KPI");
    },
  });
}

export function useDeleteAnalyticsKPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.deleteKPI(id),
    onSuccess: () => {
      toast.success("KPI deleted successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.kpis() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete KPI");
    },
  });
}

export function useCreateAnalyticsTrend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createTrend(data),
    onSuccess: () => {
      toast.success("Trend created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.trends() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create trend");
    },
  });
}

export function useCreateAnalyticsBenchmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createBenchmark(data),
    onSuccess: () => {
      toast.success("Benchmark created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.benchmarks() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create benchmark");
    },
  });
}

export function useCreateAnalyticsComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createComparison(data),
    onSuccess: () => {
      toast.success("Comparison created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.comparisons() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create comparison");
    },
  });
}

export function useCreateAnalyticsForecast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createForecast(data),
    onSuccess: () => {
      toast.success("Forecast created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.forecasts() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create forecast");
    },
  });
}

export function useMarkInsightRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.markInsightRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.insights() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark insight as read");
    },
  });
}

export function useDismissInsight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.dismissInsight(id),
    onSuccess: () => {
      toast.success("Insight dismissed");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.insights() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to dismiss insight");
    },
  });
}

export function useAcceptRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.acceptRecommendation(id),
    onSuccess: () => {
      toast.success("Recommendation accepted");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.recommendations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept recommendation");
    },
  });
}

export function useDismissRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.dismissRecommendation(id),
    onSuccess: () => {
      toast.success("Recommendation dismissed");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.recommendations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to dismiss recommendation");
    },
  });
}

export function useCompleteRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.completeRecommendation(id),
    onSuccess: () => {
      toast.success("Recommendation completed");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.recommendations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to complete recommendation");
    },
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.markAlertRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.alerts() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark alert as read");
    },
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.dismissAlert(id),
    onSuccess: () => {
      toast.success("Alert dismissed");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.alerts() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to dismiss alert");
    },
  });
}

export function useCreateAnalyticsExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.createExport(data),
    onSuccess: () => {
      toast.success("Export created successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.exports() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create export");
    },
  });
}

export function useUpdateAnalyticsSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => analyticsApi.updateSettings(data),
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.settings() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.notifications() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => analyticsApi.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: analyticsKeys.notifications() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark all notifications as read");
    },
  });
}
