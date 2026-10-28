import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  LayoutGrid,
  List,
  Building2,
  DollarSign,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { useApplications, useBulkDeleteApplications } from "@/hooks/useCRM";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ApplicationStatus, ApplicationStage } from "@/types/crm";

const statusLabels: Record<ApplicationStatus, { label: string; variant: string }> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "info" },
  interviewing: { label: "Interviewing", variant: "warning" },
  offer: { label: "Offer", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  withdrawn: { label: "Withdrawn", variant: "outline" },
  accepted: { label: "Accepted", variant: "success" },
};

const stageLabels: Record<ApplicationStage, string> = {
  application: "Application",
  screening: "Screening",
  first_round: "First Round",
  second_round: "Second Round",
  final_round: "Final Round",
  offer: "Offer",
  onboarding: "Onboarding",
};

const kanbanColumns: ApplicationStatus[] = ["draft", "submitted", "interviewing", "offer"];

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-3">
          <Skeleton variant="text" className="h-5 w-40" />
          <Skeleton variant="text" className="h-4 w-28" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" className="h-5 w-16 rounded-full" />
            <Skeleton variant="rectangular" className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton variant="text" className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumn({ status, applications }: { status: ApplicationStatus; applications: any[] }) {
  const config = statusLabels[status];

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Badge variant={config.variant as any}>{config.label}</Badge>
        <span className="text-xs text-muted-foreground">{applications.length}</span>
      </div>
      <div className="space-y-3 flex-1">
        {applications.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link to={`/crm/applications/${app.id}`} className="font-medium text-sm hover:underline">
                {app.job_title}
              </Link>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Building2 className="size-3" />
                {app.company}
              </p>
              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className="text-xs">
                  {stageLabels[app.stage]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(app.created_at), "MMM d")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ApplicationListPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: results, isLoading } = useApplications({
    search,
    status: statusFilter,
    stage: stageFilter,
    page,
  });
  const bulkDeleteMutation = useBulkDeleteApplications();

  const applications = results?.items ?? [];
  const totalPages = results?.total_pages ?? 1;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => setSelectedIds([]),
    });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Applications"
          description="Track and manage all your job applications"
          icon={<Briefcase className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/crm/applications/create">New Application</Link>
            </Button>
          }
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="size-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                leftIcon={<Trash2 className="size-4" />}
                onClick={handleBulkDelete}
              >
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>

          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex gap-2 flex-wrap">
                      {(["all", ...Object.keys(statusLabels)] as const).map((s) => (
                        <Button
                          key={s}
                          variant={statusFilter === s ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setStatusFilter(s as ApplicationStatus | "all")}
                        >
                          {s === "all" ? "All" : statusLabels[s as ApplicationStatus].label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Stage</label>
                    <div className="flex gap-2 flex-wrap">
                      {(["all", ...Object.keys(stageLabels)] as const).map((s) => (
                        <Button
                          key={s}
                          variant={stageFilter === s ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setStageFilter(s as ApplicationStage | "all")}
                        >
                          {s === "all" ? "All" : stageLabels[s as ApplicationStage]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
          viewMode === "kanban" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {kanbanColumns.map((col) => (
                <div key={col} className="min-w-[280px]">
                  <Skeleton variant="rectangular" height={400} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )
        ) : applications.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="size-7" />}
            title="No applications found"
            description={search ? "Try adjusting your search or filters." : "Start tracking your job applications."}
            action={
              !search
                ? { label: "New Application", onClick: () => (window.location.href = "/crm/applications/create") }
                : undefined
            }
          />
        ) : viewMode === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={applications.filter((a) => a.status === status)}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <Checkbox
                        checked={selectedIds.includes(app.id)}
                        onCheckedChange={() => toggleSelect(app.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/crm/applications/${app.id}`}
                              className="font-semibold hover:underline"
                            >
                              {app.job_title}
                            </Link>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Building2 className="size-3" />
                              {app.company}
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <Badge variant={statusLabels[app.status]?.variant as any}>
                              {statusLabels[app.status]?.label}
                            </Badge>
                            <Badge variant="outline">
                              {stageLabels[app.stage]}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          {app.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {app.location}
                            </span>
                          )}
                          {app.salary_range && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="size-3" />
                              {app.salary_range}
                            </span>
                          )}
                          <span className="text-xs">
                            Applied {format(new Date(app.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft className="size-4" />}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight className="size-4" />}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
