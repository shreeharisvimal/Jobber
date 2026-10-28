export type SuggestionType = "rewrite" | "keyword" | "bullet" | "summary" | "headline" | "section" | "skill" | "achievement";
export type SessionType = "manual" | "auto" | "scheduled";
export type SessionStatus = "draft" | "running" | "completed" | "failed" | "cancelled";
export type SuggestionStatus = "pending" | "accepted" | "rejected" | "applied" | "rolled_back";
export type Severity = "low" | "medium" | "high" | "critical";
export type ApprovalAction = "accepted" | "rejected" | "edited";
export type ApprovalType = "individual" | "batch" | "session";

export interface ResumeOptimizationSession {
  id: string;
  resume_id: string;
  job_id: string | null;
  version_id: string | null;
  ats_analysis_id: string | null;
  user_id: string;
  session_type: SessionType;
  status: SessionStatus;
  name: string;
  description: string | null;
  configuration: Record<string, unknown> | null;
  total_suggestions: number;
  accepted_count: number;
  rejected_count: number;
  applied_count: number;
  overall_confidence: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeOptimizationSessionCreate {
  resume_id: string;
  job_id?: string;
  version_id?: string;
  ats_analysis_id?: string;
  session_type?: SessionType;
  name: string;
  description?: string;
  configuration?: Record<string, unknown>;
}

export interface ResumeOptimizationSessionUpdate {
  name?: string;
  description?: string;
  status?: SessionStatus;
  configuration?: Record<string, unknown>;
}

export interface ResumeOptimizationResult {
  id: string;
  session_id: string;
  resume_id: string;
  dimension: string;
  score_before: number | null;
  score_after: number | null;
  improvement_pct: number | null;
  metrics: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeSuggestion {
  id: string;
  session_id: string;
  resume_id: string;
  suggestion_type: SuggestionType;
  target_section: string | null;
  target_entity_id: string | null;
  target_field: string | null;
  original_value: string | null;
  suggested_value: string | null;
  reason: string | null;
  expected_impact: string | null;
  confidence: number;
  priority: number;
  severity: Severity;
  expected_score_gain: number | null;
  status: SuggestionStatus;
  affected_keywords: string[] | null;
  affected_sections: string[] | null;
  affected_rules: string[] | null;
  affected_requirements: string[] | null;
  ai_provider: string | null;
  ai_model: string | null;
  ai_prompt_version: string | null;
  ai_execution_id: string | null;
  ai_metadata: Record<string, unknown> | null;
  is_applied: boolean;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeSuggestionCreate {
  session_id: string;
  resume_id: string;
  suggestion_type: SuggestionType;
  target_section?: string;
  target_entity_id?: string;
  target_field?: string;
  original_value?: string;
  suggested_value?: string;
  reason?: string;
  expected_impact?: string;
  confidence?: number;
  priority?: number;
  severity?: Severity;
  expected_score_gain?: number;
  affected_keywords?: string[];
  affected_sections?: string[];
  affected_rules?: string[];
  affected_requirements?: string[];
  ai_provider?: string;
  ai_model?: string;
  ai_prompt_version?: string;
  ai_execution_id?: string;
  ai_metadata?: Record<string, unknown>;
}

export interface ResumeRewrite {
  id: string;
  suggestion_id: string;
  rewrite_type: string;
  original_text: string | null;
  suggested_text: string;
  diff: Record<string, unknown> | null;
  word_count_before: number | null;
  word_count_after: number | null;
  tone: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeKeywordSuggestion {
  id: string;
  suggestion_id: string;
  keyword: string;
  action: string;
  current_count: number | null;
  suggested_count: number | null;
  current_density: number | null;
  suggested_density: number | null;
  target_section: string | null;
  context: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeBulletSuggestion {
  id: string;
  suggestion_id: string;
  section_type: string;
  section_id: string | null;
  bullet_index: number | null;
  original_text: string | null;
  suggested_text: string;
  action: string;
  bullet_type: string | null;
  metrics_before: Record<string, unknown> | null;
  metrics_after: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeSummarySuggestion {
  id: string;
  suggestion_id: string;
  original_summary: string | null;
  suggested_summary: string;
  original_word_count: number | null;
  suggested_word_count: number | null;
  tone: string | null;
  focus_areas: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeHeadlineSuggestion {
  id: string;
  suggestion_id: string;
  original_headline: string | null;
  suggested_headline: string;
  headline_type: string;
  keywords_included: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeSectionSuggestion {
  id: string;
  suggestion_id: string;
  section_type: string;
  action: string;
  section_order_before: number | null;
  section_order_after: number | null;
  original_name: string | null;
  suggested_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeSkillSuggestion {
  id: string;
  suggestion_id: string;
  skill_name: string;
  skill_category: string | null;
  action: string;
  relevance_score: number | null;
  proficiency_before: string | null;
  proficiency_after: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeAchievementSuggestion {
  id: string;
  suggestion_id: string;
  achievement_type: string;
  original_text: string | null;
  suggested_text: string;
  quantified_impact: string | null;
  metrics_added: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeOptimizationRule {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  rule_type: string;
  condition: Record<string, unknown>;
  action: Record<string, unknown>;
  weight: number;
  is_active: boolean;
  is_system: boolean;
  priority: number;
  category: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeOptimizationRuleCreate {
  name: string;
  description?: string;
  rule_type: string;
  condition: Record<string, unknown>;
  action: Record<string, unknown>;
  weight?: number;
  is_active?: boolean;
  priority?: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface ResumeOptimizationRuleUpdate {
  name?: string;
  description?: string;
  rule_type?: string;
  condition?: Record<string, unknown>;
  action?: Record<string, unknown>;
  weight?: number;
  is_active?: boolean;
  priority?: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface ResumeOptimizationHistory {
  id: string;
  session_id: string | null;
  suggestion_id: string | null;
  user_id: string;
  action: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface ResumeOptimizationFeedback {
  id: string;
  suggestion_id: string;
  user_id: string;
  rating: number;
  feedback_type: string;
  comments: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeOptimizationFeedbackCreate {
  suggestion_id: string;
  rating: number;
  feedback_type: string;
  comments?: string;
  category?: string;
}

export interface ResumeOptimizationApproval {
  id: string;
  session_id: string;
  suggestion_id: string | null;
  user_id: string;
  approval_type: ApprovalType;
  action: ApprovalAction;
  edited_suggestion: Record<string, unknown> | null;
  applied: boolean;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeOptimizationArtifact {
  id: string;
  session_id: string;
  artifact_type: string;
  name: string;
  description: string | null;
  content: Record<string, unknown> | null;
  file_url: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface ResumeOptimizationComparison {
  id: string;
  session_id: string;
  base_snapshot_id: string | null;
  target_snapshot_id: string | null;
  comparison_type: string;
  summary: string | null;
  changes: Record<string, unknown> | null;
  score_delta: Record<string, unknown> | null;
  created_at: string;
}

export interface ResumeOptimizationBulkAction {
  action: string;
  suggestion_ids: string[];
  payload?: Record<string, unknown>;
}

export interface ResumeOptimizationSearchRequest {
  query?: string;
  status?: SuggestionStatus;
  suggestion_type?: SuggestionType;
  session_id?: string;
  resume_id?: string;
  severity?: Severity;
  min_confidence?: number;
  max_confidence?: number;
  is_applied?: boolean;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface ResumeOptimizationStats {
  total_sessions: number;
  total_suggestions: number;
  accepted_count: number;
  rejected_count: number;
  applied_count: number;
  pending_count: number;
  average_confidence: number | null;
  average_priority: number | null;
  suggestions_by_type: Record<string, number>;
  suggestions_by_severity: Record<string, number>;
  sessions_by_status: Record<string, number>;
  score_improvement_avg: number | null;
}
