export interface Resume {
  id: string;
  user_id: string;
  career_profile_id: string;
  title: string;
  slug: string;
  description: string | null;
  template_id: string | null;
  status: "draft" | "published" | "archived";
  visibility: "private" | "contacts_only" | "public";
  is_default: boolean;
  sort_order: number;
  target_role: string | null;
  target_company: string | null;
  target_industry: string | null;
  language: string;
  deleted_at: string | null;
  ai_generated: boolean;
  ai_optimization_score: number | null;
  ai_ats_score: number | null;
  last_ai_optimized_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeListItem extends Resume {
  tags: ResumeTag[];
  analytics: Pick<ResumeAnalytics, "views" | "downloads" | "completeness_score"> | null;
  section_count: number;
}

export interface ResumeDetail extends Resume {
  sections: ResumeSection[];
  tags: ResumeTag[];
  analytics: ResumeAnalytics | null;
  customizations: ResumeCustomization[];
  template: ResumeTemplate | null;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  title: string;
  status: string;
  snapshot_data: ResumeSnapshotData;
  change_summary: string | null;
  published_at: string | null;
  created_by: string;
  parent_version_id: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeSnapshotData {
  sections: ResumeSection[];
  customizations: ResumeCustomization[];
  settings: Record<string, unknown>;
}

export type SectionType =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "awards"
  | "languages"
  | "volunteer"
  | "publications"
  | "patents"
  | "custom";

export interface ResumeSection {
  id: string;
  resume_id: string;
  section_type: SectionType;
  title: string;
  is_enabled: boolean;
  is_visible: boolean;
  sort_order: number;
  referenced_entity_ids: string[] | null;
  custom_content: string | null;
  max_items: number | null;
  show_descriptions: boolean;
  show_dates: boolean;
  show_bullets: boolean;
  condense_descriptions: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeCustomization {
  id: string;
  resume_id: string;
  entity_type: string;
  entity_id: string;
  custom_title: string | null;
  custom_description: string | null;
  custom_bullets: string[] | null;
  custom_highlights: string[] | null;
  is_included: boolean;
  sort_order: number;
  description_mode: "original" | "condensed" | "expanded" | "custom";
  created_at: string;
  updated_at: string;
}

export type TemplateCategory =
  | "modern"
  | "minimal"
  | "executive"
  | "engineering"
  | "designer"
  | "academic"
  | "compact"
  | "creative";

export interface ResumeTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: TemplateCategory;
  thumbnail_url: string | null;
  layout_config: Record<string, unknown>;
  color_scheme: Record<string, unknown> | null;
  typography: Record<string, unknown> | null;
  is_system: boolean;
  is_active: boolean;
  created_by: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExportHistoryEntry {
  format: string;
  timestamp: string;
  count: number;
}

export interface ResumeAnalytics {
  id: string;
  resume_id: string;
  views: number;
  downloads: number;
  shares: number;
  unique_views: number;
  last_viewed_at: string | null;
  last_downloaded_at: string | null;
  last_shared_at: string | null;
  export_history: ExportHistoryEntry[];
  completeness_score: number;
  ai_optimization_score: number | null;
  ai_ats_score: number | null;
  last_analyzed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeTag {
  id: string;
  resume_id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  items?: ResumeCollectionItem[];
}

export interface ResumeCollectionItem {
  id: string;
  collection_id: string;
  resume_id: string;
  sort_order: number;
  resume?: ResumeListItem;
}

export interface ResumeShare {
  id: string;
  resume_id: string;
  shared_by: string;
  shared_with: string | null;
  permission: "view" | "comment" | "edit";
  share_token: string | null;
  expires_at: string | null;
  is_active: boolean;
  access_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResumeComment {
  id: string;
  resume_id: string;
  user_id: string;
  section_type: string | null;
  entity_type: string | null;
  entity_id: string | null;
  content: string;
  parent_comment_id: string | null;
  is_resolved: boolean;
  position: { x: number; y: number } | null;
  created_at: string;
  updated_at: string;
}

export type ExportFormat = "json" | "html" | "docx" | "pdf" | "linkedin" | "portfolio";

export interface ResumeExport {
  id: string;
  resume_id: string;
  version_id: string | null;
  user_id: string;
  format: ExportFormat;
  status: "pending" | "processing" | "completed" | "failed";
  file_url: string | null;
  file_size: number | null;
  settings: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeHistory {
  id: string;
  resume_id: string;
  version_id: string | null;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeOptimization {
  id: string;
  resume_id: string;
  version_id: string | null;
  optimization_type: string;
  status: "suggested" | "accepted" | "rejected" | "applied";
  original_data: Record<string, unknown>;
  suggested_data: Record<string, unknown>;
  confidence: number | null;
  explanation: string | null;
  ai_model: string | null;
  ai_suggestions: string[] | null;
  human_approved: boolean;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeFeedback {
  id: string;
  resume_id: string;
  version_id: string | null;
  user_id: string;
  feedback_type: "rating" | "comment" | "suggestion" | "issue";
  rating: number | null;
  content: string | null;
  section_type: string | null;
  entity_type: string | null;
  entity_id: string | null;
  is_addressed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeSnapshot {
  id: string;
  resume_id: string;
  version_id: string;
  snapshot_data: ResumeSnapshotData;
  created_at: string;
  updated_at: string;
}

export interface ResumeCreate {
  career_profile_id: string;
  title: string;
  description?: string;
  template_id?: string;
  target_role?: string;
  target_company?: string;
  target_industry?: string;
  language?: string;
}

export interface ResumeUpdate {
  title?: string;
  description?: string;
  template_id?: string;
  status?: string;
  visibility?: string;
  target_role?: string;
  target_company?: string;
  target_industry?: string;
  language?: string;
}

export interface ResumeSearchRequest {
  query?: string;
  tags?: string[];
  template_id?: string;
  status?: string;
  visibility?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  offset?: number;
  limit?: number;
}

export interface ResumeAnalyticsSummary {
  total_resumes: number;
  total_views: number;
  total_downloads: number;
  total_shares: number;
  avg_completeness: number;
  avg_optimization_score: number | null;
}

export interface ResumeBulkAction {
  action: "archive" | "delete" | "tag" | "set_visibility";
  resume_ids: string[];
  value?: string;
}
