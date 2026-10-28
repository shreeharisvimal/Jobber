export type ATSAnalysisStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type ATSAnalysisType = "comprehensive" | "quick" | "keyword_only" | "skill_only" | "formatting_only";
export type ATSDimension = "keyword" | "skill" | "experience" | "education" | "formatting" | "readability" | "completeness" | "compatibility";
export type ATSSeverity = "low" | "medium" | "high" | "critical";
export type ATSPriority = "low" | "medium" | "high" | "urgent";
export type ATSImpact = "low" | "medium" | "high";
export type ATSMatchType = "exact" | "partial" | "semantic" | "fuzzy";
export type ATSGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
export type ATSScanType = "quick" | "comprehensive" | "deep";

export interface ATSConfiguration {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  min_keyword_match_pct: number;
  min_skill_match_pct: number;
  min_experience_match_pct: number;
  min_formatting_score: number;
  min_readability_score: number;
  min_overall_score: number;
  max_gaps_allowed: number;
  weighting_keywords: number;
  weighting_skills: number;
  weighting_experience: number;
  weighting_education: number;
  weighting_formatting: number;
  weighting_readability: number;
  weighting_completeness: number;
  auto_run_on_import: boolean;
  notify_on_completion: boolean;
  default_analysis_type: ATSAnalysisType;
  default_scan_type: ATSScanType;
  rules: ATSRule[] | null;
  created_at: string;
  updated_at: string;
}

export interface ATSConfigurationCreate {
  name: string;
  description?: string;
  min_keyword_match_pct?: number;
  min_skill_match_pct?: number;
  min_experience_match_pct?: number;
  min_formatting_score?: number;
  min_readability_score?: number;
  min_overall_score?: number;
  max_gaps_allowed?: number;
  weighting_keywords?: number;
  weighting_skills?: number;
  weighting_experience?: number;
  weighting_education?: number;
  weighting_formatting?: number;
  weighting_readability?: number;
  weighting_completeness?: number;
  auto_run_on_import?: boolean;
  notify_on_completion?: boolean;
  default_analysis_type?: ATSAnalysisType;
  default_scan_type?: ATSScanType;
}

export interface ATSConfigurationUpdate extends Partial<ATSConfigurationCreate> {
  is_active?: boolean;
}

export interface ATSRuleSet {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  is_default: boolean;
  rules: ATSRule[] | null;
  created_at: string;
  updated_at: string;
}

export interface ATSRuleSetCreate {
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface ATSRuleSetUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
}

export interface ATSRuleCategory {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  rules: ATSRule[] | null;
  created_at: string;
  updated_at: string;
}

export interface ATSRuleCategoryCreate {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface ATSRuleCategoryUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface ATSRule {
  id: string;
  rule_set_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  rule_type: string;
  dimension: ATSDimension;
  severity: ATSSeverity;
  priority: ATSPriority;
  condition: Record<string, unknown>;
  action: Record<string, unknown>;
  weight: number;
  is_active: boolean;
  is_system: boolean;
  metadata: Record<string, unknown> | null;
  category: ATSRuleCategory | null;
  created_at: string;
  updated_at: string;
}

export interface ATSRuleCreate {
  rule_set_id?: string;
  category_id?: string;
  name: string;
  description?: string;
  rule_type: string;
  dimension: ATSDimension;
  severity?: ATSSeverity;
  priority?: ATSPriority;
  condition?: Record<string, unknown>;
  action?: Record<string, unknown>;
  weight?: number;
}

export interface ATSRuleUpdate {
  name?: string;
  description?: string;
  rule_type?: string;
  dimension?: ATSDimension;
  severity?: ATSSeverity;
  priority?: ATSPriority;
  condition?: Record<string, unknown>;
  action?: Record<string, unknown>;
  weight?: number;
  is_active?: boolean;
}

export interface ATSAnalysis {
  id: string;
  resume_id: string;
  job_id: string | null;
  user_id: string;
  configuration_id: string | null;
  analysis_type: ATSAnalysisType;
  scan_type: ATSScanType | null;
  status: ATSAnalysisStatus;
  overall_score: number | null;
  keyword_score: number | null;
  skill_score: number | null;
  experience_score: number | null;
  education_score: number | null;
  formatting_score: number | null;
  readability_score: number | null;
  completeness_score: number | null;
  compatibility_score: number | null;
  keyword_match_rate: number | null;
  skill_match_rate: number | null;
  experience_match_rate: number | null;
  total_keywords: number | null;
  matched_keywords: number | null;
  total_skills: number | null;
  matched_skills: number | null;
  total_experience: number | null;
  matched_experience: number | null;
  gaps_count: number | null;
  issues_count: number | null;
  warnings_count: number | null;
  improvements_count: number | null;
  recommendations_count: number | null;
  grade: ATSGrade | null;
  percentile: number | null;
  analysis_version: string | null;
  is_favorite: boolean;
  tags: string[] | null;
  notes: string | null;
  ai_metadata: Record<string, unknown> | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ATSAnalysisCreate {
  resume_id: string;
  job_id?: string;
  configuration_id?: string;
  analysis_type?: ATSAnalysisType;
  scan_type?: ATSScanType;
  tags?: string[];
  notes?: string;
}

export interface ATSAnalysisUpdate {
  is_favorite?: boolean;
  tags?: string[];
  notes?: string;
}

export interface ATSAnalysisDetail extends ATSAnalysis {
  scores: ATSScore[];
  keyword_matches: ATSKeywordMatch[];
  keyword_gaps: ATSKeywordGap[];
  skill_matches: ATSSkillMatch[];
  skill_gaps: ATSSkillGap[];
  experience_matches: ATSExperienceMatch[];
  experience_gaps: ATSExperienceGap[];
  section_analyses: ATSSectionAnalysis[];
  formatting_analyses: ATSFormattingAnalysis[];
  readability: ATSReadability;
  recommendations: ATSRecommendation[];
  issues: ATSIssue[];
  warnings: ATSWarning[];
  improvements: ATSImprovement[];
}

export interface ATSScore {
  id: string;
  analysis_id: string;
  dimension: ATSDimension;
  score: number;
  weight: number;
  weighted_score: number;
  max_score: number;
  percentage: number;
  grade: ATSGrade | null;
  label: string | null;
  details: Record<string, unknown> | null;
}

export interface ATSKeywordMatch {
  id: string;
  analysis_id: string;
  keyword_id: string | null;
  keyword: string;
  match_type: ATSMatchType;
  found: boolean;
  count: number;
  density: number;
  context: string | null;
  locations: string[] | null;
  confidence: number | null;
}

export interface ATSKeywordGap {
  id: string;
  analysis_id: string;
  keyword: string;
  importance: ATSPriority;
  category: string | null;
  suggestion: string | null;
}

export interface ATSSkillMatch {
  id: string;
  analysis_id: string;
  skill: string;
  category: string | null;
  match_type: ATSMatchType;
  found: boolean;
  confidence: number | null;
}

export interface ATSSkillGap {
  id: string;
  analysis_id: string;
  skill: string;
  category: string | null;
  importance: ATSPriority;
  suggestion: string | null;
}

export interface ATSExperienceMatch {
  id: string;
  analysis_id: string;
  requirement: string;
  match_type: ATSMatchType;
  found: boolean;
  years_required: number | null;
  years_actual: number | null;
  relevance: number | null;
}

export interface ATSExperienceGap {
  id: string;
  analysis_id: string;
  requirement: string;
  years_required: number | null;
  years_actual: number | null;
  severity: ATSSeverity;
  suggestion: string | null;
}

export interface ATSSectionAnalysis {
  id: string;
  analysis_id: string;
  section_type: string;
  section_name: string;
  score: number;
  word_count: number;
  bullet_count: number;
  keyword_density: number;
  suggestions: string[] | null;
  issues: string[] | null;
}

export interface ATSFormattingAnalysis {
  id: string;
  analysis_id: string;
  check_type: string;
  check_name: string;
  passed: boolean;
  score: number;
  details: string | null;
  suggestion: string | null;
}

export interface ATSReadability {
  id: string;
  analysis_id: string;
  flesch_score: number | null;
  flesch_grade: string | null;
  avg_sentence_length: number | null;
  avg_word_length: number | null;
  passive_voice_pct: number | null;
  transition_words_pct: number | null;
  bullet_usage_score: number | null;
  paragraph_length_score: number | null;
  overall_score: number;
  suggestions: string[] | null;
}

export interface ATSRecommendation {
  id: string;
  analysis_id: string;
  dimension: ATSDimension;
  title: string;
  description: string;
  impact: ATSImpact;
  effort: string | null;
  category: string | null;
  is_applied: boolean;
  is_dismissed: boolean;
  is_read: boolean;
}

export interface ATSIssue {
  id: string;
  analysis_id: string;
  dimension: ATSDimension;
  title: string;
  description: string;
  severity: ATSSeverity;
  category: string | null;
  is_resolved: boolean;
}

export interface ATSWarning {
  id: string;
  analysis_id: string;
  dimension: ATSDimension;
  title: string;
  description: string;
  severity: ATSSeverity;
  category: string | null;
  is_acknowledged: boolean;
}

export interface ATSImprovement {
  id: string;
  analysis_id: string;
  dimension: ATSDimension;
  title: string;
  description: string;
  impact: ATSImpact;
  effort: string | null;
  category: string | null;
  is_applied: boolean;
}

export interface ATSVersion {
  id: string;
  analysis_id: string;
  version_number: number;
  version_label: string | null;
  snapshot: Record<string, unknown>;
  change_summary: string | null;
  created_at: string;
}

export interface ATSComparison {
  id: string;
  base_analysis_id: string;
  target_analysis_id: string;
  user_id: string;
  score_deltas: Record<string, unknown>;
  match_deltas: Record<string, unknown>;
  gap_deltas: Record<string, unknown>;
  summary: string | null;
  created_at: string;
}

export interface ATSComparisonCreate {
  target_analysis_id: string;
}

export interface ATSHistory {
  id: string;
  analysis_id: string;
  action: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface ATSBenchmark {
  id: string;
  analysis_id: string;
  dimension: ATSDimension;
  score: number;
  industry: string | null;
  role: string | null;
  source: string | null;
  percentile: number | null;
  created_at: string;
}

export interface ATSReport {
  id: string;
  analysis_id: string;
  report_type: string;
  format: string;
  title: string;
  summary: string | null;
  content: Record<string, unknown> | null;
  file_url: string | null;
  created_at: string;
}

export interface ATSReportCreate {
  report_type?: string;
  format?: string;
  title?: string;
  summary?: string;
}

export interface ATSScan {
  id: string;
  analysis_id: string;
  scan_type: ATSScanType;
  started_at: string | null;
  completed_at: string | null;
  items_scanned: number | null;
  items_matched: number | null;
  items_failed: number | null;
  error_log: string[] | null;
}

export interface ATSScanCreate {
  scan_type?: ATSScanType;
}

export interface ATSBulkAction {
  action: string;
  ids: string[];
  payload?: Record<string, unknown>;
}

export interface ATSAnalysisSearchRequest {
  query?: string;
  status?: ATSAnalysisStatus | ATSAnalysisStatus[];
  analysis_type?: ATSAnalysisType;
  grade?: ATSGrade;
  resume_id?: string;
  job_id?: string;
  is_favorite?: boolean;
  min_score?: number;
  max_score?: number;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface ATSAnalysisStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  average_score: number;
  average_keyword_score: number;
  average_skill_score: number;
  average_experience_score: number;
  grade_distribution: Record<string, number>;
  score_distribution: Record<string, number>;
  top_gaps: Array<{ name: string; count: number }>;
  analysis_by_type: Record<string, number>;
  analysis_by_day: Array<{ date: string; count: number }>;
}

export interface ATSApiResponse<T> {
  data: T;
  message?: string;
}

export interface ATSPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
