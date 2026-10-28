import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useInterviews, useBulkDeleteInterviews } from "@/hooks/useInterview";
import { useInterviewStore } from "@/stores/interview.store";
import type {
  InterviewStatus,
  InterviewSessionType,
  InterviewDifficulty,
  InterviewMode,
} from "@/types/interview";

const statusLabels: Record<InterviewStatus, { label: string; variant: string }> = {
  draft: { label: "Draft", variant: "secondary" },
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  completed: { label: "Completed", variant: "info" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const typeLabels: Record<InterviewSessionType, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  coding: "Coding",
  system_design: "System Design",
  case_study: "Case Study",
  leadership: "Leadership",
  hr: "HR",
  mixed: "Mixed",
  custom: "Custom",
};

const difficultyLabels: Record<InterviewDifficulty, { label: string; variant: string }> = {
  easy: { label: "Easy", variant: "success" },
  medium: { label: "Medium", variant: "warning" },
  hard: { label: "Hard", variant: "danger" },
  expert: { label: "Expert", variant: "danger" },
};

const modeLabels: Record<InterviewMode, string> = {
  timed: "Timed",
  untimed: "Untimed",
  simulation: "Simulation",
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

function ScoreDisplay({ score }: { score: number | null }) {
  if (score === null) return <span className="text-sm text-muted-foreground">N/A</span>;
  if (score >= 80) return <span className="text-lg font-bold text-success-600">{score}</span>;
  if (score >= 60) return <span className="text-lg font-bold">{score}</span>;
  if (score >= 40) return <span className="text-lg font-bold text-warning-600">{score}</span>;
  return <span className="text-lg font-bold text-danger-600">{score}</span>;
}

export const InterviewListPage: FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { data: results, isLoading } = useInterviews();
  const bulkDeleteMutation = useBulkDeleteInterviews();
  const filters = useInterviewStore((s) => s.filters);
  const setFilters = useInterviewStore((s) => s.setFilters);
  const selectedIds = useInterviewStore((s) => s.selectedSessionIds);
  const toggleSelection = useInterviewStore((s) => s.toggleSessionSelection);
  const clearSelection = useInterviewStore((s) => s.clearSelection);
  const totalPages = results?.meta?.total_pages ?? 0;

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteMutation.mutate(
      { session_ids: selectedIds, action: "delete" },
      { onSuccess: () => clearSelection() },
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Interview Sessions"
          description="Manage and track all your interview practice sessions"
          icon={<Video className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/interview/create">New Session</Link>
            </Button>
          }
        />

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search interview sessions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                  leftIcon={<Search className="size-4" />}
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
              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 className="size-4" />}
                  onClick={handleBulkDelete}
                  loading={bulkDeleteMutation.isPending}
                >
                  Delete ({selectedIds.length})
                </Button>
              )}
            </div>

            {showFilters && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.status}
                      onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(statusLabels).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.sessionType}
                      onChange={(e) => setFilters({ sessionType: e.target.value, page: 1 })}
                    >
                      <option value="">All Types</option>
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.difficulty}
                      onChange={(e) => setFilters({ difficulty: e.target.value, page: 1 })}
                    >
                      <option value="">All Difficulties</option>
                      {Object.entries(difficultyLabels).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.mode}
                      onChange={(e) => setFilters({ mode: e.target.value, page: 1 })}
                    >
                      <option value="">All Modes</option>
                      {Object.entries(modeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ sortBy: e.target.value })}
                    >
                      <option value="created_at">Sort by Created</option>
                      <option value="updated_at">Sort by Updated</option>
                      <option value="title">Sort by Title</option>
                      <option value="overall_score">Sort by Score</option>
                      <option value="session_type">Sort by Type</option>
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.sortOrder}
                      onChange={(e) => setFilters({ sortOrder: e.target.value })}
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : results?.data && results.data.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {results.meta?.total ?? 0} sessions found
                </p>
                <div className="space-y-4">
                  {results.data.map((session) => (
                    <Card key={session.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="flex gap-4">
                          <div className="flex items-start pt-0.5">
                            <Checkbox
                              checked={selectedIds.includes(session.id)}
                              onCheckedChange={() => toggleSelection(session.id)}
                            />
                          </div>
                          <Link
                            to={`/interview/${session.id}`}
                            className="flex flex-1 gap-4"
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <Video className="size-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-sm font-semibold leading-tight">
                                    {session.title}
                                  </h3>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {typeLabels[session.session_type]} &middot; {difficultyLabels[session.difficulty].label}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <ScoreDisplay score={session.overall_score} />
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge
                                  variant={statusLabels[session.status].variant as "secondary" | "info" | "warning" | "success" | "default" | "outline"}
                                  size="sm"
                                >
                                  {statusLabels[session.status].label}
                                </Badge>
                                <Badge variant="outline" size="sm">{modeLabels[session.mode]}</Badge>
                                {session.total_questions != null && (
                                  <Badge variant="secondary" size="sm">
                                    {session.answered_questions ?? 0}/{session.total_questions} Qs
                                  </Badge>
                                )}
                                <Badge variant="secondary" size="sm">
                                  <Calendar className="mr-1 size-3" />
                                  {new Date(session.created_at).toLocaleDateString()}
                                </Badge>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<ChevronLeft className="size-4" />}
                      disabled={filters.page <= 1}
                      onClick={() => setFilters({ page: filters.page - 1 })}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ChevronRight className="size-4" />}
                      disabled={filters.page >= totalPages}
                      onClick={() => setFilters({ page: filters.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Video className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No interview sessions found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {filters.search ? "Try adjusting your search or filters" : "Create your first session to get started"}
                  </p>
                  {!filters.search && (
                    <Button size="sm" leftIcon={<Plus className="size-4" />} className="mt-4" asChild>
                      <Link to="/interview/create">Create Session</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
