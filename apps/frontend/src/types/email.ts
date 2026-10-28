// ─── Union Types ───

export type EmailDirection = "inbound" | "outbound";
export type EmailStatus = "draft" | "queued" | "sending" | "sent" | "delivered" | "opened" | "clicked" | "replied" | "bounced" | "failed" | "archived";
export type EmailPriority = "low" | "normal" | "high" | "urgent";
export type EmailFolder = "inbox" | "sent" | "drafts" | "trash" | "archive";
export type CampaignStatus = "draft" | "scheduled" | "running" | "paused" | "completed" | "cancelled";
export type SequenceStatus = "draft" | "active" | "paused" | "completed" | "archived";
export type SequenceEnrollmentStatus = "active" | "paused" | "completed" | "unenrolled";
export type TemplateCategory = "general" | "recruiter_outreach" | "follow_up" | "thank_you" | "referral" | "interview" | "offer" | "networking" | "cold_outreach";
export type BounceType = "hard" | "soft";
export type TriggerType = "manual" | "auto_opened" | "auto_clicked" | "auto_replied" | "time_based";
export type SortOrder = "asc" | "desc";

// ─── EmailAccount ───

export interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  display_name: string | null;
  provider: string | null;
  provider_id: string | null;
  is_default: boolean;
  is_verified: boolean;
  is_active: boolean;
  signature: string | null;
  reply_to: string | null;
  daily_send_limit: number;
  monthly_send_limit: number;
  current_daily_count: number;
  current_monthly_count: number;
  last_synced_at: string | null;
  sync_token: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAccountCreate {
  email_address: string;
  display_name?: string;
  provider?: string;
  provider_id?: string;
  is_default?: boolean;
  signature?: string;
  reply_to?: string;
  daily_send_limit?: number;
  monthly_send_limit?: number;
  metadata?: Record<string, unknown>;
}

export interface EmailAccountUpdate {
  email_address?: string;
  display_name?: string;
  provider?: string;
  provider_id?: string;
  is_default?: boolean;
  is_active?: boolean;
  signature?: string;
  reply_to?: string;
  daily_send_limit?: number;
  monthly_send_limit?: number;
  metadata?: Record<string, unknown>;
}

export type EmailAccountResponse = EmailAccount;

// ─── EmailIdentity ───

export interface EmailIdentity {
  id: string;
  user_id: string;
  account_id: string;
  name: string | null;
  email_address: string;
  organization: string | null;
  title: string | null;
  avatar_url: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailIdentityCreate {
  account_id: string;
  name?: string;
  email_address: string;
  organization?: string;
  title?: string;
  avatar_url?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailIdentityUpdate {
  name?: string;
  email_address?: string;
  organization?: string;
  title?: string;
  avatar_url?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailIdentityResponse = EmailIdentity;

// ─── EmailTemplate ───

export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  category: string;
  description: string | null;
  variables: Record<string, unknown> | null;
  usage_count: number;
  is_active: boolean;
  is_system: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateCreate {
  name: string;
  subject?: string;
  body?: string;
  html_body?: string;
  category?: string;
  description?: string;
  variables?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EmailTemplateUpdate {
  name?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  category?: string;
  description?: string;
  variables?: Record<string, unknown>;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailTemplateResponse = EmailTemplate;

// ─── EmailTemplateVersion ───

export interface EmailTemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  changelog: string | null;
  is_current: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateVersionCreate {
  template_id: string;
  subject?: string;
  body?: string;
  html_body?: string;
  changelog?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailTemplateVersionUpdate {
  subject?: string;
  body?: string;
  html_body?: string;
  changelog?: string;
  is_current?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailTemplateVersionResponse = EmailTemplateVersion;

// ─── EmailCampaign ───

export interface EmailCampaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  subject: string | null;
  from_name: string | null;
  from_email: string | null;
  reply_to: string | null;
  template_id: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  total_failed: number;
  total_unsubscribed: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaignCreate {
  name: string;
  description?: string;
  status?: string;
  subject?: string;
  from_name?: string;
  from_email?: string;
  reply_to?: string;
  template_id?: string;
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailCampaignUpdate {
  name?: string;
  description?: string;
  status?: string;
  subject?: string;
  from_name?: string;
  from_email?: string;
  reply_to?: string;
  template_id?: string;
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

export type EmailCampaignResponse = EmailCampaign;

// ─── EmailCampaignRecipient ───

export interface EmailCampaignRecipient {
  id: string;
  campaign_id: string;
  email_address: string;
  contact_name: string | null;
  contact_id: string | null;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  bounced_at: string | null;
  bounce_type: string | null;
  unsubscribed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaignRecipientCreate {
  campaign_id: string;
  email_address: string;
  contact_name?: string;
  contact_id?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailCampaignRecipientUpdate {
  status?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  bounced_at?: string;
  bounce_type?: string;
  unsubscribed_at?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export type EmailCampaignRecipientResponse = EmailCampaignRecipient;

// ─── EmailCampaignStep ───

export interface EmailCampaignStep {
  id: string;
  campaign_id: string;
  step_number: number;
  name: string | null;
  template_id: string | null;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  delay_days: number;
  delay_hours: number;
  trigger_type: string;
  trigger_condition: Record<string, unknown> | null;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaignStepCreate {
  campaign_id: string;
  step_number: number;
  name?: string;
  template_id?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  delay_days?: number;
  delay_hours?: number;
  trigger_type?: string;
  trigger_condition?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EmailCampaignStepUpdate {
  step_number?: number;
  name?: string;
  template_id?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  delay_days?: number;
  delay_hours?: number;
  trigger_type?: string;
  trigger_condition?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type EmailCampaignStepResponse = EmailCampaignStep;

// ─── EmailCampaignAnalytics ───

export interface EmailCampaignAnalytics {
  id: string;
  campaign_id: string;
  user_id: string;
  date: string;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  total_failed: number;
  total_unsubscribed: number;
  open_rate: number | null;
  click_rate: number | null;
  reply_rate: number | null;
  bounce_rate: number | null;
  unsubscribe_rate: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaignAnalyticsCreate {
  campaign_id: string;
  date: string;
  total_sent?: number;
  total_delivered?: number;
  total_opened?: number;
  total_clicked?: number;
  total_replied?: number;
  total_bounced?: number;
  total_failed?: number;
  total_unsubscribed?: number;
  metadata?: Record<string, unknown>;
}

export type EmailCampaignAnalyticsResponse = EmailCampaignAnalytics;

// ─── EmailMessage ───

export interface EmailMessage {
  id: string;
  user_id: string;
  account_id: string;
  thread_id: string | null;
  direction: string;
  status: string;
  priority: string;
  from_address: string | null;
  from_name: string | null;
  to_addresses: Record<string, unknown> | null;
  cc_addresses: Record<string, unknown> | null;
  bcc_addresses: Record<string, unknown> | null;
  reply_to: string | null;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  snippet: string | null;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  sent_at: string | null;
  received_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  folder: string;
  labels: Record<string, unknown> | null;
  campaign_id: string | null;
  template_id: string | null;
  sequence_id: string | null;
  metadata: Record<string, unknown> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailMessageCreate {
  account_id: string;
  thread_id?: string;
  direction?: string;
  priority?: string;
  from_address?: string;
  from_name?: string;
  to_addresses?: Record<string, unknown>;
  cc_addresses?: Record<string, unknown>;
  bcc_addresses?: Record<string, unknown>;
  reply_to?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  is_draft?: boolean;
  folder?: string;
  labels?: Record<string, unknown>;
  campaign_id?: string;
  template_id?: string;
  sequence_id?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailMessageUpdate {
  thread_id?: string;
  direction?: string;
  status?: string;
  priority?: string;
  from_address?: string;
  from_name?: string;
  to_addresses?: Record<string, unknown>;
  cc_addresses?: Record<string, unknown>;
  bcc_addresses?: Record<string, unknown>;
  reply_to?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  is_read?: boolean;
  is_starred?: boolean;
  is_draft?: boolean;
  folder?: string;
  labels?: Record<string, unknown>;
  campaign_id?: string;
  template_id?: string;
  sequence_id?: string;
  metadata?: Record<string, unknown>;
}

export type EmailMessageResponse = EmailMessage;

// ─── EmailThread ───

export interface EmailThread {
  id: string;
  user_id: string;
  account_id: string;
  subject: string | null;
  snippet: string | null;
  message_count: number;
  last_message_at: string | null;
  last_message_from: string | null;
  last_message_snippet: string | null;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  folder: string;
  labels: Record<string, unknown> | null;
  participants: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailThreadCreate {
  account_id: string;
  subject?: string;
  snippet?: string;
  folder?: string;
  labels?: Record<string, unknown>;
  participants?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EmailThreadUpdate {
  subject?: string;
  snippet?: string;
  is_read?: boolean;
  is_starred?: boolean;
  is_archived?: boolean;
  folder?: string;
  labels?: Record<string, unknown>;
  participants?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type EmailThreadResponse = EmailThread;

// ─── EmailAttachment ───

export interface EmailAttachment {
  id: string;
  user_id: string;
  message_id: string;
  file_name: string;
  file_path: string | null;
  file_size: number;
  mime_type: string;
  content_id: string | null;
  is_inline: boolean;
  download_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAttachmentCreate {
  message_id: string;
  file_name: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  content_id?: string;
  is_inline?: boolean;
  download_url?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailAttachmentUpdate {
  file_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  content_id?: string;
  is_inline?: boolean;
  download_url?: string;
  metadata?: Record<string, unknown>;
}

export type EmailAttachmentResponse = EmailAttachment;

// ─── EmailLabel ───

export interface EmailLabel {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  message_count: number;
  is_system: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLabelCreate {
  name: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailLabelUpdate {
  name?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export type EmailLabelResponse = EmailLabel;

// ─── EmailDraft ───

export interface EmailDraft {
  id: string;
  user_id: string;
  account_id: string;
  in_reply_to: string | null;
  forward_of: string | null;
  to_addresses: Record<string, unknown> | null;
  cc_addresses: Record<string, unknown> | null;
  bcc_addresses: Record<string, unknown> | null;
  reply_to: string | null;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  template_id: string | null;
  attachments: Record<string, unknown> | null;
  scheduled_at: string | null;
  is_scheduled: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailDraftCreate {
  account_id: string;
  in_reply_to?: string;
  forward_of?: string;
  to_addresses?: Record<string, unknown>;
  cc_addresses?: Record<string, unknown>;
  bcc_addresses?: Record<string, unknown>;
  reply_to?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  template_id?: string;
  attachments?: Record<string, unknown>;
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailDraftUpdate {
  to_addresses?: Record<string, unknown>;
  cc_addresses?: Record<string, unknown>;
  bcc_addresses?: Record<string, unknown>;
  reply_to?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  template_id?: string;
  attachments?: Record<string, unknown>;
  scheduled_at?: string;
  is_scheduled?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailDraftResponse = EmailDraft;

// ─── EmailHistory ───

export interface EmailHistory {
  id: string;
  user_id: string;
  message_id: string | null;
  thread_id: string | null;
  action: string;
  direction: string | null;
  subject: string | null;
  from_address: string | null;
  to_addresses: Record<string, unknown> | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailHistoryCreate {
  message_id?: string;
  thread_id?: string;
  action: string;
  direction?: string;
  subject?: string;
  from_address?: string;
  to_addresses?: Record<string, unknown>;
  description?: string;
  metadata?: Record<string, unknown>;
}

export type EmailHistoryResponse = EmailHistory;
// ─── EmailOpenEvent ───

export interface EmailOpenEvent {
  id: string;
  user_id: string;
  message_id: string;
  campaign_id: string | null;
  email_address: string;
  user_agent: string | null;
  ip_address: string | null;
  opened_at: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailOpenEventCreate {
  message_id: string;
  campaign_id?: string;
  email_address: string;
  user_agent?: string;
  ip_address?: string;
  opened_at?: string;
  metadata?: Record<string, unknown>;
}

export type EmailOpenEventResponse = EmailOpenEvent;

// ─── EmailClickEvent ───

export interface EmailClickEvent {
  id: string;
  user_id: string;
  message_id: string;
  campaign_id: string | null;
  email_address: string;
  url: string;
  link_text: string | null;
  user_agent: string | null;
  ip_address: string | null;
  clicked_at: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailClickEventCreate {
  message_id: string;
  campaign_id?: string;
  email_address: string;
  url: string;
  link_text?: string;
  user_agent?: string;
  ip_address?: string;
  clicked_at?: string;
  metadata?: Record<string, unknown>;
}

export type EmailClickEventResponse = EmailClickEvent;

// ─── EmailReplyEvent ───

export interface EmailReplyEvent {
  id: string;
  user_id: string;
  message_id: string;
  campaign_id: string | null;
  sequence_id: string | null;
  email_address: string;
  reply_message_id: string | null;
  replied_at: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailReplyEventCreate {
  message_id: string;
  campaign_id?: string;
  sequence_id?: string;
  email_address: string;
  reply_message_id?: string;
  replied_at?: string;
  metadata?: Record<string, unknown>;
}

export type EmailReplyEventResponse = EmailReplyEvent;

// ─── EmailBounce ───

export interface EmailBounce {
  id: string;
  user_id: string;
  message_id: string;
  campaign_id: string | null;
  email_address: string;
  bounce_type: string;
  bounce_code: string | null;
  bounce_message: string | null;
  diagnostic_code: string | null;
  bounced_at: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailBounceCreate {
  message_id: string;
  campaign_id?: string;
  email_address: string;
  bounce_type: string;
  bounce_code?: string;
  bounce_message?: string;
  diagnostic_code?: string;
  bounced_at?: string;
  metadata?: Record<string, unknown>;
}

export type EmailBounceResponse = EmailBounce;

// ─── EmailSuppression ───

export interface EmailSuppression {
  id: string;
  user_id: string;
  email_address: string;
  reason: string | null;
  source: string | null;
  suppressed_at: string;
  expires_at: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSuppressionCreate {
  email_address: string;
  reason?: string;
  source?: string;
  suppressed_at?: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailSuppressionUpdate {
  reason?: string;
  source?: string;
  expires_at?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailSuppressionResponse = EmailSuppression;

// ─── EmailSequence ───

export interface EmailSequence {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  category: string | null;
  trigger_type: string;
  trigger_condition: Record<string, unknown> | null;
  total_enrolled: number;
  total_active: number;
  total_completed: number;
  total_paused: number;
  total_unenrolled: number;
  total_replies: number;
  avg_open_rate: number | null;
  avg_click_rate: number | null;
  avg_reply_rate: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSequenceCreate {
  name: string;
  description?: string;
  status?: string;
  category?: string;
  trigger_type?: string;
  trigger_condition?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EmailSequenceUpdate {
  name?: string;
  description?: string;
  status?: string;
  category?: string;
  trigger_type?: string;
  trigger_condition?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type EmailSequenceResponse = EmailSequence;

// ─── EmailSequenceStep ───

export interface EmailSequenceStep {
  id: string;
  sequence_id: string;
  step_number: number;
  name: string | null;
  template_id: string | null;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  delay_days: number;
  delay_hours: number;
  condition_type: string | null;
  condition_value: Record<string, unknown> | null;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSequenceStepCreate {
  sequence_id: string;
  step_number: number;
  name?: string;
  template_id?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  delay_days?: number;
  delay_hours?: number;
  condition_type?: string;
  condition_value?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EmailSequenceStepUpdate {
  step_number?: number;
  name?: string;
  template_id?: string;
  subject?: string;
  body?: string;
  html_body?: string;
  delay_days?: number;
  delay_hours?: number;
  condition_type?: string;
  condition_value?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type EmailSequenceStepResponse = EmailSequenceStep;

// ─── EmailSequenceEnrollment ───

export interface EmailSequenceEnrollment {
  id: string;
  sequence_id: string;
  user_id: string;
  contact_id: string | null;
  email_address: string;
  contact_name: string | null;
  status: string;
  current_step: number;
  next_send_at: string | null;
  enrolled_at: string;
  completed_at: string | null;
  paused_at: string | null;
  unenrolled_at: string | null;
  unenroll_reason: string | null;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSequenceEnrollmentCreate {
  sequence_id: string;
  contact_id?: string;
  email_address: string;
  contact_name?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailSequenceEnrollmentUpdate {
  status?: string;
  current_step?: number;
  next_send_at?: string;
  unenroll_reason?: string;
  metadata?: Record<string, unknown>;
}

export type EmailSequenceEnrollmentResponse = EmailSequenceEnrollment;

// ─── EmailSequenceExecution ───

export interface EmailSequenceExecution {
  id: string;
  sequence_id: string;
  enrollment_id: string;
  step_id: string;
  step_number: number;
  message_id: string | null;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSequenceExecutionCreate {
  sequence_id: string;
  enrollment_id: string;
  step_id: string;
  step_number: number;
  message_id?: string;
  status?: string;
  sent_at?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailSequenceExecutionUpdate {
  status?: string;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export type EmailSequenceExecutionResponse = EmailSequenceExecution;

// ─── EmailTrackingPixel ───

export interface EmailTrackingPixel {
  id: string;
  user_id: string;
  message_id: string;
  campaign_id: string | null;
  pixel_key: string;
  is_active: boolean;
  total_opens: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTrackingPixelCreate {
  message_id: string;
  campaign_id?: string;
  pixel_key: string;
  metadata?: Record<string, unknown>;
}

export interface EmailTrackingPixelUpdate {
  is_active?: boolean;
  total_opens?: number;
  metadata?: Record<string, unknown>;
}

export type EmailTrackingPixelResponse = EmailTrackingPixel;

// ─── EmailPersonalizationVariable ───

export interface EmailPersonalizationVariable {
  id: string;
  user_id: string;
  name: string;
  default_value: string | null;
  description: string | null;
  variable_type: string | null;
  source: string | null;
  is_system: boolean;
  usage_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailPersonalizationVariableCreate {
  name: string;
  default_value?: string;
  description?: string;
  variable_type?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailPersonalizationVariableUpdate {
  name?: string;
  default_value?: string;
  description?: string;
  variable_type?: string;
  source?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailPersonalizationVariableResponse = EmailPersonalizationVariable;

// ─── EmailMergeField ───

export interface EmailMergeField {
  id: string;
  user_id: string;
  name: string;
  field_key: string;
  default_value: string | null;
  description: string | null;
  field_type: string | null;
  is_required: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailMergeFieldCreate {
  name: string;
  field_key: string;
  default_value?: string;
  description?: string;
  field_type?: string;
  is_required?: boolean;
  metadata?: Record<string, unknown>;
}

export interface EmailMergeFieldUpdate {
  name?: string;
  field_key?: string;
  default_value?: string;
  description?: string;
  field_type?: string;
  is_required?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailMergeFieldResponse = EmailMergeField;

// ─── EmailAIRequest ───

export interface EmailAIRequest {
  id: string;
  user_id: string;
  request_type: string;
  prompt: string | null;
  context: Record<string, unknown> | null;
  model: string | null;
  provider: string | null;
  status: string;
  tokens_used: number | null;
  error_message: string | null;
  execution_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAIRequestCreate {
  request_type: string;
  prompt?: string;
  context?: Record<string, unknown>;
  model?: string;
  provider?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailAIRequestUpdate {
  status?: string;
  tokens_used?: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export type EmailAIRequestResponse = EmailAIRequest;

// ─── EmailAIResult ───

export interface EmailAIResult {
  id: string;
  request_id: string;
  user_id: string;
  result_type: string;
  content: string | null;
  subject_suggestion: string | null;
  body_suggestion: string | null;
  score: number | null;
  feedback: string | null;
  is_applied: boolean;
  ai_confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAIResultCreate {
  request_id: string;
  result_type?: string;
  content?: string;
  subject_suggestion?: string;
  body_suggestion?: string;
  score?: number;
  ai_confidence?: number;
  ai_provider?: string;
  ai_model?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailAIResultUpdate {
  content?: string;
  subject_suggestion?: string;
  body_suggestion?: string;
  score?: number;
  feedback?: string;
  is_applied?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailAIResultResponse = EmailAIResult;

// ─── EmailProvider ───

export interface EmailProvider {
  id: string;
  user_id: string;
  name: string;
  provider_type: string;
  is_active: boolean;
  is_default: boolean;
  supports_send: boolean;
  supports_receive: boolean;
  supports_tracking: boolean;
  config: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailProviderCreate {
  name: string;
  provider_type: string;
  is_default?: boolean;
  supports_send?: boolean;
  supports_receive?: boolean;
  supports_tracking?: boolean;
  config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EmailProviderUpdate {
  name?: string;
  provider_type?: string;
  is_active?: boolean;
  is_default?: boolean;
  supports_send?: boolean;
  supports_receive?: boolean;
  supports_tracking?: boolean;
  config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type EmailProviderResponse = EmailProvider;

// ─── EmailProviderCredential ───

export interface EmailProviderCredential {
  id: string;
  user_id: string;
  provider_id: string;
  credential_type: string;
  credential_key: string;
  credential_value: string | null;
  expires_at: string | null;
  is_active: boolean;
  last_validated_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailProviderCredentialCreate {
  provider_id: string;
  credential_type: string;
  credential_key: string;
  credential_value?: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailProviderCredentialUpdate {
  credential_type?: string;
  credential_key?: string;
  credential_value?: string;
  expires_at?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailProviderCredentialResponse = EmailProviderCredential;

// ─── EmailQuota ───

export interface EmailQuota {
  id: string;
  user_id: string;
  account_id: string;
  period_type: string;
  period_start: string;
  period_end: string;
  send_limit: number;
  send_used: number;
  send_remaining: number;
  bounce_count: number;
  complaint_count: number;
  is_throttled: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailQuotaCreate {
  account_id: string;
  period_type?: string;
  period_start: string;
  period_end: string;
  send_limit: number;
  metadata?: Record<string, unknown>;
}

export interface EmailQuotaUpdate {
  send_limit?: number;
  send_used?: number;
  is_throttled?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailQuotaResponse = EmailQuota;

// ─── EmailRateLimit ───

export interface EmailRateLimit {
  id: string;
  user_id: string;
  account_id: string;
  limit_type: string;
  max_requests: number;
  window_seconds: number;
  current_count: number;
  window_start: string;
  is_limited: boolean;
  resets_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailRateLimitCreate {
  account_id: string;
  limit_type: string;
  max_requests: number;
  window_seconds: number;
  metadata?: Record<string, unknown>;
}

export interface EmailRateLimitUpdate {
  max_requests?: number;
  window_seconds?: number;
  current_count?: number;
  is_limited?: boolean;
  metadata?: Record<string, unknown>;
}

export type EmailRateLimitResponse = EmailRateLimit;

// ─── EmailWebhookEvent ───

export interface EmailWebhookEvent {
  id: string;
  user_id: string;
  provider_id: string;
  event_type: string;
  payload: Record<string, unknown> | null;
  source_ip: string | null;
  signature: string | null;
  is_processed: boolean;
  processed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailWebhookEventCreate {
  provider_id: string;
  event_type: string;
  payload?: Record<string, unknown>;
  source_ip?: string;
  signature?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailWebhookEventUpdate {
  is_processed?: boolean;
  processed_at?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export type EmailWebhookEventResponse = EmailWebhookEvent;

// ─── EmailAuditLog ───

export interface EmailAuditLog {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string | null;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAuditLogCreate {
  entity_type: string;
  entity_id: string;
  action: string;
  description?: string;
  previous_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

export type EmailAuditLogResponse = EmailAuditLog;

// ─── EmailNotification ───

export interface EmailNotification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string | null;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  action_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailNotificationCreate {
  notification_type: string;
  title: string;
  message?: string;
  entity_type?: string;
  entity_id?: string;
  is_read?: boolean;
  is_dismissed?: boolean;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailNotificationUpdate {
  notification_type?: string;
  title?: string;
  message?: string;
  entity_type?: string;
  entity_id?: string;
  is_read?: boolean;
  is_dismissed?: boolean;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

export type EmailNotificationResponse = EmailNotification;

// ─── Detail Interfaces ───

export interface EmailThreadDetail extends EmailThread {
  messages?: EmailMessage[];
}

export interface EmailCampaignDetail extends EmailCampaign {
  recipients?: EmailCampaignRecipient[];
  steps?: EmailCampaignStep[];
}

export interface EmailSequenceDetail extends EmailSequence {
  steps?: EmailSequenceStep[];
  enrollments?: EmailSequenceEnrollment[];
}

export interface EmailMessageDetail extends EmailMessage {
  attachments?: EmailAttachment[];
  open_events?: EmailOpenEvent[];
  click_events?: EmailClickEvent[];
}

// ─── Pagination / Response Types ───

export interface EmailPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface EmailPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: EmailPaginationMeta;
  message?: string | null;
}

export interface EmailDetailResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Search / Filter Types ───

export interface EmailSearchRequest {
  page?: number;
  per_page?: number;
  q?: string;
  folder?: string;
  direction?: string;
  status?: string;
  priority?: string;
  is_read?: boolean;
  is_starred?: boolean;
  label_ids?: string[];
  account_id?: string;
  thread_id?: string;
  from_address?: string;
  to_address?: string;
  date_from?: string;
  date_to?: string;
  has_attachment?: boolean;
  sort_by?: string;
  sort_order?: SortOrder;
}

// ─── Export / Bulk Action Types ───

export interface EmailExportRequest {
  entity_type: string;
  format: string;
  filters?: Record<string, unknown>;
  selected_ids?: string[];
  include_attachments?: boolean;
  date_from?: string;
  date_to?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailBulkAction {
  action: string;
  message_ids: string[];
  target_folder?: string;
  labels?: string[];
  metadata?: Record<string, unknown>;
}

// ─── Send Request Types ───

export interface EmailSendRequest {
  account_id: string;
  to_addresses: string[];
  cc_addresses?: string[];
  bcc_addresses?: string[];
  reply_to?: string;
  subject: string;
  body?: string;
  html_body?: string;
  template_id?: string;
  merge_fields?: Record<string, string>;
  attachments?: Record<string, unknown>[];
  scheduled_at?: string;
  priority?: string;
  track_opens?: boolean;
  track_clicks?: boolean;
  campaign_id?: string;
  sequence_id?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailBulkSendRequest {
  account_id: string;
  recipients: EmailSendRequest[];
  template_id?: string;
  merge_fields?: Record<string, Record<string, string>>;
  scheduled_at?: string;
  priority?: string;
  track_opens?: boolean;
  track_clicks?: boolean;
  campaign_id?: string;
  metadata?: Record<string, unknown>;
}

// ─── AI Assist Types ───

export interface EmailAIAssistRequest {
  request_type: string;
  prompt?: string;
  subject?: string;
  body?: string;
  context?: Record<string, unknown>;
  tone?: string;
  model?: string;
  provider?: string;
  metadata?: Record<string, unknown>;
}

// ─── Dashboard Stats ───

export interface EmailStats {
  total_accounts: number;
  total_messages: number;
  sent_messages: number;
  inbound_messages: number;
  total_templates: number;
  total_campaigns: number;
  active_campaigns: number;
  total_sequences: number;
  active_sequences: number;
  total_drafts: number;
  total_threads: number;
  total_suppressions: number;
}

export interface EmailDashboardStats {
  total_messages_sent: number;
  total_messages_received: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  open_rate: number | null;
  click_rate: number | null;
  reply_rate: number | null;
  bounce_rate: number | null;
  active_campaigns: number;
  active_sequences: number;
  total_templates: number;
  total_contacts_emailed: number;
  messages_sent_today: number;
  messages_sent_this_week: number;
  messages_sent_this_month: number;
  recent_activity: Record<string, unknown> | null;
  top_templates: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── Settings Types ───

export interface EmailSettings {
  id: string;
  user_id: string;
  default_account_id: string | null;
  default_from_name: string | null;
  default_from_email: string | null;
  default_reply_to: string | null;
  signature: string | null;
  track_opens: boolean;
  track_clicks: boolean;
  unsubscribe_link: boolean;
  auto_follow_up: boolean;
  auto_follow_up_days: number;
  daily_send_limit: number;
  monthly_send_limit: number;
  notification_new_message: boolean;
  notification_campaign_complete: boolean;
  notification_sequence_reply: boolean;
  notification_bounce_alert: boolean;
  notification_weekly_report: boolean;
  preferred_ai_provider: string | null;
  preferred_ai_model: string | null;
  default_currency: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSettingsUpdate {
  default_account_id?: string;
  default_from_name?: string;
  default_from_email?: string;
  default_reply_to?: string;
  signature?: string;
  track_opens?: boolean;
  track_clicks?: boolean;
  unsubscribe_link?: boolean;
  auto_follow_up?: boolean;
  auto_follow_up_days?: number;
  daily_send_limit?: number;
  monthly_send_limit?: number;
  notification_new_message?: boolean;
  notification_campaign_complete?: boolean;
  notification_sequence_reply?: boolean;
  notification_bounce_alert?: boolean;
  notification_weekly_report?: boolean;
  preferred_ai_provider?: string;
  preferred_ai_model?: string;
  default_currency?: string;
  metadata?: Record<string, unknown>;
}

export type EmailSettingsResponse = EmailSettings;

// ─── Search Params ───

export interface EmailAccountSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  provider?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface EmailCampaignSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface EmailSequenceSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  category?: string;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface EmailTemplateSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  category?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: SortOrder;
}
