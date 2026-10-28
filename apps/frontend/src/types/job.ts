export type JobStatus =
  | "active"
  | "closed"
  | "expired"
  | "draft"
  | "saved";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "freelance"
  | "temporary"
  | "other";

export type RemoteStatus =
  | "remote"
  | "hybrid"
  | "on_site"
  | "flexible";

export type ExperienceLevel =
  | "entry"
  | "mid"
  | "senior"
  | "lead"
  | "executive";

export type JobSource =
  | "linkedin"
  | "indeed"
  | "wellfound"
  | "greenhouse"
  | "lever"
  | "ashby"
  | "company_careers"
  | "manual"
  | "json_import";

export type RequirementCategory =
  | "required"
  | "preferred"
  | "nice_to_have";

export type SkillCategory =
  | "programming"
  | "framework"
  | "tool"
  | "soft_skill"
  | "domain"
  | "language"
  | "certification";

export type AnalysisStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ProcessingStage =
  | "raw"
  | "parsed"
  | "structured"
  | "analyzed"
  | "scored";

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company_name: string;
  company_id: string | null;
  description: string;
  summary: string | null;
  employment_type: EmploymentType | null;
  remote_status: RemoteStatus | null;
  experience_level: ExperienceLevel | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  is_remote_friendly: boolean;
  status: JobStatus;
  is_active: boolean;
  is_saved: boolean;
  is_favorited: boolean;
  is_applied: boolean;
  application_url: string | null;
  application_deadline: string | null;
  source: string | null;
  source_url: string | null;
  source_id: string | null;
  posted_at: string | null;
  fetched_at: string | null;
  expires_at: string | null;
  ai_generated: boolean;
  ai_analysis_status: AnalysisStatus;
  ai_confidence: number | null;
  ai_processing_stage: ProcessingStage | null;
  verified: boolean;
  user_verified: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobListItem extends Job {
  tags: JobTag[];
  required_skills: RequiredSkill[];
  keyword_count: number;
}

export interface JobDetail extends Job {
  requirements: JobRequirement[];
  required_skills: RequiredSkill[];
  preferred_skills: PreferredSkill[];
  responsibilities: Responsibility[];
  qualifications: Qualification[];
  benefits: Benefit[];
  compensation: JobCompensation | null;
  job_location: JobLocation | null;
  tags: JobTag[];
  keywords: Keyword[];
  hiring_managers: HiringManager[];
  application_methods: ApplicationMethod[];
  application_questions: ApplicationQuestion[];
  versions: JobVersion[];
  analyses: JobAnalysis[];
  scores: JobScore[];
  gaps: JobGap[];
  recommendations: JobRecommendation[];
}

export interface JobVersion {
  id: string;
  job_id: string;
  version_number: number;
  snapshot_data: Record<string, unknown>;
  change_summary: string | null;
  created_by: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRequirement {
  id: string;
  job_id: string;
  category: RequirementCategory;
  requirement_type: string;
  content: string;
  normalize_value: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RequiredSkill {
  id: string;
  job_id: string;
  name: string;
  normalized_name: string | null;
  category: SkillCategory | null;
  proficiency: string | null;
  years_required: number | null;
  is_mandatory: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PreferredSkill {
  id: string;
  job_id: string;
  name: string;
  normalized_name: string | null;
  category: SkillCategory | null;
  proficiency: string | null;
  years_required: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Responsibility {
  id: string;
  job_id: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Qualification {
  id: string;
  job_id: string;
  content: string;
  qualification_type: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Benefit {
  id: string;
  job_id: string;
  name: string;
  category: string | null;
  description: string | null;
  value: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface JobCompensation {
  id: string;
  job_id: string;
  base_salary_min: number | null;
  base_salary_max: number | null;
  bonus_min: number | null;
  bonus_max: number | null;
  equity_min: number | null;
  equity_max: number | null;
  signing_bonus: number | null;
  currency: string;
  pay_period: string | null;
  compensation_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobLocation {
  id: string;
  job_id: string;
  formatted_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_remote: boolean;
  remote_type: string | null;
  office_days_per_week: number | null;
  relocation_assistance: boolean;
  relocation_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface JobTag {
  id: string;
  job_id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Keyword {
  id: string;
  job_id: string;
  keyword: string;
  category: string | null;
  frequency: number;
  is_relevant: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyReference {
  id: string;
  user_id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  founded_year: number | null;
  headquarters: string | null;
  website: string | null;
  linkedin_url: string | null;
  glassdoor_rating: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HiringManager {
  id: string;
  job_id: string;
  name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationMethod {
  id: string;
  job_id: string;
  method_type: string;
  label: string | null;
  url: string | null;
  email: string | null;
  platform: string | null;
  instructions: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationQuestion {
  id: string;
  job_id: string;
  question: string;
  question_type: string;
  is_required: boolean;
  options: unknown[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface JobSnapshot {
  id: string;
  job_id: string;
  version_id: string | null;
  snapshot_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface JobAnalysis {
  id: string;
  job_id: string;
  analysis_type: string;
  status: AnalysisStatus;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  confidence: number | null;
  model_used: string | null;
  processing_time_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface JobScore {
  id: string;
  job_id: string;
  score_type: string;
  score: number;
  breakdown: Record<string, unknown> | null;
  model_used: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobGap {
  id: string;
  job_id: string;
  gap_type: string;
  gap_description: string;
  severity: string;
  suggestion: string | null;
  is_addressable: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRecommendation {
  id: string;
  job_id: string;
  user_id: string;
  recommendation_type: string;
  title: string;
  description: string;
  priority: string;
  action_items: unknown[] | null;
  confidence: number | null;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  notes: string | null;
  priority: string;
  created_at: string;
  updated_at: string;
  job?: JobListItem;
}

export interface FavoriteJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  job?: JobListItem;
}

export interface JobCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  items?: JobCollectionItem[];
}

export interface JobCollectionItem {
  id: string;
  collection_id: string;
  job_id: string;
  sort_order: number;
  notes: string | null;
  job?: JobListItem;
}

export interface JobSourceEntity {
  id: string;
  name: string;
  display_name: string;
  base_url: string | null;
  api_endpoint: string | null;
  is_enabled: boolean;
  import_method: string;
  last_fetched_at: string | null;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface JobImportRecord {
  id: string;
  user_id: string;
  source: string;
  import_type: string;
  filename: string | null;
  status: string;
  jobs_found: number;
  jobs_imported: number;
  conflicts: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobCreate {
  title: string;
  company_name: string;
  description: string;
  employment_type?: EmploymentType;
  remote_status?: RemoteStatus;
  experience_level?: ExperienceLevel;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  source?: string;
  source_url?: string;
}

export interface JobUpdate {
  title?: string;
  company_name?: string;
  description?: string;
  summary?: string;
  employment_type?: EmploymentType;
  remote_status?: RemoteStatus;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  status?: JobStatus;
  application_url?: string;
  application_deadline?: string;
}

export interface JobSearchRequest {
  query?: string;
  company?: string;
  location?: string;
  skills?: string[];
  salary_min?: number;
  salary_max?: number;
  remote?: boolean;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  tags?: string[];
  industry?: string;
  source?: string;
  status?: JobStatus;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  offset?: number;
  limit?: number;
}

export interface JobImportRequest {
  import_type: "manual_paste" | "url" | "json" | "pdf";
  source_text?: string;
  url?: string;
  json_data?: Record<string, unknown>;
  source?: string;
}

export interface JobBulkAction {
  action: "delete" | "save" | "unsave" | "favorite" | "unfavorite" | "tag";
  job_ids: string[];
  value?: string;
}

export interface JobSearchStats {
  total: number;
  by_employment_type: Record<string, number>;
  by_remote_status: Record<string, number>;
  by_experience_level: Record<string, number>;
  avg_salary: number | null;
  salary_range: { min: number; max: number } | null;
  top_skills: Array<{ name: string; count: number }>;
}
