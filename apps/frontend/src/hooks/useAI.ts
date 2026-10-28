import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/lib/api-client";
import { useAIStore } from "@/stores/ai.store";
import { useAIConversationStore } from "@/stores/ai-conversation.store";
import { toast } from "@/stores/toast.store";
import type {
  AIRequest,
  AIExecution,
  AIProvider,
  AIModel,
  Prompt,
  PromptVersion,
  PromptExecution,
  AIUsage,
  AIUsageSummary,
  AIQuota,
  AISettings,
  AICacheStats,
  AIConversation,
  AIConversationDetail,
  AIMessage,
  AIArtifact,
  AIExecuteRequest,
  AIExecuteResponse,
  AIConversationCreate,
  AIConversationMessage,
  AIArtifactCreate,
  AISearchRequest,
  AIModule,
  AITokenUsageTrend,
  AILatencyTrend,
  AICostTrend,
} from "@/types/ai";

export const aiKeys = {
  all: ["ai"] as const,
  requests: () => [...aiKeys.all, "requests"] as const,
  requestList: (params: Record<string, unknown>) =>
    [...aiKeys.requests(), "list", params] as const,
  request: (id: string) => [...aiKeys.requests(), id] as const,
  executions: (requestId: string) =>
    [...aiKeys.request(requestId), "executions"] as const,
  execution: (id: string) => [...aiKeys.all, "executions", id] as const,

  providers: () => [...aiKeys.all, "providers"] as const,
  provider: (id: string) => [...aiKeys.providers(), id] as const,
  models: (providerId?: string) =>
    [...aiKeys.all, "models", providerId ?? "all"] as const,
  model: (id: string) => [...aiKeys.all, "models", id] as const,

  prompts: () => [...aiKeys.all, "prompts"] as const,
  promptList: (params: Record<string, unknown>) =>
    [...aiKeys.prompts(), "list", params] as const,
  prompt: (id: string) => [...aiKeys.prompts(), id] as const,
  promptVersions: (promptId: string) =>
    [...aiKeys.prompt(promptId), "versions"] as const,
  promptVersion: (promptId: string, versionId: string) =>
    [...aiKeys.promptVersions(promptId), versionId] as const,
  promptExecutions: (promptId: string) =>
    [...aiKeys.prompt(promptId), "executions"] as const,

  usage: () => [...aiKeys.all, "usage"] as const,
  usageList: (params: Record<string, unknown>) =>
    [...aiKeys.usage(), "list", params] as const,
  usageSummary: (params: Record<string, unknown>) =>
    [...aiKeys.usage(), "summary", params] as const,
  tokenTrend: (params: Record<string, unknown>) =>
    [...aiKeys.usage(), "tokenTrend", params] as const,
  latencyTrend: (params: Record<string, unknown>) =>
    [...aiKeys.usage(), "latencyTrend", params] as const,
  costTrend: (params: Record<string, unknown>) =>
    [...aiKeys.usage(), "costTrend", params] as const,

  quota: () => [...aiKeys.all, "quota"] as const,
  quotaByModule: (module: AIModule) =>
    [...aiKeys.quota(), module] as const,

  settings: () => [...aiKeys.all, "settings"] as const,

  cache: () => [...aiKeys.all, "cache"] as const,
  cacheStats: () => [...aiKeys.cache(), "stats"] as const,
  cacheList: (params: Record<string, unknown>) =>
    [...aiKeys.cache(), "list", params] as const,

  conversations: () => [...aiKeys.all, "conversations"] as const,
  conversationList: (params: Record<string, unknown>) =>
    [...aiKeys.conversations(), "list", params] as const,
  conversation: (id: string) => [...aiKeys.conversations(), id] as const,

  artifacts: () => [...aiKeys.all, "artifacts"] as const,
  artifactList: (params: Record<string, unknown>) =>
    [...aiKeys.artifacts(), "list", params] as const,
  artifact: (id: string) => [...aiKeys.artifacts(), id] as const,
};

interface PaginationParams {
  page?: number;
  per_page?: number;
}

export function useAIExecute() {
  const queryClient = useQueryClient();
  const {
    setIsExecuting,
    setActiveRequestId,
    addRequestId,
    setLastResponse,
    setLastError,
  } = useAIStore.getState();

  return useMutation<AIExecuteResponse, Error, AIExecuteRequest>({
    mutationFn: async (data: AIExecuteRequest) => {
      setIsExecuting(true);
      const { data: response } = await aiApi.execute(data);
      const result = response?.data as AIExecuteResponse | undefined;
      if (result) {
        setActiveRequestId(result.request_id);
        addRequestId(result.request_id);
      }
      return result!;
    },
    onSuccess: (result) => {
      setLastResponse(result as unknown as Record<string, unknown>);
      setLastError(null);
      queryClient.invalidateQueries({ queryKey: aiKeys.requests() });
    },
    onError: (error) => {
      setLastError(error.message);
      toast.error(error.message || "AI execution failed");
    },
    onSettled: () => {
      setIsExecuting(false);
    },
  });
}

export function useAIRequests(params?: PaginationParams) {
  return useQuery({
    queryKey: aiKeys.requestList(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getRequests(params);
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useAISearchRequests(params: AISearchRequest) {
  return useQuery({
    queryKey: aiKeys.requestList(params as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await aiApi.searchRequests(params);
      return data?.data as AIRequest[];
    },
    staleTime: 30 * 1000,
  });
}

export function useAIRequest(id: string) {
  return useQuery({
    queryKey: aiKeys.request(id),
    queryFn: async () => {
      const { data } = await aiApi.getRequest(id);
      return data?.data as AIRequest;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useCancelAIRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.cancelRequest(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.request(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.requests() });
      toast.success("Request cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel request");
    },
  });
}

export function useRetryAIRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.retryRequest(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.request(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.requests() });
      toast.success("Request retrying");
    },
    onError: () => {
      toast.error("Failed to retry request");
    },
  });
}

export function useAIExecutions(requestId: string) {
  return useQuery({
    queryKey: aiKeys.executions(requestId),
    queryFn: async () => {
      const { data } = await aiApi.getExecutions(requestId);
      return data?.data as AIExecution[];
    },
    enabled: !!requestId,
    staleTime: 30 * 1000,
  });
}

export function useAIExecution(id: string) {
  return useQuery({
    queryKey: aiKeys.execution(id),
    queryFn: async () => {
      const { data } = await aiApi.getExecution(id);
      return data?.data as AIExecution;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useAIProviders() {
  return useQuery({
    queryKey: aiKeys.providers(),
    queryFn: async () => {
      const { data } = await aiApi.getProviders();
      return data?.data as AIProvider[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIProvider(id: string) {
  return useQuery({
    queryKey: aiKeys.provider(id),
    queryFn: async () => {
      const { data } = await aiApi.getProvider(id);
      return data?.data as AIProvider;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAIProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AIProvider> }) =>
      aiApi.updateProvider(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.provider(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: aiKeys.providers() });
      toast.success("Provider updated");
    },
    onError: () => {
      toast.error("Failed to update provider");
    },
  });
}

export function useToggleAIProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.toggleProvider(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.provider(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.providers() });
      toast.success("Provider toggled");
    },
    onError: () => {
      toast.error("Failed to toggle provider");
    },
  });
}

export function useAIModels(providerId?: string) {
  return useQuery({
    queryKey: aiKeys.models(providerId),
    queryFn: async () => {
      const { data } = await aiApi.getModels(providerId);
      return data?.data as AIModel[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIModel(id: string) {
  return useQuery({
    queryKey: aiKeys.model(id),
    queryFn: async () => {
      const { data } = await aiApi.getModel(id);
      return data?.data as AIModel;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AIModel> }) =>
      aiApi.updateModel(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.model(variables.id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.models() });
      toast.success("Model updated");
    },
    onError: () => {
      toast.error("Failed to update model");
    },
  });
}

export function useToggleAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.toggleModel(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.model(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.models() });
      toast.success("Model toggled");
    },
    onError: () => {
      toast.error("Failed to toggle model");
    },
  });
}

export function useAIPrompts(params?: { module?: AIModule; category?: string }) {
  return useQuery({
    queryKey: aiKeys.promptList(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getPrompts(params);
      return data?.data as Prompt[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIPrompt(id: string) {
  return useQuery({
    queryKey: aiKeys.prompt(id),
    queryFn: async () => {
      const { data } = await aiApi.getPrompt(id);
      return data?.data as Prompt;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAIPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Prompt, "id" | "created_at" | "updated_at">) =>
      aiApi.createPrompt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.prompts() });
      toast.success("Prompt created");
    },
    onError: () => {
      toast.error("Failed to create prompt");
    },
  });
}

export function useUpdateAIPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Prompt> }) =>
      aiApi.updatePrompt(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.prompt(variables.id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.prompts() });
      toast.success("Prompt updated");
    },
    onError: () => {
      toast.error("Failed to update prompt");
    },
  });
}

export function useDeleteAIPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.deletePrompt(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: aiKeys.prompt(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.prompts() });
      toast.success("Prompt deleted");
    },
    onError: () => {
      toast.error("Failed to delete prompt");
    },
  });
}

export function useDuplicateAIPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      aiApi.duplicatePrompt(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.prompts() });
      toast.success("Prompt duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate prompt");
    },
  });
}

export function useAIPromptVersions(promptId: string) {
  return useQuery({
    queryKey: aiKeys.promptVersions(promptId),
    queryFn: async () => {
      const { data } = await aiApi.getPromptVersions(promptId);
      return data?.data as PromptVersion[];
    },
    enabled: !!promptId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIPromptVersion(promptId: string, versionId: string) {
  return useQuery({
    queryKey: aiKeys.promptVersion(promptId, versionId),
    queryFn: async () => {
      const { data } = await aiApi.getPromptVersion(promptId, versionId);
      return data?.data as PromptVersion;
    },
    enabled: !!promptId && !!versionId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAIPromptVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      promptId,
      data,
    }: {
      promptId: string;
      data: Omit<PromptVersion, "id" | "prompt_id" | "created_at" | "updated_at">;
    }) => aiApi.createPromptVersion(promptId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptVersions(variables.promptId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.prompt(variables.promptId),
      });
      toast.success("Version created");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });
}

export function useUpdateAIPromptVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      promptId,
      versionId,
      data,
    }: {
      promptId: string;
      versionId: string;
      data: Partial<PromptVersion>;
    }) => aiApi.updatePromptVersion(promptId, versionId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptVersion(variables.promptId, variables.versionId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptVersions(variables.promptId),
      });
      toast.success("Version updated");
    },
    onError: () => {
      toast.error("Failed to update version");
    },
  });
}

export function usePublishAIPromptVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promptId, versionId }: { promptId: string; versionId: string }) =>
      aiApi.publishPromptVersion(promptId, versionId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptVersions(variables.promptId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.prompt(variables.promptId),
      });
      toast.success("Version published");
    },
    onError: () => {
      toast.error("Failed to publish version");
    },
  });
}

export function useArchiveAIPromptVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promptId, versionId }: { promptId: string; versionId: string }) =>
      aiApi.archivePromptVersion(promptId, versionId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptVersions(variables.promptId),
      });
      toast.success("Version archived");
    },
    onError: () => {
      toast.error("Failed to archive version");
    },
  });
}

export function useRollbackAIPromptVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promptId, versionId }: { promptId: string; versionId: string }) =>
      aiApi.rollbackPromptVersion(promptId, versionId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptVersions(variables.promptId),
      });
      queryClient.invalidateQueries({
        queryKey: aiKeys.prompt(variables.promptId),
      });
      toast.success("Version rolled back");
    },
    onError: () => {
      toast.error("Failed to rollback version");
    },
  });
}

export function useTestAIPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      promptId,
      data,
    }: {
      promptId: string;
      data: {
        variables: Record<string, unknown>;
        provider?: string;
        model?: string;
        temperature?: number;
      };
    }) => aiApi.testPrompt(promptId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.promptExecutions(variables.promptId),
      });
      toast.success("Prompt tested");
    },
    onError: () => {
      toast.error("Failed to test prompt");
    },
  });
}

export function useAIPromptExecutions(promptId: string) {
  return useQuery({
    queryKey: aiKeys.promptExecutions(promptId),
    queryFn: async () => {
      const { data } = await aiApi.getPromptExecutions(promptId);
      return data?.data as PromptExecution[];
    },
    enabled: !!promptId,
    staleTime: 30 * 1000,
  });
}

export function useAIUsage(params?: {
  module?: AIModule;
  date_from?: string;
  date_to?: string;
}) {
  return useQuery({
    queryKey: aiKeys.usageList(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getUsage(params);
      return data?.data as AIUsage[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIUsageSummary(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return useQuery({
    queryKey: aiKeys.usageSummary(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getUsageSummary(params);
      return data?.data as AIUsageSummary;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAITokenUsageTrend(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return useQuery({
    queryKey: aiKeys.tokenTrend(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getTokenUsageTrend(params);
      return data?.data as AITokenUsageTrend[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAILatencyTrend(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return useQuery({
    queryKey: aiKeys.latencyTrend(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getLatencyTrend(params);
      return data?.data as AILatencyTrend[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAICostTrend(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return useQuery({
    queryKey: aiKeys.costTrend(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getCostTrend(params);
      return data?.data as AICostTrend[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIQuota() {
  return useQuery({
    queryKey: aiKeys.quota(),
    queryFn: async () => {
      const { data } = await aiApi.getQuota();
      return data?.data as AIQuota[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIQuotaByModule(module: AIModule) {
  return useQuery({
    queryKey: aiKeys.quotaByModule(module),
    queryFn: async () => {
      const { data } = await aiApi.getQuotaByModule(module);
      return data?.data as AIQuota;
    },
    enabled: !!module,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAISettings() {
  return useQuery({
    queryKey: aiKeys.settings(),
    queryFn: async () => {
      const { data } = await aiApi.getSettings();
      return data?.data as AISettings;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAISettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AISettings>) => aiApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.settings() });
      toast.success("Settings updated");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });
}

export function useAICacheStats() {
  return useQuery({
    queryKey: aiKeys.cacheStats(),
    queryFn: async () => {
      const { data } = await aiApi.getCacheStats();
      return data?.data as AICacheStats;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAICacheEntries(params?: PaginationParams) {
  return useQuery({
    queryKey: aiKeys.cacheList(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getCacheEntries(params);
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useClearAICache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (module?: string) => aiApi.clearCache(module),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.cache() });
      toast.success("Cache cleared");
    },
    onError: () => {
      toast.error("Failed to clear cache");
    },
  });
}

export function useDeleteAICacheEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.deleteCacheEntry(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({
        queryKey: [...aiKeys.cache(), "entry", id],
      });
      queryClient.invalidateQueries({ queryKey: aiKeys.cache() });
      toast.success("Cache entry deleted");
    },
    onError: () => {
      toast.error("Failed to delete cache entry");
    },
  });
}

export function useAIConversations(params?: { module?: AIModule }) {
  return useQuery({
    queryKey: aiKeys.conversationList(
      params as Record<string, unknown> ?? {}
    ),
    queryFn: async () => {
      const { data } = await aiApi.getConversations(params);
      return data?.data as AIConversation[];
    },
    staleTime: 30 * 1000,
  });
}

export function useAIConversation(id: string) {
  const setMessages = useAIConversationStore((s) => s.setMessages);
  const setActiveConversationId = useAIConversationStore(
    (s) => s.setActiveConversationId
  );
  const setContext = useAIConversationStore((s) => s.setContext);
  const setTitle = useAIConversationStore((s) => s.setTitle);

  return useQuery({
    queryKey: aiKeys.conversation(id),
    queryFn: async () => {
      const { data } = await aiApi.getConversation(id);
      const detail = data?.data as AIConversationDetail;
      if (detail) {
        setActiveConversationId(detail.id);
        setMessages(
          detail.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            tokens: m.tokens,
            created_at: m.created_at,
          }))
        );
        setContext(detail.context);
        setTitle(detail.title);
      }
      return detail;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useCreateAIConversation() {
  const queryClient = useQueryClient();
  const { setActiveConversationId, setTitle } =
    useAIConversationStore.getState();

  return useMutation({
    mutationFn: (data: AIConversationCreate) =>
      aiApi.createConversation(data),
    onSuccess: (response) => {
      const conversation = response?.data?.data as
        | AIConversation
        | undefined;
      if (conversation) {
        setActiveConversationId(conversation.id);
        setTitle(conversation.title);
      }
      queryClient.invalidateQueries({ queryKey: aiKeys.conversations() });
      toast.success("Conversation created");
    },
    onError: () => {
      toast.error("Failed to create conversation");
    },
  });
}

export function useDeleteAIConversation() {
  const queryClient = useQueryClient();
  const { reset } = useAIConversationStore.getState();

  return useMutation({
    mutationFn: (id: string) => aiApi.deleteConversation(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: aiKeys.conversation(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.conversations() });
      reset();
      toast.success("Conversation deleted");
    },
    onError: () => {
      toast.error("Failed to delete conversation");
    },
  });
}

export function useArchiveAIConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.archiveConversation(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.conversation(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.conversations() });
      toast.success("Conversation archived");
    },
    onError: () => {
      toast.error("Failed to archive conversation");
    },
  });
}

export function useSendAIMessage() {
  const queryClient = useQueryClient();
  const { addMessage } = useAIConversationStore.getState();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: AIConversationMessage;
    }) => aiApi.sendMessage(conversationId, data),
    onSuccess: (response, variables) => {
      const message = response?.data?.data as AIMessage | undefined;
      if (message) {
        addMessage({
          id: message.id,
          role: message.role,
          content: message.content,
          tokens: message.tokens,
          created_at: message.created_at,
        });
      }
      queryClient.invalidateQueries({
        queryKey: aiKeys.conversation(variables.conversationId),
      });
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });
}

export function useAIArtifacts(params?: { module?: AIModule }) {
  return useQuery({
    queryKey: aiKeys.artifactList(params as Record<string, unknown> ?? {}),
    queryFn: async () => {
      const { data } = await aiApi.getArtifacts(params);
      return data?.data as AIArtifact[];
    },
    staleTime: 30 * 1000,
  });
}

export function useAIArtifact(id: string) {
  return useQuery({
    queryKey: aiKeys.artifact(id),
    queryFn: async () => {
      const { data } = await aiApi.getArtifact(id);
      return data?.data as AIArtifact;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useCreateAIArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AIArtifactCreate) => aiApi.createArtifact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.artifacts() });
      toast.success("Artifact created");
    },
    onError: () => {
      toast.error("Failed to create artifact");
    },
  });
}

export function useUpdateAIArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AIArtifact> }) =>
      aiApi.updateArtifact(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.artifact(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: aiKeys.artifacts() });
      toast.success("Artifact updated");
    },
    onError: () => {
      toast.error("Failed to update artifact");
    },
  });
}

export function useDeleteAIArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.deleteArtifact(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: aiKeys.artifact(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.artifacts() });
      toast.success("Artifact deleted");
    },
    onError: () => {
      toast.error("Failed to delete artifact");
    },
  });
}

export function useRateAIArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) =>
      aiApi.rateArtifact(id, rating),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.artifact(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: aiKeys.artifacts() });
      toast.success("Artifact rated");
    },
    onError: () => {
      toast.error("Failed to rate artifact");
    },
  });
}

export function useAcceptAIArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.acceptArtifact(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.artifact(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.artifacts() });
      toast.success("Artifact accepted");
    },
    onError: () => {
      toast.error("Failed to accept artifact");
    },
  });
}

export function useRejectAIArtifact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiApi.rejectArtifact(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.artifact(id) });
      queryClient.invalidateQueries({ queryKey: aiKeys.artifacts() });
      toast.success("Artifact rejected");
    },
    onError: () => {
      toast.error("Failed to reject artifact");
    },
  });
}

export function useAIHealthCheck() {
  return useQuery({
    queryKey: [...aiKeys.all, "health"],
    queryFn: async () => {
      const { data } = await aiApi.healthCheck();
      return data?.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
