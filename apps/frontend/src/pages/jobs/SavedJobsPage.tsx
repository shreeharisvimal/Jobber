import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Trash2,
  MapPin,
  DollarSign,
  Building2,
  Globe,
  LayoutGrid,
  LayoutList,
  StickyNote,
  FolderInput,
  Check,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";

interface SavedJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string;
  remoteStatus: string;
  source: string;
  priority: "low" | "medium" | "high";
  notes: string;
  collectionId: string | null;
  savedAt: string;
}

const priorityVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  low: "info",
  medium: "warning",
  high: "default",
};

const sortOptions = [
  { value: "savedAt", label: "Date Saved" },
  { value: "priority", label: "Priority" },
  { value: "company", label: "Company" },
  { value: "title", label: "Title" },
];

const filterPriorities = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not specified";
  if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  if (min) return `From $${(min / 1000).toFixed(0)}k`;
  return `Up to $${(max! / 1000).toFixed(0)}k`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
}

export const SavedJobsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("savedAt");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  const { data: savedJobs = [], isLoading, error } = useQuery<SavedJob[]>({
    queryKey: ["jobs", "saved", searchQuery, priorityFilter, sortBy],
    queryFn: async () => {
      const response = await apiClient.get("/jobs/saved", {
        params: { search: searchQuery, priority: priorityFilter, sort: sortBy },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const updatePriorityMutation = useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: string }) => {
      return apiClient.patch(`/jobs/saved/${id}`, { priority });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      toast.success("Priority updated");
    },
    onError: () => {
      toast.error("Failed to update priority");
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiClient.patch(`/jobs/saved/${id}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      setEditingNoteId(null);
      toast.success("Note saved");
    },
    onError: () => {
      toast.error("Failed to save note");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/jobs/saved/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      toast.success("Job removed from saved");
    },
    onError: () => {
      toast.error("Failed to remove job");
    },
  });

  const bulkRemoveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiClient.post("/jobs/saved/bulk-remove", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      setSelectedIds([]);
      toast.success("Selected jobs removed");
    },
    onError: () => {
      toast.error("Failed to remove jobs");
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === savedJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(savedJobs.map((j) => j.id));
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={60} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
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
            title="Saved Jobs"
            description="Manage your saved job opportunities"
          />
          <Alert variant="danger" title="Failed to load saved jobs" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Saved Jobs"
          description="Manage and organize your saved job opportunities"
          actions={
            selectedIds.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 className="size-4" />}
                onClick={() => bulkRemoveMutation.mutate(selectedIds)}
                loading={bulkRemoveMutation.isPending}
              >
                Remove Selected ({selectedIds.length})
              </Button>
            ) : undefined
          }
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved jobs..."
                  className="max-w-xs"
                />
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  {filterPriorities.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </Select>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSelectAll}
                >
                  {selectedIds.length === savedJobs.length ? "Deselect All" : "Select All"}
                </Button>
                <Tooltip content="Grid view">
                  <Button
                    variant={viewMode === "grid" ? "primary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="size-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="List view">
                  <Button
                    variant={viewMode === "list" ? "primary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="size-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {savedJobs.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="size-7" />}
            title="No saved jobs"
            description="Save jobs to keep track of opportunities you're interested in."
            action={{
              label: "Browse Jobs",
              onClick: () => window.location.href = "/jobs",
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((job) => (
              <Card key={job.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(job.id)}
                        onChange={() => toggleSelect(job.id)}
                        className="size-4"
                      />
                      <Link to={`/jobs/${job.jobId}`} className="flex-1">
                        <CardTitle className="text-base hover:underline">{job.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1.5">
                          <Building2 className="size-3" />
                          {job.company}
                        </CardDescription>
                      </Link>
                    </div>
                    <Badge variant={priorityVariant[job.priority] ?? "default"} size="sm">
                      {job.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="size-3" />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <Badge variant="secondary" size="sm">{job.employmentType}</Badge>
                      <Badge variant="secondary" size="sm"><Globe className="mr-1 size-3" />{job.remoteStatus}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Saved {formatDate(job.savedAt)}</span>
                  </div>
                  {editingNoteId === job.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm"
                        placeholder="Add a note..."
                      />
                      <Button
                        size="icon-sm"
                        onClick={() => updateNoteMutation.mutate({ id: job.id, notes: noteValue })}
                      >
                        <Check className="size-3" />
                      </Button>
                    </div>
                  ) : job.notes ? (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setEditingNoteId(job.id);
                        setNoteValue(job.notes);
                      }}
                    >
                      <StickyNote className="size-3" />
                      {job.notes}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground"
                      onClick={() => {
                        setEditingNoteId(job.id);
                        setNoteValue("");
                      }}
                    >
                      <StickyNote className="size-3" />
                      Add note...
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <Select
                      value={job.priority}
                      onChange={(e) => updatePriorityMutation.mutate({ id: job.id, priority: e.target.value })}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      leftIcon={<FolderInput className="size-3" />}
                    />
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => removeMutation.mutate(job.id)}
                      className="border-danger-200 text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {savedJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/50">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(job.id)}
                    onChange={() => toggleSelect(job.id)}
                    className="size-4"
                  />
                  <Link to={`/jobs/${job.jobId}`} className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3" />
                      {job.company}
                    </p>
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {job.location}
                    </span>
                    <Badge variant={priorityVariant[job.priority] ?? "default"} size="sm">{job.priority}</Badge>
                    <Badge variant="secondary" size="sm">{job.source}</Badge>
                    <span>{formatDate(job.savedAt)}</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => removeMutation.mutate(job.id)}
                      className="border-danger-200 text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
