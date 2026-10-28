import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Tag,
  Clock,
  Archive,
  RotateCcw,
  Play,
  Trash2,
  Check,
  X,
  Variable,
  Save,
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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Prompt {
  id: string;
  name: string;
  module: string;
  category: string;
  status: "draft" | "published" | "archived";
  versions: PromptVersion[];
  variables: PromptVariable[];
  description: string;
  updatedAt: string;
  createdAt: string;
}

interface PromptVersion {
  id: string;
  version: number;
  systemPrompt: string;
  userPrompt: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  publishedAt?: string;
}

interface PromptVariable {
  name: string;
  type: "text" | "number" | "boolean";
  defaultValue: string;
  required: boolean;
}


const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  draft: "warning",
  published: "success",
  archived: "default",
};

const modules = [
  { value: "all", label: "All Modules" },
  { value: "resume", label: "Resume" },
  { value: "cover-letter", label: "Cover Letter" },
  { value: "interview", label: "Interview" },
  { value: "career", label: "Career" },
  { value: "skills", label: "Skills" },
  { value: "general", label: "General" },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "generation", label: "Generation" },
  { value: "optimization", label: "Optimization" },
  { value: "analysis", label: "Analysis" },
  { value: "extraction", label: "Extraction" },
  { value: "improvement", label: "Improvement" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export const PromptLibraryPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [testVariables, setTestVariables] = useState<Record<string, string>>({});
  const [newPrompt, setNewPrompt] = useState({
    name: "",
    module: "general",
    category: "generation",
    description: "",
    systemPrompt: "",
    userPrompt: "",
  });

  const { data: prompts = [], isLoading, error } = useQuery<Prompt[]>({
    queryKey: ["ai", "prompts", searchQuery, moduleFilter, categoryFilter],
    queryFn: async () => {
      const response = await apiClient.get("/ai/prompts", {
        params: {
          search: searchQuery,
          module: moduleFilter,
          category: categoryFilter,
        },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

  const createMutation = useMutation({
    mutationFn: async (data: typeof newPrompt) => {
      const response = await apiClient.post("/ai/prompts", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "prompts"] });
      toast.success("Prompt created");
      setIsCreating(false);
      setNewPrompt({
        name: "",
        module: "general",
        category: "generation",
        description: "",
        systemPrompt: "",
        userPrompt: "",
      });
    },
    onError: () => {
      toast.error("Failed to create prompt");
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (promptId: string) => {
      const response = await apiClient.post(`/ai/prompts/${promptId}/publish`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "prompts"] });
      toast.success("Prompt published");
    },
    onError: () => {
      toast.error("Failed to publish prompt");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (promptId: string) => {
      const response = await apiClient.post(`/ai/prompts/${promptId}/archive`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "prompts"] });
      toast.success("Prompt archived");
      setShowArchiveDialog(false);
      setSelectedPromptId(null);
    },
    onError: () => {
      toast.error("Failed to archive prompt");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (promptId: string) => {
      await apiClient.delete(`/ai/prompts/${promptId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "prompts"] });
      toast.success("Prompt deleted");
      setShowDeleteDialog(false);
      setSelectedPromptId(null);
    },
    onError: () => {
      toast.error("Failed to delete prompt");
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: async ({ promptId, versionId }: { promptId: string; versionId: string }) => {
      const response = await apiClient.post(`/ai/prompts/${promptId}/rollback`, { versionId });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "prompts"] });
      toast.success("Rolled back to previous version");
    },
    onError: () => {
      toast.error("Failed to rollback prompt");
    },
  });

  const testMutation = useMutation({
    mutationFn: async ({ promptId, variables }: { promptId: string; variables: Record<string, string> }) => {
      const response = await apiClient.post(`/ai/prompts/${promptId}/test`, { variables });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      toast.success("Test execution complete");
    },
    onError: () => {
      toast.error("Test execution failed");
    },
  });

  const handleCreate = () => {
    if (!newPrompt.name.trim()) {
      toast.error("Prompt name is required");
      return;
    }
    createMutation.mutate(newPrompt);
  };

  const handleTest = () => {
    if (!selectedPrompt) return;
    testMutation.mutate({ promptId: selectedPrompt.id, variables: testVariables });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={60} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={180} />
            ))}
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
            title="Prompt Library"
            description="Manage and organize your AI prompts"
            icon={<FileText className="size-5" />}
          />
          <Alert variant="danger" title="Failed to load prompts" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Prompt Library"
          description="Manage, version, and test your AI prompts"
          icon={<FileText className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => setIsCreating(true)}
            >
              New Prompt
            </Button>
          }
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="max-w-xs"
              />
              <Select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                {modules.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Select>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {isCreating && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create New Prompt</CardTitle>
                  <CardDescription>Define a new prompt template</CardDescription>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setIsCreating(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prompt Name" htmlFor="promptName" required>
                  <Input
                    id="promptName"
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Resume Optimizer"
                  />
                </Field>
                <Field label="Module" htmlFor="promptModule">
                  <Select
                    id="promptModule"
                    value={newPrompt.module}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, module: e.target.value }))}
                  >
                    {modules.filter((m) => m.value !== "all").map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Category" htmlFor="promptCategory">
                  <Select
                    id="promptCategory"
                    value={newPrompt.category}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.filter((c) => c.value !== "all").map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Description" htmlFor="promptDescription">
                  <Input
                    id="promptDescription"
                    value={newPrompt.description}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description..."
                  />
                </Field>
              </div>
              <Field label="System Prompt" htmlFor="systemPrompt">
                <Textarea
                  id="systemPrompt"
                  value={newPrompt.systemPrompt}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  rows={4}
                  placeholder="Enter the system prompt..."
                />
              </Field>
              <Field label="User Prompt" htmlFor="userPrompt">
                <Textarea
                  id="userPrompt"
                  value={newPrompt.userPrompt}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, userPrompt: e.target.value }))}
                  rows={4}
                  placeholder="Enter the user prompt template..."
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button
                  leftIcon={<Save className="size-4" />}
                  onClick={handleCreate}
                  loading={createMutation.isPending}
                >
                  Create Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {prompts.length === 0 && !isCreating ? (
          <EmptyState
            icon={<FileText className="size-7" />}
            title="No prompts yet"
            description="Create your first prompt to start building AI-powered features."
            action={{
              label: "Create Prompt",
              onClick: () => setIsCreating(true),
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => setSelectedPromptId(prompt.id === selectedPromptId ? null : prompt.id)}
                className={cn(
                  "text-left transition-colors",
                  selectedPromptId === prompt.id
                    ? "ring-2 ring-brand-500 rounded-lg"
                    : ""
                )}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{prompt.name}</CardTitle>
                        <CardDescription className="mt-1">{prompt.description}</CardDescription>
                      </div>
                      <Badge variant={statusVariant[prompt.status] ?? "default"} size="sm">
                        {prompt.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" size="sm">{prompt.module}</Badge>
                      <Badge variant="secondary" size="sm">{prompt.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="size-3" />
                        {prompt.versions.length} version{prompt.versions.length !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Variable className="size-3" />
                        {prompt.variables.length} variable{prompt.variables.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      Updated {formatDate(prompt.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}

        {selectedPrompt && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedPrompt.name}</CardTitle>
                  <CardDescription>
                    {selectedPrompt.module} · {selectedPrompt.category}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Check className="size-4" />}
                    onClick={() => publishMutation.mutate(selectedPrompt.id)}
                    loading={publishMutation.isPending}
                  >
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Archive className="size-4" />}
                    onClick={() => setShowArchiveDialog(true)}
                  >
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 className="size-4" />}
                    onClick={() => setShowDeleteDialog(true)}
                    className="border-danger-200 text-danger-600 hover:bg-danger-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Versions</h3>
                  <div className="space-y-2">
                    {selectedPrompt.versions.map((version) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant={statusVariant[version.status] ?? "default"} size="sm">
                            v{version.version}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(version.createdAt)}
                            {version.publishedAt && ` · Published ${formatDate(version.publishedAt)}`}
                          </span>
                        </div>
                        {version.status !== "published" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<RotateCcw className="size-3" />}
                            onClick={() =>
                              rollbackMutation.mutate({
                                promptId: selectedPrompt.id,
                                versionId: version.id,
                              })
                            }
                          >
                            Rollback
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">System Prompt</h3>
                    <div className="rounded-md border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                      {selectedPrompt.versions.find((v) => v.status === "published")?.systemPrompt ??
                        selectedPrompt.versions[selectedPrompt.versions.length - 1]?.systemPrompt ??
                        "No system prompt defined"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">User Prompt</h3>
                    <div className="rounded-md border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                      {selectedPrompt.versions.find((v) => v.status === "published")?.userPrompt ??
                        selectedPrompt.versions[selectedPrompt.versions.length - 1]?.userPrompt ??
                        "No user prompt defined"}
                    </div>
                  </div>
                </div>

                {selectedPrompt.variables.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Variables</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {selectedPrompt.variables.map((variable) => (
                          <Field key={variable.name} label={variable.name} htmlFor={`var-${variable.name}`}>
                            <Input
                              id={`var-${variable.name}`}
                              value={testVariables[variable.name] ?? variable.defaultValue}
                              onChange={(e) =>
                                setTestVariables((prev) => ({
                                  ...prev,
                                  [variable.name]: e.target.value,
                                }))
                              }
                              placeholder={`${variable.type}${variable.required ? " (required)" : ""}`}
                            />
                          </Field>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Test Execution</h3>
                  <Button
                    size="sm"
                    leftIcon={<Play className="size-4" />}
                    onClick={handleTest}
                    loading={testMutation.isPending}
                  >
                    Run Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Prompt"
          description="This will permanently delete this prompt and all its versions. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => selectedPrompt && deleteMutation.mutate(selectedPrompt.id)}
          loading={deleteMutation.isPending}
          variant="danger"
        />

        <ConfirmationDialog
          open={showArchiveDialog}
          onOpenChange={setShowArchiveDialog}
          title="Archive Prompt"
          description="Archiving this prompt will make it unavailable for new executions."
          confirmLabel="Archive"
          onConfirm={() => selectedPrompt && archiveMutation.mutate(selectedPrompt.id)}
          loading={archiveMutation.isPending}
          variant="info"
        />
      </div>
    </PageContainer>
  );
};
