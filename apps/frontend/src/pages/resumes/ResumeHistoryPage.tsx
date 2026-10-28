import { type FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Eye,
  Download,
  Settings,
  FileText,
  ChevronDown,
  ChevronUp,
  GitBranch,
  CheckCircle2,
  Archive,
  ArrowDownUp,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface ResumeHistoryEntry {
  id: string;
  action: "created" | "updated" | "deleted" | "viewed" | "downloaded" | "published" | "archived" | "duplicated" | "restored" | "section_added" | "section_removed" | "settings_changed" | "version_created";
  entity: string;
  entityType: string;
  user: string;
  timestamp: string;
  description: string;
  before?: string;
  after?: string;
}

const actionConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  created: { icon: Plus, color: "text-success-600", label: "Created" },
  updated: { icon: Pencil, color: "text-brand-600", label: "Updated" },
  deleted: { icon: Trash2, color: "text-danger-600", label: "Deleted" },
  viewed: { icon: Eye, color: "text-info-600", label: "Viewed" },
  downloaded: { icon: Download, color: "text-info-600", label: "Downloaded" },
  published: { icon: CheckCircle2, color: "text-success-600", label: "Published" },
  archived: { icon: Archive, color: "text-muted-foreground", label: "Archived" },
  duplicated: { icon: Copy, color: "text-brand-600", label: "Duplicated" },
  restored: { icon: Clock, color: "text-warning-600", label: "Restored" },
  section_added: { icon: Plus, color: "text-success-600", label: "Section Added" },
  section_removed: { icon: Trash2, color: "text-danger-600", label: "Section Removed" },
  settings_changed: { icon: Settings, color: "text-brand-600", label: "Settings Changed" },
  version_created: { icon: GitBranch, color: "text-brand-600", label: "Version Created" },
};

const actionFilters = [
  { value: "all", label: "All Actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
  { value: "published", label: "Published" },
  { value: "version_created", label: "Version Created" },
];

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

export const ResumeHistoryPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actionFilter, setActionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: history = [], isLoading, error } = useQuery<ResumeHistoryEntry[]>({
    queryKey: ["resumes", id, "history", actionFilter, searchQuery],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}/history`, {
        params: { action: actionFilter, search: searchQuery },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
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
            title="Change History"
            description="Track all changes to your resume"
            backHref={`/resumes/${id}`}
          />
          <Alert variant="danger" title="Failed to load history" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Change History"
          description="Track all changes and modifications to your resume"
          backHref={`/resumes/${id}`}
          actions={
            <Button variant="outline" size="sm" leftIcon={<ArrowDownUp className="size-4" />}>
              Export History
            </Button>
          }
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="max-w-xs"
              />
              <Select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                {actionFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </Select>
              <span className="text-xs text-muted-foreground">
                {history.length} {history.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </CardContent>
        </Card>

        {history.length === 0 ? (
          <EmptyState
            icon={<Clock className="size-7" />}
            title="No history yet"
            description="Changes to your resume will appear here."
          />
        ) : (
          <div className="relative space-y-0">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            {history.map((entry) => {
              const config = actionConfig[entry.action] ?? actionConfig.updated!;
              const Icon = config.icon;
              const isExpanded = expandedId === entry.id;
              const hasDiff = entry.before || entry.after;

              return (
                <div key={entry.id} className="relative flex gap-4 pb-4">
                  <div className={cn(
                    "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-background border border-border"
                  )}>
                    <Icon className={cn("size-5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Card>
                      <CardHeader className="py-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" size="sm">{config.label}</Badge>
                              <span className="text-xs text-muted-foreground">{entry.entityType}</span>
                            </div>
                            <CardTitle className="text-sm">{entry.description}</CardTitle>
                            <CardDescription>
                              by {entry.user} - {formatDate(entry.timestamp)}
                            </CardDescription>
                          </div>
                          {hasDiff && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                            >
                              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      {isExpanded && hasDiff && (
                        <CardContent className="pt-0">
                          <Separator className="mb-3" />
                          <div className="grid gap-3 sm:grid-cols-2">
                            {entry.before && (
                              <div className="rounded-md bg-danger-50 p-3">
                                <p className="mb-1 text-[10px] font-medium uppercase text-danger-600">Before</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.before}</p>
                              </div>
                            )}
                            {entry.after && (
                              <div className="rounded-md bg-success-50 p-3">
                                <p className="mb-1 text-[10px] font-medium uppercase text-success-600">After</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.after}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
