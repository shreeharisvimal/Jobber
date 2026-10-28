// ─── Enums ──────────────────────────────────────────────────────────────────

export type DashboardType =
  | "custom"
  | "executive"
  | "overview"
  | "resume"
  | "interview"
  | "skills"
  | "market"
  | "goals";

export type WidgetType =
  | "metric"
  | "chart"
  | "table"
  | "kpi"
  | "trend"
  | "forecast"
  | "comparison"
  | "activity"
  | "stat"
  | "list"
  | "calendar"
  | "progress"
  | "gauge"
  | "heatmap";

export type ReportType =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "custom";

export type ReportStatus =
  | "draft"
  | "generated"
  | "generating"
  | "completed"
  | "failed"
  | "scheduled";

export type SnapshotType =
  | "baseline"
  | "periodic"
  | "comparison"
  | "milestone";

export type MetricType =
  | "counter"
  | "gauge"
  | "rate"
  | "score"
  | "duration"
  | "currency"
  | "histogram"
  | "summary";

export type KPIStatus =
  | "on_track"
  | "at_risk"
  | "off_track"
  | "behind"
  | "exceeded";

export type TrendDirection = "up" | "down" | "stable";

export type InsightType =
  | "performance"
  | "opportunity"
  | "risk"
  | "trend"
  | "anomaly"
  | "recommendation";

export type SeverityLevel =
  | "info"
  | "warning"
  | "critical"
  | "success"
  | "low"
  | "medium"
  | "high";

export type RecommendationCategory =
  | "skill"
  | "resume"
  | "interview"
  | "networking"
  | "job_search"
  | "portfolio"
  | "general";

export type RecommendationStatus =
  | "pending"
  | "accepted"
  | "dismissed"
  | "completed"
  | "in_progress";

export type AlertType =
  | "threshold"
  | "anomaly"
  | "deadline"
  | "milestone"
  | "system"
  | "reminder";

export type ExportFormat = "csv" | "pdf" | "json" | "xlsx";

export type ExportStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type SharePermission = "view" | "edit" | "admin";

export type JobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "share";

export type AIRequestStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ScoreType =
  | "overall"
  | "resume"
  | "interview"
  | "skills"
  | "market"
  | "portfolio";

export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type NotificationType =
  | "alert"
  | "recommendation"
  | "insight"
  | "report"
  | "system";

export type ScheduleType = "once" | "daily" | "weekly" | "monthly";

export type ForecastMethodology =
  | "linear"
  | "exponential"
  | "moving_average"
  | "seasonal";

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface AnalyticsDashboardStats {
  total_dashboards: number;
  total_reports: number;
  total_metrics: number;
  active_alerts: number;
  active_recommendations: number;
  insights_count: number;
  avg_score: number | null;
  score_trend: string | null;
}

// ─── AnalyticsDashboard ─────────────────────────────────────────────────────

export interface AnalyticsDashboard {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  dashboard_type: string | null;
  layout: Record<string, unknown> | null;
  is_default: boolean;
  is_shared: boolean;
  share_token: string | null;
  metadata_: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsDashboardCreate {
  title: string;
  description?: string | null;
  dashboard_type?: string | null;
  layout?: Record<string, unknown> | null;
  is_default?: boolean;
  is_shared?: boolean;
}

export interface AnalyticsDashboardUpdate {
  title?: string | null;
  description?: string | null;
  dashboard_type?: string | null;
  layout?: Record<string, unknown> | null;
  is_default?: boolean | null;
  is_shared?: boolean | null;
  share_token?: string | null;
}

// ─── AnalyticsWidget ────────────────────────────────────────────────────────

export interface AnalyticsWidget {
  id: string;
  user_id: string;
  dashboard_id: string | null;
  widget_type: string;
  title: string;
  config: Record<string, unknown> | null;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  refresh_interval: number | null;
  is_visible: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsWidgetCreate {
  dashboard_id?: string | null;
  widget_type: string;
  title: string;
  config?: Record<string, unknown> | null;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  refresh_interval?: number | null;
  is_visible?: boolean;
}

export interface AnalyticsWidgetUpdate {
  dashboard_id?: string | null;
  widget_type?: string | null;
  title?: string | null;
  config?: Record<string, unknown> | null;
  position_x?: number | null;
  position_y?: number | null;
  width?: number | null;
  height?: number | null;
  refresh_interval?: number | null;
  is_visible?: boolean | null;
}

// ─── AnalyticsReport ────────────────────────────────────────────────────────

export interface AnalyticsReport {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  report_type: string;
  status: string | null;
  config: Record<string, unknown> | null;
  results: Record<string, unknown> | null;
  schedule: Record<string, unknown> | null;
  last_generated_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsReportCreate {
  title: string;
  description?: string | null;
  report_type: string;
  config?: Record<string, unknown> | null;
}

export interface AnalyticsReportUpdate {
  title?: string | null;
  description?: string | null;
  report_type?: string | null;
  status?: string | null;
  config?: Record<string, unknown> | null;
  results?: Record<string, unknown> | null;
  schedule?: Record<string, unknown> | null;
}

// ─── AnalyticsReportVersion ─────────────────────────────────────────────────

export interface AnalyticsReportVersion {
  id: string;
  user_id: string;
  report_id: string;
  version_number: number | null;
  data: Record<string, unknown> | null;
  change_summary: string | null;
  generated_at: string | null;
  created_at: string | null;
}

export interface AnalyticsReportVersionCreate {
  report_id: string;
  version_number?: number | null;
  data?: Record<string, unknown> | null;
  change_summary?: string | null;
}

// ─── AnalyticsSnapshot ──────────────────────────────────────────────────────

export interface AnalyticsSnapshot {
  id: string;
  user_id: string;
  snapshot_type: string;
  entity_type: string | null;
  entity_id: string | null;
  data: Record<string, unknown> | null;
  score: number | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string | null;
}

export interface AnalyticsSnapshotCreate {
  snapshot_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  data?: Record<string, unknown> | null;
  score?: number | null;
  period_start?: string | null;
  period_end?: string | null;
}

// ─── AnalyticsMetric ────────────────────────────────────────────────────────

export interface AnalyticsMetric {
  id: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  unit: string | null;
  source_module: string | null;
  period_start: string | null;
  period_end: string | null;
  breakdown: Record<string, unknown> | null;
  recorded_at: string | null;
  created_at: string | null;
}

export interface AnalyticsMetricCreate {
  metric_name: string;
  metric_value: number;
  metric_type: string;
  unit?: string | null;
  source_module?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  breakdown?: Record<string, unknown> | null;
}

// ─── AnalyticsKPI ───────────────────────────────────────────────────────────

export interface AnalyticsKPI {
  id: string;
  user_id: string;
  kpi_name: string;
  kpi_value: number;
  target_value: number | null;
  unit: string | null;
  status: string | null;
  category: string | null;
  period: string | null;
  trend: string | null;
  change_pct: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsKPICreate {
  kpi_name: string;
  kpi_value: number;
  target_value?: number | null;
  unit?: string | null;
  status?: string | null;
  category?: string | null;
  period?: string | null;
}

export interface AnalyticsKPIUpdate {
  kpi_name?: string | null;
  kpi_value?: number | null;
  target_value?: number | null;
  unit?: string | null;
  status?: string | null;
  category?: string | null;
  period?: string | null;
}

// ─── AnalyticsTrend ─────────────────────────────────────────────────────────

export interface AnalyticsTrend {
  id: string;
  user_id: string;
  trend_name: string;
  trend_type: string;
  data_points: Record<string, unknown>[] | null;
  period: string | null;
  source_module: string | null;
  direction: string | null;
  magnitude: number | null;
  confidence: number | null;
  created_at: string | null;
}

export interface AnalyticsTrendCreate {
  trend_name: string;
  trend_type: string;
  data_points?: Record<string, unknown>[] | null;
  period?: string | null;
  source_module?: string | null;
}

// ─── AnalyticsBenchmark ─────────────────────────────────────────────────────

export interface AnalyticsBenchmark {
  id: string;
  user_id: string;
  benchmark_name: string;
  benchmark_type: string;
  user_value: number;
  benchmark_value: number | null;
  source: string | null;
  period: string | null;
  percentile: number | null;
  comparison: string | null;
  created_at: string | null;
}

export interface AnalyticsBenchmarkCreate {
  benchmark_name: string;
  benchmark_type: string;
  user_value: number;
  benchmark_value?: number | null;
  source?: string | null;
  period?: string | null;
}

// ─── AnalyticsComparison ────────────────────────────────────────────────────

export interface AnalyticsComparison {
  id: string;
  user_id: string;
  title: string;
  comparison_type: string;
  entity_a_type: string;
  entity_a_id: string;
  entity_b_type: string | null;
  entity_b_id: string | null;
  results: Record<string, unknown> | null;
  winner: string | null;
  score_a: number | null;
  score_b: number | null;
  created_at: string | null;
}

export interface AnalyticsComparisonCreate {
  title: string;
  comparison_type: string;
  entity_a_type: string;
  entity_a_id: string;
  entity_b_type?: string | null;
  entity_b_id?: string | null;
}

// ─── AnalyticsForecast ──────────────────────────────────────────────────────

export interface AnalyticsForecast {
  id: string;
  user_id: string;
  forecast_name: string;
  forecast_type: string;
  current_value: number;
  predicted_value: number | null;
  confidence: number | null;
  horizon: string | null;
  methodology: string | null;
  data_points: Record<string, unknown>[] | null;
  created_at: string | null;
}

export interface AnalyticsForecastCreate {
  forecast_name: string;
  forecast_type: string;
  current_value: number;
  horizon?: string | null;
  methodology?: string | null;
}

// ─── AnalyticsInsight ───────────────────────────────────────────────────────

export interface AnalyticsInsight {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  insight_type: string;
  severity: string | null;
  source_module: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  action_url: string | null;
  created_at: string | null;
}

export interface AnalyticsInsightCreate {
  title: string;
  description?: string | null;
  insight_type: string;
  severity?: string | null;
  source_module?: string | null;
  action_url?: string | null;
}

export interface AnalyticsInsightUpdate {
  is_read?: boolean | null;
  is_dismissed?: boolean | null;
}

// ─── AnalyticsRecommendation ────────────────────────────────────────────────

export interface AnalyticsRecommendation {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  priority: number;
  impact: string | null;
  status: string | null;
  affected_modules: string[] | null;
  expected_outcome: string | null;
  ai_provider: string | null;
  ai_model: string | null;
  ai_prompt_version: string | null;
  ai_execution_id: string | null;
  ai_confidence: number | null;
  ai_reasoning: string | null;
  created_at: string | null;
}

export interface AnalyticsRecommendationCreate {
  title: string;
  description?: string | null;
  category: string;
  priority?: number;
  impact?: string | null;
  affected_modules?: string[] | null;
  expected_outcome?: string | null;
}

export interface AnalyticsRecommendationUpdate {
  status?: string | null;
}

// ─── AnalyticsAlert ─────────────────────────────────────────────────────────

export interface AnalyticsAlert {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  alert_type: string;
  severity: string | null;
  source_module: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  action_url: string | null;
  created_at: string | null;
}

export interface AnalyticsAlertCreate {
  title: string;
  message?: string | null;
  alert_type: string;
  severity?: string | null;
  source_module?: string | null;
  action_url?: string | null;
}

export interface AnalyticsAlertUpdate {
  is_read?: boolean | null;
  is_dismissed?: boolean | null;
}

// ─── AnalyticsFilter ────────────────────────────────────────────────────────

export interface AnalyticsFilter {
  id: string;
  user_id: string;
  name: string;
  filter_type: string;
  config: Record<string, unknown> | null;
  is_default: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsFilterCreate {
  name: string;
  filter_type: string;
  config?: Record<string, unknown> | null;
  is_default?: boolean;
}

export interface AnalyticsFilterUpdate {
  name?: string | null;
  filter_type?: string | null;
  config?: Record<string, unknown> | null;
  is_default?: boolean | null;
}

// ─── AnalyticsSegment ───────────────────────────────────────────────────────

export interface AnalyticsSegment {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  segment_type: string;
  criteria: Record<string, unknown> | null;
  entity_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsSegmentCreate {
  name: string;
  description?: string | null;
  segment_type: string;
  criteria?: Record<string, unknown> | null;
  entity_count?: number;
}

// ─── AnalyticsSchedule ──────────────────────────────────────────────────────

export interface AnalyticsSchedule {
  id: string;
  user_id: string;
  name: string;
  schedule_type: string;
  cron_expression: string | null;
  config: Record<string, unknown> | null;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsScheduleCreate {
  name: string;
  schedule_type: string;
  cron_expression?: string | null;
  config?: Record<string, unknown> | null;
  is_active?: boolean;
}

export interface AnalyticsScheduleUpdate {
  name?: string | null;
  schedule_type?: string | null;
  cron_expression?: string | null;
  config?: Record<string, unknown> | null;
  is_active?: boolean | null;
}

// ─── AnalyticsExport ────────────────────────────────────────────────────────

export interface AnalyticsExport {
  id: string;
  user_id: string;
  export_type: string;
  format: string;
  config: Record<string, unknown> | null;
  status: string;
  file_url: string | null;
  file_size: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsExportCreate {
  export_type: string;
  format: string;
  config?: Record<string, unknown> | null;
}

// ─── AnalyticsShare ─────────────────────────────────────────────────────────

export interface AnalyticsShare {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  shared_with_id: string | null;
  permission: string;
  share_token: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsShareCreate {
  entity_type: string;
  entity_id: string;
  shared_with_id?: string | null;
  permission?: string;
  share_token?: string | null;
  expires_at?: string | null;
}

// ─── AnalyticsHistory ───────────────────────────────────────────────────────

export interface AnalyticsHistory {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string | null;
  previous_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string | null;
}

export interface AnalyticsHistoryCreate {
  entity_type: string;
  entity_id?: string | null;
  action: string;
  description?: string | null;
  previous_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
}

// ─── AnalyticsCache ─────────────────────────────────────────────────────────

export interface AnalyticsCache {
  id: string;
  cache_key: string;
  cache_type: string | null;
  data: Record<string, unknown> | null;
  ttl_seconds: number;
  hit_count: number;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsCacheCreate {
  cache_key: string;
  cache_type?: string | null;
  data?: Record<string, unknown> | null;
  ttl_seconds?: number;
}

// ─── AnalyticsJob ───────────────────────────────────────────────────────────

export interface AnalyticsJob {
  id: string;
  user_id: string;
  job_type: string;
  config: Record<string, unknown> | null;
  priority: number;
  status: string;
  result: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsJobCreate {
  job_type: string;
  config?: Record<string, unknown> | null;
  priority?: number;
  status?: string;
}

// ─── AnalyticsExecution ─────────────────────────────────────────────────────

export interface AnalyticsExecution {
  id: string;
  user_id: string;
  execution_type: string;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  provider: string | null;
  model: string | null;
  tokens_used: number | null;
  latency_ms: number | null;
  status: string;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsExecutionCreate {
  execution_type: string;
  input_data?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
  status?: string;
}

// ─── AnalyticsSettings ──────────────────────────────────────────────────────

export interface AnalyticsSettings {
  id: string;
  user_id: string;
  notification_email: boolean;
  notification_in_app: boolean;
  auto_refresh: boolean;
  refresh_interval: number;
  default_theme: string;
  timezone: string;
  date_format: string;
  ai_provider_preference: string | null;
  focus_areas: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsSettingsCreate {
  notification_email?: boolean;
  notification_in_app?: boolean;
  auto_refresh?: boolean;
  refresh_interval?: number;
  default_theme?: string;
  timezone?: string;
  date_format?: string;
  ai_provider_preference?: string | null;
  focus_areas?: string[] | null;
}

export interface AnalyticsSettingsUpdate {
  notification_email?: boolean | null;
  notification_in_app?: boolean | null;
  auto_refresh?: boolean | null;
  refresh_interval?: number | null;
  default_theme?: string | null;
  timezone?: string | null;
  date_format?: string | null;
  ai_provider_preference?: string | null;
  focus_areas?: string[] | null;
}

// ─── AnalyticsNotification ──────────────────────────────────────────────────

export interface AnalyticsNotification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsNotificationCreate {
  notification_type: string;
  title: string;
  message?: string | null;
  action_url?: string | null;
}

// ─── AnalyticsAuditLog ──────────────────────────────────────────────────────

export interface AnalyticsAuditLog {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string | null;
}

export interface AnalyticsAuditLogCreate {
  entity_type: string;
  entity_id?: string | null;
  action: string;
  description?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
}

// ─── AnalyticsAIRequest ─────────────────────────────────────────────────────

export interface AnalyticsAIRequest {
  id: string;
  user_id: string;
  request_type: string;
  prompt: string | null;
  context: Record<string, unknown> | null;
  provider: string | null;
  model: string | null;
  status: string;
  execution_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsAIRequestCreate {
  request_type: string;
  prompt?: string | null;
  context?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
  status?: string;
  execution_id?: string | null;
}

// ─── AnalyticsAIResult ──────────────────────────────────────────────────────

export interface AnalyticsAIResult {
  id: string;
  user_id: string;
  request_type: string;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  confidence: number | null;
  reasoning: string | null;
  suggestions: string[] | null;
  scores: Record<string, unknown> | null;
  provider: string | null;
  model: string | null;
  tokens_used: number | null;
  latency_ms: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsAIResultCreate {
  request_type: string;
  input_data?: Record<string, unknown> | null;
  output_data?: Record<string, unknown> | null;
  confidence?: number | null;
  reasoning?: string | null;
  suggestions?: string[] | null;
  scores?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
}

// ─── AnalyticsScoreHistory ──────────────────────────────────────────────────

export interface AnalyticsScoreHistory {
  id: string;
  user_id: string;
  score_type: string;
  score: number;
  breakdown: Record<string, unknown> | null;
  recorded_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsScoreHistoryCreate {
  score_type: string;
  score: number;
  breakdown?: Record<string, unknown> | null;
}
