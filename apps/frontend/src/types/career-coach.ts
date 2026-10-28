// ─── Enums ──────────────────────────────────────────────────────────────────

export type SessionType =
  | "assessment"
  | "coaching"
  | "review"
  | "planning"
  | "learning";

export type SessionStatus =
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type AssessmentType =
  | "initial"
  | "followup"
  | "comprehensive"
  | "quick";

export type AssessmentStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed";

export type HealthTrend =
  | "improving"
  | "stable"
  | "declining";

export type ReadinessCategory =
  | "job_search"
  | "career_change"
  | "promotion"
  | "skill_development";

export type GoalType =
  | "career_change"
  | "skill_acquisition"
  | "certification"
  | "promotion"
  | "networking"
  | "job_search";

export type GoalStatus =
  | "active"
  | "completed"
  | "paused"
  | "cancelled";

export type MilestoneStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped";

export type PlanType =
  | "short_term"
  | "long_term"
  | "emergency"
  | "development";

export type PlanStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type RecommendationCategory =
  | "skill"
  | "resume"
  | "interview"
  | "networking"
  | "career_change"
  | "learning"
  | "portfolio";

export type RecommendationImpact =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DifficultyLevel =
  | "easy"
  | "moderate"
  | "hard"
  | "expert";

export type RecommendationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "dismissed";

export type FeedbackAction =
  | "accepted"
  | "rejected"
  | "completed"
  | "dismissed"
  | "deferred";

export type RoadmapType =
  | "career_change"
  | "skill_development"
  | "leadership"
  | "entrepreneurship";

export type ReviewType =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual";

export type InsightType =
  | "trend"
  | "opportunity"
  | "risk"
  | "achievement"
  | "milestone"
  | "pattern";

export type SeverityLevel =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TrendType =
  | "skill_demand"
  | "salary"
  | "market"
  | "industry"
  | "job_growth";

export type TrendDirection =
  | "improving"
  | "stable"
  | "declining";

export type LearningResourceType =
  | "course"
  | "book"
  | "article"
  | "video"
  | "podcast"
  | "tool"
  | "mentorship";

export type LearningStatus =
  | "suggested"
  | "in_progress"
  | "completed"
  | "skipped";

export type SkillGapStatus =
  | "identified"
  | "in_progress"
  | "closed"
  | "archived";

export type OpportunityType =
  | "job"
  | "project"
  | "networking"
  | "learning"
  | "promotion";

export type RiskType =
  | "skill_obsolescence"
  | "market_shift"
  | "health"
  | "financial"
  | "relocation";

export type PriorityType =
  | "career"
  | "skill"
  | "networking"
  | "personal"
  | "financial";

export type AlertType =
  | "deadline"
  | "score_drop"
  | "opportunity"
  | "risk"
  | "reminder";

export type NotificationType =
  | "reminder"
  | "achievement"
  | "recommendation"
  | "alert"
  | "digest";

export type ConversationStatus =
  | "active"
  | "paused"
  | "archived";

export type MessageRole =
  | "user"
  | "assistant"
  | "system";

export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export type ReportType =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "custom";

export type SnapshotType =
  | "baseline"
  | "periodic"
  | "comparison"
  | "milestone";

export type HistoryAction =
  | "created"
  | "updated"
  | "deleted"
  | "archived";

export type AchievementType =
  | "milestone"
  | "streak"
  | "completion"
  | "assessment"
  | "goal";

export type HabitType =
  | "learning"
  | "networking"
  | "application"
  | "review"
  | "practice";

export type Frequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly";

export type HabitStatus =
  | "active"
  | "paused"
  | "completed";

export type ReviewFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly";

export type ToneType =
  | "encouraging"
  | "professional"
  | "direct"
  | "detailed";

export type BookmarkType =
  | "resource"
  | "article"
  | "job"
  | "tool"
  | "contact";

export type ResourceProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned";

export type ReminderType =
  | "goal"
  | "milestone"
  | "review"
  | "application"
  | "followup";

export type DigestType =
  | "daily"
  | "weekly"
  | "monthly";

export type DigestStatus =
  | "pending"
  | "generated"
  | "sent"
  | "failed";

export type AIRequestStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ScoreType =
  | "health"
  | "readiness"
  | "overall"
  | "skill"
  | "market";

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface DashboardStats {
  total_sessions: number;
  active_goals: number;
  completed_goals: number;
  total_assessments: number;
  overall_score: number;
  health_score: number;
  readiness_score: number;
  open_recommendations: number;
  total_milestones: number;
  completed_milestones: number;
  skill_gaps_count: number;
  streak_days: number;
  recent_achievements: Record<string, unknown>[] | null;
  score_history: Record<string, unknown>[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SearchRequest {
  query: string | null;
  filters: Record<string, unknown> | null;
  sort_by: string | null;
  sort_order: string | null;
  page: number;
  per_page: number;
}

export interface BulkAction {
  action: string;
  entity_ids: string[];
}

// ─── CareerCoachSession ─────────────────────────────────────────────────────

export interface CareerCoachSession {
  id: string;
  user_id: string;
  session_type: string;
  title: string;
  status: string;
  summary: string | null;
  context_data: Record<string, unknown> | null;
  is_active: boolean;
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerCoachSessionCreate {
  session_type: string;
  title: string;
  status?: string;
  summary?: string | null;
  context_data?: Record<string, unknown> | null;
  is_active?: boolean;
}

export interface CareerCoachSessionUpdate {
  session_type?: string;
  title?: string;
  status?: string;
  summary?: string | null;
  context_data?: Record<string, unknown> | null;
  is_active?: boolean;
}

// ─── CareerAssessment ───────────────────────────────────────────────────────

export interface CareerAssessment {
  id: string;
  user_id: string;
  assessment_type: string;
  title: string;
  overall_score: number | null;
  profile_score: number | null;
  resume_score: number | null;
  ats_score: number | null;
  interview_score: number | null;
  portfolio_score: number | null;
  cover_letter_score: number | null;
  networking_score: number | null;
  skills_score: number | null;
  market_score: number | null;
  assessment_data: Record<string, unknown> | null;
  recommendations_count: number;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerAssessmentCreate {
  assessment_type?: string;
  title: string;
  overall_score?: number | null;
  assessment_data?: Record<string, unknown> | null;
  status?: string;
}

export interface CareerAssessmentUpdate {
  assessment_type?: string;
  title?: string;
  overall_score?: number | null;
  assessment_data?: Record<string, unknown> | null;
  status?: string;
}

// ─── CareerHealthScore ──────────────────────────────────────────────────────

export interface CareerHealthScore {
  id: string;
  user_id: string;
  score: number;
  previous_score: number | null;
  change_pct: number | null;
  components: Record<string, unknown> | null;
  trend: string;
  factors: Record<string, unknown> | null;
  scored_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerHealthScoreCreate {
  score: number;
  previous_score?: number | null;
  change_pct?: number | null;
  components?: Record<string, unknown> | null;
  trend?: string;
  factors?: Record<string, unknown> | null;
}

export interface CareerHealthScoreUpdate {
  score?: number | null;
  previous_score?: number | null;
  change_pct?: number | null;
  components?: Record<string, unknown> | null;
  trend?: string;
  factors?: Record<string, unknown> | null;
}

// ─── CareerReadinessScore ───────────────────────────────────────────────────

export interface CareerReadinessScore {
  id: string;
  user_id: string;
  score: number;
  category: string;
  components: Record<string, unknown> | null;
  gaps: string[] | null;
  strengths: string[] | null;
  readiness_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerReadinessScoreCreate {
  score: number;
  category: string;
  components?: Record<string, unknown> | null;
  gaps?: string[] | null;
  strengths?: string[] | null;
}

export interface CareerReadinessScoreUpdate {
  score?: number | null;
  category?: string;
  components?: Record<string, unknown> | null;
  gaps?: string[] | null;
  strengths?: string[] | null;
}

// ─── CareerGoal ─────────────────────────────────────────────────────────────

export interface CareerGoal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  goal_type: string;
  target_date: string | null;
  status: string;
  priority: number;
  progress_pct: number;
  milestones_count: number;
  completed_milestones: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerGoalCreate {
  title: string;
  description?: string | null;
  goal_type: string;
  target_date?: string | null;
  status?: string;
  priority?: number;
  progress_pct?: number;
}

export interface CareerGoalUpdate {
  title?: string;
  description?: string | null;
  goal_type?: string;
  target_date?: string | null;
  status?: string;
  priority?: number;
  progress_pct?: number;
}

// ─── CareerMilestone ────────────────────────────────────────────────────────

export interface CareerMilestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerMilestoneCreate {
  goal_id: string;
  title: string;
  description?: string | null;
  status?: string;
  due_date?: string | null;
  sort_order?: number;
}

export interface CareerMilestoneUpdate {
  goal_id?: string;
  title?: string;
  description?: string | null;
  status?: string;
  due_date?: string | null;
  sort_order?: number;
}

// ─── CareerActionPlan ───────────────────────────────────────────────────────

export interface CareerActionPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  plan_type: string;
  status: string;
  priority: number;
  target_date: string | null;
  actions: Record<string, unknown>[] | null;
  progress_pct: number;
  estimated_duration: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerActionPlanCreate {
  title: string;
  description?: string | null;
  plan_type: string;
  status?: string;
  priority?: number;
  target_date?: string | null;
  actions?: Record<string, unknown>[] | null;
  estimated_duration?: string | null;
}

export interface CareerActionPlanUpdate {
  title?: string;
  description?: string | null;
  plan_type?: string;
  status?: string;
  priority?: number;
  target_date?: string | null;
  actions?: Record<string, unknown>[] | null;
  estimated_duration?: string | null;
}

// ─── CareerRecommendation ───────────────────────────────────────────────────

export interface CareerRecommendation {
  id: string;
  user_id: string;
  session_id: string | null;
  category: string;
  title: string;
  description: string | null;
  rationale: string | null;
  priority: number;
  impact: string;
  difficulty: string | null;
  status: string;
  action_url: string | null;
  affected_modules: string[] | null;
  expected_gains: Record<string, unknown> | null;
  ai_confidence: number | null;
  ai_reasoning: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerRecommendationCreate {
  session_id?: string | null;
  category: string;
  title: string;
  description?: string | null;
  rationale?: string | null;
  priority?: number;
  impact?: string;
  difficulty?: string | null;
  status?: string;
  action_url?: string | null;
}

export interface CareerRecommendationUpdate {
  session_id?: string | null;
  category?: string;
  title?: string;
  description?: string | null;
  rationale?: string | null;
  priority?: number;
  impact?: string;
  difficulty?: string | null;
  status?: string;
  action_url?: string | null;
}

// ─── CareerRecommendationFeedback ───────────────────────────────────────────

export interface CareerRecommendationFeedback {
  id: string;
  recommendation_id: string;
  user_id: string;
  action: string;
  feedback_text: string | null;
  rating: number | null;
  outcome_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerRecommendationFeedbackCreate {
  recommendation_id: string;
  action: string;
  feedback_text?: string | null;
  rating?: number | null;
  outcome_notes?: string | null;
}

export interface CareerRecommendationFeedbackUpdate {
  action?: string;
  feedback_text?: string | null;
  rating?: number | null;
  outcome_notes?: string | null;
}

// ─── CareerRoadmap ──────────────────────────────────────────────────────────

export interface CareerRoadmap {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  roadmap_type: string;
  target_date: string | null;
  status: string;
  phases: Record<string, unknown>[] | null;
  current_phase: number;
  total_phases: number;
  progress_pct: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerRoadmapCreate {
  title: string;
  description?: string | null;
  roadmap_type: string;
  target_date?: string | null;
  status?: string;
  phases?: Record<string, unknown>[] | null;
}

export interface CareerRoadmapUpdate {
  title?: string;
  description?: string | null;
  roadmap_type?: string;
  target_date?: string | null;
  status?: string;
  phases?: Record<string, unknown>[] | null;
}

// ─── CareerReview ───────────────────────────────────────────────────────────

export interface CareerReview {
  id: string;
  user_id: string;
  review_type: string;
  period_start: string;
  period_end: string;
  overall_score: number | null;
  summary: string | null;
  highlights: string[] | null;
  improvements: string[] | null;
  recommendations: string[] | null;
  next_actions: string[] | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerReviewCreate {
  review_type: string;
  period_start: string;
  period_end: string;
  overall_score?: number | null;
  summary?: string | null;
  highlights?: string[] | null;
  improvements?: string[] | null;
  recommendations?: string[] | null;
  next_actions?: string[] | null;
  status?: string;
}

export interface CareerReviewUpdate {
  review_type?: string;
  period_start?: string;
  period_end?: string;
  overall_score?: number | null;
  summary?: string | null;
  highlights?: string[] | null;
  improvements?: string[] | null;
  recommendations?: string[] | null;
  next_actions?: string[] | null;
  status?: string;
}

// ─── CareerInsight ──────────────────────────────────────────────────────────

export interface CareerInsight {
  id: string;
  user_id: string;
  insight_type: string;
  title: string;
  description: string | null;
  severity: string;
  category: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  is_dismissed: boolean;
  action_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerInsightCreate {
  insight_type: string;
  title: string;
  description?: string | null;
  severity?: string;
  category?: string | null;
  data?: Record<string, unknown> | null;
  action_url?: string | null;
}

export interface CareerInsightUpdate {
  insight_type?: string;
  title?: string;
  description?: string | null;
  severity?: string;
  category?: string | null;
  data?: Record<string, unknown> | null;
  is_read?: boolean;
  is_dismissed?: boolean;
  action_url?: string | null;
}

// ─── CareerTrend ────────────────────────────────────────────────────────────

export interface CareerTrend {
  id: string;
  user_id: string;
  trend_type: string;
  title: string;
  description: string | null;
  direction: string;
  magnitude: number | null;
  data: Record<string, unknown> | null;
  source: string | null;
  period: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerTrendCreate {
  trend_type: string;
  title: string;
  description?: string | null;
  direction?: string;
  magnitude?: number | null;
  data?: Record<string, unknown> | null;
  source?: string | null;
  period?: string | null;
}

export interface CareerTrendUpdate {
  trend_type?: string;
  title?: string;
  description?: string | null;
  direction?: string;
  magnitude?: number | null;
  data?: Record<string, unknown> | null;
  source?: string | null;
  period?: string | null;
}

// ─── CareerLearningRecommendation ───────────────────────────────────────────

export interface CareerLearningRecommendation {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  resource_url: string | null;
  skill_name: string | null;
  priority: number;
  estimated_hours: number | null;
  estimated_cost: number | null;
  relevance_score: number | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerLearningRecommendationCreate {
  title: string;
  description?: string | null;
  resource_type: string;
  resource_url?: string | null;
  skill_name?: string | null;
  priority?: number;
  estimated_hours?: number | null;
  estimated_cost?: number | null;
  relevance_score?: number | null;
  status?: string;
}

export interface CareerLearningRecommendationUpdate {
  title?: string;
  description?: string | null;
  resource_type?: string;
  resource_url?: string | null;
  skill_name?: string | null;
  priority?: number;
  estimated_hours?: number | null;
  estimated_cost?: number | null;
  relevance_score?: number | null;
  status?: string;
}

// ─── CareerSkillGap ─────────────────────────────────────────────────────────

export interface CareerSkillGap {
  id: string;
  user_id: string;
  skill_name: string;
  current_level: number;
  target_level: number;
  gap_size: number;
  priority: number;
  market_demand: number | null;
  learning_resources: Record<string, unknown>[] | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerSkillGapCreate {
  skill_name: string;
  current_level?: number;
  target_level?: number;
  gap_size?: number;
  priority?: number;
  market_demand?: number | null;
  learning_resources?: Record<string, unknown>[] | null;
  status?: string;
}

export interface CareerSkillGapUpdate {
  skill_name?: string;
  current_level?: number;
  target_level?: number;
  gap_size?: number;
  priority?: number;
  market_demand?: number | null;
  learning_resources?: Record<string, unknown>[] | null;
  status?: string;
}

// ─── CareerOpportunity ──────────────────────────────────────────────────────

export interface CareerOpportunity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  opportunity_type: string;
  source_module: string | null;
  source_entity_id: string | null;
  match_score: number | null;
  data: Record<string, unknown> | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerOpportunityCreate {
  title: string;
  description?: string | null;
  opportunity_type: string;
  source_module?: string | null;
  source_entity_id?: string | null;
  match_score?: number | null;
  data?: Record<string, unknown> | null;
  status?: string;
}

export interface CareerOpportunityUpdate {
  title?: string;
  description?: string | null;
  opportunity_type?: string;
  source_module?: string | null;
  match_score?: number | null;
  data?: Record<string, unknown> | null;
  status?: string;
}

// ─── CareerRisk ─────────────────────────────────────────────────────────────

export interface CareerRisk {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  risk_type: string;
  severity: string;
  likelihood: number | null;
  impact_score: number | null;
  mitigation: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerRiskCreate {
  title: string;
  description?: string | null;
  risk_type: string;
  severity?: string;
  likelihood?: number | null;
  impact_score?: number | null;
  mitigation?: string | null;
  status?: string;
}

export interface CareerRiskUpdate {
  title?: string;
  description?: string | null;
  risk_type?: string;
  severity?: string;
  likelihood?: number | null;
  impact_score?: number | null;
  mitigation?: string | null;
  status?: string;
}

// ─── CareerPriority ─────────────────────────────────────────────────────────

export interface CareerPriority {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority_type: string;
  priority_level: number;
  due_date: string | null;
  status: string;
  linked_recommendation_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerPriorityCreate {
  title: string;
  description?: string | null;
  priority_type: string;
  priority_level?: number;
  due_date?: string | null;
  status?: string;
  linked_recommendation_id?: string | null;
}

export interface CareerPriorityUpdate {
  title?: string;
  description?: string | null;
  priority_type?: string;
  priority_level?: number;
  due_date?: string | null;
  status?: string;
  linked_recommendation_id?: string | null;
}

// ─── CareerAlert ────────────────────────────────────────────────────────────

export interface CareerAlert {
  id: string;
  user_id: string;
  alert_type: string;
  title: string;
  message: string | null;
  severity: string;
  source_module: string | null;
  source_entity_id: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  action_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerAlertCreate {
  alert_type: string;
  title: string;
  message?: string | null;
  severity?: string;
  source_module?: string | null;
  source_entity_id?: string | null;
  action_url?: string | null;
}

export interface CareerAlertUpdate {
  alert_type?: string;
  title?: string;
  message?: string | null;
  severity?: string;
  source_module?: string | null;
  is_read?: boolean;
  is_dismissed?: boolean;
  action_url?: string | null;
}

// ─── CareerNotification ─────────────────────────────────────────────────────

export interface CareerNotification {
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

export interface CareerNotificationCreate {
  notification_type: string;
  title: string;
  message?: string | null;
  action_url?: string | null;
}

export interface CareerNotificationUpdate {
  notification_type?: string;
  title?: string;
  message?: string | null;
  is_read?: boolean;
  action_url?: string | null;
}

// ─── CareerConversation ─────────────────────────────────────────────────────

export interface CareerConversation {
  id: string;
  user_id: string;
  title: string | null;
  status: string;
  last_message_at: string | null;
  message_count: number;
  context: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerConversationCreate {
  title?: string | null;
  status?: string;
  context?: Record<string, unknown> | null;
}

export interface CareerConversationUpdate {
  title?: string | null;
  status?: string;
  context?: Record<string, unknown> | null;
}

// ─── CareerMessage ──────────────────────────────────────────────────────────

export interface CareerMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  content: string;
  tokens_used: number | null;
  latency_ms: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerMessageCreate {
  conversation_id: string;
  role: string;
  content: string;
  tokens_used?: number | null;
  latency_ms?: number | null;
}

export interface CareerMessageUpdate {
  role?: string;
  content?: string;
  tokens_used?: number | null;
  latency_ms?: number | null;
}

// ─── CareerPrompt ───────────────────────────────────────────────────────────

export interface CareerPrompt {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  prompt_text: string;
  module: string | null;
  version: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerPromptCreate {
  name: string;
  slug: string;
  description?: string | null;
  prompt_text: string;
  module?: string | null;
  version?: number;
  is_active?: boolean;
}

export interface CareerPromptUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  prompt_text?: string;
  module?: string | null;
  version?: number;
  is_active?: boolean;
}

// ─── CareerExecution ────────────────────────────────────────────────────────

export interface CareerExecution {
  id: string;
  prompt_id: string | null;
  user_id: string;
  request_type: string;
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

export interface CareerExecutionCreate {
  prompt_id?: string | null;
  request_type: string;
  input_data?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
  status?: string;
}

export interface CareerExecutionUpdate {
  prompt_id?: string | null;
  request_type?: string;
  input_data?: Record<string, unknown> | null;
  output_data?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
  status?: string;
  error_message?: string | null;
}

// ─── CareerReport ───────────────────────────────────────────────────────────

export interface CareerReport {
  id: string;
  user_id: string;
  report_type: string;
  title: string;
  period_start: string | null;
  period_end: string | null;
  summary: string | null;
  sections: Record<string, unknown>[] | null;
  scores: Record<string, unknown> | null;
  recommendations_count: number;
  status: string;
  file_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerReportCreate {
  report_type: string;
  title: string;
  period_start?: string | null;
  period_end?: string | null;
  summary?: string | null;
  sections?: Record<string, unknown>[] | null;
  scores?: Record<string, unknown> | null;
  status?: string;
}

export interface CareerReportUpdate {
  report_type?: string;
  title?: string;
  period_start?: string | null;
  period_end?: string | null;
  summary?: string | null;
  sections?: Record<string, unknown>[] | null;
  scores?: Record<string, unknown> | null;
  status?: string;
  file_url?: string | null;
}

// ─── CareerSnapshot ─────────────────────────────────────────────────────────

export interface CareerSnapshot {
  id: string;
  user_id: string;
  snapshot_type: string;
  data: Record<string, unknown> | null;
  scores: Record<string, unknown> | null;
  label: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerSnapshotCreate {
  snapshot_type: string;
  data?: Record<string, unknown> | null;
  scores?: Record<string, unknown> | null;
  label?: string | null;
}

export interface CareerSnapshotUpdate {
  snapshot_type?: string;
  data?: Record<string, unknown> | null;
  scores?: Record<string, unknown> | null;
  label?: string | null;
}

// ─── CareerComparison ───────────────────────────────────────────────────────

export interface CareerComparison {
  id: string;
  user_id: string;
  name: string | null;
  snapshot_a_id: string;
  snapshot_b_id: string;
  diff_data: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerComparisonCreate {
  name?: string | null;
  snapshot_a_id: string;
  snapshot_b_id: string;
  diff_data?: Record<string, unknown> | null;
}

export interface CareerComparisonUpdate {
  name?: string | null;
  diff_data?: Record<string, unknown> | null;
}

// ─── CareerHistory ──────────────────────────────────────────────────────────

export interface CareerHistory {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string | null;
  previous_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerHistoryCreate {
  entity_type: string;
  entity_id?: string | null;
  action: string;
  description?: string | null;
  previous_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
}

export interface CareerHistoryUpdate {
  entity_type?: string;
  action?: string;
  description?: string | null;
  previous_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
}

// ─── CareerAchievement ──────────────────────────────────────────────────────

export interface CareerAchievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  achievement_type: string;
  badge_icon: string | null;
  earned_at: string | null;
  points: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerAchievementCreate {
  title: string;
  description?: string | null;
  achievement_type: string;
  badge_icon?: string | null;
  earned_at?: string | null;
  points?: number;
}

export interface CareerAchievementUpdate {
  title?: string;
  description?: string | null;
  achievement_type?: string;
  badge_icon?: string | null;
  points?: number;
}

// ─── CareerHabit ────────────────────────────────────────────────────────────

export interface CareerHabit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  habit_type: string;
  frequency: string;
  streak: number;
  best_streak: number;
  last_completed_at: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerHabitCreate {
  name: string;
  description?: string | null;
  habit_type: string;
  frequency?: string;
}

export interface CareerHabitUpdate {
  name?: string;
  description?: string | null;
  habit_type?: string;
  frequency?: string;
  status?: string;
}

// ─── CareerProgress ─────────────────────────────────────────────────────────

export interface CareerProgress {
  id: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  previous_value: number | null;
  change_pct: number | null;
  period: string | null;
  data: Record<string, unknown> | null;
  recorded_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerProgressCreate {
  metric_name: string;
  metric_value: number;
  previous_value?: number | null;
  change_pct?: number | null;
  period?: string | null;
  data?: Record<string, unknown> | null;
}

export interface CareerProgressUpdate {
  metric_name?: string;
  metric_value?: number;
  previous_value?: number | null;
  change_pct?: number | null;
  period?: string | null;
  data?: Record<string, unknown> | null;
}

// ─── CareerSettings ─────────────────────────────────────────────────────────

export interface CareerSettings {
  id: string;
  user_id: string;
  notification_email: boolean;
  notification_in_app: boolean;
  review_frequency: string;
  goal_reminder: boolean;
  weekly_digest: boolean;
  monthly_report: boolean;
  ai_provider_preference: string | null;
  tone: string;
  focus_areas: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerSettingsCreate {
  notification_email?: boolean;
  notification_in_app?: boolean;
  review_frequency?: string;
  goal_reminder?: boolean;
  weekly_digest?: boolean;
  monthly_report?: boolean;
  ai_provider_preference?: string | null;
  tone?: string;
  focus_areas?: string[] | null;
}

export interface CareerSettingsUpdate {
  notification_email?: boolean;
  notification_in_app?: boolean;
  review_frequency?: string;
  goal_reminder?: boolean;
  weekly_digest?: boolean;
  monthly_report?: boolean;
  ai_provider_preference?: string | null;
  tone?: string;
  focus_areas?: string[] | null;
}

// ─── CareerBookmark ─────────────────────────────────────────────────────────

export interface CareerBookmark {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string | null;
  bookmark_type: string;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerBookmarkCreate {
  title: string;
  description?: string | null;
  url?: string | null;
  bookmark_type: string;
  tags?: string[] | null;
}

export interface CareerBookmarkUpdate {
  title?: string;
  description?: string | null;
  url?: string | null;
  bookmark_type?: string;
  tags?: string[] | null;
}

// ─── CareerResource ─────────────────────────────────────────────────────────

export interface CareerResource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string | null;
  category: string | null;
  tags: string[] | null;
  rating: number | null;
  notes: string | null;
  is_completed: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerResourceCreate {
  title: string;
  description?: string | null;
  resource_type: string;
  url?: string | null;
  category?: string | null;
  tags?: string[] | null;
  rating?: number | null;
  notes?: string | null;
}

export interface CareerResourceUpdate {
  title?: string;
  description?: string | null;
  resource_type?: string;
  url?: string | null;
  category?: string | null;
  tags?: string[] | null;
  rating?: number | null;
  notes?: string | null;
  is_completed?: boolean;
}

// ─── CareerResourceProgress ─────────────────────────────────────────────────

export interface CareerResourceProgress {
  id: string;
  resource_id: string;
  user_id: string;
  progress_pct: number;
  time_spent_minutes: number;
  last_accessed_at: string | null;
  notes: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerResourceProgressCreate {
  resource_id: string;
  progress_pct?: number;
  time_spent_minutes?: number;
  notes?: string | null;
  status?: string;
}

export interface CareerResourceProgressUpdate {
  progress_pct?: number;
  time_spent_minutes?: number;
  notes?: string | null;
  status?: string;
}

// ─── CareerReminder ─────────────────────────────────────────────────────────

export interface CareerReminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reminder_type: string;
  remind_at: string;
  is_completed: boolean;
  linked_entity_type: string | null;
  linked_entity_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerReminderCreate {
  title: string;
  description?: string | null;
  reminder_type: string;
  remind_at: string;
  linked_entity_type?: string | null;
  linked_entity_id?: string | null;
}

export interface CareerReminderUpdate {
  title?: string;
  description?: string | null;
  reminder_type?: string;
  remind_at?: string;
  is_completed?: boolean;
  linked_entity_type?: string | null;
  linked_entity_id?: string | null;
}

// ─── CareerDigest ───────────────────────────────────────────────────────────

export interface CareerDigest {
  id: string;
  user_id: string;
  digest_type: string;
  period_start: string;
  period_end: string;
  subject: string | null;
  content: Record<string, unknown> | null;
  status: string;
  sent_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerDigestCreate {
  digest_type: string;
  period_start: string;
  period_end: string;
  subject?: string | null;
  content?: Record<string, unknown> | null;
  status?: string;
}

export interface CareerDigestUpdate {
  digest_type?: string;
  period_start?: string;
  period_end?: string;
  subject?: string | null;
  content?: Record<string, unknown> | null;
  status?: string;
}

// ─── CareerAIResult ─────────────────────────────────────────────────────────

export interface CareerAIResult {
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

export interface CareerAIResultCreate {
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

export interface CareerAIResultUpdate {
  request_type?: string;
  input_data?: Record<string, unknown> | null;
  output_data?: Record<string, unknown> | null;
  confidence?: number | null;
  reasoning?: string | null;
  suggestions?: string[] | null;
  scores?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
}

// ─── CareerAIRequest ────────────────────────────────────────────────────────

export interface CareerAIRequest {
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

export interface CareerAIRequestCreate {
  request_type: string;
  prompt?: string | null;
  context?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
  status?: string;
  execution_id?: string | null;
}

export interface CareerAIRequestUpdate {
  request_type?: string;
  prompt?: string | null;
  context?: Record<string, unknown> | null;
  provider?: string | null;
  model?: string | null;
  status?: string;
  execution_id?: string | null;
}

// ─── CareerScoreHistory ─────────────────────────────────────────────────────

export interface CareerScoreHistory {
  id: string;
  user_id: string;
  score_type: string;
  score: number;
  breakdown: Record<string, unknown> | null;
  recorded_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CareerScoreHistoryCreate {
  score_type: string;
  score: number;
  breakdown?: Record<string, unknown> | null;
}

export interface CareerScoreHistoryUpdate {
  score_type?: string;
  score?: number;
  breakdown?: Record<string, unknown> | null;
}

// ─── Search / Filter Interfaces ─────────────────────────────────────────────

export interface CareerCoachSearchRequest {
  query?: string;
  session_type?: SessionType;
  status?: SessionStatus;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface CareerGoalSearchRequest {
  query?: string;
  goal_type?: GoalType;
  status?: GoalStatus;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface CareerRecommendationSearchRequest {
  query?: string;
  category?: RecommendationCategory;
  status?: RecommendationStatus;
  impact?: RecommendationImpact;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface CareerAssessmentSearchRequest {
  query?: string;
  assessment_type?: AssessmentType;
  status?: AssessmentStatus;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface CareerInsightSearchRequest {
  query?: string;
  insight_type?: InsightType;
  severity?: SeverityLevel;
  is_read?: boolean;
  is_dismissed?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
