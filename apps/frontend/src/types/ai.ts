export type AIModule =
  | "resume"
  | "ats"
  | "job_match"
  | "career_coach"
  | "interview"
  | "cover_letter"
  | "email"
  | "portfolio"
  | "company_research"
  | "recruiter_crm"
  | "analytics";

export type AIRequestStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "retrying";

export interface AIRequest {
  id: string;
  user_id: string;
  module: AIModule;
  action: string;
  provider: string | null;
  model: string | null;
  status: AIRequestStatus;
  priority: number;
  request_data: Record<string, unknown>;
  response_data: Record<string, unknown> | null;
  error_message: string | null;
  error_code: string | null;
  retry_count: number;
  max_retries: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost: number;
  latency_ms: number | null;
  started_at: string | null;
  completed_at: string | null;
  context_snapshot: Record<string, unknown> | null;
  prompt_version_id: string | null;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
}

export type AIExecutionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "timeout";

export interface AIExecution {
  id: string;
  request_id: string;
  attempt_number: number;
  provider: string;
  model: string;
  status: AIExecutionStatus;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost: number;
  latency_ms: number | null;
  time_to_first_token_ms: number | null;
  started_at: string;
  completed_at: string | null;
  raw_request: Record<string, unknown> | null;
  raw_response: Record<string, unknown> | null;
  parsed_response: Record<string, unknown> | null;
  error_message: string | null;
  error_type: string | null;
  is_timeout: boolean;
  is_rate_limited: boolean;
  temperature: number | null;
  max_tokens: number | null;
  top_p: number | null;
  system_fingerprint: string | null;
  created_at: string;
  updated_at: string;
}

export type ProviderHealthStatus = "healthy" | "degraded" | "down";

export interface AIProvider {
  id: string;
  name: string;
  display_name: string;
  is_enabled: boolean;
  is_default: boolean;
  api_endpoint: string | null;
  config: Record<string, unknown>;
  rate_limit_rpm: number | null;
  rate_limit_tpm: number | null;
  rate_limit_rpd: number | null;
  priority: number;
  health_status: ProviderHealthStatus;
  last_health_check: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIModel {
  id: string;
  provider_id: string;
  model_id: string;
  display_name: string;
  is_enabled: boolean;
  is_default: boolean;
  supports_json: boolean;
  supports_streaming: boolean;
  supports_vision: boolean;
  supports_functions: boolean;
  max_context_tokens: number;
  max_output_tokens: number;
  input_cost_per_1m: number;
  output_cost_per_1m: number;
  requests_per_minute: number | null;
  tokens_per_minute: number | null;
  default_temperature: number;
  default_max_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  module: AIModule;
  is_system: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  current_version?: PromptVersion;
  version_count?: number;
}

export type PromptVersionStatus = "draft" | "published" | "archived";

export interface PromptVariable {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  version_number: number;
  name: string;
  status: PromptVersionStatus;
  system_prompt: string;
  user_prompt_template: string;
  variables: PromptVariable[];
  preferred_provider: string | null;
  preferred_model: string | null;
  temperature: number;
  max_tokens: number;
  top_p: number | null;
  frequency_penalty: number | null;
  presence_penalty: number | null;
  response_format: string;
  output_schema: Record<string, unknown> | null;
  change_notes: string | null;
  published_at: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptExecution {
  id: string;
  prompt_id: string;
  prompt_version_id: string;
  request_id: string | null;
  variables_used: Record<string, unknown>;
  rendered_system_prompt: string;
  rendered_user_prompt: string;
  output: string | null;
  parsed_output: Record<string, unknown> | null;
  quality_score: number | null;
  relevance_score: number | null;
  accuracy_score: number | null;
  user_rating: number | null;
  user_feedback: string | null;
  latency_ms: number | null;
  created_at: string;
}

export interface AIUsage {
  id: string;
  user_id: string;
  period: string;
  period_start: string;
  period_end: string;
  total_requests: number;
  completed_requests: number;
  failed_requests: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost: number;
  module_breakdown: Record<
    AIModule,
    { requests: number; tokens: number; cost: number }
  >;
  provider_breakdown: Record<
    string,
    { requests: number; tokens: number; cost: number }
  >;
  created_at: string;
  updated_at: string;
}

export interface AIUsageSummary {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  avg_latency_ms: number;
  success_rate: number;
  by_module: Record<AIModule, number>;
  by_provider: Record<string, number>;
}

export interface AIQuota {
  id: string;
  user_id: string;
  module: string;
  max_requests_per_day: number;
  max_tokens_per_day: number;
  max_cost_per_day: number;
  max_requests_per_month: number;
  max_tokens_per_month: number;
  max_cost_per_month: number;
  current_requests_today: number;
  current_tokens_today: number;
  current_cost_today: number;
  current_requests_this_month: number;
  current_tokens_this_month: number;
  current_cost_this_month: number;
  daily_reset_at: string | null;
  monthly_reset_at: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AISettings {
  id: string;
  user_id: string;
  default_provider: string;
  default_model: string;
  default_temperature: number;
  default_max_tokens: number;
  content_filter_enabled: boolean;
  max_request_size: number;
  blocked_topics: string[];
  monthly_budget_limit: number | null;
  alert_threshold_percent: number;
  auto_disable_on_budget_exceeded: boolean;
  cache_enabled: boolean;
  cache_ttl_seconds: number;
  cache_semantic_enabled: boolean;
  queue_enabled: boolean;
  queue_max_concurrent: number;
  queue_timeout_seconds: number;
  streaming_enabled: boolean;
  fallback_providers_enabled: boolean;
  auto_retry_enabled: boolean;
  max_auto_retries: number;
  created_at: string;
  updated_at: string;
}

export interface AICacheEntry {
  id: string;
  cache_key: string;
  module: string;
  action: string;
  prompt_hash: string;
  context_hash: string;
  response_data: Record<string, unknown>;
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  expires_at: string;
  access_count: number;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AICacheStats {
  total_entries: number;
  total_hits: number;
  total_misses: number;
  hit_rate: number;
  total_saved_cost: number;
  by_module: Record<string, { entries: number; hits: number }>;
}

export interface AIConversation {
  id: string;
  user_id: string;
  module: AIModule;
  title: string | null;
  status: "active" | "archived" | "deleted";
  context: Record<string, unknown>;
  message_count: number;
  total_tokens: number;
  total_cost: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIConversationDetail extends AIConversation {
  messages: AIMessage[];
}

export type AIMessageRole = "system" | "user" | "assistant" | "function";

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: AIMessageRole;
  content: string;
  tokens: number;
  model: string | null;
  provider: string | null;
  latency_ms: number | null;
  function_name: string | null;
  function_arguments: Record<string, unknown> | null;
  sequence_number: number;
  created_at: string;
  updated_at: string;
}

export type ArtifactType =
  | "resume_content"
  | "cover_letter"
  | "email"
  | "summary"
  | "analysis"
  | "suggestion"
  | "rewrite"
  | "other";

export interface AIArtifact {
  id: string;
  user_id: string;
  request_id: string | null;
  conversation_id: string | null;
  module: AIModule;
  artifact_type: ArtifactType;
  title: string;
  content: Record<string, unknown>;
  format: string;
  source_entity_type: string | null;
  source_entity_id: string | null;
  version: number;
  is_current: boolean;
  user_rating: number | null;
  is_accepted: boolean;
  is_rejected: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIExecuteRequest {
  module: AIModule;
  action: string;
  context?: Record<string, unknown>;
  provider?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: string;
  prompt_name?: string;
  prompt_variables?: Record<string, unknown>;
  use_cache?: boolean;
}

export interface AIExecuteResponse {
  success: boolean;
  request_id: string;
  data?: unknown;
  cached?: boolean;
  tokens?: { input: number; output: number; total: number };
  cost?: number;
  latency_ms?: number;
  error?: string;
}

export interface AIConversationCreate {
  module: AIModule;
  title?: string;
}

export interface AIConversationMessage {
  role: AIMessageRole;
  content: string;
}

export interface AIArtifactCreate {
  module: AIModule;
  artifact_type: ArtifactType;
  title: string;
  content: Record<string, unknown>;
  source_entity_type?: string;
  source_entity_id?: string;
}

export interface AISearchRequest {
  query?: string;
  module?: AIModule;
  status?: AIRequestStatus;
  provider?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  offset?: number;
  limit?: number;
}

export interface AITokenUsageTrend {
  date: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  requests: number;
}

export interface AILatencyTrend {
  date: string;
  avg_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
}

export interface AICostTrend {
  date: string;
  cost: number;
  by_provider: Record<string, number>;
}
