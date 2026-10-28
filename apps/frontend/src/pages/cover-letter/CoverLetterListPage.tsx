import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoverLetters } from "@/hooks/useCoverLetter";
import { useCoverLetterStore } from "@/stores/cover-letter.store";
import type { CoverLetterStatus, CoverLetterTone } from "@/types/cover-letter";

const statusLabels: Record<CoverLetterStatus, { label: string; variant: string }> = {
  draft: { label: "Draft", variant: "secondary" },
  generated: { label: "Generated", variant: "info" },
  reviewing: { label: "Reviewing", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  submitted: { label: "Submitted", variant: "default" },
  archived: { label: "Archived", variant: "outline" },
};

const toneLabels: Record<CoverLetterTone, string> = {
  professional: "Professional",
  casual: "Casual",
  enthusiastic: "Enthusiastic",
  formal: "Formal",
  creative: "Creative",
  confident: "Confident",
  humble: "Humble",
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

export const CoverLetterListPage: FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { data: results, isLoading } = useCoverLetters();
  const filters = useCoverLetterStore((s) => s.filters);
  const setFilters = useCoverLetterStore((s) => s.setFilters);
  const totalPages = results?.total_pages ?? 0;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Cover Letters"
          description="Manage and organize all your cover letters"
          icon={<FileText className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/cover-letter/generate">New Cover Letter</Link>
            </Button>
          }
        />

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search cover letters..."
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
            </div>

            {showFilters && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.status ?? ""}
                      onChange={(e) => setFilters({ status: (e.target.value || null) as CoverLetterStatus | null, page: 1 })}
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(statusLabels).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.tone ?? ""}
                      onChange={(e) => setFilters({ tone: (e.target.value || null) as CoverLetterTone | null, page: 1 })}
                    >
                      <option value="">All Tones</option>
                      {Object.entries(toneLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="Min score"
                      type="number"
                      className="w-24"
                      value={filters.min_score ?? ""}
                      onChange={(e) =>
                        setFilters({ min_score: e.target.value ? Number(e.target.value) : null, page: 1 })
                      }
                    />
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.sort_by}
                      onChange={(e) => setFilters({ sort_by: e.target.value })}
                    >
                      <option value="updated_at">Sort by Last Updated</option>
                      <option value="created_at">Sort by Created</option>
                      <option value="overall_score">Sort by Score</option>
                      <option value="title">Sort by Title</option>
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
                  {results.total} cover letters found
                </p>
                <div className="space-y-4">
                  {results.data.map((letter) => (
                    <Card key={letter.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <Link
                          to={`/cover-letter/${letter.id}`}
                          className="flex gap-4"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileText className="size-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold leading-tight">
                                  {letter.title}
                                </h3>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {letter.job_title} at {letter.company_name}
                                </p>
                              </div>
                              <div className="text-right">
                                <ScoreDisplay score={letter.overall_score} />
                                <p className="text-xs text-muted-foreground">
                                  v{letter.version}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <Badge
                                variant={statusLabels[letter.status].variant as "secondary" | "info" | "warning" | "success" | "default" | "outline"}
                                size="sm"
                              >
                                {statusLabels[letter.status].label}
                              </Badge>
                              <Badge variant="outline" size="sm">{toneLabels[letter.tone]}</Badge>
                              <Badge variant="secondary" size="sm">{letter.word_count} words</Badge>
                              {letter.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        </Link>
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
                  <FileText className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No cover letters found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {filters.search ? "Try adjusting your search or filters" : "Create your first cover letter to get started"}
                  </p>
                  {!filters.search && (
                    <Button size="sm" leftIcon={<Plus className="size-4" />} className="mt-4" asChild>
                      <Link to="/cover-letter/generate">Create Cover Letter</Link>
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
