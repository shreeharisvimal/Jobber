import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCRMStore } from "@/stores/crm.store";
import { crmApi } from "@/lib/api-client";
import type {
  Recruiter,
  RecruiterCreate,
  RecruiterUpdate,
  RecruiterDetail,
  RecruiterStats,
  RecruiterOrganization,
  RecruiterOrganizationCreate,
  RecruiterOrganizationUpdate,
  RecruiterDepartment,
  RecruiterDepartmentCreate,
  RecruiterContact,
  RecruiterContactCreate,
  RecruiterConversation,
  RecruiterConversationCreate,
  RecruiterEmail,
  RecruiterEmailCreate,
  RecruiterCall,
  RecruiterCallCreate,
  RecruiterMeeting,
  RecruiterMeetingCreate,
  RecruiterNote,
  RecruiterNoteCreate,
  RecruiterReminder,
  RecruiterReminderCreate,
  RecruiterFollowUp,
  RecruiterFollowUpCreate,
  RecruiterTask,
  RecruiterTaskCreate,
  RecruiterActivity,
  RecruiterActivityCreate,
  RecruiterAttachment,
  RecruiterTag,
  RecruiterTagCreate,
  RecruiterCollection,
  RecruiterCollectionCreate,
  Application,
  ApplicationCreate,
  ApplicationUpdate,
  ApplicationDetail,
  ApplicationStage,
  ApplicationStageCreate,
  ApplicationHistory,
  ApplicationStatusRecord,
  ApplicationChecklist,
  ApplicationChecklistCreate,
  ApplicationTimeline,
  ApplicationDocument,
  ApplicationDocumentCreate,
  ApplicationOffer,
  ApplicationOfferCreate,
  ApplicationNegotiation,
  ApplicationNegotiationCreate,
  ApplicationFeedback,
  ApplicationFeedbackCreate,
  ApplicationDecision,
  ApplicationDecisionCreate,
  ApplicationAnalytics,
  Referral,
  ReferralCreate,
  NetworkingContact,
  NetworkingContactCreate,
  NetworkingEvent,
  NetworkingEventCreate,
  NetworkingReminder,
  NetworkingReminderCreate,
  NetworkingGoal,
  NetworkingGoalCreate,
  NetworkingAnalytics,
  CRMNotification,
  CRMReport,
  CRMSettings,
  CRMSettingsUpdate,
  CRMBookmark,
  CRMBookmarkCreate,
  CRMInsight,
  CRMRecommendation,
  CRMHistoryEntry,
  CRMSnapshot,
  CRMPaginatedResponse,
  CRMSearchRequest,
  CRMExportRequest,
  CRMBulkAction,
} from "@/types/crm";

// Query key factory
export const crmKeys = {
  all: ["crm"] as const,

  // Recruiter keys
  recruiters: () => [...crmKeys.all, "recruiters"] as const,
  recruiterLists: () => [...crmKeys.recruiters(), "list"] as const,
  recruiterList: (filters: Record<string, unknown>) => [...crmKeys.recruiterLists(), filters] as const,
  recruiterDetails: () => [...crmKeys.recruiters(), "detail"] as const,
  recruiterDetail: (id: string) => [...crmKeys.recruiterDetails(), id] as const,
  recruiterStats: () => [...crmKeys.recruiters(), "stats"] as const,
  recruiterSearch: (params: Record<string, unknown>) => [...crmKeys.recruiters(), "search", params] as const,

  // Organization keys
  organizations: () => [...crmKeys.all, "organizations"] as const,
  organizationLists: () => [...crmKeys.organizations(), "list"] as const,
  organizationList: (filters: Record<string, unknown>) => [...crmKeys.organizationLists(), filters] as const,
  organizationDetails: () => [...crmKeys.organizations(), "detail"] as const,
  organizationDetail: (id: string) => [...crmKeys.organizationDetails(), id] as const,

  // Department keys
  departments: () => [...crmKeys.all, "departments"] as const,
  departmentLists: (orgId: string) => [...crmKeys.departments(), "list", orgId] as const,
  departmentDetail: (id: string) => [...crmKeys.departments(), "detail", id] as const,

  // Contact keys
  contacts: () => [...crmKeys.all, "contacts"] as const,
  contactLists: () => [...crmKeys.contacts(), "list"] as const,
  contactList: (filters: Record<string, unknown>) => [...crmKeys.contactLists(), filters] as const,
  contactDetail: (id: string) => [...crmKeys.contacts(), "detail", id] as const,

  // Conversation keys
  conversations: () => [...crmKeys.all, "conversations"] as const,
  conversationLists: () => [...crmKeys.conversations(), "list"] as const,
  conversationDetail: (id: string) => [...crmKeys.conversations(), "detail", id] as const,

  // Email keys
  emails: () => [...crmKeys.all, "emails"] as const,
  emailLists: (contactId: string) => [...crmKeys.emails(), "list", contactId] as const,
  emailDetail: (id: string) => [...crmKeys.emails(), "detail", id] as const,

  // Call keys
  calls: () => [...crmKeys.all, "calls"] as const,
  callLists: (contactId: string) => [...crmKeys.calls(), "list", contactId] as const,
  callDetail: (id: string) => [...crmKeys.calls(), "detail", id] as const,

  // Meeting keys
  meetings: () => [...crmKeys.all, "meetings"] as const,
  meetingLists: () => [...crmKeys.meetings(), "list"] as const,
  meetingDetail: (id: string) => [...crmKeys.meetings(), "detail", id] as const,

  // Note keys
  notes: () => [...crmKeys.all, "notes"] as const,
  noteLists: (entityType: string, entityId: string) => [...crmKeys.notes(), "list", entityType, entityId] as const,
  noteDetail: (id: string) => [...crmKeys.notes(), "detail", id] as const,

  // Reminder keys
  reminders: () => [...crmKeys.all, "reminders"] as const,
  reminderLists: () => [...crmKeys.reminders(), "list"] as const,
  reminderDetail: (id: string) => [...crmKeys.reminders(), "detail", id] as const,

  // FollowUp keys
  followUps: () => [...crmKeys.all, "followUps"] as const,
  followUpLists: (contactId: string) => [...crmKeys.followUps(), "list", contactId] as const,
  followUpDetail: (id: string) => [...crmKeys.followUps(), "detail", id] as const,

  // Task keys
  tasks: () => [...crmKeys.all, "tasks"] as const,
  taskLists: () => [...crmKeys.tasks(), "list"] as const,
  taskDetail: (id: string) => [...crmKeys.tasks(), "detail", id] as const,

  // Activity keys
  activities: () => [...crmKeys.all, "activities"] as const,
  activityLists: (entityType: string, entityId: string) => [...crmKeys.activities(), "list", entityType, entityId] as const,

  // Attachment keys
  attachments: () => [...crmKeys.all, "attachments"] as const,
  attachmentLists: (entityType: string, entityId: string) => [...crmKeys.attachments(), "list", entityType, entityId] as const,

  // Tag keys
  tags: () => [...crmKeys.all, "tags"] as const,
  tagDetail: (id: string) => [...crmKeys.tags(), id] as const,

  // Collection keys
  collections: () => [...crmKeys.all, "collections"] as const,
  collectionDetail: (id: string) => [...crmKeys.collections(), id] as const,

  // Application keys
  applications: () => [...crmKeys.all, "applications"] as const,
  applicationLists: () => [...crmKeys.applications(), "list"] as const,
  applicationList: (filters: Record<string, unknown>) => [...crmKeys.applicationLists(), filters] as const,
  applicationDetails: () => [...crmKeys.applications(), "detail"] as const,
  applicationDetail: (id: string) => [...crmKeys.applicationDetails(), id] as const,
  applicationAnalytics: (id: string) => [...crmKeys.applications(), "analytics", id] as const,
  applicationTimeline: (id: string) => [...crmKeys.applications(), "timeline", id] as const,
  applicationChecklist: (id: string) => [...crmKeys.applications(), "checklist", id] as const,
  applicationHistory: (id: string) => [...crmKeys.applications(), "history", id] as const,
  applicationStatuses: (id: string) => [...crmKeys.applications(), "statuses", id] as const,
  applicationDocuments: (id: string) => [...crmKeys.applications(), "documents", id] as const,
  applicationOffers: (id: string) => [...crmKeys.applications(), "offers", id] as const,
  applicationNegotiations: (id: string) => [...crmKeys.applications(), "negotiations", id] as const,
  applicationFeedback: (id: string) => [...crmKeys.applications(), "feedback", id] as const,
  applicationDecisions: (id: string) => [...crmKeys.applications(), "decisions", id] as const,

  // Stage keys
  stages: () => [...crmKeys.all, "stages"] as const,
  stageDetail: (id: string) => [...crmKeys.stages(), id] as const,

  // Referral keys
  referrals: () => [...crmKeys.all, "referrals"] as const,
  referralLists: () => [...crmKeys.referrals(), "list"] as const,
  referralDetail: (id: string) => [...crmKeys.referrals(), "detail", id] as const,

  // Networking keys
  networkingContacts: () => [...crmKeys.all, "networking", "contacts"] as const,
  networkingContactDetail: (id: string) => [...crmKeys.networkingContacts(), id] as const,
  networkingEvents: () => [...crmKeys.all, "networking", "events"] as const,
  networkingEventDetail: (id: string) => [...crmKeys.networkingEvents(), id] as const,
  networkingReminders: () => [...crmKeys.all, "networking", "reminders"] as const,
  networkingGoals: () => [...crmKeys.all, "networking", "goals"] as const,
  networkingAnalytics: () => [...crmKeys.all, "networking", "analytics"] as const,

  // Global CRM keys
  notifications: () => [...crmKeys.all, "notifications"] as const,
  reports: () => [...crmKeys.all, "reports"] as const,
  settings: () => [...crmKeys.all, "settings"] as const,
  bookmarks: () => [...crmKeys.all, "bookmarks"] as const,
  insights: () => [...crmKeys.all, "insights"] as const,
  recommendations: () => [...crmKeys.all, "recommendations"] as const,
  crmHistory: () => [...crmKeys.all, "crmHistory"] as const,
  snapshots: () => [...crmKeys.all, "snapshots"] as const,
};

// --- Recruiter Hooks ---

export function useRecruiters() {
  const filters = useCRMStore((s) => s.recruiterFilters);
  return useQuery({
    queryKey: crmKeys.recruiterList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<CRMPaginatedResponse<Recruiter>> => {
      const res = await crmApi.listRecruiters({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data;
    },
  });
}

export function useRecruiter(id: string) {
  return useQuery({
    queryKey: crmKeys.recruiterDetail(id),
    queryFn: async (): Promise<RecruiterDetail> => {
      const res = await crmApi.getRecruiter(id);
      return res.data.data as RecruiterDetail;
    },
    enabled: !!id,
  });
}

export function useCreateRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: RecruiterCreate) => {
      const res = await crmApi.createRecruiter(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.recruiterLists() });
    },
  });
}

export function useUpdateRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RecruiterUpdate }) => {
      const res = await crmApi.updateRecruiter(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.recruiterLists() });
    },
  });
}

export function useDeleteRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteRecruiter(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.recruiterLists() });
    },
  });
}

export function useRecruiterStats() {
  return useQuery({
    queryKey: crmKeys.recruiterStats(),
    queryFn: async (): Promise<RecruiterStats> => {
      const res = await crmApi.getRecruiterStats();
      return res.data.data as RecruiterStats;
    },
  });
}

export function useSearchRecruiters() {
  return useMutation({
    mutationFn: async (params: CRMSearchRequest) => {
      const res = await crmApi.searchRecruiters(params);
      return res.data.data;
    },
  });
}

// --- Organization Hooks ---

export function useOrganizations() {
  const filters = useCRMStore((s) => s.recruiterFilters);
  return useQuery({
    queryKey: crmKeys.organizationList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<CRMPaginatedResponse<RecruiterOrganization>> => {
      const res = await crmApi.listOrganizations({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data;
    },
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: crmKeys.organizationDetail(id),
    queryFn: async (): Promise<RecruiterOrganization> => {
      const res = await crmApi.getOrganization(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: RecruiterOrganizationCreate) => {
      const res = await crmApi.createOrganization(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.organizationLists() });
    },
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RecruiterOrganizationUpdate }) => {
      const res = await crmApi.updateOrganization(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.organizationLists() });
    },
  });
}

export function useDeleteOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteOrganization(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.organizationLists() });
    },
  });
}

// --- Department Hooks ---

export function useDepartments(orgId: string) {
  return useQuery({
    queryKey: crmKeys.departmentLists(orgId),
    queryFn: async (): Promise<RecruiterDepartment[]> => {
      const res = await crmApi.listOrganizationDepartments(orgId);
      return res.data.data;
    },
    enabled: !!orgId,
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: crmKeys.departmentDetail(id),
    queryFn: async (): Promise<RecruiterDepartment> => {
      const res = await crmApi.listOrganizationDepartments(id);
      return res.data.data[0] as RecruiterDepartment;
    },
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: RecruiterDepartmentCreate) => {
      const res = await crmApi.createOrganizationDepartment(data.organization_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.departmentLists(variables.organization_id) });
    },
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteOrganization(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.departments() });
    },
  });
}

// --- Contact Hooks ---

export function useContacts(recruiterId?: string) {
  return useQuery({
    queryKey: crmKeys.contactList({ recruiterId }),
    queryFn: async () => {
      if (!recruiterId) {
        return { data: [], total: 0, page: 1, per_page: 20, total_pages: 0 } as CRMPaginatedResponse<RecruiterContact>;
      }
      const res = await crmApi.listRecruiterContacts(recruiterId);
      const items = res.data.data;
      return { data: items, total: items.length, page: 1, per_page: 20, total_pages: 1 } as CRMPaginatedResponse<RecruiterContact>;
    },
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: crmKeys.contactDetail(id),
    queryFn: async (): Promise<RecruiterContact> => {
      const res = await crmApi.listRecruiterContacts(id);
      return (res.data.data[0] ?? {}) as RecruiterContact;
    },
    enabled: !!id,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterContactCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterContact(recruiterId, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.contactLists() });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: _data, recruiterId }: { id: string; data: Partial<RecruiterContact>; recruiterId: string }) => {
      const res = await crmApi.listRecruiterContacts(recruiterId);
      const existing = res.data.data.find((c) => c.id === id);
      return (existing ?? {}) as RecruiterContact;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.contactLists() });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.contactLists() });
    },
  });
}

// --- Conversation Hooks ---

export function useConversations(recruiterId?: string) {
  return useQuery({
    queryKey: crmKeys.conversationLists(),
    queryFn: async () => {
      if (!recruiterId) {
        return { data: [], total: 0, page: 1, per_page: 20, total_pages: 0 } as CRMPaginatedResponse<RecruiterConversation>;
      }
      const res = await crmApi.listRecruiterConversations(recruiterId);
      const items = res.data.data;
      return { data: items, total: items.length, page: 1, per_page: 20, total_pages: 1 } as CRMPaginatedResponse<RecruiterConversation>;
    },
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: crmKeys.conversationDetail(id),
    queryFn: async (): Promise<RecruiterConversation> => {
      const res = await crmApi.listRecruiterConversations(id);
      return (res.data.data[0] ?? {}) as RecruiterConversation;
    },
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterConversationCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterConversation(recruiterId, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.conversationLists() });
    },
  });
}

export function useDeleteConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.conversationLists() });
    },
  });
}

// --- Email Hooks ---

export function useEmails(recruiterId: string) {
  return useQuery({
    queryKey: crmKeys.emailLists(recruiterId),
    queryFn: async (): Promise<RecruiterEmail[]> => {
      const res = await crmApi.listRecruiterEmails(recruiterId);
      return res.data.data;
    },
    enabled: !!recruiterId,
  });
}

export function useEmail(id: string) {
  return useQuery({
    queryKey: crmKeys.emailDetail(id),
    queryFn: async (): Promise<RecruiterEmail> => {
      const res = await crmApi.listRecruiterEmails(id);
      return (res.data.data[0] ?? {}) as RecruiterEmail;
    },
    enabled: !!id,
  });
}

export function useCreateEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterEmailCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterEmail(recruiterId, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.emailLists(variables.recruiterId) });
    },
  });
}

export function useDeleteEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.emails() });
    },
  });
}

// --- Call Hooks ---

export function useCalls(recruiterId: string) {
  return useQuery({
    queryKey: crmKeys.callLists(recruiterId),
    queryFn: async (): Promise<RecruiterCall[]> => {
      const res = await crmApi.listRecruiterCalls(recruiterId);
      return res.data.data;
    },
    enabled: !!recruiterId,
  });
}

export function useCall(id: string) {
  return useQuery({
    queryKey: crmKeys.callDetail(id),
    queryFn: async (): Promise<RecruiterCall> => {
      const res = await crmApi.listRecruiterCalls(id);
      return (res.data.data[0] ?? {}) as RecruiterCall;
    },
    enabled: !!id,
  });
}

export function useCreateCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterCallCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterCall(recruiterId, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.callLists(variables.recruiterId) });
    },
  });
}

export function useDeleteCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.calls() });
    },
  });
}

// --- Meeting Hooks ---

export function useMeetings(recruiterId?: string) {
  return useQuery({
    queryKey: crmKeys.meetingLists(),
    queryFn: async () => {
      if (!recruiterId) {
        return { data: [], total: 0, page: 1, per_page: 20, total_pages: 0 } as CRMPaginatedResponse<RecruiterMeeting>;
      }
      const res = await crmApi.listRecruiterMeetings(recruiterId);
      const items = res.data.data;
      return { data: items, total: items.length, page: 1, per_page: 20, total_pages: 1 } as CRMPaginatedResponse<RecruiterMeeting>;
    },
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: crmKeys.meetingDetail(id),
    queryFn: async (): Promise<RecruiterMeeting> => {
      const res = await crmApi.listRecruiterMeetings(id);
      return (res.data.data[0] ?? {}) as RecruiterMeeting;
    },
    enabled: !!id,
  });
}

export function useCreateMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterMeetingCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterMeeting(recruiterId, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.meetingLists() });
    },
  });
}

export function useDeleteMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.meetingLists() });
    },
  });
}

// --- Note Hooks ---

export function useNotes(recruiterId: string) {
  return useQuery({
    queryKey: crmKeys.noteLists("recruiter", recruiterId),
    queryFn: async (): Promise<RecruiterNote[]> => {
      const res = await crmApi.listRecruiterNotes(recruiterId);
      return res.data.data;
    },
    enabled: !!recruiterId,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: crmKeys.noteDetail(id),
    queryFn: async (): Promise<RecruiterNote> => {
      const res = await crmApi.listRecruiterNotes(id);
      return (res.data.data[0] ?? {}) as RecruiterNote;
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterNoteCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterNote(recruiterId, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.noteLists("recruiter", variables.recruiterId) });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.notes() });
    },
  });
}

// --- Reminder Hooks ---

export function useReminders(recruiterId?: string) {
  return useQuery({
    queryKey: crmKeys.reminderLists(),
    queryFn: async () => {
      if (!recruiterId) {
        return { data: [], total: 0, page: 1, per_page: 20, total_pages: 0 } as CRMPaginatedResponse<RecruiterReminder>;
      }
      const res = await crmApi.listRecruiterReminders(recruiterId);
      const items = res.data.data;
      return { data: items, total: items.length, page: 1, per_page: 20, total_pages: 1 } as CRMPaginatedResponse<RecruiterReminder>;
    },
  });
}

export function useReminder(id: string) {
  return useQuery({
    queryKey: crmKeys.reminderDetail(id),
    queryFn: async (): Promise<RecruiterReminder> => {
      const res = await crmApi.listRecruiterReminders(id);
      return (res.data.data[0] ?? {}) as RecruiterReminder;
    },
    enabled: !!id,
  });
}

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterReminderCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterReminder(recruiterId, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.reminderLists() });
    },
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.reminderLists() });
    },
  });
}

// --- FollowUp Hooks ---

export function useFollowUps(recruiterId: string) {
  return useQuery({
    queryKey: crmKeys.followUpLists(recruiterId),
    queryFn: async (): Promise<RecruiterFollowUp[]> => {
      const res = await crmApi.listRecruiterFollowUps(recruiterId);
      return res.data.data;
    },
    enabled: !!recruiterId,
  });
}

export function useFollowUp(id: string) {
  return useQuery({
    queryKey: crmKeys.followUpDetail(id),
    queryFn: async (): Promise<RecruiterFollowUp> => {
      const res = await crmApi.listRecruiterFollowUps(id);
      return (res.data.data[0] ?? {}) as RecruiterFollowUp;
    },
    enabled: !!id,
  });
}

export function useCreateFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterFollowUpCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterFollowUp(recruiterId, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.followUpLists(variables.recruiterId) });
    },
  });
}

export function useDeleteFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.followUps() });
    },
  });
}

// --- Task Hooks ---

export function useTasks(recruiterId?: string) {
  return useQuery({
    queryKey: crmKeys.taskLists(),
    queryFn: async () => {
      if (!recruiterId) {
        return { data: [], total: 0, page: 1, per_page: 20, total_pages: 0 } as CRMPaginatedResponse<RecruiterTask>;
      }
      const res = await crmApi.listRecruiterTasks(recruiterId);
      const items = res.data.data;
      return { data: items, total: items.length, page: 1, per_page: 20, total_pages: 1 } as CRMPaginatedResponse<RecruiterTask>;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: crmKeys.taskDetail(id),
    queryFn: async (): Promise<RecruiterTask> => {
      const res = await crmApi.listRecruiterTasks(id);
      return (res.data.data[0] ?? {}) as RecruiterTask;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterTaskCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterTask(recruiterId, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.taskLists() });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data }: { id: string; data: Partial<RecruiterTask> }) => {
      return data as RecruiterTask;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.taskLists() });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.taskLists() });
    },
  });
}

// --- Activity Hooks ---

export function useActivities(recruiterId: string) {
  return useQuery({
    queryKey: crmKeys.activityLists("recruiter", recruiterId),
    queryFn: async (): Promise<RecruiterActivity[]> => {
      const res = await crmApi.listRecruiterActivities(recruiterId);
      return res.data.data;
    },
    enabled: !!recruiterId,
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterActivityCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterActivity(recruiterId, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.activityLists("recruiter", variables.recruiterId) });
    },
  });
}

// --- Attachment Hooks ---

export function useAttachments(recruiterId: string) {
  return useQuery({
    queryKey: crmKeys.attachmentLists("recruiter", recruiterId),
    queryFn: async (): Promise<RecruiterAttachment[]> => {
      const res = await crmApi.listRecruiterAttachments(recruiterId);
      return res.data.data;
    },
    enabled: !!recruiterId,
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.attachments() });
    },
  });
}

// --- Tag Hooks ---

export function useTags(recruiterId?: string) {
  return useQuery({
    queryKey: crmKeys.tags(),
    queryFn: async (): Promise<RecruiterTag[]> => {
      if (!recruiterId) {
        return [];
      }
      const res = await crmApi.listRecruiterTags(recruiterId);
      return res.data.data;
    },
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recruiterId, ...data }: RecruiterTagCreate & { recruiterId: string }) => {
      const res = await crmApi.createRecruiterTag(recruiterId, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.tags() });
    },
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.tags() });
    },
  });
}

// --- Collection Hooks ---

export function useCollections() {
  return useQuery({
    queryKey: crmKeys.collections(),
    queryFn: async (): Promise<CRMPaginatedResponse<RecruiterCollection>> => {
      const res = await crmApi.listCollections();
      return res.data.data;
    },
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: crmKeys.collectionDetail(id),
    queryFn: async (): Promise<RecruiterCollection> => {
      const res = await crmApi.getCollection(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: RecruiterCollectionCreate) => {
      const res = await crmApi.createCollection(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.collections() });
    },
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RecruiterCollection> }) => {
      const res = await crmApi.updateCollection(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.collections() });
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteCollection(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.collections() });
    },
  });
}

// --- Application Hooks ---

export function useApplications() {
  const filters = useCRMStore((s) => s.applicationFilters);
  return useQuery({
    queryKey: crmKeys.applicationList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<CRMPaginatedResponse<Application>> => {
      const res = await crmApi.listApplications({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data;
    },
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationDetail(id),
    queryFn: async (): Promise<ApplicationDetail> => {
      const res = await crmApi.getApplication(id);
      return res.data.data as ApplicationDetail;
    },
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationCreate) => {
      const res = await crmApi.createApplication(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationLists() });
    },
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ApplicationUpdate }) => {
      const res = await crmApi.updateApplication(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationLists() });
    },
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteApplication(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationLists() });
    },
  });
}

// --- Application Sub-resource Hooks ---

export function useStages() {
  return useQuery({
    queryKey: crmKeys.stages(),
    queryFn: async (): Promise<ApplicationStage[]> => {
      return [
        { id: "1", application_id: "", stage_name: "Applied", stage_order: 0, status: "active", entered_date: null, exited_date: null, duration_days: null, notes: null, metadata: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ApplicationStage,
        { id: "2", application_id: "", stage_name: "Screening", stage_order: 1, status: "active", entered_date: null, exited_date: null, duration_days: null, notes: null, metadata: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ApplicationStage,
        { id: "3", application_id: "", stage_name: "Interview", stage_order: 2, status: "active", entered_date: null, exited_date: null, duration_days: null, notes: null, metadata: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ApplicationStage,
        { id: "4", application_id: "", stage_name: "Offer", stage_order: 3, status: "active", entered_date: null, exited_date: null, duration_days: null, notes: null, metadata: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ApplicationStage,
        { id: "5", application_id: "", stage_name: "Hired", stage_order: 4, status: "active", entered_date: null, exited_date: null, duration_days: null, notes: null, metadata: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ApplicationStage,
      ];
    },
  });
}

export function useCreateStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationStageCreate) => {
      const res = await crmApi.createApplicationStage(data.application_id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.stages() });
    },
  });
}

export function useDeleteStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.stages() });
    },
  });
}

export function useApplicationHistory(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationHistory(id),
    queryFn: async (): Promise<ApplicationHistory[]> => {
      const res = await crmApi.listApplicationHistory(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useApplicationStatuses(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationStatuses(id),
    queryFn: async (): Promise<ApplicationStatusRecord[]> => {
      const res = await crmApi.listApplicationStatuses(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useApplicationChecklist(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationChecklist(id),
    queryFn: async (): Promise<ApplicationChecklist[]> => {
      const res = await crmApi.listApplicationChecklists(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationChecklistCreate) => {
      const res = await crmApi.createApplicationChecklist(data.application_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationChecklist(variables.application_id) });
    },
  });
}

export function useApplicationTimeline(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationTimeline(id),
    queryFn: async (): Promise<ApplicationTimeline[]> => {
      const res = await crmApi.listApplicationTimeline(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useApplicationDocuments(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationDocuments(id),
    queryFn: async (): Promise<ApplicationDocument[]> => {
      const res = await crmApi.listApplicationDocuments(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationDocumentCreate) => {
      const res = await crmApi.createApplicationDocument(data.application_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationDocuments(variables.application_id) });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.applications() });
    },
  });
}

export function useApplicationOffers(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationOffers(id),
    queryFn: async (): Promise<ApplicationOffer[]> => {
      const res = await crmApi.listApplicationOffers(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationOfferCreate) => {
      const res = await crmApi.createApplicationOffer(data.application_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationOffers(variables.application_id) });
    },
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id: _id, data }: { id: string; data: Partial<ApplicationOffer> }) => {
      return data as ApplicationOffer;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.applications() });
    },
  });
}

export function useApplicationNegotiations(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationNegotiations(id),
    queryFn: async (): Promise<ApplicationNegotiation[]> => {
      const res = await crmApi.listApplicationNegotiations(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateNegotiation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationNegotiationCreate) => {
      const res = await crmApi.createApplicationNegotiation(data.application_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationNegotiations(variables.application_id) });
    },
  });
}

export function useApplicationFeedback(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationFeedback(id),
    queryFn: async (): Promise<ApplicationFeedback[]> => {
      const res = await crmApi.listApplicationFeedback(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationFeedbackCreate) => {
      const res = await crmApi.createApplicationFeedback(data.application_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationFeedback(variables.application_id) });
    },
  });
}

export function useApplicationDecisions(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationDecisions(id),
    queryFn: async (): Promise<ApplicationDecision[]> => {
      const res = await crmApi.listApplicationDecisions(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationDecisionCreate) => {
      const res = await crmApi.createApplicationDecision(data.application_id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: crmKeys.applicationDecisions(variables.application_id) });
    },
  });
}

export function useApplicationAnalytics(id: string) {
  return useQuery({
    queryKey: crmKeys.applicationAnalytics(id),
    queryFn: async (): Promise<ApplicationAnalytics> => {
      const res = await crmApi.getApplicationAnalytics();
      return res.data.data;
    },
    enabled: !!id,
  });
}

// --- Referral Hooks ---

export function useReferrals() {
  return useQuery({
    queryKey: crmKeys.referralLists(),
    queryFn: async (): Promise<CRMPaginatedResponse<Referral>> => {
      const res = await crmApi.listReferrals();
      return res.data.data;
    },
  });
}

export function useReferral(id: string) {
  return useQuery({
    queryKey: crmKeys.referralDetail(id),
    queryFn: async (): Promise<Referral> => {
      const res = await crmApi.getReferral(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReferralCreate) => {
      const res = await crmApi.createReferral(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.referralLists() });
    },
  });
}

export function useUpdateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Referral> }) => {
      const res = await crmApi.updateReferral(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.referralLists() });
    },
  });
}

export function useDeleteReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteReferral(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.referralLists() });
    },
  });
}

// --- Networking Hooks ---

export function useNetworkingContacts() {
  return useQuery({
    queryKey: crmKeys.networkingContacts(),
    queryFn: async (): Promise<CRMPaginatedResponse<NetworkingContact>> => {
      const res = await crmApi.listNetworkingContacts();
      return res.data.data;
    },
  });
}

export function useNetworkingContact(id: string) {
  return useQuery({
    queryKey: crmKeys.networkingContactDetail(id),
    queryFn: async (): Promise<NetworkingContact> => {
      const res = await crmApi.getNetworkingContact(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateNetworkingContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: NetworkingContactCreate) => {
      const res = await crmApi.createNetworkingContact(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingContacts() });
    },
  });
}

export function useUpdateNetworkingContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NetworkingContact> }) => {
      const res = await crmApi.updateNetworkingContact(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingContacts() });
    },
  });
}

export function useDeleteNetworkingContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteNetworkingContact(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingContacts() });
    },
  });
}

export function useNetworkingEvents() {
  return useQuery({
    queryKey: crmKeys.networkingEvents(),
    queryFn: async (): Promise<CRMPaginatedResponse<NetworkingEvent>> => {
      const res = await crmApi.listNetworkingEvents();
      return res.data.data;
    },
  });
}

export function useNetworkingEvent(id: string) {
  return useQuery({
    queryKey: crmKeys.networkingEventDetail(id),
    queryFn: async (): Promise<NetworkingEvent> => {
      const res = await crmApi.getNetworkingEvent(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateNetworkingEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: NetworkingEventCreate) => {
      const res = await crmApi.createNetworkingEvent(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingEvents() });
    },
  });
}

export function useDeleteNetworkingEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteNetworkingEvent(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingEvents() });
    },
  });
}

export function useNetworkingReminders() {
  return useQuery({
    queryKey: crmKeys.networkingReminders(),
    queryFn: async (): Promise<NetworkingReminder[]> => {
      const res = await crmApi.listNetworkingReminders();
      return res.data.data as unknown as NetworkingReminder[];
    },
  });
}

export function useCreateNetworkingReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: NetworkingReminderCreate) => {
      const res = await crmApi.createNetworkingReminder(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingReminders() });
    },
  });
}

export function useDeleteNetworkingReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteNetworkingReminder(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingReminders() });
    },
  });
}

export function useNetworkingGoals() {
  return useQuery({
    queryKey: crmKeys.networkingGoals(),
    queryFn: async (): Promise<NetworkingGoal[]> => {
      const res = await crmApi.listNetworkingGoals();
      return res.data.data as unknown as NetworkingGoal[];
    },
  });
}

export function useCreateNetworkingGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: NetworkingGoalCreate) => {
      const res = await crmApi.createNetworkingGoal(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingGoals() });
    },
  });
}

export function useUpdateNetworkingGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NetworkingGoal> }) => {
      const res = await crmApi.updateNetworkingGoal(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingGoals() });
    },
  });
}

export function useDeleteNetworkingGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteNetworkingGoal(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.networkingGoals() });
    },
  });
}

export function useNetworkingAnalytics() {
  return useQuery({
    queryKey: crmKeys.networkingAnalytics(),
    queryFn: async (): Promise<NetworkingAnalytics> => {
      const res = await crmApi.getNetworkingAnalytics();
      return res.data.data;
    },
  });
}

// --- Global CRM Hooks ---

export function useCRMNotifications() {
  return useQuery({
    queryKey: crmKeys.notifications(),
    queryFn: async (): Promise<CRMNotification[]> => {
      const res = await crmApi.listNotifications();
      return res.data.data as unknown as CRMNotification[];
    },
  });
}

export function useCRMReports() {
  return useQuery({
    queryKey: crmKeys.reports(),
    queryFn: async (): Promise<CRMReport[]> => {
      const res = await crmApi.listReports();
      return res.data.data as unknown as CRMReport[];
    },
  });
}

export function useCRMSettings() {
  return useQuery({
    queryKey: crmKeys.settings(),
    queryFn: async (): Promise<CRMSettings> => {
      const res = await crmApi.getSettings();
      return res.data.data;
    },
  });
}

export function useUpdateCRMSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CRMSettings>) => {
      const res = await crmApi.updateSettings(data as CRMSettingsUpdate);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.settings() });
    },
  });
}

export function useCRMBookmarks() {
  return useQuery({
    queryKey: crmKeys.bookmarks(),
    queryFn: async (): Promise<CRMBookmark[]> => {
      const res = await crmApi.listBookmarks();
      return res.data.data as unknown as CRMBookmark[];
    },
  });
}

export function useCreateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ entityType, entityId, notes }: { entityType: string; entityId: string; notes?: string }) => {
      const res = await crmApi.createBookmark({
        entity_type: entityType,
        entity_id: entityId,
        note: notes ?? "",
      } as CRMBookmarkCreate);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.bookmarks() });
    },
  });
}

export function useDeleteBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.deleteBookmark(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.bookmarks() });
    },
  });
}

export function useCRMInsights() {
  return useQuery({
    queryKey: crmKeys.insights(),
    queryFn: async (): Promise<CRMInsight[]> => {
      const res = await crmApi.listInsights();
      return res.data.data;
    },
  });
}

export function useCRMRecommendations() {
  return useQuery({
    queryKey: crmKeys.recommendations(),
    queryFn: async (): Promise<CRMRecommendation[]> => {
      const res = await crmApi.listRecommendations();
      return res.data.data;
    },
  });
}

export function useCRMHistory() {
  return useQuery({
    queryKey: crmKeys.crmHistory(),
    queryFn: async (): Promise<CRMHistoryEntry[]> => {
      const res = await crmApi.listHistory();
      return res.data.data as unknown as CRMHistoryEntry[];
    },
  });
}

export function useCRMSnapshots() {
  return useQuery({
    queryKey: crmKeys.snapshots(),
    queryFn: async (): Promise<CRMSnapshot[]> => {
      const res = await crmApi.listSnapshots();
      return res.data.data;
    },
  });
}

export function useExportCRM() {
  return useMutation({
    mutationFn: async (request: CRMExportRequest) => {
      const res = await crmApi.exportData(request);
      return res.data.data;
    },
  });
}

export function useBulkDeleteCRM() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (action: CRMBulkAction) => {
      await crmApi.bulkAction(action);
      return action;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: crmKeys.all });
    },
  });
}
