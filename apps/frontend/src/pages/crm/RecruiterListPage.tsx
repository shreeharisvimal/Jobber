import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Grid3X3,
  List,
  Mail,
  Phone,
  Building2,
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
import { useRecruiters, useBulkDeleteRecruiters } from "@/hooks/useCRM";
import { cn } from "@/lib/utils";
import type { RecruiterStatus, RecruiterPriority } from "@/types/crm";

const statusLabels: Record<RecruiterStatus, { label: string; variant: string }> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "secondary" },
  contacted: { label: "Contacted", variant: "info" },
  responding: { label: "Responding", variant: "warning" },
  closed: { label: "Closed", variant: "outline" },
};

const priorityLabels: Record<RecruiterPriority, { label: string; variant: string }> = {
  high: { label: "High", variant: "danger" },
  medium: { label: "Medium", variant: "warning" },
  low: { label: "Low", variant: "secondary" },
};

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Skeleton variant="rectangular" className="size-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-40" />
            <Skeleton variant="text" className="h-4 w-28" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-5 w-16 rounded-full" />
              <Skeleton variant="rectangular" className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton variant="text" className="h-6 w-10 ml-auto" />
            <Skeleton variant="text" className="h-3 w-16 ml-auto mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecruiterListPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecruiterStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<RecruiterPriority | "all">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data: results, isLoading } = useRecruiters({
    search,
    status: statusFilter,
    priority: priorityFilter,
    page,
  });
  const bulkDeleteMutation = useBulkDeleteRecruiters();

  const recruiters = results?.items ?? [];
  const totalPages = results?.total_pages ?? 1;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === recruiters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recruiters.map((r) => r.id));
    }
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
          title="Recruiters"
          description="Manage your recruiter contacts and relationships"
          icon={<Users className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/crm/recruiters/create">Add Recruiter</Link>
            </Button>
          }
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search recruiters..."
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
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="size-4" />
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
                    <div className="flex gap-2">
                      {(["all", ...Object.keys(statusLabels)] as const).map((s) => (
                        <Button
                          key={s}
                          variant={statusFilter === s ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setStatusFilter(s as RecruiterStatus | "all")}
                        >
                          {s === "all" ? "All" : statusLabels[s as RecruiterStatus].label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Priority</label>
                    <div className="flex gap-2">
                      {(["all", ...Object.keys(priorityLabels)] as const).map((p) => (
                        <Button
                          key={p}
                          variant={priorityFilter === p ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setPriorityFilter(p as RecruiterPriority | "all")}
                        >
                          {p === "all" ? "All" : priorityLabels[p as RecruiterPriority].label}
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
          <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recruiters.length === 0 ? (
          <EmptyState
            icon={<Users className="size-7" />}
            title="No recruiters found"
            description={search ? "Try adjusting your search or filters." : "Add your first recruiter to get started."}
            action={
              !search
                ? { label: "Add Recruiter", onClick: () => window.location.href = "/crm/recruiters/create" }
                : undefined
            }
          />
        ) : (
          <>
            <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
              {recruiters.map((recruiter) => (
                <Card key={recruiter.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <Checkbox
                        checked={selectedIds.includes(recruiter.id)}
                        onCheckedChange={() => toggleSelect(recruiter.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/crm/recruiters/${recruiter.id}`}
                              className="font-semibold hover:underline"
                            >
                              {recruiter.name}
                            </Link>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Building2 className="size-3" />
                              {recruiter.company}
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <Badge variant={statusLabels[recruiter.status]?.variant as any}>
                              {statusLabels[recruiter.status]?.label}
                            </Badge>
                            <Badge variant={priorityLabels[recruiter.priority]?.variant as any}>
                              {priorityLabels[recruiter.priority]?.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          {recruiter.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="size-3" />
                              {recruiter.email}
                            </span>
                          )}
                          {recruiter.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="size-3" />
                              {recruiter.phone}
                            </span>
                          )}
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
