import { type FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Plus,
  RotateCcw,
  GitBranch,
  CheckCircle2,
  Archive,
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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ResumeVersion {
  id: string;
  versionNumber: number;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  changeSummary: string;
  isCurrent: boolean;
  changes: {
    added: number;
    modified: number;
    removed: number;
  };
}

interface VersionFormData {
  title: string;
  changeSummary: string;
}

const emptyForm: VersionFormData = {
  title: "",
  changeSummary: "",
};

const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  draft: "warning",
  published: "success",
  archived: "default",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const ResumeVersionsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showForkForm, setShowForkForm] = useState<string | null>(null);
  const [form, setForm] = useState<VersionFormData>(emptyForm);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const { data: versions = [], isLoading, error } = useQuery<ResumeVersion[]>({
    queryKey: ["resumes", id, "versions"],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}/versions`);
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const createVersionMutation = useMutation({
    mutationFn: async (data: VersionFormData) => {
      const response = await apiClient.post(`/resumes/${id}/versions`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "versions"] });
      toast.success("Version created");
      setShowCreateForm(false);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });

  const restoreVersionMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const response = await apiClient.post(`/resumes/${id}/versions/${versionId}/restore`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "versions"] });
      toast.success("Version restored");
      setRestoringId(null);
    },
    onError: () => {
      toast.error("Failed to restore version");
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const response = await apiClient.put(`/resumes/${id}/versions/${versionId}`, { status: "published" });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "versions"] });
      toast.success("Version published");
    },
    onError: () => {
      toast.error("Failed to publish version");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const response = await apiClient.put(`/resumes/${id}/versions/${versionId}`, { status: "archived" });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "versions"] });
      toast.success("Version archived");
    },
    onError: () => {
      toast.error("Failed to archive version");
    },
  });

  const forkVersionMutation = useMutation({
    mutationFn: async ({ versionId, data }: { versionId: string; data: VersionFormData }) => {
      const response = await apiClient.post(`/resumes/${id}/versions/${versionId}/fork`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "versions"] });
      toast.success("Version forked");
      setShowForkForm(null);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to fork version");
    },
  });

  const handleCreateVersion = () => {
    createVersionMutation.mutate(form);
  };

  const handleForkVersion = () => {
    if (showForkForm) {
      forkVersionMutation.mutate({ versionId: showForkForm, data: form });
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={140} />
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
            title="Version History"
            description="Track and manage resume versions"
            backHref={`/resumes/${id}`}
          />
          <Alert variant="danger" title="Failed to load versions" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Version History"
          description="Track and manage all versions of your resume"
          backHref={`/resumes/${id}`}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setShowCreateForm(true);
                setForm(emptyForm);
              }}
            >
              Create Version
            </Button>
          }
        />

        {versions.length === 0 && !showCreateForm ? (
          <EmptyState
            icon={<Clock className="size-7" />}
            title="No versions yet"
            description="Create your first version to start tracking changes."
            action={{
              label: "Create Version",
              onClick: () => {
                setShowCreateForm(true);
                setForm(emptyForm);
              },
            }}
          />
        ) : (
          <div className="relative space-y-0">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            {showCreateForm && (
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Plus className="size-5" />
                </div>
                <div className="flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Version</CardTitle>
                      <CardDescription>
                        Create a snapshot of the current resume state
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Field label="Version Title" htmlFor="versionTitle">
                        <Input
                          id="versionTitle"
                          value={form.title}
                          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                          placeholder="e.g., v2.0 - Full stack focus"
                        />
                      </Field>
                      <Field label="Change Summary" htmlFor="changeSummary">
                        <Textarea
                          id="changeSummary"
                          value={form.changeSummary}
                          onChange={(e) => setForm((p) => ({ ...p, changeSummary: e.target.value }))}
                          placeholder="Describe what changed..."
                          rows={3}
                        />
                      </Field>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button onClick={handleCreateVersion} loading={createVersionMutation.isPending}>
                        Create Version
                      </Button>
                      <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}

            {versions.map((version) => (
              <div key={version.id} className="relative flex gap-4 pb-6">
                <div
                  className={cn(
                    "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full",
                    version.isCurrent
                      ? "bg-brand-50 text-brand-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {version.isCurrent ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </div>
                <div className="flex-1">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {version.title}
                            {version.isCurrent && (
                              <Badge variant="brand" size="sm" className="ml-2">
                                Current
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Version {version.versionNumber} - {formatDate(version.createdAt)}
                          </CardDescription>
                        </div>
                        <Badge variant={statusVariant[version.status] ?? "default"} size="sm">
                          {version.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {version.changeSummary && (
                        <p className="text-sm text-muted-foreground">{version.changeSummary}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="text-success-600">+{version.changes.added} added</span>
                        <span className="text-warning-600">~{version.changes.modified} modified</span>
                        <span className="text-danger-600">-{version.changes.removed} removed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!version.isCurrent && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<RotateCcw className="size-3" />}
                              onClick={() => setRestoringId(version.id)}
                            >
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<GitBranch className="size-3" />}
                              onClick={() => {
                                setShowForkForm(version.id);
                                setForm(emptyForm);
                              }}
                            >
                              Fork
                            </Button>
                          </>
                        )}
                        {version.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<CheckCircle2 className="size-3" />}
                            onClick={() => publishMutation.mutate(version.id)}
                          >
                            Publish
                          </Button>
                        )}
                        {version.status === "published" && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Archive className="size-3" />}
                            onClick={() => archiveMutation.mutate(version.id)}
                          >
                            Archive
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmationDialog
          open={!!restoringId}
          onOpenChange={(open) => !open && setRestoringId(null)}
          title="Restore Version"
          description="This will replace the current resume content with the selected version. A new version will be created automatically."
          confirmLabel="Restore"
          onConfirm={() => restoringId && restoreVersionMutation.mutate(restoringId)}
          loading={restoreVersionMutation.isPending}
        />

        {showForkForm && (
          <Card>
            <CardHeader>
              <CardTitle>Fork Version</CardTitle>
              <CardDescription>Create a new version based on this version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Version Title" htmlFor="forkTitle">
                <Input
                  id="forkTitle"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Fork from v1.0"
                />
              </Field>
              <Field label="Change Summary" htmlFor="forkSummary">
                <Textarea
                  id="forkSummary"
                  value={form.changeSummary}
                  onChange={(e) => setForm((p) => ({ ...p, changeSummary: e.target.value }))}
                  placeholder="Describe this fork..."
                  rows={3}
                />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleForkVersion} loading={forkVersionMutation.isPending}>
                Fork Version
              </Button>
              <Button variant="ghost" onClick={() => setShowForkForm(null)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
