import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmailStore } from "@/stores/email.store";
import { emailApi } from "@/lib/api-client";
import type {
  EmailAccount,
  EmailAccountCreate,
  EmailAccountUpdate,
  EmailTemplate,
  EmailTemplateCreate,
  EmailTemplateUpdate,
  EmailMessage,
  EmailMessageCreate,
  EmailThread,
  EmailDraft,
  EmailDraftCreate,
  EmailDraftUpdate,
  EmailCampaign,
  EmailCampaignCreate,
  EmailCampaignUpdate,
  EmailCampaignStep,
  EmailCampaignRecipientCreate,
  EmailSequence,
  EmailSequenceCreate,
  EmailSequenceUpdate,
  EmailSequenceStep,
  EmailSequenceEnrollmentCreate,
  EmailLabel,
  EmailLabelCreate,
  EmailSuppression,
  EmailSuppressionCreate,
  EmailStats,
  EmailSearchRequest,
  EmailNotification,
  EmailHistoryEntry,
  EmailPaginatedResponse,
} from "@/types/email";

// Query key factory
export const emailKeys = {
  all: ["email"] as const,

  accounts: () => [...emailKeys.all, "accounts"] as const,
  accountLists: () => [...emailKeys.accounts(), "list"] as const,
  accountList: (filters: Record<string, unknown>) => [...emailKeys.accountLists(), filters] as const,
  accountDetails: () => [...emailKeys.accounts(), "detail"] as const,
  accountDetail: (id: string) => [...emailKeys.accountDetails(), id] as const,

  stats: () => [...emailKeys.all, "stats"] as const,

  messages: () => [...emailKeys.all, "messages"] as const,
  messageLists: () => [...emailKeys.messages(), "list"] as const,
  messageList: (filters: Record<string, unknown>) => [...emailKeys.messageLists(), filters] as const,
  messageDetails: () => [...emailKeys.messages(), "detail"] as const,
  messageDetail: (id: string) => [...emailKeys.messageDetails(), id] as const,
  messageSearch: (params: Record<string, unknown>) => [...emailKeys.messages(), "search", params] as const,
  messageHistory: (id: string) => [...emailKeys.messages(), "history", id] as const,

  templates: () => [...emailKeys.all, "templates"] as const,
  templateLists: () => [...emailKeys.templates(), "list"] as const,
  templateList: (filters: Record<string, unknown>) => [...emailKeys.templateLists(), filters] as const,
  templateDetails: () => [...emailKeys.templates(), "detail"] as const,
  templateDetail: (id: string) => [...emailKeys.templateDetails(), id] as const,

  threads: () => [...emailKeys.all, "threads"] as const,
  threadLists: () => [...emailKeys.threads(), "list"] as const,
  threadList: (filters: Record<string, unknown>) => [...emailKeys.threadLists(), filters] as const,
  threadDetails: () => [...emailKeys.threads(), "detail"] as const,
  threadDetail: (id: string) => [...emailKeys.threadDetails(), id] as const,

  drafts: () => [...emailKeys.all, "drafts"] as const,
  draftLists: () => [...emailKeys.drafts(), "list"] as const,
  draftList: (filters: Record<string, unknown>) => [...emailKeys.draftLists(), filters] as const,
  draftDetails: () => [...emailKeys.drafts(), "detail"] as const,
  draftDetail: (id: string) => [...emailKeys.draftDetails(), id] as const,

  campaigns: () => [...emailKeys.all, "campaigns"] as const,
  campaignLists: () => [...emailKeys.campaigns(), "list"] as const,
  campaignList: (filters: Record<string, unknown>) => [...emailKeys.campaignLists(), filters] as const,
  campaignDetails: () => [...emailKeys.campaigns(), "detail"] as const,
  campaignDetail: (id: string) => [...emailKeys.campaignDetails(), id] as const,

  sequences: () => [...emailKeys.all, "sequences"] as const,
  sequenceLists: () => [...emailKeys.sequences(), "list"] as const,
  sequenceList: (filters: Record<string, unknown>) => [...emailKeys.sequenceLists(), filters] as const,
  sequenceDetails: () => [...emailKeys.sequences(), "detail"] as const,
  sequenceDetail: (id: string) => [...emailKeys.sequenceDetails(), id] as const,

  labels: () => [...emailKeys.all, "labels"] as const,
  labelLists: () => [...emailKeys.labels(), "list"] as const,
  labelDetail: (id: string) => [...emailKeys.labels(), "detail", id] as const,

  suppressions: () => [...emailKeys.all, "suppressions"] as const,
  suppressionLists: () => [...emailKeys.suppressions(), "list"] as const,
  suppressionList: (filters: Record<string, unknown>) => [...emailKeys.suppressionLists(), filters] as const,
  suppressionDetail: (id: string) => [...emailKeys.suppressions(), "detail", id] as const,

  notifications: () => [...emailKeys.all, "notifications"] as const,
  notificationList: (filters: Record<string, unknown>) => [...emailKeys.notifications(), "list", filters] as const,
};

// --- Account Hooks ---

export function useEmailAccounts() {
  const filters = useEmailStore((s) => s.messageFilters);
  return useQuery({
    queryKey: emailKeys.accountList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailAccount>> => {
      const res = await emailApi.listAccounts({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailAccount(id: string) {
  return useQuery({
    queryKey: emailKeys.accountDetail(id),
    queryFn: async (): Promise<EmailAccount> => {
      const res = await emailApi.getAccount(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailAccountCreate) => {
      const res = await emailApi.createAccount(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.accountLists() });
    },
  });
}

export function useUpdateEmailAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmailAccountUpdate }) => {
      const res = await emailApi.updateAccount(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.accountLists() });
    },
  });
}

export function useDeleteEmailAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteAccount(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.accountLists() });
    },
  });
}

// --- Stats ---

export function useEmailStats() {
  return useQuery({
    queryKey: emailKeys.stats(),
    queryFn: async (): Promise<EmailStats> => {
      const res = await emailApi.getStats();
      return res.data.data!;
    },
  });
}

// --- Message Hooks ---

export function useEmailMessages() {
  const filters = useEmailStore((s) => s.messageFilters);
  return useQuery({
    queryKey: emailKeys.messageList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailMessage>> => {
      const res = await emailApi.listMessages({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailMessage(id: string) {
  return useQuery({
    queryKey: emailKeys.messageDetail(id),
    queryFn: async (): Promise<EmailMessage> => {
      const res = await emailApi.getMessage(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailMessageCreate) => {
      const res = await emailApi.createMessage(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
    },
  });
}

export function useDeleteEmailMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteMessage(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
    },
  });
}

export function useSendEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailMessageCreate) => {
      const res = await emailApi.sendEmail(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
    },
  });
}

export function useBulkSendEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { messages: EmailMessageCreate[] }) => {
      const res = await emailApi.bulkSendEmail(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
    },
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.markAsRead(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
      qc.invalidateQueries({ queryKey: emailKeys.threadLists() });
    },
  });
}

export function useToggleStar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.toggleStar(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
      qc.invalidateQueries({ queryKey: emailKeys.threadLists() });
    },
  });
}

export function useSearchEmails() {
  return useMutation({
    mutationFn: async (params: EmailSearchRequest) => {
      const res = await emailApi.searchMessages(params);
      return res.data.data!;
    },
  });
}

export function useTrackOpen() {
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.trackOpen(id);
      return id;
    },
  });
}

export function useTrackClick() {
  return useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      await emailApi.trackClick(id, url);
      return { id, url };
    },
  });
}

export function useEmailHistory(id: string) {
  return useQuery({
    queryKey: emailKeys.messageHistory(id),
    queryFn: async (): Promise<EmailHistoryEntry[]> => {
      const res = await emailApi.getEmailHistory(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

// --- Template Hooks ---

export function useEmailTemplates() {
  const filters = useEmailStore((s) => s.templateFilters);
  return useQuery({
    queryKey: emailKeys.templateList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailTemplate>> => {
      const res = await emailApi.listTemplates({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailTemplate(id: string) {
  return useQuery({
    queryKey: emailKeys.templateDetail(id),
    queryFn: async (): Promise<EmailTemplate> => {
      const res = await emailApi.getTemplate(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailTemplateCreate) => {
      const res = await emailApi.createTemplate(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.templateLists() });
    },
  });
}

export function useUpdateEmailTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmailTemplateUpdate }) => {
      const res = await emailApi.updateTemplate(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.templateLists() });
    },
  });
}

export function useDeleteEmailTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteTemplate(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.templateLists() });
    },
  });
}

export function useCloneTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.cloneTemplate(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.templateLists() });
    },
  });
}

export function useRestoreTemplateVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ templateId, versionId }: { templateId: string; versionId: string }) => {
      const res = await emailApi.restoreTemplateVersion(templateId, versionId);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.templateLists() });
    },
  });
}

// --- Thread Hooks ---

export function useEmailThreads() {
  const filters = useEmailStore((s) => s.threadFilters);
  return useQuery({
    queryKey: emailKeys.threadList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailThread>> => {
      const res = await emailApi.listThreads({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailThread(id: string) {
  return useQuery({
    queryKey: emailKeys.threadDetail(id),
    queryFn: async (): Promise<EmailThread> => {
      const res = await emailApi.getThread(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useDeleteEmailThread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteThread(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.threadLists() });
    },
  });
}

// --- Draft Hooks ---

export function useEmailDrafts() {
  const filters = useEmailStore((s) => s.messageFilters);
  return useQuery({
    queryKey: emailKeys.draftList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailDraft>> => {
      const res = await emailApi.listDrafts({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailDraft(id: string) {
  return useQuery({
    queryKey: emailKeys.draftDetail(id),
    queryFn: async (): Promise<EmailDraft> => {
      const res = await emailApi.getDraft(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailDraftCreate) => {
      const res = await emailApi.createDraft(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.draftLists() });
    },
  });
}

export function useUpdateEmailDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmailDraftUpdate }) => {
      const res = await emailApi.updateDraft(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.draftLists() });
    },
  });
}

export function useDeleteEmailDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteDraft(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.draftLists() });
    },
  });
}

export function useSendDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.sendDraft(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.draftLists() });
      qc.invalidateQueries({ queryKey: emailKeys.messageLists() });
    },
  });
}

// --- Campaign Hooks ---

export function useEmailCampaigns() {
  const filters = useEmailStore((s) => s.campaignFilters);
  return useQuery({
    queryKey: emailKeys.campaignList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailCampaign>> => {
      const res = await emailApi.listCampaigns({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailCampaign(id: string) {
  return useQuery({
    queryKey: emailKeys.campaignDetail(id),
    queryFn: async (): Promise<EmailCampaign> => {
      const res = await emailApi.getCampaign(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailCampaignCreate) => {
      const res = await emailApi.createCampaign(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function useUpdateEmailCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmailCampaignUpdate }) => {
      const res = await emailApi.updateCampaign(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function useDeleteEmailCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteCampaign(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function useStartCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.startCampaign(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function usePauseCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.pauseCampaign(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function useResumeCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.resumeCampaign(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function useCancelCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.cancelCampaign(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignLists() });
    },
  });
}

export function useAddCampaignRecipient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ campaignId, data }: { campaignId: string; data: EmailCampaignRecipientCreate }) => {
      const res = await emailApi.addCampaignRecipient(campaignId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignDetail(variables.campaignId) });
    },
  });
}

export function useAddCampaignStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ campaignId, data }: { campaignId: string; data: Partial<EmailCampaignStep> }) => {
      const res = await emailApi.addCampaignStep(campaignId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.campaignDetail(variables.campaignId) });
    },
  });
}

// --- Sequence Hooks ---

export function useEmailSequences() {
  const filters = useEmailStore((s) => s.sequenceFilters);
  return useQuery({
    queryKey: emailKeys.sequenceList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailSequence>> => {
      const res = await emailApi.listSequences({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailSequence(id: string) {
  return useQuery({
    queryKey: emailKeys.sequenceDetail(id),
    queryFn: async (): Promise<EmailSequence> => {
      const res = await emailApi.getSequence(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailSequence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailSequenceCreate) => {
      const res = await emailApi.createSequence(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceLists() });
    },
  });
}

export function useUpdateEmailSequence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmailSequenceUpdate }) => {
      const res = await emailApi.updateSequence(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceLists() });
    },
  });
}

export function useDeleteEmailSequence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteSequence(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceLists() });
    },
  });
}

export function useAddSequenceStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sequenceId, data }: { sequenceId: string; data: Partial<EmailSequenceStep> }) => {
      const res = await emailApi.addSequenceStep(sequenceId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceDetail(variables.sequenceId) });
    },
  });
}

export function useEnrollInSequence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sequenceId, data }: { sequenceId: string; data: EmailSequenceEnrollmentCreate }) => {
      const res = await emailApi.enrollInSequence(sequenceId, data);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceDetail(variables.sequenceId) });
    },
  });
}

export function usePauseEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sequenceId, enrollmentId }: { sequenceId: string; enrollmentId: string }) => {
      const res = await emailApi.pauseEnrollment(sequenceId, enrollmentId);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceDetail(variables.sequenceId) });
    },
  });
}

export function useResumeEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sequenceId, enrollmentId }: { sequenceId: string; enrollmentId: string }) => {
      const res = await emailApi.resumeEnrollment(sequenceId, enrollmentId);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceDetail(variables.sequenceId) });
    },
  });
}

export function useUnenroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sequenceId, enrollmentId }: { sequenceId: string; enrollmentId: string }) => {
      const res = await emailApi.unenroll(sequenceId, enrollmentId);
      return res.data.data!;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: emailKeys.sequenceDetail(variables.sequenceId) });
    },
  });
}

// --- Label Hooks ---

export function useEmailLabels() {
  return useQuery({
    queryKey: emailKeys.labelLists(),
    queryFn: async (): Promise<EmailLabel[]> => {
      const res = await emailApi.listLabels();
      return res.data.data!;
    },
  });
}

export function useEmailLabel(id: string) {
  return useQuery({
    queryKey: emailKeys.labelDetail(id),
    queryFn: async (): Promise<EmailLabel> => {
      const res = await emailApi.getLabel(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailLabelCreate) => {
      const res = await emailApi.createLabel(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.labelLists() });
    },
  });
}

export function useUpdateEmailLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmailLabel> }) => {
      const res = await emailApi.updateLabel(id, data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.labelLists() });
    },
  });
}

export function useDeleteEmailLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteLabel(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.labelLists() });
    },
  });
}

// --- Suppression Hooks ---

export function useEmailSuppressions() {
  const filters = useEmailStore((s) => s.messageFilters);
  return useQuery({
    queryKey: emailKeys.suppressionList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailSuppression>> => {
      const res = await emailApi.listSuppressions({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useEmailSuppression(id: string) {
  return useQuery({
    queryKey: emailKeys.suppressionDetail(id),
    queryFn: async (): Promise<EmailSuppression> => {
      const res = await emailApi.getSuppression(id);
      return res.data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateEmailSuppression() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailSuppressionCreate) => {
      const res = await emailApi.createSuppression(data);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.suppressionLists() });
    },
  });
}

export function useDeleteEmailSuppression() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await emailApi.deleteSuppression(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.suppressionLists() });
    },
  });
}

// --- AI Assist ---

export function useAIAssist() {
  return useMutation({
    mutationFn: async (data: { prompt: string; context?: Record<string, unknown> }) => {
      const res = await emailApi.aiAssist(data);
      return res.data.data!;
    },
  });
}

// --- Notification Hooks ---

export function useEmailNotifications() {
  const filters = useEmailStore((s) => s.messageFilters);
  return useQuery({
    queryKey: emailKeys.notificationList(filters as unknown as Record<string, unknown>),
    queryFn: async (): Promise<EmailPaginatedResponse<EmailNotification>> => {
      const res = await emailApi.listNotifications({
        page: filters.page,
        per_page: filters.perPage,
        ...filters,
      });
      return res.data.data!;
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await emailApi.markNotificationRead(id);
      return res.data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailKeys.notifications() });
    },
  });
}
