export type PortfolioStatus = "draft" | "published" | "archived" | "unpublished";
export type PortfolioVisibility = "public" | "private" | "password_protected" | "unlisted";
export type PortfolioVariantType = "base" | "resume_linked" | "company_specific" | "recruiter_specific" | "job_matched" | "ats_optimized";
export type PortfolioSectionType = "header" | "about" | "experience" | "education" | "skills" | "projects" | "certifications" | "publications" | "awards" | "testimonials" | "contact" | "custom";
export type PortfolioProjectType = "personal" | "professional" | "academic" | "open_source" | "freelance" | "contract";
export type PortfolioAssetType = "document" | "image" | "video" | "audio" | "link" | "file";
export type PortfolioMediaType = "image" | "video" | "document";
export type PortfolioShareType = "link" | "email" | "embed" | "qr_code";
export type PortfolioExportFormat = "pdf" | "html" | "json" | "png" | "svg";
export type PortfolioAIRequestType = "generate" | "optimize" | "rewrite" | "analyze" | "suggest_seo" | "suggest_content";
export type PortfolioTimelineType = "experience" | "education" | "certification" | "award" | "custom";
export type PortfolioContactType = "email" | "phone" | "website" | "linkedin" | "github" | "twitter" | "other";
export type PortfolioDeploymentStatus = "pending" | "building" | "deployed" | "failed";
export type PortfolioRecommendationCategory = "content" | "seo" | "design" | "structure" | "performance" | "accessibility";
export type PortfolioOptimizationType = "content" | "seo" | "design" | "structure" | "performance" | "accessibility";

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  headline: string | null;
  status: PortfolioStatus;
  visibility: PortfolioVisibility;
  password_hash: string | null;
  custom_domain: string | null;
  template_id: string | null;
  theme_id: string | null;
  resume_id: string | null;
  job_id: string | null;
  company_id: string | null;
  recruiter_id: string | null;
  cover_letter_id: string | null;
  variant_type: PortfolioVariantType | null;
  published_at: string | null;
  unpublish_reason: string | null;
  is_featured: boolean;
  view_count: number;
  unique_visitor_count: number;
  download_count: number;
  share_count: number;
  last_viewed_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCreate {
  title: string;
  description?: string;
  headline?: string;
  status?: PortfolioStatus;
  visibility?: PortfolioVisibility;
  template_id?: string;
  theme_id?: string;
  resume_id?: string;
  job_id?: string;
  company_id?: string;
  recruiter_id?: string;
  cover_letter_id?: string;
  variant_type?: PortfolioVariantType;
}

export interface PortfolioUpdate {
  title?: string;
  description?: string;
  headline?: string;
  status?: PortfolioStatus;
  visibility?: PortfolioVisibility;
  template_id?: string;
  theme_id?: string;
  custom_domain?: string;
  is_featured?: boolean;
  metadata?: Record<string, unknown>;
}

export interface PortfolioTemplate {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  thumbnail_url: string | null;
  layout_config: Record<string, unknown> | null;
  section_defaults: Record<string, unknown> | null;
  style_config: Record<string, unknown> | null;
  is_system: boolean;
  is_active: boolean;
  use_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioTemplateCreate {
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  layout_config?: Record<string, unknown>;
  section_defaults?: Record<string, unknown>;
  style_config?: Record<string, unknown>;
}

export interface PortfolioTemplateUpdate {
  name?: string;
  description?: string;
  category?: string;
  layout_config?: Record<string, unknown>;
  section_defaults?: Record<string, unknown>;
  style_config?: Record<string, unknown>;
  is_active?: boolean;
}

export interface PortfolioTheme {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  background_color: string | null;
  text_color: string | null;
  font_heading: string | null;
  font_body: string | null;
  font_size_base: number | null;
  border_radius: string | null;
  spacing: string | null;
  css_variables: Record<string, unknown> | null;
  custom_css: string | null;
  is_system: boolean;
  is_dark: boolean;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioThemeCreate {
  name: string;
  slug?: string;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_heading?: string;
  font_body?: string;
  font_size_base?: number;
  border_radius?: string;
  spacing?: string;
  css_variables?: Record<string, unknown>;
  custom_css?: string;
  is_dark?: boolean;
}

export interface PortfolioThemeUpdate {
  name?: string;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_heading?: string;
  font_body?: string;
  font_size_base?: number;
  border_radius?: string;
  spacing?: string;
  css_variables?: Record<string, unknown>;
  custom_css?: string;
  is_dark?: boolean;
  is_active?: boolean;
}

export interface PortfolioSection {
  id: string;
  portfolio_id: string;
  title: string;
  section_type: PortfolioSectionType;
  slug: string | null;
  description: string | null;
  content: Record<string, unknown> | null;
  sort_order: number;
  is_visible: boolean;
  is_collapsible: boolean;
  is_default: boolean;
  style_config: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSectionCreate {
  title: string;
  section_type: PortfolioSectionType;
  slug?: string;
  description?: string;
  content?: Record<string, unknown>;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioSectionUpdate {
  title?: string;
  description?: string;
  content?: Record<string, unknown>;
  sort_order?: number;
  is_visible?: boolean;
  style_config?: Record<string, unknown>;
}

export interface PortfolioSectionItem {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  content: Record<string, unknown> | null;
  media_url: string | null;
  link_url: string | null;
  link_text: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSectionItemCreate {
  title: string;
  description?: string;
  content?: Record<string, unknown>;
  media_url?: string;
  link_url?: string;
  link_text?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioSectionItemUpdate {
  title?: string;
  description?: string;
  content?: Record<string, unknown>;
  media_url?: string;
  link_url?: string;
  link_text?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioProject {
  id: string;
  portfolio_id: string;
  title: string;
  slug: string | null;
  description: string | null;
  summary: string | null;
  project_type: PortfolioProjectType | null;
  role: string | null;
  technologies: string[] | null;
  skills_used: string[] | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
  thumbnail_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  company_name: string | null;
  client_name: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  metrics: Record<string, unknown> | null;
  gallery: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProjectCreate {
  title: string;
  description?: string;
  summary?: string;
  project_type?: PortfolioProjectType;
  role?: string;
  technologies?: string[];
  skills_used?: string[];
  start_date?: string;
  end_date?: string;
  is_ongoing?: boolean;
  thumbnail_url?: string;
  live_url?: string;
  repo_url?: string;
  company_name?: string;
  client_name?: string;
  is_featured?: boolean;
  sort_order?: number;
}

export interface PortfolioProjectUpdate {
  title?: string;
  description?: string;
  summary?: string;
  project_type?: PortfolioProjectType;
  role?: string;
  technologies?: string[];
  skills_used?: string[];
  start_date?: string;
  end_date?: string;
  is_ongoing?: boolean;
  thumbnail_url?: string;
  live_url?: string;
  repo_url?: string;
  company_name?: string;
  client_name?: string;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  metrics?: Record<string, unknown>;
  gallery?: Record<string, unknown>;
}

export interface PortfolioCaseStudy {
  id: string;
  project_id: string;
  title: string;
  slug: string | null;
  summary: string | null;
  challenge: string | null;
  approach: string | null;
  solution: string | null;
  results: string | null;
  outcomes: string[] | null;
  key_metrics: Record<string, unknown> | null;
  technologies_used: string[] | null;
  lessons_learned: string | null;
  thumbnail_url: string | null;
  gallery: Record<string, unknown> | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCaseStudyCreate {
  title: string;
  summary?: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  results?: string;
  outcomes?: string[];
  key_metrics?: Record<string, unknown>;
  technologies_used?: string[];
  lessons_learned?: string;
  thumbnail_url?: string;
  sort_order?: number;
}

export interface PortfolioCaseStudyUpdate {
  title?: string;
  summary?: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  results?: string;
  outcomes?: string[];
  key_metrics?: Record<string, unknown>;
  technologies_used?: string[];
  lessons_learned?: string;
  thumbnail_url?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioGallery {
  id: string;
  portfolio_id: string;
  title: string;
  description: string | null;
  layout: string;
  columns: number;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioMedia {
  id: string;
  portfolio_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  alt_text: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  thumbnail_url: string | null;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAsset {
  id: string;
  portfolio_id: string;
  name: string;
  asset_type: PortfolioAssetType;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  is_downloadable: boolean;
  download_count: number;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAssetCreate {
  name: string;
  asset_type: PortfolioAssetType;
  file_url?: string;
  file_name?: string;
  description?: string;
  is_downloadable?: boolean;
  sort_order?: number;
}

export interface PortfolioAssetUpdate {
  name?: string;
  file_url?: string;
  description?: string;
  is_downloadable?: boolean;
  sort_order?: number;
}

export interface PortfolioCertification {
  id: string;
  portfolio_id: string;
  certification_id: string | null;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCertificationCreate {
  name: string;
  issuer?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioPublication {
  id: string;
  portfolio_id: string;
  publication_id: string | null;
  title: string;
  publisher: string | null;
  publication_date: string | null;
  url: string | null;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioPublicationCreate {
  title: string;
  publisher?: string;
  publication_date?: string;
  url?: string;
  description?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioAward {
  id: string;
  portfolio_id: string;
  award_id: string | null;
  title: string;
  issuer: string | null;
  date: string | null;
  description: string | null;
  url: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAwardCreate {
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
  url?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioTestimonial {
  id: string;
  portfolio_id: string;
  author_name: string;
  author_title: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
  relationship: string | null;
  date: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioTestimonialCreate {
  author_name: string;
  author_title?: string;
  author_company?: string;
  author_avatar_url?: string;
  content: string;
  rating?: number;
  relationship?: string;
  date?: string;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioTimeline {
  id: string;
  portfolio_id: string;
  timeline_type: PortfolioTimelineType;
  title: string;
  organization: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  linked_entity_id: string | null;
  linked_entity_type: string | null;
  sort_order: number;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioTimelineCreate {
  timeline_type: PortfolioTimelineType;
  title: string;
  organization?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  sort_order?: number;
  is_visible?: boolean;
}

export interface PortfolioContact {
  id: string;
  portfolio_id: string;
  contact_type: PortfolioContactType;
  value: string;
  label: string | null;
  is_primary: boolean;
  is_visible: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioContactCreate {
  contact_type: PortfolioContactType;
  value: string;
  label?: string;
  is_primary?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

export interface PortfolioFormSubmission {
  id: string;
  portfolio_id: string;
  sender_name: string | null;
  sender_email: string;
  subject: string | null;
  message: string;
  form_type: string;
  is_read: boolean;
  is_archived: boolean;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioVisitor {
  id: string;
  portfolio_id: string;
  visitor_id: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  is_recruiter: boolean;
  is_company: boolean;
  company_name: string | null;
  visit_count: number;
  first_visit_at: string | null;
  last_visit_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAnalytics {
  id: string;
  portfolio_id: string;
  date: string;
  views: number;
  unique_visitors: number;
  downloads: number;
  shares: number;
  contact_requests: number;
  resume_downloads: number;
  recruiter_visits: number;
  company_visits: number;
  avg_time_on_page: number | null;
  bounce_rate: number | null;
  ctr: number | null;
  referral_sources: Record<string, unknown> | null;
  geo_distribution: Record<string, unknown> | null;
  device_types: Record<string, unknown> | null;
  traffic_sources: Record<string, unknown> | null;
  project_views: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioView {
  id: string;
  portfolio_id: string;
  visitor_id: string | null;
  page_section: string | null;
  duration_seconds: number | null;
  referrer: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioShare {
  id: string;
  portfolio_id: string;
  user_id: string;
  share_token: string;
  share_type: PortfolioShareType;
  permission: string;
  is_active: boolean;
  is_expired: boolean;
  expires_at: string | null;
  access_count: number;
  max_access_count: number | null;
  shared_with_email: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioShareCreate {
  share_type?: PortfolioShareType;
  permission?: string;
  expires_at?: string;
  max_access_count?: number;
  shared_with_email?: string;
  message?: string;
}

export interface PortfolioQRCode {
  id: string;
  portfolio_id: string;
  url: string;
  qr_image_url: string | null;
  size: string;
  error_correction: string;
  foreground_color: string | null;
  background_color: string | null;
  scan_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioQRCodeCreate {
  url?: string;
  size?: string;
  error_correction?: string;
  foreground_color?: string;
  background_color?: string;
}

export interface PortfolioDeployment {
  id: string;
  portfolio_id: string;
  deployment_url: string | null;
  status: PortfolioDeploymentStatus;
  provider: string | null;
  build_log: string | null;
  deployed_at: string | null;
  version_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSEO {
  id: string;
  portfolio_id: string;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  keywords: string[] | null;
  robots: string | null;
  structured_data: Record<string, unknown> | null;
  seo_score: number | null;
  readability_score: number | null;
  keyword_coverage: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSEOUpdate {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  keywords?: string[];
  robots?: string;
}

export interface PortfolioDomain {
  id: string;
  portfolio_id: string;
  domain: string;
  is_verified: boolean;
  is_primary: boolean;
  verification_token: string | null;
  ssl_status: string | null;
  dns_records: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCustomization {
  id: string;
  portfolio_id: string;
  custom_css: string | null;
  custom_js: string | null;
  header_html: string | null;
  footer_html: string | null;
  favicon_url: string | null;
  logo_url: string | null;
  social_links: Record<string, string> | null;
  analytics_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioComparison {
  id: string;
  user_id: string;
  name: string | null;
  portfolio_a_id: string;
  portfolio_b_id: string;
  comparison_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHistory {
  id: string;
  portfolio_id: string;
  action: string;
  description: string | null;
  snapshot_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSnapshot {
  id: string;
  portfolio_id: string;
  version_id: string | null;
  snapshot_data: Record<string, unknown>;
  label: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioVersion {
  id: string;
  portfolio_id: string;
  version_number: number;
  label: string | null;
  snapshot_data: Record<string, unknown>;
  change_summary: string | null;
  is_current: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAIRequest {
  id: string;
  portfolio_id: string;
  user_id: string;
  request_type: PortfolioAIRequestType;
  prompt: string | null;
  provider: string | null;
  model: string | null;
  prompt_version: string | null;
  execution_id: string | null;
  status: string;
  input_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAIResult {
  id: string;
  request_id: string;
  output_data: Record<string, unknown> | null;
  confidence: number | null;
  reasoning: string | null;
  suggestions: string[] | null;
  seo_score: number | null;
  readability_score: number | null;
  professionalism_score: number | null;
  visual_balance: number | null;
  keyword_coverage: number | null;
  recruiter_appeal: number | null;
  company_alignment: number | null;
  industry_alignment: number | null;
  expected_engagement: number | null;
  accessibility_score: number | null;
  performance_score: number | null;
  tokens_used: number | null;
  latency_ms: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioRecommendation {
  id: string;
  portfolio_id: string;
  user_id: string;
  category: PortfolioRecommendationCategory;
  title: string;
  description: string | null;
  priority: string;
  impact: string | null;
  action_url: string | null;
  is_dismissed: boolean;
  is_read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioOptimization {
  id: string;
  portfolio_id: string;
  user_id: string;
  optimization_type: PortfolioOptimizationType;
  score_before: number | null;
  score_after: number | null;
  changes: Record<string, unknown> | null;
  suggestions: string[] | null;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioTag {
  id: string;
  portfolio_id: string;
  tag: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioExport {
  id: string;
  portfolio_id: string;
  user_id: string;
  export_format: PortfolioExportFormat;
  file_url: string | null;
  file_size: number | null;
  status: string;
  options: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSettings {
  id: string;
  user_id: string;
  default_visibility: PortfolioVisibility;
  default_template_id: string | null;
  default_theme_id: string | null;
  show_resume_link: boolean;
  show_contact_form: boolean;
  show_social_links: boolean;
  allow_downloads: boolean;
  track_visitors: boolean;
  email_notifications: boolean;
  custom_footer: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSettingsUpdate {
  default_visibility?: PortfolioVisibility;
  default_template_id?: string;
  default_theme_id?: string;
  show_resume_link?: boolean;
  show_contact_form?: boolean;
  show_social_links?: boolean;
  allow_downloads?: boolean;
  track_visitors?: boolean;
  email_notifications?: boolean;
  custom_footer?: string;
}

export interface PortfolioNotification {
  id: string;
  user_id: string;
  portfolio_id: string | null;
  notification_type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  action_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioDetail extends Portfolio {
  sections: PortfolioSection[];
  projects: PortfolioProject[];
  assets: PortfolioAsset[];
  tags: PortfolioTag[];
}

export interface PortfolioDashboardStats {
  total_portfolios: number;
  published_count: number;
  draft_count: number;
  total_views: number;
  total_unique_visitors: number;
  total_shares: number;
  total_contact_requests: number;
  recent_portfolios: Portfolio[];
}

export interface PortfolioSearchRequest {
  query: string;
  status?: PortfolioStatus;
  visibility?: PortfolioVisibility;
  page?: number;
  per_page?: number;
}

export interface PortfolioBulkAction {
  action: string;
  portfolio_ids: string[];
}

export interface PortfolioExportRequest {
  format: PortfolioExportFormat;
  options?: Record<string, unknown>;
}

export interface PortfolioAIAssistRequest {
  request_type: PortfolioAIRequestType;
  prompt?: string;
  context?: Record<string, unknown>;
}

export interface PortfolioAnalyticsSummary {
  total_views: number;
  total_unique_visitors: number;
  total_downloads: number;
  total_shares: number;
  total_contact_requests: number;
  total_recruiter_visits: number;
  total_company_visits: number;
  avg_time_on_page: number;
  avg_bounce_rate: number;
}

export interface PortfolioPaginatedMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PortfolioPaginatedResponse<T> {
  data: T[];
  meta: PortfolioPaginatedMeta;
}
