export interface AiMetadata {
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updatedBy: string | null;
  ai_generated: boolean;
  user_verified: boolean;
}

export interface CareerProfile {
  id: string;
  user_id: string;
  summary: string | null;
  target_role: string | null;
  industry: string | null;
  years_of_experience: number | null;
  location: string | null;
  open_to_work: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  career_profile_id: string;
  company: string;
  position: string;
  location: string | null;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
  bullets?: WorkExperienceBullet[];
  skills_used?: WorkExperienceSkill[];
  highlights?: WorkExperienceHighlight[];
}

export interface WorkExperienceBullet {
  id: string;
  work_experience_id: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WorkExperienceSkill {
  id: string;
  work_experience_id: string;
  skill_name: string;
  skill_id: string | null;
  created_at: string;
}

export interface WorkExperienceHighlight {
  id: string;
  work_experience_id: string;
  content: string;
  metric_value: string | null;
  metric_type: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  career_profile_id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  education_level: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  gpa: string | null;
  description: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
  bullets?: EducationBullet[];
}

export interface EducationBullet {
  id: string;
  education_id: string;
  content: string;
  bullet_type: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  career_profile_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  career_profile_id: string;
  skill_category_id: string | null;
  name: string;
  proficiency: string | null;
  years_of_experience: number | null;
  last_used: string | null;
  is_primary: boolean;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  career_profile_id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  is_active: boolean;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  career_profile_id: string;
  name: string;
  description: string | null;
  url: string | null;
  github_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
  role: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
  bullets?: ProjectBullet[];
  skills_used?: ProjectSkill[];
}

export interface ProjectBullet {
  id: string;
  project_id: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectSkill {
  id: string;
  project_id: string;
  skill_name: string;
  created_at: string;
}

export interface Language {
  id: string;
  career_profile_id: string;
  name: string;
  proficiency: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface VolunteerExperience {
  id: string;
  career_profile_id: string;
  organization: string;
  role: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
  bullets?: VolunteerExperienceBullet[];
}

export interface VolunteerExperienceBullet {
  id: string;
  volunteer_experience_id: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  career_profile_id: string;
  title: string;
  publisher: string | null;
  publication_date: string | null;
  url: string | null;
  description: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Patent {
  id: string;
  career_profile_id: string;
  title: string;
  patent_number: string | null;
  filing_date: string | null;
  issue_date: string | null;
  status: string | null;
  description: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: string;
  career_profile_id: string;
  title: string;
  issuer: string | null;
  date_received: string | null;
  description: string | null;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  career_profile_id: string;
  recommender_name: string;
  recommender_title: string | null;
  recommender_company: string | null;
  recommender_email: string | null;
  relationship: string | null;
  content: string;
  date_received: string | null;
  is_visible: boolean;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerGoal {
  id: string;
  career_profile_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  priority: string | null;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  verified: boolean;
  source: string | null;
  confidence: number | null;
  last_updated_by: string | null;
  ai_generated: boolean;
  user_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomSection {
  id: string;
  career_profile_id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ImportRecord {
  id: string;
  career_profile_id: string;
  import_type: string;
  filename: string | null;
  status: string;
  conflicts: Record<string, unknown> | null;
  imported_data: Record<string, unknown> | null;
  imported_at: string;
  entity_counts: Record<string, number> | null;
  created_at: string;
  updated_at: string;
}

export interface CareerProfileFull extends CareerProfile {
  work_experiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  skill_categories: SkillCategory[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  volunteer_experiences: VolunteerExperience[];
  publications: Publication[];
  patents: Patent[];
  awards: Award[];
  recommendations: Recommendation[];
  career_goals: CareerGoal[];
  custom_sections: CustomSection[];
  import_records: ImportRecord[];
}

export interface WorkExperienceCreate {
  company: string;
  position: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  sort_order?: number;
}

export interface EducationCreate {
  institution: string;
  degree?: string;
  field_of_study?: string;
  education_level?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  gpa?: string;
  description?: string;
  sort_order?: number;
}

export interface SkillCreate {
  name: string;
  skill_category_id?: string;
  proficiency?: string;
  years_of_experience?: number;
  last_used?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface CertificationCreate {
  name: string;
  issuer?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
  is_ongoing?: boolean;
  role?: string;
  sort_order?: number;
}

export interface LanguageCreate {
  name: string;
  proficiency?: string;
  sort_order?: number;
}

export interface VolunteerExperienceCreate {
  organization: string;
  role: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  sort_order?: number;
}

export interface PublicationCreate {
  title: string;
  publisher?: string;
  publication_date?: string;
  url?: string;
  description?: string;
  sort_order?: number;
}

export interface PatentCreate {
  title: string;
  patent_number?: string;
  filing_date?: string;
  issue_date?: string;
  status?: string;
  description?: string;
  sort_order?: number;
}

export interface AwardCreate {
  title: string;
  issuer?: string;
  date_received?: string;
  description?: string;
  sort_order?: number;
}

export interface RecommendationCreate {
  recommender_name: string;
  recommender_title?: string;
  recommender_company?: string;
  recommender_email?: string;
  relationship?: string;
  content: string;
  date_received?: string;
  is_visible?: boolean;
  sort_order?: number;
}

export interface CareerGoalCreate {
  title: string;
  description?: string;
  target_date?: string;
  priority?: string;
  category?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface CustomSectionCreate {
  title: string;
  content: string;
  sort_order?: number;
}

export interface AutosaveChange {
  entity_type: string;
  entity_id: string | null;
  action: "create" | "update" | "delete" | "reorder";
  data?: Record<string, unknown>;
  ordered_ids?: string[];
}

export interface AutosavePayload {
  changes: AutosaveChange[];
}

export interface AutosaveResult {
  entity_type: string;
  entity_id: string;
  action: string;
  status: "success" | "error";
  error?: string;
}

export interface AutosaveResponse {
  success: boolean;
  results: AutosaveResult[];
}

export interface DraftData {
  profile: Partial<CareerProfile>;
  entities: Record<string, unknown>;
  saved_at: string;
}

export interface ImportRequest {
  import_type: "linkedin" | "resume_json" | "resume_pdf" | "manual_json";
  data: Record<string, unknown>;
}

export interface ImportConflict {
  entity_type: string;
  entity_id: string;
  existing: Record<string, unknown>;
  imported: Record<string, unknown>;
  resolution: "keep_existing" | "use_imported" | "merge";
}

export interface ExportRequest {
  format: "json" | "structured" | "resume_engine";
  sections?: string[];
}

export interface ProfileSearchRequest {
  query: string;
  entity_types?: string[];
  filters?: Record<string, unknown>;
}

export interface ProfileSearchResult {
  entity_type: string;
  entity_id: string;
  title: string;
  snippet: string;
  highlight: string;
}

export interface ProfileStats {
  completion_percentage: number;
  sections: Record<string, { count: number; complete: boolean }>;
}

export interface ReorderPayload {
  entity_type: string;
  ordered_ids: string[];
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}
