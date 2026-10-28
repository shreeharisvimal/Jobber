import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Clock,
  Archive,
  Trash2,
  User,
  Bot,
  FileText,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Conversation {
  id: string;
  title: string;
  module: string;
  status: "active" | "archived" | "deleted";
  messageCount: number;
  context: Record<string, unknown>;
  artifacts: ConversationArtifact[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens: number;
  createdAt: string;
}

interface ConversationArtifact {
  id: string;
  type: string;
  name: string;
  createdAt: string;
}

interface ConversationDetail {
  id: string;
  title: string;
  module: string;
  status: string;
  messages: ConversationMessage[];
  context: Record<string, unknown>;
  artifacts: ConversationArtifact[];
  createdAt: string;
  updatedAt: string;
}

const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  active: "success",
  archived: "default",
  deleted: "default",
};

const moduleOptions = [
  { value: "all", label: "All Modules" },
  { value: "resume", label: "Resume" },
  { value: "cover-letter", label: "Cover Letter" },
  { value: "interview", label: "Interview" },
  { value: "career", label: "Career" },
  { value: "skills", label: "Skills" },
  { value: "general", label: "General" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const ConversationExplorerPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: conversations = [], isLoading, error } = useQuery<Conversation[]>({
    queryKey: ["ai", "conversations", searchQuery, moduleFilter, statusFilter],
    queryFn: async () => {
      const response = await apiClient.get("/ai/conversations", {
        params: {
          search: searchQuery,
          module: moduleFilter,
          status: statusFilter,
        },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const { data: selectedConversation } = useQuery<ConversationDetail>({
    queryKey: ["ai", "conversations", selectedId],
    queryFn: async () => {
      const response = await apiClient.get(`/ai/conversations/${selectedId}`);
      return response.data?.data ?? response.data;
    },
    enabled: !!selectedId,
    staleTime: 30 * 1000,
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/ai/conversations/${id}/archive`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
      toast.success("Conversation archived");
      setShowArchiveDialog(false);
      setSelectedId(null);
    },
    onError: () => {
      toast.error("Failed to archive conversation");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/ai/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
      toast.success("Conversation deleted");
      setShowDeleteDialog(false);
      setSelectedId(null);
    },
    onError: () => {
      toast.error("Failed to delete conversation");
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={60} />
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <Skeleton variant="rectangular" height={500} />
            <Skeleton variant="rectangular" height={500} />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Conversation Explorer"
            description="Browse and manage AI conversations"
            icon={<MessageSquare className="size-5" />}
          />
          <Alert variant="danger" title="Failed to load conversations" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Conversation Explorer"
          description="Browse, search, and manage AI conversations"
          icon={<MessageSquare className="size-5" />}
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="max-w-xs"
              />
              <Select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                {moduleOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {conversations.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-7" />}
            title="No conversations yet"
            description="Conversations will appear here when you use AI features."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-2">
              <ScrollArea className="h-[600px]">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedId(conversation.id)}
                    className={cn(
                      "w-full rounded-lg border p-4 text-left transition-colors mb-2",
                      selectedId === conversation.id
                        ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                        : "border-border hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {conversation.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {conversation.module} · {conversation.messageCount} messages
                        </p>
                      </div>
                      <Badge variant={statusVariant[conversation.status] ?? "default"} size="sm">
                        {conversation.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {formatDate(conversation.updatedAt)}
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>

            <div>
              {selectedId && selectedConversation ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedConversation.title}</CardTitle>
                        <CardDescription>
                          {selectedConversation.module} · {formatFullDate(selectedConversation.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Archive className="size-3" />}
                          onClick={() => setShowArchiveDialog(true)}
                        >
                          Archive
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Trash2 className="size-3" />}
                          onClick={() => setShowDeleteDialog(true)}
                          className="border-danger-200 text-danger-600 hover:bg-danger-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Messages</h3>
                      <div className="space-y-3">
                        {selectedConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3 rounded-lg p-3",
                              message.role === "user"
                                ? "bg-brand-50"
                                : "bg-muted/50"
                            )}
                          >
                            <div
                              className={cn(
                                "flex size-7 shrink-0 items-center justify-center rounded-full",
                                message.role === "user"
                                  ? "bg-brand-500 text-white"
                                  : "bg-muted-foreground/20 text-foreground"
                              )}
                            >
                              {message.role === "user" ? (
                                <User className="size-3.5" />
                              ) : (
                                <Bot className="size-3.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium capitalize">
                                  {message.role}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {message.tokens} tokens
                                </span>
                              </div>
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedConversation.artifacts.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-3">
                            Artifacts ({selectedConversation.artifacts.length})
                          </h3>
                          <div className="space-y-2">
                            {selectedConversation.artifacts.map((artifact) => (
                              <div
                                key={artifact.id}
                                className="flex items-center gap-3 rounded-lg border border-border p-3"
                              >
                                <FileText className="size-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{artifact.name}</p>
                                  <p className="text-xs text-muted-foreground">{artifact.type}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(artifact.createdAt)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {Object.keys(selectedConversation.context).length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Context</h3>
                          <pre className="rounded-md border border-border bg-muted/30 p-4 text-xs overflow-auto max-h-40">
                            {JSON.stringify(selectedConversation.context, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex h-[600px] items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Select a conversation to view details
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        <ConfirmationDialog
          open={showArchiveDialog}
          onOpenChange={setShowArchiveDialog}
          title="Archive Conversation"
          description="Archiving this conversation will hide it from the active list."
          confirmLabel="Archive"
          onConfirm={() => selectedId && archiveMutation.mutate(selectedId)}
          loading={archiveMutation.isPending}
          variant="info"
        />

        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Conversation"
          description="This will permanently delete this conversation and all its messages."
          confirmLabel="Delete"
          onConfirm={() => selectedId && deleteMutation.mutate(selectedId)}
          loading={deleteMutation.isPending}
          variant="danger"
        />
      </div>
    </PageContainer>
  );
};
