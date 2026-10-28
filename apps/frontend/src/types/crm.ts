// ─── Union Types ───

export type RecruiterPriority = "low" | "medium" | "high" | "urgent";
export type RecruiterStatus = "active" | "inactive" | "archived";
export type ContactDirection = "inbound" | "outbound";
export type ApplicationStatusType = "draft" | "applied" | "screening" | "interview" | "offer" | "accepted" | "rejected" | "withdrawn" | "cancelled";
export type ApplicationPriority = "low" | "medium" | "high" | "urgent";
export type ReferralStatus = "pending" | "requested" | "accepted" | "declined" | "expired";
export type NotificationType = "reminder" | "follow_up" | "task" | "system" | "achievement";
export type SortOrder = "asc" | "desc";
export type ConnectionStrength = "weak" | "moderate" | "strong" | "very_strong";
export type FollowUpStatus = "pending" | "completed" | "overdue";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type RecommendationStatus = "pending" | "accepted" | "completed" | "dismissed";
export type InsightType = "pattern" | "opportunity" | "risk" | "suggestion";
export type ReportType = "summary" | "detailed" | "progress" | "comparison";

// ─── Recruiter ───

export interface Recruiter {
  id: string;
  user_id: string;
  organization_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  title: string | null;
  department: string | null;
  company_name: string | null;
  company_id: string | null;
  relationship_score: number;
  priority: string;
  status: string;
  source: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  total_interactions: number;
  response_rate: number;
  notes: string | null;
  is_archived: boolean;
  is_favorite: boolean;
  metadata: Record<string, unknown> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterCreate {
  first_name: string;
  last_name: string;
  organization_id?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  title?: string;
  department?: string;
  company_name?: string;
  company_id?: string;
  priority?: string;
  source?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterUpdate {
  first_name?: string;
  last_name?: string;
  organization_id?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  title?: string;
  department?: string;
  company_name?: string;
  company_id?: string;
  relationship_score?: number;
  priority?: string;
  status?: string;
  source?: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
  notes?: string;
  is_archived?: boolean;
  is_favorite?: boolean;
  metadata?: Record<string, unknown>;
}

export type RecruiterResponse = Recruiter;

// ─── RecruiterOrganization ───

export interface RecruiterOrganization {
  id: string;
  user_id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  headquarters_location: string | null;
  website: string | null;
  description: string | null;
  company_id: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterOrganizationCreate {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  headquarters_location?: string;
  website?: string;
  description?: string;
  company_id?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface RecruiterOrganizationUpdate {
  name?: string;
  domain?: string;
  industry?: string;
  size?: string;
  headquarters_location?: string;
  website?: string;
  description?: string;
  company_id?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export type RecruiterOrganizationResponse = RecruiterOrganization;

// ─── RecruiterDepartment ───

export interface RecruiterDepartment {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  head_name: string | null;
  head_email: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterDepartmentCreate {
  organization_id: string;
  name: string;
  description?: string;
  head_name?: string;
  head_email?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterDepartmentUpdate {
  name?: string;
  description?: string;
  head_name?: string;
  head_email?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterDepartmentResponse = RecruiterDepartment;

// ─── RecruiterContact ───

export interface RecruiterContact {
  id: string;
  recruiter_id: string;
  contact_type: string;
  direction: string | null;
  subject: string | null;
  content: string | null;
  duration_minutes: number | null;
  contact_date: string;
  follow_up_date: string | null;
  is_completed: boolean;
  sentiment: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterContactCreate {
  recruiter_id: string;
  contact_type: string;
  direction?: string;
  subject?: string;
  content?: string;
  duration_minutes?: number;
  contact_date: string;
  follow_up_date?: string;
  is_completed?: boolean;
  sentiment?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterContactUpdate {
  contact_type?: string;
  direction?: string;
  subject?: string;
  content?: string;
  duration_minutes?: number;
  contact_date?: string;
  follow_up_date?: string;
  is_completed?: boolean;
  sentiment?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterContactResponse = RecruiterContact;

// ─── RecruiterConversation ───

export interface RecruiterConversation {
  id: string;
  recruiter_id: string;
  subject: string | null;
  platform: string | null;
  direction: string | null;
  content: string | null;
  summary: string | null;
  follow_up_required: boolean;
  follow_up_date: string | null;
  sentiment: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterConversationCreate {
  recruiter_id: string;
  subject?: string;
  platform?: string;
  direction?: string;
  content?: string;
  summary?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  sentiment?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterConversationUpdate {
  subject?: string;
  platform?: string;
  direction?: string;
  content?: string;
  summary?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  sentiment?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterConversationResponse = RecruiterConversation;

// ─── RecruiterEmail ───

export interface RecruiterEmail {
  id: string;
  recruiter_id: string;
  direction: string;
  subject: string | null;
  body: string | null;
  from_address: string | null;
  to_addresses: Record<string, unknown> | null;
  cc_addresses: Record<string, unknown> | null;
  is_read: boolean;
  is_replied: boolean;
  email_date: string | null;
  thread_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterEmailCreate {
  recruiter_id: string;
  direction: string;
  subject?: string;
  body?: string;
  from_address?: string;
  to_addresses?: Record<string, unknown>;
  cc_addresses?: Record<string, unknown>;
  is_read?: boolean;
  is_replied?: boolean;
  email_date?: string;
  thread_id?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterEmailUpdate {
  direction?: string;
  subject?: string;
  body?: string;
  from_address?: string;
  to_addresses?: Record<string, unknown>;
  cc_addresses?: Record<string, unknown>;
  is_read?: boolean;
  is_replied?: boolean;
  email_date?: string;
  thread_id?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterEmailResponse = RecruiterEmail;

// ─── RecruiterCall ───

export interface RecruiterCall {
  id: string;
  recruiter_id: string;
  direction: string | null;
  phone_number: string | null;
  duration_seconds: number | null;
  call_date: string;
  notes: string | null;
  summary: string | null;
  follow_up_date: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterCallCreate {
  recruiter_id: string;
  direction?: string;
  phone_number?: string;
  duration_seconds?: number;
  call_date: string;
  notes?: string;
  summary?: string;
  follow_up_date?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterCallUpdate {
  direction?: string;
  phone_number?: string;
  duration_seconds?: number;
  call_date?: string;
  notes?: string;
  summary?: string;
  follow_up_date?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterCallResponse = RecruiterCall;

// ─── RecruiterMeeting ───

export interface RecruiterMeeting {
  id: string;
  recruiter_id: string;
  title: string;
  description: string | null;
  meeting_type: string | null;
  meeting_date: string;
  duration_minutes: number | null;
  location: string | null;
  meeting_url: string | null;
  status: string | null;
  notes: string | null;
  follow_up_notes: string | null;
  attendees: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterMeetingCreate {
  recruiter_id: string;
  title: string;
  description?: string;
  meeting_type?: string;
  meeting_date: string;
  duration_minutes?: number;
  location?: string;
  meeting_url?: string;
  status?: string;
  notes?: string;
  follow_up_notes?: string;
  attendees?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RecruiterMeetingUpdate {
  title?: string;
  description?: string;
  meeting_type?: string;
  meeting_date?: string;
  duration_minutes?: number;
  location?: string;
  meeting_url?: string;
  status?: string;
  notes?: string;
  follow_up_notes?: string;
  attendees?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type RecruiterMeetingResponse = RecruiterMeeting;

// ─── RecruiterNote ───

export interface RecruiterNote {
  id: string;
  recruiter_id: string;
  title: string | null;
  content: string;
  note_type: string | null;
  is_pinned: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterNoteCreate {
  recruiter_id: string;
  title?: string;
  content: string;
  note_type?: string;
  is_pinned?: boolean;
  metadata?: Record<string, unknown>;
}

export interface RecruiterNoteUpdate {
  title?: string;
  content?: string;
  note_type?: string;
  is_pinned?: boolean;
  metadata?: Record<string, unknown>;
}

export type RecruiterNoteResponse = RecruiterNote;

// ─── RecruiterReminder ───

export interface RecruiterReminder {
  id: string;
  user_id: string;
  recruiter_id: string | null;
  title: string;
  description: string | null;
  reminder_date: string;
  is_completed: boolean;
  completed_at: string | null;
  priority: string;
  reminder_type: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterReminderCreate {
  recruiter_id?: string;
  title: string;
  description?: string;
  reminder_date: string;
  is_completed?: boolean;
  priority?: string;
  reminder_type?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterReminderUpdate {
  title?: string;
  description?: string;
  reminder_date?: string;
  is_completed?: boolean;
  completed_at?: string;
  priority?: string;
  reminder_type?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterReminderResponse = RecruiterReminder;

// ─── RecruiterFollowUp ───

export interface RecruiterFollowUp {
  id: string;
  recruiter_id: string;
  title: string;
  description: string | null;
  follow_up_type: string | null;
  scheduled_date: string;
  status: string;
  completed_at: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterFollowUpCreate {
  recruiter_id: string;
  title: string;
  description?: string;
  follow_up_type?: string;
  scheduled_date: string;
  status?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterFollowUpUpdate {
  title?: string;
  description?: string;
  follow_up_type?: string;
  scheduled_date?: string;
  status?: string;
  completed_at?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterFollowUpResponse = RecruiterFollowUp;

// ─── RecruiterTask ───

export interface RecruiterTask {
  id: string;
  user_id: string;
  recruiter_id: string | null;
  title: string;
  description: string | null;
  task_type: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterTaskCreate {
  recruiter_id?: string;
  title: string;
  description?: string;
  task_type?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterTaskUpdate {
  title?: string;
  description?: string;
  task_type?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  completed_at?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterTaskResponse = RecruiterTask;

// ─── RecruiterActivity ───

export interface RecruiterActivity {
  id: string;
  recruiter_id: string;
  activity_type: string;
  title: string | null;
  description: string | null;
  activity_date: string;
  direction: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterActivityCreate {
  recruiter_id: string;
  activity_type: string;
  title?: string;
  description?: string;
  activity_date: string;
  direction?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterActivityUpdate {
  activity_type?: string;
  title?: string;
  description?: string;
  activity_date?: string;
  direction?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterActivityResponse = RecruiterActivity;

// ─── RecruiterAttachment ───

export interface RecruiterAttachment {
  id: string;
  recruiter_id: string;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  attachment_type: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterAttachmentCreate {
  recruiter_id: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  attachment_type?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterAttachmentUpdate {
  file_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  attachment_type?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterAttachmentResponse = RecruiterAttachment;

// ─── RecruiterTag ───

export interface RecruiterTag {
  id: string;
  recruiter_id: string;
  name: string;
  color: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterTagCreate {
  recruiter_id: string;
  name: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterTagUpdate {
  name?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterTagResponse = RecruiterTag;

// ─── RecruiterCollection ───

export interface RecruiterCollection {
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

export interface RecruiterCollectionCreate {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  metadata?: Record<string, unknown>;
}

export interface RecruiterCollectionUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  metadata?: Record<string, unknown>;
}

export type RecruiterCollectionResponse = RecruiterCollection;

// ─── RecruiterCollectionItem ───

export interface RecruiterCollectionItem {
  id: string;
  collection_id: string;
  recruiter_id: string | null;
  sort_order: number;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RecruiterCollectionItemCreate {
  collection_id: string;
  recruiter_id?: string;
  sort_order?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface RecruiterCollectionItemUpdate {
  sort_order?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type RecruiterCollectionItemResponse = RecruiterCollectionItem;

// ─── Application ───

export interface Application {
  id: string;
  user_id: string;
  job_id: string | null;
  company_id: string | null;
  recruiter_id: string | null;
  resume_id: string | null;
  resume_version_id: string | null;
  cover_letter_id: string | null;
  career_profile_id: string | null;
  referral_id: string | null;
  duplicate_of_id: string | null;
  title: string;
  company_name: string | null;
  job_title: string | null;
  location: string | null;
  status: string;
  stage: string | null;
  pipeline_stage: string | null;
  application_date: string | null;
  response_date: string | null;
  last_activity_date: string | null;
  next_action_date: string | null;
  source: string | null;
  priority: string;
  probability_score: number | null;
  application_score: number | null;
  salary_expected: number | null;
  salary_offered: number | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  employment_type: string | null;
  remote_status: string | null;
  notes: string | null;
  rejection_reason: string | null;
  is_favorited: boolean;
  is_archived: boolean;
  is_duplicate: boolean;
  metadata: Record<string, unknown> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  title: string;
  job_id?: string;
  company_id?: string;
  recruiter_id?: string;
  resume_id?: string;
  resume_version_id?: string;
  cover_letter_id?: string;
  career_profile_id?: string;
  referral_id?: string;
  duplicate_of_id?: string;
  company_name?: string;
  job_title?: string;
  location?: string;
  status?: string;
  stage?: string;
  pipeline_stage?: string;
  application_date?: string;
  source?: string;
  priority?: string;
  probability_score?: number;
  application_score?: number;
  salary_expected?: number;
  salary_offered?: number;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  employment_type?: string;
  remote_status?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationUpdate {
  title?: string;
  job_id?: string;
  company_id?: string;
  recruiter_id?: string;
  resume_id?: string;
  resume_version_id?: string;
  cover_letter_id?: string;
  career_profile_id?: string;
  referral_id?: string;
  duplicate_of_id?: string;
  company_name?: string;
  job_title?: string;
  location?: string;
  status?: string;
  stage?: string;
  pipeline_stage?: string;
  application_date?: string;
  response_date?: string;
  last_activity_date?: string;
  next_action_date?: string;
  source?: string;
  priority?: string;
  probability_score?: number;
  application_score?: number;
  salary_expected?: number;
  salary_offered?: number;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  employment_type?: string;
  remote_status?: string;
  notes?: string;
  rejection_reason?: string;
  is_favorited?: boolean;
  is_archived?: boolean;
  is_duplicate?: boolean;
  metadata?: Record<string, unknown>;
}

export type ApplicationResponse = Application;

// ─── ApplicationStage ───

export interface ApplicationStage {
  id: string;
  application_id: string;
  stage_name: string;
  stage_order: number;
  status: string;
  entered_date: string | null;
  exited_date: string | null;
  duration_days: number | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStageCreate {
  application_id: string;
  stage_name: string;
  stage_order: number;
  status?: string;
  entered_date?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationStageUpdate {
  stage_name?: string;
  stage_order?: number;
  status?: string;
  entered_date?: string;
  exited_date?: string;
  duration_days?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationStageResponse = ApplicationStage;

// ─── ApplicationHistory ───

export interface ApplicationHistory {
  id: string;
  application_id: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  previous_stage: string | null;
  new_stage: string | null;
  description: string | null;
  actor: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationHistoryCreate {
  application_id: string;
  action: string;
  previous_status?: string;
  new_status?: string;
  previous_stage?: string;
  new_stage?: string;
  description?: string;
  actor?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationHistoryResponse = ApplicationHistory;

// ─── ApplicationStatus ───

export interface ApplicationStatusRecord {
  id: string;
  application_id: string;
  status: string;
  status_date: string;
  notes: string | null;
  changed_by: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStatusRecordCreate {
  application_id: string;
  status: string;
  status_date: string;
  notes?: string;
  changed_by?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationStatusRecordResponse = ApplicationStatusRecord;

// ─── ApplicationChecklist ───

export interface ApplicationChecklist {
  id: string;
  application_id: string;
  item_text: string;
  is_completed: boolean;
  completed_at: string | null;
  sort_order: number;
  category: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationChecklistCreate {
  application_id: string;
  item_text: string;
  is_completed?: boolean;
  sort_order?: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationChecklistUpdate {
  item_text?: string;
  is_completed?: boolean;
  completed_at?: string;
  sort_order?: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationChecklistResponse = ApplicationChecklist;

// ─── ApplicationTimeline ───

export interface ApplicationTimeline {
  id: string;
  application_id: string;
  event_type: string;
  title: string | null;
  description: string | null;
  event_date: string;
  icon: string | null;
  color: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationTimelineCreate {
  application_id: string;
  event_type: string;
  title?: string;
  description?: string;
  event_date: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationTimelineUpdate {
  event_type?: string;
  title?: string;
  description?: string;
  event_date?: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationTimelineResponse = ApplicationTimeline;

// ─── ApplicationDocument ───

export interface ApplicationDocument {
  id: string;
  application_id: string;
  resume_id: string | null;
  resume_version_id: string | null;
  cover_letter_id: string | null;
  document_type: string | null;
  title: string | null;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  version: number;
  is_current: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationDocumentCreate {
  application_id: string;
  resume_id?: string;
  resume_version_id?: string;
  cover_letter_id?: string;
  document_type?: string;
  title?: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  version?: number;
  is_current?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ApplicationDocumentUpdate {
  document_type?: string;
  title?: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  version?: number;
  is_current?: boolean;
  metadata?: Record<string, unknown>;
}

export type ApplicationDocumentResponse = ApplicationDocument;

// ─── ApplicationOffer ───

export interface ApplicationOffer {
  id: string;
  application_id: string;
  offer_date: string;
  response_deadline: string | null;
  base_salary: number | null;
  bonus: number | null;
  equity: number | null;
  sign_on_bonus: number | null;
  annual_raise: number | null;
  currency: string;
  benefits_package: Record<string, unknown> | null;
  perks: Record<string, unknown> | null;
  vacation_days: number | null;
  remote_days: number | null;
  status: string;
  overall_rating: number | null;
  pros: string | null;
  cons: string | null;
  decision_notes: string | null;
  responded_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationOfferCreate {
  application_id: string;
  offer_date: string;
  response_deadline?: string;
  base_salary?: number;
  bonus?: number;
  equity?: number;
  sign_on_bonus?: number;
  annual_raise?: number;
  currency?: string;
  benefits_package?: Record<string, unknown>;
  perks?: Record<string, unknown>;
  vacation_days?: number;
  remote_days?: number;
  status?: string;
  overall_rating?: number;
  pros?: string;
  cons?: string;
  decision_notes?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationOfferUpdate {
  offer_date?: string;
  response_deadline?: string;
  base_salary?: number;
  bonus?: number;
  equity?: number;
  sign_on_bonus?: number;
  annual_raise?: number;
  currency?: string;
  benefits_package?: Record<string, unknown>;
  perks?: Record<string, unknown>;
  vacation_days?: number;
  remote_days?: number;
  status?: string;
  overall_rating?: number;
  pros?: string;
  cons?: string;
  decision_notes?: string;
  responded_at?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationOfferResponse = ApplicationOffer;

// ─── ApplicationNegotiation ───

export interface ApplicationNegotiation {
  id: string;
  application_id: string;
  offer_id: string | null;
  negotiation_type: string | null;
  requested_value: string | null;
  offered_value: string | null;
  status: string;
  notes: string | null;
  response_date: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationNegotiationCreate {
  application_id: string;
  offer_id?: string;
  negotiation_type?: string;
  requested_value?: string;
  offered_value?: string;
  status?: string;
  notes?: string;
  response_date?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationNegotiationUpdate {
  offer_id?: string;
  negotiation_type?: string;
  requested_value?: string;
  offered_value?: string;
  status?: string;
  notes?: string;
  response_date?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationNegotiationResponse = ApplicationNegotiation;

// ─── ApplicationFeedback ───

export interface ApplicationFeedback {
  id: string;
  application_id: string;
  feedback_type: string | null;
  rating: number | null;
  content: string | null;
  strengths: Record<string, unknown> | null;
  improvements: Record<string, unknown> | null;
  recommendation: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationFeedbackCreate {
  application_id: string;
  feedback_type?: string;
  rating?: number;
  content?: string;
  strengths?: Record<string, unknown>;
  improvements?: Record<string, unknown>;
  recommendation?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationFeedbackUpdate {
  feedback_type?: string;
  rating?: number;
  content?: string;
  strengths?: Record<string, unknown>;
  improvements?: Record<string, unknown>;
  recommendation?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationFeedbackResponse = ApplicationFeedback;

// ─── ApplicationDecision ───

export interface ApplicationDecision {
  id: string;
  application_id: string;
  decision: string | null;
  decision_date: string;
  reason: string | null;
  satisfaction_rating: number | null;
  would_recommend: boolean | null;
  would_apply_again: boolean | null;
  lessons_learned: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationDecisionCreate {
  application_id: string;
  decision?: string;
  decision_date: string;
  reason?: string;
  satisfaction_rating?: number;
  would_recommend?: boolean;
  would_apply_again?: boolean;
  lessons_learned?: string;
  metadata?: Record<string, unknown>;
}

export interface ApplicationDecisionUpdate {
  decision?: string;
  decision_date?: string;
  reason?: string;
  satisfaction_rating?: number;
  would_recommend?: boolean;
  would_apply_again?: boolean;
  lessons_learned?: string;
  metadata?: Record<string, unknown>;
}

export type ApplicationDecisionResponse = ApplicationDecision;

// ─── ApplicationAnalytics ───

export interface ApplicationAnalytics {
  id: string;
  user_id: string;
  total_applications: number;
  active_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  avg_response_time_days: number | null;
  avg_interview_score: number | null;
  acceptance_rate: number | null;
  response_rate: number | null;
  conversion_rates: Record<string, unknown> | null;
  stage_durations: Record<string, unknown> | null;
  score_history: Record<string, unknown> | null;
  weekly_trend: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationAnalyticsResponse = ApplicationAnalytics;

// ─── Referral ───

export interface Referral {
  id: string;
  user_id: string;
  recruiter_id: string | null;
  company_id: string | null;
  job_id: string | null;
  application_id: string | null;
  referrer_name: string;
  referrer_email: string | null;
  referrer_company: string | null;
  referrer_title: string | null;
  referrer_relationship: string | null;
  status: string;
  request_date: string | null;
  response_date: string | null;
  notes: string | null;
  thank_you_sent: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralCreate {
  referrer_name: string;
  recruiter_id?: string;
  company_id?: string;
  job_id?: string;
  application_id?: string;
  referrer_email?: string;
  referrer_company?: string;
  referrer_title?: string;
  referrer_relationship?: string;
  status?: string;
  request_date?: string;
  notes?: string;
  thank_you_sent?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReferralUpdate {
  recruiter_id?: string;
  company_id?: string;
  job_id?: string;
  application_id?: string;
  referrer_name?: string;
  referrer_email?: string;
  referrer_company?: string;
  referrer_title?: string;
  referrer_relationship?: string;
  status?: string;
  request_date?: string;
  response_date?: string;
  notes?: string;
  thank_you_sent?: boolean;
  metadata?: Record<string, unknown>;
}

export type ReferralResponse = Referral;

// ─── ReferralContact ───

export interface ReferralContact {
  id: string;
  referral_id: string;
  contact_type: string | null;
  direction: string | null;
  content: string | null;
  contact_date: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralContactCreate {
  referral_id: string;
  contact_type?: string;
  direction?: string;
  content?: string;
  contact_date: string;
  metadata?: Record<string, unknown>;
}

export interface ReferralContactUpdate {
  contact_type?: string;
  direction?: string;
  content?: string;
  contact_date?: string;
  metadata?: Record<string, unknown>;
}

export type ReferralContactResponse = ReferralContact;

// ─── ReferralRequest ───

export interface ReferralRequest {
  id: string;
  user_id: string;
  referral_id: string | null;
  job_id: string | null;
  company_id: string | null;
  request_message: string | null;
  status: string;
  sent_date: string | null;
  response_date: string | null;
  response_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralRequestCreate {
  referral_id?: string;
  job_id?: string;
  company_id?: string;
  request_message?: string;
  status?: string;
  sent_date?: string;
  metadata?: Record<string, unknown>;
}

export interface ReferralRequestUpdate {
  referral_id?: string;
  job_id?: string;
  company_id?: string;
  request_message?: string;
  status?: string;
  sent_date?: string;
  response_date?: string;
  response_message?: string;
  metadata?: Record<string, unknown>;
}

export type ReferralRequestResponse = ReferralRequest;

// ─── ReferralHistory ───

export interface ReferralHistory {
  id: string;
  referral_id: string;
  action: string;
  description: string | null;
  action_date: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralHistoryCreate {
  referral_id: string;
  action: string;
  description?: string;
  action_date: string;
  metadata?: Record<string, unknown>;
}

export type ReferralHistoryResponse = ReferralHistory;

// ─── NetworkingContact ───

export interface NetworkingContact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  company: string | null;
  title: string | null;
  industry: string | null;
  contact_type: string | null;
  connection_strength: string;
  last_interaction_date: string | null;
  next_follow_up_date: string | null;
  total_interactions: number;
  how_met: string | null;
  common_interests: Record<string, unknown> | null;
  notes: string | null;
  is_favorited: boolean;
  metadata: Record<string, unknown> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingContactCreate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  company?: string;
  title?: string;
  industry?: string;
  contact_type?: string;
  connection_strength?: string;
  how_met?: string;
  common_interests?: Record<string, unknown>;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkingContactUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  company?: string;
  title?: string;
  industry?: string;
  contact_type?: string;
  connection_strength?: string;
  last_interaction_date?: string;
  next_follow_up_date?: string;
  total_interactions?: number;
  how_met?: string;
  common_interests?: Record<string, unknown>;
  notes?: string;
  is_favorited?: boolean;
  metadata?: Record<string, unknown>;
}

export type NetworkingContactResponse = NetworkingContact;

// ─── NetworkingEvent ───

export interface NetworkingEvent {
  id: string;
  user_id: string;
  contact_id: string | null;
  event_name: string;
  event_type: string | null;
  event_date: string;
  location: string | null;
  event_url: string | null;
  description: string | null;
  attendees_count: number | null;
  contacts_met: Record<string, unknown> | null;
  follow_up_required: boolean;
  follow_up_date: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingEventCreate {
  event_name: string;
  contact_id?: string;
  event_type?: string;
  event_date: string;
  location?: string;
  event_url?: string;
  description?: string;
  attendees_count?: number;
  contacts_met?: Record<string, unknown>;
  follow_up_required?: boolean;
  follow_up_date?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkingEventUpdate {
  contact_id?: string;
  event_name?: string;
  event_type?: string;
  event_date?: string;
  location?: string;
  event_url?: string;
  description?: string;
  attendees_count?: number;
  contacts_met?: Record<string, unknown>;
  follow_up_required?: boolean;
  follow_up_date?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type NetworkingEventResponse = NetworkingEvent;

// ─── NetworkingConversation ───

export interface NetworkingConversation {
  id: string;
  contact_id: string;
  platform: string | null;
  direction: string | null;
  subject: string | null;
  content: string | null;
  summary: string | null;
  conversation_date: string;
  follow_up_date: string | null;
  sentiment: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingConversationCreate {
  contact_id: string;
  platform?: string;
  direction?: string;
  subject?: string;
  content?: string;
  summary?: string;
  conversation_date: string;
  follow_up_date?: string;
  sentiment?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkingConversationUpdate {
  platform?: string;
  direction?: string;
  subject?: string;
  content?: string;
  summary?: string;
  conversation_date?: string;
  follow_up_date?: string;
  sentiment?: string;
  metadata?: Record<string, unknown>;
}

export type NetworkingConversationResponse = NetworkingConversation;

// ─── NetworkingReminder ───

export interface NetworkingReminder {
  id: string;
  user_id: string;
  contact_id: string | null;
  title: string;
  description: string | null;
  reminder_date: string;
  is_completed: boolean;
  completed_at: string | null;
  priority: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingReminderCreate {
  contact_id?: string;
  title: string;
  description?: string;
  reminder_date: string;
  is_completed?: boolean;
  priority?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkingReminderUpdate {
  contact_id?: string;
  title?: string;
  description?: string;
  reminder_date?: string;
  is_completed?: boolean;
  completed_at?: string;
  priority?: string;
  metadata?: Record<string, unknown>;
}

export type NetworkingReminderResponse = NetworkingReminder;

// ─── NetworkingGoal ───

export interface NetworkingGoal {
  id: string;
  user_id: string;
  goal_type: string | null;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number;
  deadline: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingGoalCreate {
  goal_type?: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  deadline?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkingGoalUpdate {
  goal_type?: string;
  title?: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  deadline?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export type NetworkingGoalResponse = NetworkingGoal;

// ─── NetworkingActivity ───

export interface NetworkingActivity {
  id: string;
  contact_id: string;
  activity_type: string | null;
  title: string | null;
  description: string | null;
  activity_date: string;
  direction: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingActivityCreate {
  contact_id: string;
  activity_type?: string;
  title?: string;
  description?: string;
  activity_date: string;
  direction?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkingActivityUpdate {
  activity_type?: string;
  title?: string;
  description?: string;
  activity_date?: string;
  direction?: string;
  metadata?: Record<string, unknown>;
}

export type NetworkingActivityResponse = NetworkingActivity;

// ─── NetworkingAnalytics ───

export interface NetworkingAnalytics {
  id: string;
  user_id: string;
  total_contacts: number;
  contacts_by_type: Record<string, unknown> | null;
  contacts_by_strength: Record<string, unknown> | null;
  total_events: number;
  total_conversations: number;
  avg_interactions_per_contact: number | null;
  follow_up_rate: number | null;
  connection_growth: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type NetworkingAnalyticsResponse = NetworkingAnalytics;

// ─── CRMReport ───

export interface CRMReport {
  id: string;
  user_id: string;
  report_type: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  date_range_start: string | null;
  date_range_end: string | null;
  data: Record<string, unknown> | null;
  insights: Record<string, unknown> | null;
  recommendations: Record<string, unknown> | null;
  ai_confidence: number | null;
  ai_provider: string | null;
  ai_model: string | null;
  execution_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMReportCreate {
  report_type?: string;
  title?: string;
  summary?: string;
  content?: string;
  date_range_start?: string;
  date_range_end?: string;
  data?: Record<string, unknown>;
  insights?: Record<string, unknown>;
  recommendations?: Record<string, unknown>;
  ai_confidence?: number;
  ai_provider?: string;
  ai_model?: string;
  execution_id?: string;
  metadata?: Record<string, unknown>;
}

export interface CRMReportUpdate {
  report_type?: string;
  title?: string;
  summary?: string;
  content?: string;
  date_range_start?: string;
  date_range_end?: string;
  data?: Record<string, unknown>;
  insights?: Record<string, unknown>;
  recommendations?: Record<string, unknown>;
  ai_confidence?: number;
  ai_provider?: string;
  ai_model?: string;
  execution_id?: string;
  metadata?: Record<string, unknown>;
}

export type CRMReportResponse = CRMReport;

// ─── CRMSettings ───

export interface CRMSettings {
  id: string;
  user_id: string;
  default_pipeline_stages: Record<string, unknown> | null;
  auto_follow_up_days: number;
  reminder_days_before: number;
  email_notifications: boolean;
  weekly_digest: boolean;
  auto_stage_progression: boolean;
  preferred_ai_provider: string | null;
  preferred_ai_model: string | null;
  default_currency: string;
  calendar_integration: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMSettingsCreate {
  default_pipeline_stages?: Record<string, unknown>;
  auto_follow_up_days?: number;
  reminder_days_before?: number;
  email_notifications?: boolean;
  weekly_digest?: boolean;
  auto_stage_progression?: boolean;
  preferred_ai_provider?: string;
  preferred_ai_model?: string;
  default_currency?: string;
  calendar_integration?: string;
  metadata?: Record<string, unknown>;
}

export interface CRMSettingsUpdate {
  default_pipeline_stages?: Record<string, unknown>;
  auto_follow_up_days?: number;
  reminder_days_before?: number;
  email_notifications?: boolean;
  weekly_digest?: boolean;
  auto_stage_progression?: boolean;
  preferred_ai_provider?: string;
  preferred_ai_model?: string;
  default_currency?: string;
  calendar_integration?: string;
  metadata?: Record<string, unknown>;
}

export type CRMSettingsResponse = CRMSettings;

// ─── CRMNotification ───

export interface CRMNotification {
  id: string;
  user_id: string;
  notification_type: string | null;
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

export interface CRMNotificationCreate {
  notification_type?: string;
  title: string;
  message?: string;
  entity_type?: string;
  entity_id?: string;
  is_read?: boolean;
  is_dismissed?: boolean;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

export interface CRMNotificationUpdate {
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

export type CRMNotificationResponse = CRMNotification;

// ─── CRMBookmark ───

export interface CRMBookmark {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  note: string | null;
  tags: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMBookmarkCreate {
  entity_type: string;
  entity_id: string;
  note?: string;
  tags?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CRMBookmarkUpdate {
  entity_type?: string;
  entity_id?: string;
  note?: string;
  tags?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type CRMBookmarkResponse = CRMBookmark;

// ─── CRMInsight ───

export interface CRMInsight {
  id: string;
  user_id: string;
  insight_type: string | null;
  title: string | null;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  confidence: number | null;
  priority: string | null;
  is_dismissed: boolean;
  is_applied: boolean;
  ai_provider: string | null;
  ai_model: string | null;
  execution_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMInsightCreate {
  insight_type?: string;
  title?: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  confidence?: number;
  priority?: string;
  is_dismissed?: boolean;
  is_applied?: boolean;
  ai_provider?: string;
  ai_model?: string;
  execution_id?: string;
  metadata?: Record<string, unknown>;
}

export interface CRMInsightUpdate {
  insight_type?: string;
  title?: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  confidence?: number;
  priority?: string;
  is_dismissed?: boolean;
  is_applied?: boolean;
  ai_provider?: string;
  ai_model?: string;
  execution_id?: string;
  metadata?: Record<string, unknown>;
}

export type CRMInsightResponse = CRMInsight;

// ─── CRMRecommendation ───

export interface CRMRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string | null;
  title: string | null;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  priority: string;
  status: string;
  confidence: number | null;
  impact_score: number | null;
  estimated_time_minutes: number | null;
  resources: Record<string, unknown> | null;
  ai_provider: string | null;
  ai_model: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMRecommendationCreate {
  recommendation_type?: string;
  title?: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  priority?: string;
  status?: string;
  confidence?: number;
  impact_score?: number;
  estimated_time_minutes?: number;
  resources?: Record<string, unknown>;
  ai_provider?: string;
  ai_model?: string;
  metadata?: Record<string, unknown>;
}

export interface CRMRecommendationUpdate {
  recommendation_type?: string;
  title?: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  priority?: string;
  status?: string;
  confidence?: number;
  impact_score?: number;
  estimated_time_minutes?: number;
  resources?: Record<string, unknown>;
  ai_provider?: string;
  ai_model?: string;
  metadata?: Record<string, unknown>;
}

export type CRMRecommendationResponse = CRMRecommendation;

// ─── CRMHistory ───

export interface CRMHistory {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string | null;
  action_date: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMHistoryCreate {
  entity_type: string;
  entity_id: string;
  action: string;
  description?: string;
  action_date: string;
  metadata?: Record<string, unknown>;
}

export type CRMHistoryResponse = CRMHistory;

// ─── CRMSnapshot ───

export interface CRMSnapshot {
  id: string;
  user_id: string;
  snapshot_type: string | null;
  snapshot_date: string;
  pipeline_summary: Record<string, unknown> | null;
  recruiter_summary: Record<string, unknown> | null;
  networking_summary: Record<string, unknown> | null;
  application_metrics: Record<string, unknown> | null;
  goals_progress: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CRMSnapshotCreate {
  snapshot_type?: string;
  snapshot_date: string;
  pipeline_summary?: Record<string, unknown>;
  recruiter_summary?: Record<string, unknown>;
  networking_summary?: Record<string, unknown>;
  application_metrics?: Record<string, unknown>;
  goals_progress?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type CRMSnapshotResponse = CRMSnapshot;

// ─── Request / Action Types ───

export interface RecruiterBatchUpdate {
  recruiter_ids: string[];
  updates: Partial<RecruiterUpdate>;
}

export interface ApplicationBatchUpdate {
  application_ids: string[];
  updates: Partial<ApplicationUpdate>;
}

export interface ReferralBatchUpdate {
  referral_ids: string[];
  updates: Partial<ReferralUpdate>;
}

export interface NetworkingBatchUpdate {
  contact_ids: string[];
  updates: Partial<NetworkingContactUpdate>;
}

// ─── Stats / Pagination Types ───

export interface CRMStats {
  total_recruiters: number;
  active_recruiters: number;
  total_applications: number;
  active_applications: number;
  total_referrals: number;
  pending_referrals: number;
  total_networking_contacts: number;
  upcoming_follow_ups: number;
}

export interface CRMPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CRMListResponse<T> {
  success: boolean;
  data: T[];
  meta: CRMPaginationMeta;
  message?: string | null;
}

export interface CRMDetailResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Search / Filter Types ───

export interface RecruiterSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  priority?: string;
  organization_id?: string;
  company_id?: string;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface ApplicationSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  stage?: string;
  priority?: string;
  company_id?: string;
  job_id?: string;
  recruiter_id?: string;
  source?: string;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface ReferralSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  company_id?: string;
  recruiter_id?: string;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface NetworkingSearchParams {
  page?: number;
  per_page?: number;
  q?: string;
  contact_type?: string;
  connection_strength?: string;
  company?: string;
  industry?: string;
  sort_by?: string;
  sort_order?: SortOrder;
}
