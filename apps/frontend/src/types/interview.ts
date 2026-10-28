// ─── Union Types ───

export type InterviewSessionType = "behavioral" | "technical" | "coding" | "system_design" | "case_study" | "leadership" | "hr" | "mixed" | "custom";
export type InterviewStatus = "draft" | "active" | "paused" | "completed" | "cancelled";
export type InterviewDifficulty = "easy" | "medium" | "hard" | "expert";
export type InterviewMode = "timed" | "untimed" | "simulation";
export type InterviewQuestionType = "behavioral" | "technical" | "coding" | "system_design" | "leadership" | "hr" | "company_specific" | "role_specific" | "industry_specific" | "follow_up" | "case_study";
export type InterviewFeedbackType = "ai" | "self" | "peer" | "expert";
export type InterviewSortBy = "created_at" | "updated_at" | "title" | "status" | "overall_score" | "session_type";
export type InterviewSortOrder = "asc" | "desc";
export type InterviewSuggestionType = "rewording" | "addition" | "removal" | "structure" | "content" | "example" | " STAR";
export type InterviewPriority = "low" | "medium" | "high" | "urgent";
export type InterviewImprovementStatus = "pending" | "in_progress" | "completed";
export type InterviewRecommendationStatus = "pending" | "accepted" | "completed" | "dismissed";
export type InterviewSimulationStatus = "not_started" | "in_progress" | "completed";
export type InterviewGoalStatus = "active" | "completed" | "expired";
export type InterviewReportType = "summary" | "detailed" | "progress" | "comparison";
export type InterviewChecklistType = "company" | "role" | "general";

// ─── InterviewSession ───

export interface InterviewSession {
  id: string;
  user_id: string;
  career_profile_id: string | null;
  resume_id: string | null;
  resume_version_id: string | null;
  job_id: string | null;
  company_id: string | null;
  template_id: string | null;
  title: string;
  description: string | null;
  session_type: InterviewSessionType;
  status: InterviewStatus;
  difficulty: InterviewDifficulty;
  mode: InterviewMode;
  duration_minutes: number | null;
  time_spent_seconds: number | null;
  time_limit_seconds: number | null;
  total_questions: number | null;
  answered_questions: number | null;
  current_question_index: number | null;
  is_timed: boolean;
  is_simulated: boolean;
  is_practice: boolean;
  is_archived: boolean;
  is_favorite: boolean;
  overall_score: number | null;
  technical_score: number | null;
  communication_score: number | null;
  confidence_score: number | null;
  leadership_score: number | null;
  problem_solving_score: number | null;
  behavioral_score: number | null;
  system_design_score: number | null;
  coding_score: number | null;
  culture_fit_score: number | null;
  readiness_score: number | null;
  improvement_score: number | null;
  confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  created_at: string;
  updated_at: string;
}

export interface InterviewSessionCreate {
  title: string;
  description?: string;
  session_type?: InterviewSessionType;
  difficulty?: InterviewDifficulty;
  mode?: InterviewMode;
  duration_minutes?: number;
  is_timed?: boolean;
  is_simulated?: boolean;
  is_practice?: boolean;
  career_profile_id?: string;
  resume_id?: string;
  job_id?: string;
  company_id?: string;
  template_id?: string;
  metadata?: Record<string, unknown>;
}

export interface InterviewSessionUpdate {
  title?: string;
  description?: string;
  session_type?: InterviewSessionType;
  difficulty?: InterviewDifficulty;
  mode?: InterviewMode;
  duration_minutes?: number;
  status?: InterviewStatus;
  is_archived?: boolean;
  is_favorite?: boolean;
  metadata?: Record<string, unknown>;
}

export interface InterviewSessionDetail extends InterviewSession {
  metadata?: Record<string, unknown>;
  rounds?: InterviewRound[];
  questions?: InterviewQuestion[];
  answers?: InterviewAnswer[];
  evaluations?: InterviewEvaluation[];
  feedbacks?: InterviewFeedback[];
  suggestions?: InterviewSuggestion[];
  improvements?: InterviewImprovement[];
  history?: InterviewHistory[];
  scores?: InterviewScore[];
  metrics?: InterviewMetric[];
  reports?: InterviewReport[];
  bookmarks?: InterviewBookmark[];
  tags?: InterviewTag[];
  simulations?: InterviewSimulation[];
}

// ─── InterviewTemplate ───

export interface InterviewTemplate {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  template_type: string | null;
  category: string | null;
  difficulty: string | null;
  duration_minutes: number | null;
  question_count: number | null;
  structure: Record<string, unknown> | null;
  questions_config: Record<string, unknown> | null;
  is_system: boolean;
  is_public: boolean;
  is_active: boolean;
  usage_count: number;
  target_industry: string | null;
  target_role: string | null;
  company_name: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewQuestion ───

export interface InterviewQuestion {
  id: string;
  session_id: string | null;
  template_id: string | null;
  category: string | null;
  question_type: InterviewQuestionType;
  difficulty: string | null;
  question_text: string;
  expected_answer: string | null;
  answer_guidelines: string | null;
  evaluation_criteria: Record<string, unknown> | null;
  keywords: string[] | null;
  time_limit_seconds: number | null;
  sort_order: number | null;
  follow_up_to_id: string | null;
  is_follow_up: boolean;
  ai_generated: boolean;
  confidence: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewQuestionBank ───

export interface InterviewQuestionBank {
  id: string;
  user_id: string;
  question_text: string;
  question_type: InterviewQuestionType;
  category: string | null;
  difficulty: string | null;
  expected_answer: string | null;
  answer_guidelines: string | null;
  evaluation_criteria: Record<string, unknown> | null;
  keywords: string[] | null;
  tags: string[] | null;
  industry: string | null;
  role: string | null;
  company_name: string | null;
  source: string | null;
  usage_count: number;
  is_system: boolean;
  is_active: boolean;
  confidence: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewRound ───

export interface InterviewRound {
  id: string;
  session_id: string;
  round_number: number;
  round_name: string | null;
  round_type: string | null;
  duration_minutes: number | null;
  question_count: number | null;
  status: string | null;
  score: number | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewAnswer ───

export interface InterviewAnswer {
  id: string;
  session_id: string;
  question_id: string | null;
  round_id: string | null;
  answer_text: string | null;
  answer_type: string | null;
  time_spent_seconds: number | null;
  is_skipped: boolean;
  sort_order: number | null;
  score: number | null;
  confidence: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewEvaluation ───

export interface InterviewEvaluation {
  id: string;
  session_id: string;
  answer_id: string | null;
  evaluation_type: string | null;
  score: number;
  max_score: number;
  technical_score: number | null;
  communication_score: number | null;
  confidence_score: number | null;
  problem_solving_score: number | null;
  behavioral_score: number | null;
  leadership_score: number | null;
  clarity_score: number | null;
  completeness_score: number | null;
  keyword_coverage_score: number | null;
  feedback_text: string | null;
  improvement_suggestions: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  ai_confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewFeedback ───

export interface InterviewFeedback {
  id: string;
  session_id: string;
  feedback_type: InterviewFeedbackType;
  overall_rating: number | null;
  technical_rating: number | null;
  communication_rating: number | null;
  strengths: string[] | null;
  areas_for_improvement: string[] | null;
  recommendations: string[] | null;
  detailed_feedback: string | null;
  action_items: string[] | null;
  summary: string | null;
  ai_confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewSuggestion ───

export interface InterviewSuggestion {
  id: string;
  session_id: string;
  answer_id: string | null;
  suggestion_type: string | null;
  priority: string | null;
  title: string | null;
  description: string | null;
  original_text: string | null;
  suggested_text: string | null;
  explanation: string | null;
  confidence: number | null;
  is_applied: boolean;
  is_dismissed: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewImprovement ───

export interface InterviewImprovement {
  id: string;
  session_id: string;
  improvement_type: string | null;
  category: string | null;
  title: string | null;
  description: string | null;
  current_level: string | null;
  target_level: string | null;
  priority: string | null;
  status: InterviewImprovementStatus;
  resources: string[] | null;
  estimated_time_minutes: number | null;
  before_score: number | null;
  after_score: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewHistory ───

export interface InterviewHistory {
  id: string;
  session_id: string;
  action: string;
  action_detail: string | null;
  previous_value: string | null;
  new_value: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewComparison ───

export interface InterviewComparison {
  id: string;
  user_id: string;
  session_id_1: string | null;
  session_id_2: string | null;
  comparison_type: string | null;
  score_diff: number | null;
  improvement_areas: string[] | null;
  regression_areas: string[] | null;
  insights: string[] | null;
  summary: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewScore ───

export interface InterviewScore {
  id: string;
  session_id: string;
  score_type: string;
  score_value: number;
  max_score: number;
  weight: number;
  category: string | null;
  breakdown: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewMetric ───

export interface InterviewMetric {
  id: string;
  session_id: string;
  metric_name: string;
  metric_value: number | null;
  metric_unit: string | null;
  metric_type: string | null;
  category: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewAnalytics ───

export interface InterviewAnalytics {
  id: string;
  user_id: string;
  total_sessions: number;
  completed_sessions: number;
  avg_overall_score: number | null;
  avg_technical_score: number | null;
  avg_communication_score: number | null;
  avg_confidence_score: number | null;
  avg_readiness_score: number | null;
  total_questions_answered: number;
  total_practice_minutes: number;
  strongest_categories: string[] | null;
  weakest_categories: string[] | null;
  improvement_trend: number[] | null;
  score_history: number[] | null;
  streak_days: number;
  last_practice_date: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewPracticePlan ───

export interface InterviewPracticePlan {
  id: string;
  user_id: string;
  session_id: string | null;
  plan_name: string;
  description: string | null;
  plan_type: string | null;
  target_date: string | null;
  status: string;
  total_tasks: number;
  completed_tasks: number;
  priority: string | null;
  tasks: Record<string, unknown>[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewChecklist ───

export interface InterviewChecklist {
  id: string;
  user_id: string;
  session_id: string | null;
  checklist_type: string | null;
  company_name: string | null;
  role_title: string | null;
  items: Record<string, unknown>[] | null;
  completed_items: Record<string, unknown>[] | null;
  progress: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewRecording ───

export interface InterviewRecording {
  id: string;
  session_id: string;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  duration_seconds: number | null;
  format: string | null;
  transcript_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewTranscript ───

export interface InterviewTranscript {
  id: string;
  session_id: string;
  recording_id: string | null;
  content: string | null;
  language: string | null;
  confidence: number | null;
  segments: Record<string, unknown>[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewArtifact ───

export interface InterviewArtifact {
  id: string;
  user_id: string;
  session_id: string | null;
  artifact_type: string | null;
  title: string | null;
  description: string | null;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  content: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewExecution ───

export interface InterviewExecution {
  id: string;
  session_id: string;
  question_id: string | null;
  execution_type: string | null;
  provider: string | null;
  model: string | null;
  status: string | null;
  request_data: Record<string, unknown> | null;
  response_data: Record<string, unknown> | null;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  latency_ms: number | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewPrompt ───

export interface InterviewPrompt {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  prompt_type: string | null;
  system_prompt: string | null;
  user_prompt_template: string | null;
  variables: Record<string, unknown> | null;
  default_temperature: number | null;
  default_max_tokens: number | null;
  is_system: boolean;
  is_active: boolean;
  version: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewPromptVersion ───

export interface InterviewPromptVersion {
  id: string;
  prompt_id: string;
  version_number: number;
  system_prompt: string | null;
  user_prompt_template: string | null;
  variables: Record<string, unknown> | null;
  change_summary: string | null;
  created_by: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewReport ───

export interface InterviewReport {
  id: string;
  user_id: string;
  session_id: string | null;
  report_type: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  score_breakdown: Record<string, unknown> | null;
  recommendations: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  action_items: string[] | null;
  ai_confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewBookmark ───

export interface InterviewBookmark {
  id: string;
  user_id: string;
  session_id: string | null;
  question_id: string | null;
  note: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewTag ───

export interface InterviewTag {
  id: string;
  user_id: string;
  session_id: string | null;
  name: string;
  color: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewCollection ───

export interface InterviewCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  is_default: boolean;
  item_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewCollectionItem ───

export interface InterviewCollectionItem {
  id: string;
  collection_id: string;
  session_id: string | null;
  sort_order: number;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewSettings ───

export interface InterviewSettings {
  id: string;
  user_id: string;
  default_session_type: string | null;
  default_difficulty: string | null;
  default_mode: string | null;
  default_duration_minutes: number | null;
  default_questions_per_session: number | null;
  auto_evaluate: boolean;
  auto_generate_follow_ups: boolean;
  show_timer: boolean;
  show_confidence: boolean;
  preferred_ai_provider: string | null;
  preferred_ai_model: string | null;
  default_temperature: number | null;
  default_max_tokens: number | null;
  notifications_enabled: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewRecommendation ───

export interface InterviewRecommendation {
  id: string;
  user_id: string;
  session_id: string | null;
  recommendation_type: string | null;
  title: string | null;
  description: string | null;
  priority: string | null;
  category: string | null;
  target_score: number | null;
  current_score: number | null;
  resources: string[] | null;
  estimated_time_minutes: number | null;
  status: InterviewRecommendationStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewCompanyPreparation ───

export interface InterviewCompanyPreparation {
  id: string;
  user_id: string;
  company_id: string | null;
  session_id: string | null;
  company_name: string | null;
  preparation_type: string | null;
  checklist_items: Record<string, unknown>[] | null;
  completed_items: Record<string, unknown>[] | null;
  research_notes: string | null;
  culture_notes: string | null;
  hiring_process_notes: string | null;
  salary_research: Record<string, unknown> | null;
  progress: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewJobPreparation ───

export interface InterviewJobPreparation {
  id: string;
  user_id: string;
  job_id: string | null;
  session_id: string | null;
  job_title: string | null;
  preparation_type: string | null;
  required_skills: string[] | null;
  skill_gaps: string[] | null;
  study_plan: Record<string, unknown>[] | null;
  practice_areas: string[] | null;
  checklist_items: Record<string, unknown>[] | null;
  completed_items: Record<string, unknown>[] | null;
  progress: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewSimulation ───

export interface InterviewSimulation {
  id: string;
  session_id: string;
  simulation_type: string | null;
  ai_persona: string | null;
  ai_persona_description: string | null;
  company_context: string | null;
  role_context: string | null;
  difficulty: string | null;
  status: InterviewSimulationStatus;
  current_step: number;
  total_steps: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewSimulationStep ───

export interface InterviewSimulationStep {
  id: string;
  simulation_id: string;
  step_number: number;
  step_type: string | null;
  ai_message: string | null;
  user_message: string | null;
  question_id: string | null;
  response_time_seconds: number | null;
  is_skipped: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewSimulationFeedback ───

export interface InterviewSimulationFeedback {
  id: string;
  simulation_id: string;
  overall_score: number | null;
  communication_score: number | null;
  technical_score: number | null;
  confidence_score: number | null;
  strengths: string[] | null;
  improvements: string[] | null;
  detailed_feedback: string | null;
  ai_confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewProgress ───

export interface InterviewProgress {
  id: string;
  user_id: string;
  total_sessions: number;
  completed_sessions: number;
  total_questions: number;
  answered_questions: number;
  total_practice_minutes: number;
  current_streak: number;
  longest_streak: number;
  overall_readiness: number;
  category_progress: Record<string, number> | null;
  weekly_goals: Record<string, unknown>[] | null;
  last_session_date: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewGoal ───

export interface InterviewGoal {
  id: string;
  user_id: string;
  goal_type: string | null;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number;
  unit: string | null;
  deadline: string | null;
  status: InterviewGoalStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewMilestone ───

export interface InterviewMilestone {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  milestone_type: string | null;
  is_completed: boolean;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewBehavioralQuestion ───

export interface InterviewBehavioralQuestion {
  id: string;
  question_id: string;
  star_method: {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
  } | null;
  competency: string | null;
  example_answer: string | null;
  evaluation_criteria: Record<string, unknown> | null;
  follow_up_questions: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewTechnicalQuestion ───

export interface InterviewTechnicalQuestion {
  id: string;
  question_id: string;
  topic: string | null;
  technology: string | null;
  approach: string | null;
  solution: string | null;
  complexity_time: string | null;
  complexity_space: string | null;
  prerequisites: string[] | null;
  concepts: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewCodingQuestion ───

export interface InterviewCodingQuestion {
  id: string;
  question_id: string;
  language: string | null;
  starter_code: string | null;
  solution_code: string | null;
  test_cases: Record<string, unknown>[] | null;
  constraints: string[] | null;
  examples: Record<string, unknown>[] | null;
  time_limit_seconds: number | null;
  memory_limit_mb: number | null;
  approach: string | null;
  complexity_time: string | null;
  complexity_space: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewSystemDesignQuestion ───

export interface InterviewSystemDesignQuestion {
  id: string;
  question_id: string;
  system_type: string | null;
  scale_requirements: string | null;
  design_approach: string | null;
  architecture_diagram_url: string | null;
  components: string[] | null;
  trade_offs: Record<string, unknown>[] | null;
  technologies: string[] | null;
  scalability_notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── InterviewCaseStudy ───

export interface InterviewCaseStudy {
  id: string;
  question_id: string;
  industry: string | null;
  business_context: string | null;
  problem_statement: string | null;
  analysis_framework: string | null;
  solution_approach: string | null;
  key_metrics: string[] | null;
  recommendations: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── Request / Action Types ───

export interface InterviewStartRequest {
  config?: Record<string, unknown>;
}

export interface InterviewPauseRequest {
  reason?: string;
}

export interface InterviewResumeRequest {
  config?: Record<string, unknown>;
}

export interface InterviewFinishRequest {
  notes?: string;
}

export interface InterviewEvaluateRequest {
  config?: Record<string, unknown>;
}

export interface InterviewFeedbackRequest {
  config?: Record<string, unknown>;
}

export interface InterviewCompareRequest {
  session_id_2: string;
  comparison_type?: string;
}

export interface InterviewGenerateRequest {
  session_type?: InterviewSessionType;
  difficulty?: InterviewDifficulty;
  question_count?: number;
  category?: string;
  focus_areas?: string[];
  company_name?: string;
  role_title?: string;
  job_description?: string;
  additional_context?: string;
}

export interface InterviewGenerateResponse {
  questions: InterviewQuestion[];
  metadata?: Record<string, unknown>;
}

export interface InterviewSearchRequest {
  query?: string;
  offset?: number;
  limit?: number;
}

export interface InterviewBulkAction {
  session_ids: string[];
  action: string;
}

export interface InterviewExportRequest {
  format: "pdf" | "text" | "json";
  sections?: string[];
}

// ─── Stats / Pagination Types ───

export interface InterviewStats {
  total_sessions: number;
  completed_sessions: number;
  avg_score: number;
  total_practice_minutes: number;
  streak_days: number;
}

export interface InterviewPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface InterviewPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: InterviewPaginationMeta;
  message?: string | null;
}
