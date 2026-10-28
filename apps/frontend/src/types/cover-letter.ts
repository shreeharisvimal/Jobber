// ─── Union Types ───

export type CoverLetterStatus = "draft" | "generated" | "reviewing" | "approved" | "submitted" | "archived";
export type CoverLetterTone = "professional" | "casual" | "enthusiastic" | "formal" | "creative" | "confident" | "humble";
export type CoverLetterStyle = "standard" | "narrative" | "achievement" | "value_proposition" | "storytelling" | "minimal";
export type SuggestionType = "grammar" | "tone" | "clarity" | "impact" | "relevance" | "conciseness" | "flow" | "keyword";
export type SuggestionStatus = "pending" | "accepted" | "dismissed" | "applied";
export type RewriteStatus = "pending" | "accepted" | "undone";
export type OptimizationType = "score" | "ats" | "keyword" | "tone" | "length" | "impact" | "grammar" | "readability";
export type ApprovalStatus = "none" | "pending" | "approved" | "rejected";
export type SharePermission = "view" | "comment" | "edit";
export type CommentStatus = "open" | "resolved";
export type EventType = "created" | "updated" | "generated" | "optimized" | "approved" | "rejected" | "shared" | "exported" | "versioned" | "commented";
export type TemplateIndustry = "technology" | "finance" | "healthcare" | "education" | "marketing" | "design" | "engineering" | "sales" | "general";
export type AIProvider = "openai" | "anthropic" | "google" | "local";

// ─── CoverLetter ───

export interface CoverLetter {
  id: string;
  user_id: string;
  title: string;
  company_name: string;
  job_title: string;
  recipient_name: string | null;
  recipient_email: string | null;
  content: string;
  status: CoverLetterStatus;
  tone: CoverLetterTone;
  style: CoverLetterStyle;
  overall_score: number | null;
  ats_score: number | null;
  tone_score: number | null;
  clarity_score: number | null;
  impact_score: number | null;
  relevance_score: number | null;
  version: number;
  is_bookmarked: boolean;
  is_current: boolean;
  template_id: string | null;
  template_name: string | null;
  tags: string[];
  metadata: Record<string, unknown> | null;
  word_count: number;
  char_count: number;
  view_count: number;
  share_count: number;
  export_count: number;
  rating: number | null;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

export interface CoverLetterCreate {
  title: string;
  company_name: string;
  job_title: string;
  recipient_name?: string;
  recipient_email?: string;
  content?: string;
  tone?: CoverLetterTone;
  style?: CoverLetterStyle;
  template_id?: string;
  tags?: string[];
}

export interface CoverLetterUpdate {
  title?: string;
  company_name?: string;
  job_title?: string;
  recipient_name?: string;
  recipient_email?: string;
  content?: string;
  status?: CoverLetterStatus;
  tone?: CoverLetterTone;
  style?: CoverLetterStyle;
  tags?: string[];
  is_bookmarked?: boolean;
}

// ─── CoverLetter Version ───

export interface CoverLetterVersion {
  id: string;
  cover_letter_id: string;
  version_number: number;
  content: string;
  title: string;
  change_summary: string | null;
  tone: CoverLetterTone;
  style: CoverLetterStyle;
  overall_score: number | null;
  word_count: number;
  is_current: boolean;
  created_by: string | null;
  created_at: string;
}

export interface CoverLetterVersionCreate {
  change_summary?: string;
}

// ─── CoverLetter Suggestion ───

export interface CoverLetterSuggestion {
  id: string;
  cover_letter_id: string;
  suggestion_type: SuggestionType;
  original_text: string;
  suggested_text: string;
  reasoning: string | null;
  confidence: number | null;
  status: SuggestionStatus;
  position_start: number | null;
  position_end: number | null;
  applied_at: string | null;
  created_at: string;
}

export interface CoverLetterSuggestionUpdate {
  status: SuggestionStatus;
}

// ─── CoverLetter Rewrite ───

export interface CoverLetterRewrite {
  id: string;
  cover_letter_id: string;
  original_text: string;
  rewritten_text: string;
  rewrite_reason: string | null;
  tone: CoverLetterTone | null;
  status: RewriteStatus;
  applied_at: string | null;
  created_at: string;
}

// ─── CoverLetter Optimization ───

export interface CoverLetterOptimization {
  id: string;
  cover_letter_id: string;
  optimization_type: OptimizationType;
  score_before: number | null;
  score_after: number | null;
  improvement_percentage: number | null;
  suggestions_count: number;
  changes_summary: string | null;
  applied: boolean;
  created_at: string;
}

// ─── CoverLetter Approval ───

export interface CoverLetterApproval {
  id: string;
  cover_letter_id: string;
  status: ApprovalStatus;
  reviewer_name: string | null;
  reviewer_email: string | null;
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
}

export interface CoverLetterApprovalCreate {
  reviewer_name?: string;
  reviewer_email?: string;
  notes?: string;
}

// ─── CoverLetter Share ───

export interface CoverLetterShare {
  id: string;
  cover_letter_id: string;
  share_token: string;
  share_url: string;
  permission: SharePermission;
  recipient_name: string | null;
  recipient_email: string | null;
  expires_at: string | null;
  access_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CoverLetterShareCreate {
  permission: SharePermission;
  recipient_name?: string;
  recipient_email?: string;
  expires_at?: string;
}

// ─── CoverLetter Comment ───

export interface CoverLetterComment {
  id: string;
  cover_letter_id: string;
  user_id: string;
  user_name: string;
  content: string;
  position_start: number | null;
  position_end: number | null;
  selected_text: string | null;
  parent_id: string | null;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface CoverLetterCommentCreate {
  content: string;
  position_start?: number;
  position_end?: number;
  selected_text?: string;
  parent_id?: string;
}

// ─── CoverLetter Template ───

export interface CoverLetterTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  industry: TemplateIndustry;
  tone: CoverLetterTone;
  style: CoverLetterStyle;
  content: string;
  placeholders: string[];
  tags: string[];
  is_public: boolean;
  usage_count: number;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface CoverLetterTemplateCreate {
  name: string;
  description?: string;
  industry: TemplateIndustry;
  tone: CoverLetterTone;
  style: CoverLetterStyle;
  content: string;
  placeholders?: string[];
  tags?: string[];
  is_public?: boolean;
}

export interface CoverLetterTemplateUpdate {
  name?: string;
  description?: string;
  industry?: TemplateIndustry;
  tone?: CoverLetterTone;
  style?: CoverLetterStyle;
  content?: string;
  placeholders?: string[];
  tags?: string[];
  is_public?: boolean;
}

// ─── CoverLetter Collection ───

export interface CoverLetterCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_public: boolean;
  sort_order: number;
  letter_count: number;
  created_at: string;
  updated_at: string;
}

export interface CoverLetterCollectionCreate {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_public?: boolean;
  sort_order?: number;
}

export interface CoverLetterCollectionUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  is_public?: boolean;
  sort_order?: number;
}

export interface CoverLetterCollectionItem {
  id: string;
  collection_id: string;
  cover_letter_id: string;
  notes: string | null;
  sort_order: number;
}

// ─── CoverLetter History ───

export interface CoverLetterHistory {
  id: string;
  cover_letter_id: string;
  user_id: string | null;
  event_type: EventType;
  event_data: Record<string, unknown> | null;
  description: string | null;
  created_at: string;
}

// ─── CoverLetter Report ───

export interface CoverLetterReport {
  id: string;
  cover_letter_id: string;
  user_id: string;
  report_type: string;
  title: string;
  summary: string | null;
  sections: Record<string, unknown>;
  score: number | null;
  created_at: string;
}

// ─── CoverLetter Analytics ───

export interface CoverLetterAnalytics {
  view_count: number;
  share_count: number;
  export_count: number;
  average_rating: number | null;
  rating_count: number;
  comment_count: number;
  top_tones: Array<{ tone: CoverLetterTone; count: number }>;
  score_trend: Array<{ date: string; score: number }>;
}

// ─── CoverLetter Settings ───

export interface CoverLetterSettings {
  default_tone: CoverLetterTone;
  default_style: CoverLetterStyle;
  default_temperature: number;
  max_tokens: number;
  auto_generate: boolean;
  auto_optimize: boolean;
  signature_name: string;
  signature_title: string;
  signature_email: string;
  signature_phone: string;
  signature_linkedin: string;
  ai_provider: AIProvider;
  ai_model: string;
}

export interface CoverLetterSettingsUpdate {
  default_tone?: CoverLetterTone;
  default_style?: CoverLetterStyle;
  default_temperature?: number;
  max_tokens?: number;
  auto_generate?: boolean;
  auto_optimize?: boolean;
  signature_name?: string;
  signature_title?: string;
  signature_email?: string;
  signature_phone?: string;
  signature_linkedin?: string;
  ai_provider?: AIProvider;
  ai_model?: string;
}

// ─── CoverLetter Generate ───

export interface CoverLetterGenerateRequest {
  template_id?: string;
  company_name: string;
  job_title: string;
  job_description?: string;
  recipient_name?: string;
  tone: CoverLetterTone;
  style: CoverLetterStyle;
  temperature?: number;
  focus_areas?: string[];
  additional_context?: string;
}

export interface CoverLetterGenerateResponse {
  content: string;
  title: string;
  score: number | null;
  suggestions: Array<{
    type: SuggestionType;
    text: string;
    reasoning: string;
  }>;
}

// ─── CoverLetter Stats ───

export interface CoverLetterStats {
  total_letters: number;
  generated_count: number;
  approved_count: number;
  average_score: number | null;
  total_templates: number;
  total_collections: number;
  recent_activity: CoverLetterHistory[];
  tone_distribution: Record<CoverLetterTone, number>;
  status_distribution: Record<CoverLetterStatus, number>;
}

// ─── Request / Utility Types ───

export interface CoverLetterSearchRequest {
  query?: string;
  status?: CoverLetterStatus | null;
  tone?: CoverLetterTone | null;
  style?: CoverLetterStyle | null;
  min_score?: number | null;
  max_score?: number | null;
  date_from?: string | null;
  date_to?: string | null;
  tags?: string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page: number;
  per_page: number;
}

export interface CoverLetterBulkAction {
  action: string;
  cover_letter_ids: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
