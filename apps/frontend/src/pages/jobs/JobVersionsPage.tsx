import { type FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  History,
  RotateCcw,
  Plus,
  Clock,
  GitCompare,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";

interface JobVersion {
  id: string;
  version: number;
  snapshot: Record<string, unknown>;
  createdAt: string;
  label?: string;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export const JobVersionsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const { data: versions = [], isLoading, error } = useQuery<JobVersion[]>({
    queryKey: ["jobs", id, "versions"],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${id}/versions`);
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const createVersionMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post(`/jobs/${id}/versions`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "versions"] });
      toast.success("Version created");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });

  const restoreVersionMutation = useMutation({
    mutationFn: async (versionId: string) => {
      return apiClient.post(`/jobs/${id}/versions/${versionId}/restore`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "versions"] });
      toast.success("Version restored");
    },
    onError: () => {
      toast.error("Failed to restore version");
    },
  });

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const compareVersion = versions.find((v) => v.id === compareVersionId);

  const getDiffKeys = (a: Record<string, unknown>, b: Record<string, unknown>): string[] => {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return Array.from(allKeys).filter((key) => JSON.stringify(a[key]) !== JSON.stringify(b[key]));
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={400} />
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
            description="View and manage job versions"
            backHref={id ? `/jobs/${id}` : "/jobs"}
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
          description="View and manage job data versions"
          backHref={id ? `/jobs/${id}` : "/jobs"}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => createVersionMutation.mutate()}
              loading={createVersionMutation.isPending}
            >
              Create Version
            </Button>
          }
        />

        {versions.length === 0 ? (
          <EmptyState
            icon={<History className="size-7" />}
            title="No versions yet"
            description="Create a version to capture the current state of this job."
            action={{
              label: "Create Version",
              onClick: () => createVersionMutation.mutate(),
            }}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Versions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border max-h-[600px] overflow-auto">
                  {versions.map((version) => {
                    const isSelected = selectedVersionId === version.id;
                    const isCompare = compareVersionId === version.id;
                    return (
                      <div
                        key={version.id}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 transition-colors",
                          isSelected ? "bg-brand-50" : "hover:bg-accent/50",
                          isCompare && "bg-accent/30"
                        )}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-3 text-left flex-1"
                          onClick={() => setSelectedVersionId(version.id)}
                        >
                          <Badge variant={isSelected ? "brand" : "secondary"} size="sm">
                            v{version.version}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {version.label ?? `Version ${version.version}`}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatDate(version.createdAt)}
                            </p>
                          </div>
                        </button>
                        <div className="flex items-center gap-1 ml-2">
                          {isSelected && selectedVersionId !== compareVersionId && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setCompareVersionId(version.id);
                                setIsComparing(true);
                              }}
                            >
                              <GitCompare className="size-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {selectedVersion ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {selectedVersion.label ?? `Version ${selectedVersion.version}`}
                      </h3>
                      <Badge variant="info" size="sm">v{selectedVersion.version}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<RotateCcw className="size-4" />}
                      onClick={() => restoreVersionMutation.mutate(selectedVersion.id)}
                      loading={restoreVersionMutation.isPending}
                    >
                      Restore This Version
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Snapshot Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(selectedVersion.snapshot).map(([key, value]) => (
                          <div key={key} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                            <span className="text-sm font-medium text-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-sm text-muted-foreground text-right max-w-[60%] break-words">
                              {renderValue(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {isComparing && compareVersion && selectedVersionId !== compareVersionId && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Comparison</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="info" size="sm">v{selectedVersion.version}</Badge>
                          <span className="text-muted-foreground">vs</span>
                          <Badge variant="secondary" size="sm">v{compareVersion.version}</Badge>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              setIsComparing(false);
                              setCompareVersionId(null);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {getDiffKeys(selectedVersion.snapshot, compareVersion.snapshot).map((key) => (
                            <div key={key} className="rounded-lg border border-border p-3 space-y-2">
                              <p className="text-sm font-medium text-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                <div className="rounded bg-danger-50 p-2">
                                  <p className="text-xs font-semibold text-danger-600 mb-1">v{compareVersion.version}</p>
                                  <p className="text-sm text-muted-foreground break-words">{renderValue(compareVersion.snapshot[key])}</p>
                                </div>
                                <div className="rounded bg-success-50 p-2">
                                  <p className="text-xs font-semibold text-success-600 mb-1">v{selectedVersion.version}</p>
                                  <p className="text-sm text-muted-foreground break-words">{renderValue(selectedVersion.snapshot[key])}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {getDiffKeys(selectedVersion.snapshot, compareVersion.snapshot).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No differences found</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <History className="mb-3 size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Select a version to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
