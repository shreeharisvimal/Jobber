// ─── Union Types ───

export type CompanySize = "startup" | "small" | "medium" | "large" | "enterprise";
export type CompanyRelation = "subsidiary" | "parent" | "peer" | "sister" | "acquired" | "merged";
export type CultureDimension = "innovation" | "collaboration" | "work_life_balance" | "compensation" | "growth" | "stability" | "diversity" | "remote_friendly";
export type HiringProcessStage = "screening" | "phone_screen" | "technical" | "onsite" | "behavioral" | "offer" | "rejected" | "withdrew";
export type InterviewRound = "phone" | "technical" | "system_design" | "behavioral" | "onsite" | "panel" | "take_home";
export type SalaryCurrency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";
export type SalaryPeriod = "yearly" | "monthly" | "hourly" | "contract";
export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";
export type NewsSource = "press_release" | "news_article" | "blog" | "social_media" | "official";
export type FundingStage = "seed" | "series_a" | "series_b" | "series_c" | "series_d" | "ipo" | "acquired" | "private_equity" | "debt" | "grant";
export type DocumentType = "report" | "brochure" | "whitepaper" | "case_study" | "press_kit" | "annual_report" | "esg_report";
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type AnalysisType = "comprehensive" | "quick" | "culture" | "financial" | "technology" | "competitive";
export type InsightType = "strength" | "weakness" | "opportunity" | "risk" | "trend" | "pattern" | "anomaly";
export type RecommendationType = "apply" | "research" | "network" | "avoid" | "bookmark" | "follow_up" | "prepare";
export type ReportType = "comprehensive" | "summary" | "comparison" | "spotlight" | "competitive_landscape" | "market_analysis";
export type SnapshotType = "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "event_triggered";
export type EventType = "created" | "updated" | "deleted" | "scored" | "analyzed" | "bookmarked" | "followed" | "reviewed" | "reported";
export type OfficeType = "hq" | "branch" | "remote_hub" | "coworking";
export type LocationType = "remote" | "hybrid" | "onsite" | "flexible";

// ─── Company ───

export interface Company {
  id: string;
  user_id: string;
  name: string;
  legal_name: string | null;
  description: string | null;
  short_description: string | null;
  website: string | null;
  careers_page: string | null;
  blog_url: string | null;
  logo_url: string | null;
  banner_url: string | null;
  founded_year: number | null;
  headquarters: string | null;
  company_size: CompanySize | null;
  revenue: string | null;
  stock_symbol: string | null;
  stock_exchange: string | null;
  crunchbase_url: string | null;
  linkedin_url: string | null;
  glassdoor_url: string | null;
  indeed_url: string | null;
  is_public: boolean;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string | null;
  metadata: Record<string, unknown> | null;
  total_score: number | null;
  score_count: number;
  view_count: number;
  follower_count: number;
  bookmark_count: number;
  review_count: number;
  salary_count: number;
  interview_count: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreate {
  name: string;
  legal_name?: string;
  description?: string;
  short_description?: string;
  website?: string;
  careers_page?: string;
  blog_url?: string;
  logo_url?: string;
  banner_url?: string;
  founded_year?: number;
  headquarters?: string;
  company_size?: CompanySize;
  revenue?: string;
  stock_symbol?: string;
  stock_exchange?: string;
  crunchbase_url?: string;
  linkedin_url?: string;
  glassdoor_url?: string;
  indeed_url?: string;
  is_public?: boolean;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CompanyUpdate {
  name?: string;
  legal_name?: string;
  description?: string;
  short_description?: string;
  website?: string;
  careers_page?: string;
  blog_url?: string;
  logo_url?: string;
  banner_url?: string;
  founded_year?: number;
  headquarters?: string;
  company_size?: CompanySize;
  revenue?: string;
  stock_symbol?: string;
  stock_exchange?: string;
  crunchbase_url?: string;
  linkedin_url?: string;
  glassdoor_url?: string;
  indeed_url?: string;
  is_public?: boolean;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

// ─── CompanyAlias ───

export interface CompanyAlias {
  id: string;
  company_id: string;
  alias: string;
  is_legal_name: boolean;
  is_former_name: boolean;
  source: string | null;
  created_at: string;
}

export interface CompanyAliasCreate {
  alias: string;
  is_legal_name?: boolean;
  is_former_name?: boolean;
  source?: string;
}

export interface CompanyAliasUpdate {
  alias?: string;
  is_legal_name?: boolean;
  is_former_name?: boolean;
  source?: string;
}

// ─── CompanyIndustry ───

export interface CompanyIndustry {
  id: string;
  company_id: string;
  industry_name: string;
  industry_code: string | null;
  is_primary: boolean;
  sort_order: number;
  source: string | null;
  created_at: string;
}

export interface CompanyIndustryCreate {
  industry_name: string;
  industry_code?: string;
  is_primary?: boolean;
  sort_order?: number;
  source?: string;
}

export interface CompanyIndustryUpdate {
  industry_name?: string;
  industry_code?: string;
  is_primary?: boolean;
  sort_order?: number;
  source?: string;
}

// ─── CompanyOffice ───

export interface CompanyOffice {
  id: string;
  company_id: string;
  name: string;
  type: OfficeType;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyOfficeCreate {
  name: string;
  type: OfficeType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

export interface CompanyOfficeUpdate {
  name?: string;
  type?: OfficeType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

// ─── CompanyLocation ───

export interface CompanyLocation {
  id: string;
  company_id: string;
  office_id: string | null;
  location_type: LocationType;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  is_remote: boolean;
  is_primary: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyLocationCreate {
  office_id?: string;
  location_type: LocationType;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_remote?: boolean;
  is_primary?: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

export interface CompanyLocationUpdate {
  office_id?: string;
  location_type?: LocationType;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_remote?: boolean;
  is_primary?: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

// ─── CompanyCulture ───

export interface CompanyCulture {
  id: string;
  company_id: string;
  dimension: CultureDimension;
  score: number | null;
  description: string | null;
  evidence: string | null;
  source: string | null;
  confidence: number | null;
  created_at: string;
}

export interface CompanyCultureCreate {
  dimension: CultureDimension;
  score?: number;
  description?: string;
  evidence?: string;
  source?: string;
  confidence?: number;
}

export interface CompanyCultureUpdate {
  dimension?: CultureDimension;
  score?: number;
  description?: string;
  evidence?: string;
  source?: string;
  confidence?: number;
}

// ─── CompanyBenefit ───

export interface CompanyBenefit {
  id: string;
  company_id: string;
  name: string;
  category: string | null;
  description: string | null;
  is_offered: boolean;
  is_estimated: boolean;
  source: string | null;
  created_at: string;
}

export interface CompanyBenefitCreate {
  name: string;
  category?: string;
  description?: string;
  is_offered?: boolean;
  is_estimated?: boolean;
  source?: string;
}

export interface CompanyBenefitUpdate {
  name?: string;
  category?: string;
  description?: string;
  is_offered?: boolean;
  is_estimated?: boolean;
  source?: string;
}

// ─── CompanyTechnology ───

export interface CompanyTechnology {
  id: string;
  company_id: string;
  technology_name: string;
  category: string | null;
  is_core: boolean;
  usage_description: string | null;
  source: string | null;
  confidence: number | null;
  created_at: string;
}

export interface CompanyTechnologyCreate {
  technology_name: string;
  category?: string;
  is_core?: boolean;
  usage_description?: string;
  source?: string;
  confidence?: number;
}

export interface CompanyTechnologyUpdate {
  technology_name?: string;
  category?: string;
  is_core?: boolean;
  usage_description?: string;
  source?: string;
  confidence?: number;
}

// ─── CompanyHiringProcess ───

export interface CompanyHiringProcess {
  id: string;
  company_id: string;
  stage: HiringProcessStage;
  name: string | null;
  description: string | null;
  typical_duration_days: number | null;
  is_remote_possible: boolean | null;
  difficulty_rating: number | null;
  tips: string | null;
  sort_order: number;
  created_at: string;
}

export interface CompanyHiringProcessCreate {
  stage: HiringProcessStage;
  name?: string;
  description?: string;
  typical_duration_days?: number;
  is_remote_possible?: boolean;
  difficulty_rating?: number;
  tips?: string;
  sort_order?: number;
}

export interface CompanyHiringProcessUpdate {
  stage?: HiringProcessStage;
  name?: string;
  description?: string;
  typical_duration_days?: number;
  is_remote_possible?: boolean;
  difficulty_rating?: number;
  tips?: string;
  sort_order?: number;
}

// ─── CompanyInterviewExperience ───

export interface CompanyInterviewExperience {
  id: string;
  company_id: string;
  user_id: string;
  role_title: string;
  round: InterviewRound;
  experience_rating: number | null;
  difficulty_rating: number | null;
  offer_received: boolean | null;
  description: string | null;
  tips: string | null;
  questions: string[] | null;
  duration_minutes: number | null;
  interview_date: string | null;
  is_anonymous: boolean;
  is_verified: boolean;
  status: ReviewStatus;
  help_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyInterviewCreate {
  role_title: string;
  round: InterviewRound;
  experience_rating?: number;
  difficulty_rating?: number;
  offer_received?: boolean;
  description?: string;
  tips?: string;
  questions?: string[];
  duration_minutes?: number;
  interview_date?: string;
  is_anonymous?: boolean;
}

export interface CompanyInterviewUpdate {
  role_title?: string;
  round?: InterviewRound;
  experience_rating?: number;
  difficulty_rating?: number;
  offer_received?: boolean;
  description?: string;
  tips?: string;
  questions?: string[];
  duration_minutes?: number;
  interview_date?: string;
  is_anonymous?: boolean;
}

// ─── CompanySalaryInsight ───

export interface CompanySalaryInsight {
  id: string;
  company_id: string;
  user_id: string;
  role_title: string;
  role_level: string | null;
  currency: SalaryCurrency;
  period: SalaryPeriod;
  salary_min: number | null;
  salary_max: number | null;
  salary_median: number | null;
  equity: string | null;
  bonus: string | null;
  benefits_summary: string | null;
  years_experience: number | null;
  is_anonymous: boolean;
  is_estimated: boolean;
  is_verified: boolean;
  source: string | null;
  help_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanySalaryCreate {
  role_title: string;
  role_level?: string;
  currency: SalaryCurrency;
  period: SalaryPeriod;
  salary_min?: number;
  salary_max?: number;
  salary_median?: number;
  equity?: string;
  bonus?: string;
  benefits_summary?: string;
  years_experience?: number;
  is_anonymous?: boolean;
  is_estimated?: boolean;
  source?: string;
}

export interface CompanySalaryUpdate {
  role_title?: string;
  role_level?: string;
  currency?: SalaryCurrency;
  period?: SalaryPeriod;
  salary_min?: number;
  salary_max?: number;
  salary_median?: number;
  equity?: string;
  bonus?: string;
  benefits_summary?: string;
  years_experience?: number;
  is_anonymous?: boolean;
  is_estimated?: boolean;
  source?: string;
}

// ─── CompanyReview ───

export interface CompanyReview {
  id: string;
  company_id: string;
  user_id: string;
  rating_overall: number | null;
  rating_culture: number | null;
  rating_compensation: number | null;
  rating_work_life: number | null;
  rating_growth: number | null;
  rating_management: number | null;
  title: string | null;
  pros: string | null;
  cons: string | null;
  advice_to_management: string | null;
  is_anonymous: boolean;
  is_verified: boolean;
  is_current_employee: boolean;
  employment_status: string | null;
  years_employed: number | null;
  help_count: number;
  status: ReviewStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyReviewCreate {
  rating_overall?: number;
  rating_culture?: number;
  rating_compensation?: number;
  rating_work_life?: number;
  rating_growth?: number;
  rating_management?: number;
  title?: string;
  pros?: string;
  cons?: string;
  advice_to_management?: string;
  is_anonymous?: boolean;
  is_current_employee?: boolean;
  employment_status?: string;
  years_employed?: number;
}

export interface CompanyReviewUpdate {
  rating_overall?: number;
  rating_culture?: number;
  rating_compensation?: number;
  rating_work_life?: number;
  rating_growth?: number;
  rating_management?: number;
  title?: string;
  pros?: string;
  cons?: string;
  advice_to_management?: string;
  is_anonymous?: boolean;
  is_current_employee?: boolean;
  employment_status?: string;
  years_employed?: number;
}

// ─── CompanyNews ───

export interface CompanyNews {
  id: string;
  company_id: string;
  title: string;
  url: string | null;
  source: NewsSource | null;
  source_name: string | null;
  published_at: string | null;
  summary: string | null;
  content: string | null;
  author: string | null;
  sentiment: number | null;
  relevance_score: number | null;
  is_major: boolean;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyNewsCreate {
  title: string;
  url?: string;
  source?: NewsSource;
  source_name?: string;
  published_at?: string;
  summary?: string;
  content?: string;
  author?: string;
  sentiment?: number;
  relevance_score?: number;
  is_major?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CompanyNewsUpdate {
  title?: string;
  url?: string;
  source?: NewsSource;
  source_name?: string;
  published_at?: string;
  summary?: string;
  content?: string;
  author?: string;
  sentiment?: number;
  relevance_score?: number;
  is_major?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// ─── CompanyFunding ───

export interface CompanyFunding {
  id: string;
  company_id: string;
  round_name: string | null;
  stage: FundingStage;
  amount: number | null;
  currency: SalaryCurrency;
  valuation: number | null;
  investors: string[] | null;
  announced_at: string | null;
  source: string | null;
  details: string | null;
  created_at: string;
}

export interface CompanyFundingCreate {
  round_name?: string;
  stage: FundingStage;
  amount?: number;
  currency?: SalaryCurrency;
  valuation?: number;
  investors?: string[];
  announced_at?: string;
  source?: string;
  details?: string;
}

export interface CompanyFundingUpdate {
  round_name?: string;
  stage?: FundingStage;
  amount?: number;
  currency?: SalaryCurrency;
  valuation?: number;
  investors?: string[];
  announced_at?: string;
  source?: string;
  details?: string;
}

// ─── CompanyLeadership ───

export interface CompanyLeadership {
  id: string;
  company_id: string;
  name: string;
  title: string | null;
  role: string | null;
  bio: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_founder: boolean;
  is_active: boolean;
  started_at: string | null;
  ended_at: string | null;
  source: string | null;
  sort_order: number;
  created_at: string;
}

export interface CompanyLeadershipCreate {
  name: string;
  title?: string;
  role?: string;
  bio?: string;
  linkedin_url?: string;
  twitter_url?: string;
  is_founder?: boolean;
  is_active?: boolean;
  started_at?: string;
  ended_at?: string;
  source?: string;
  sort_order?: number;
}

export interface CompanyLeadershipUpdate {
  name?: string;
  title?: string;
  role?: string;
  bio?: string;
  linkedin_url?: string;
  twitter_url?: string;
  is_founder?: boolean;
  is_active?: boolean;
  started_at?: string;
  ended_at?: string;
  source?: string;
  sort_order?: number;
}

// ─── CompanyCompetitor ───

export interface CompanyCompetitor {
  id: string;
  company_id: string;
  competitor_company_id: string | null;
  competitor_name: string;
  relationship: CompanyRelation | null;
  strength: number | null;
  notes: string | null;
  source: string | null;
  created_at: string;
}

export interface CompanyCompetitorCreate {
  competitor_company_id?: string;
  competitor_name: string;
  relationship?: CompanyRelation;
  strength?: number;
  notes?: string;
  source?: string;
}

export interface CompanyCompetitorUpdate {
  competitor_company_id?: string;
  competitor_name?: string;
  relationship?: CompanyRelation;
  strength?: number;
  notes?: string;
  source?: string;
}

// ─── CompanySocialLink ───

export interface CompanySocialLink {
  id: string;
  company_id: string;
  platform: string;
  url: string;
  label: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface CompanySocialLinkCreate {
  platform: string;
  url: string;
  label?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface CompanySocialLinkUpdate {
  platform?: string;
  url?: string;
  label?: string;
  is_primary?: boolean;
  sort_order?: number;
}

// ─── CompanyDocument ───

export interface CompanyDocument {
  id: string;
  company_id: string;
  document_type: DocumentType;
  title: string;
  description: string | null;
  url: string | null;
  file_size: number | null;
  file_format: string | null;
  is_public: boolean;
  is_featured: boolean;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyDocumentCreate {
  document_type: DocumentType;
  title: string;
  description?: string;
  url?: string;
  file_size?: number;
  file_format?: string;
  is_public?: boolean;
  is_featured?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CompanyDocumentUpdate {
  document_type?: DocumentType;
  title?: string;
  description?: string;
  url?: string;
  file_size?: number;
  file_format?: string;
  is_public?: boolean;
  is_featured?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// ─── CompanyTag ───

export interface CompanyTag {
  id: string;
  company_id: string;
  tag: string;
  category: string | null;
  source: string | null;
  created_at: string;
}

export interface CompanyTagCreate {
  tag: string;
  category?: string;
  source?: string;
}

export interface CompanyTagUpdate {
  tag?: string;
  category?: string;
  source?: string;
}

// ─── Intelligence Entities ───

export interface CompanySnapshot {
  id: string;
  company_id: string;
  snapshot_type: SnapshotType;
  data: Record<string, unknown>;
  score: number | null;
  summary: string | null;
  source: string | null;
  version: number;
  created_at: string;
}

export interface CompanyScore {
  id: string;
  company_id: string;
  score_type: string;
  score: number;
  weight: number | null;
  confidence: number | null;
  factors: Record<string, unknown> | null;
  details: Record<string, unknown> | null;
  source: string | null;
  version: number | null;
  created_at: string;
}

export interface CompanyInsight {
  id: string;
  company_id: string;
  insight_type: InsightType;
  title: string;
  description: string | null;
  score: number | null;
  confidence: number | null;
  reasoning: string | null;
  supporting_data: Record<string, unknown> | null;
  tags: string[] | null;
  is_actionable: boolean;
  priority: number | null;
  source: string | null;
  provider: string | null;
  model: string | null;
  execution_id: string | null;
  prompt_version: string | null;
  cost: number | null;
  tokens: number | null;
  latency_ms: number | null;
  created_at: string;
  updated_at: string;
}

// ─── CompanyCollection ───

export interface CompanyCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_public: boolean;
  sort_order: number;
  company_count: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyCollectionCreate {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_public?: boolean;
  sort_order?: number;
}

export interface CompanyCollectionUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  is_public?: boolean;
  sort_order?: number;
}

export interface CompanyCollectionItem {
  id: string;
  collection_id: string;
  company_id: string;
  notes: string | null;
  sort_order: number;
}

export interface CompanyCollectionItemCreate {
  company_id: string;
  notes?: string;
  sort_order?: number;
}

// ─── CompanyHistory ───

export interface CompanyHistory {
  id: string;
  company_id: string;
  user_id: string | null;
  event_type: EventType;
  event_data: Record<string, unknown> | null;
  description: string | null;
  source: string | null;
  created_at: string;
}

// ─── CompanyBookmark ───

export interface CompanyBookmark {
  id: string;
  user_id: string;
  company_id: string;
  created_at: string;
}

// ─── CompanyFollow ───

export interface CompanyFollow {
  id: string;
  user_id: string;
  company_id: string;
  notify_types: string[] | null;
  created_at: string;
}

export interface CompanyFollowUpdate {
  notify_types?: string[];
}

// ─── CompanyAnalysis ───

export interface CompanyAnalysis {
  id: string;
  company_id: string;
  user_id: string;
  analysis_type: AnalysisType;
  status: AnalysisStatus;
  overall_score: number | null;
  growth_score: number | null;
  stability_score: number | null;
  culture_score: number | null;
  technology_score: number | null;
  financial_score: number | null;
  hiring_score: number | null;
  salary_score: number | null;
  summary: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  opportunities: string[] | null;
  risks: string[] | null;
  data: Record<string, unknown> | null;
  confidence: number | null;
  processing_time_ms: number | null;
  model_used: string | null;
  provider: string | null;
  execution_id: string | null;
  prompt_version: string | null;
  cost: number | null;
  tokens: number | null;
  latency_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyAnalysisCreate {
  analysis_type?: AnalysisType;
}

export interface CompanyAnalysisUpdate {
  status?: AnalysisStatus;
  overall_score?: number;
  growth_score?: number;
  stability_score?: number;
  culture_score?: number;
  technology_score?: number;
  financial_score?: number;
  hiring_score?: number;
  salary_score?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  risks?: string[];
}

// ─── CompanyRecommendation ───

export interface CompanyRecommendation {
  id: string;
  company_id: string;
  user_id: string;
  recommendation_type: RecommendationType;
  score: number | null;
  confidence: number | null;
  reasons: string[] | null;
  factors: Record<string, unknown> | null;
  description: string | null;
  is_applied: boolean;
  is_dismissed: boolean;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyRecommendationUpdate {
  is_applied?: boolean;
  is_dismissed?: boolean;
}

// ─── CompanyReport ───

export interface CompanyReport {
  id: string;
  company_id: string;
  user_id: string;
  report_type: ReportType;
  title: string;
  summary: string | null;
  sections: Record<string, unknown>;
  score: number | null;
  confidence: number | null;
  is_published: boolean;
  is_template: boolean;
  metadata: Record<string, unknown> | null;
  provider: string | null;
  model: string | null;
  execution_id: string | null;
  prompt_version: string | null;
  cost: number | null;
  tokens: number | null;
  latency_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyReportCreate {
  report_type: ReportType;
  title: string;
}

// ─── Company Follower (read-only) ───

export interface CompanyFollower {
  id: string;
  user_id: string;
  company_id: string;
  created_at: string;
}

// ─── Company Analysis Detail ───

export interface CompanyAnalysisDetail extends CompanyAnalysis {
  insights: CompanyInsight[];
  scores: CompanyScore[];
}

// ─── CompanyDetail ───

export interface CompanyDetail extends Company {
  aliases: CompanyAlias[];
  industries: CompanyIndustry[];
  offices: CompanyOffice[];
  locations: CompanyLocation[];
  cultures: CompanyCulture[];
  benefits: CompanyBenefit[];
  technologies: CompanyTechnology[];
  tags: CompanyTag[];
  social_links: CompanySocialLink[];
  top_reviews: CompanyReview[];
  latest_interviews: CompanyInterviewExperience[];
  latest_salaries: CompanySalaryInsight[];
  latest_news: CompanyNews[];
  latest_funding: CompanyFunding[];
  leadership: CompanyLeadership[];
  competitors: CompanyCompetitor[];
  latest_analysis: CompanyAnalysis | null;
  overall_score: number | null;
}

// ─── Request / Utility Types ───

export interface CompanySearchRequest {
  query?: string;
  industry?: string;
  size?: CompanySize;
  location?: string;
  tags?: string[];
  min_score?: number;
  max_score?: number;
  has_reviews?: boolean;
  has_salaries?: boolean;
  offset: number;
  limit: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface CompanyBulkAction {
  action: string;
  company_ids: string[];
}

export interface CompanyRunAnalysisRequest {
  company_id: string;
  analysis_type?: AnalysisType;
  focus_areas?: string[];
}

export interface CompanyIntelApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export interface CompanyIntelPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  message: string | null;
}
