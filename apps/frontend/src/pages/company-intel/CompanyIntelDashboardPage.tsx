import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  FolderOpen,
  Bookmark,
  BarChart3,
  TrendingUp,
  FileText,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyStats } from "@/hooks/useCompanyIntel";
import type { CompanyStats } from "@/types/company-intel";

function SkeletonGrid() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={100} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton variant="rectangular" height={320} />
        <Skeleton variant="rectangular" height={320} />
      </div>
    </>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge variant="secondary">N/A</Badge>;
  if (score >= 80) return <Badge variant="success">{score}</Badge>;
  if (score >= 60) return <Badge variant="info">{score}</Badge>;
  if (score >= 40) return <Badge variant="warning">{score}</Badge>;
  return <Badge variant="danger">{score}</Badge>;
}

export const CompanyIntelDashboardPage: FC = () => {
  const { data: stats, isLoading } = useCompanyStats();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Company Intelligence"
          description="Discover, analyze, and compare companies to make informed career decisions"
          icon={<Building2 className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Search className="size-4" />} asChild>
                <Link to="/company-intel/search">Search Companies</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<FolderOpen className="size-4" />} asChild>
                <Link to="/company-intel/collections">Collections</Link>
              </Button>
              <Button size="sm" leftIcon={<Bookmark className="size-4" />} asChild>
                <Link to="/company-intel/bookmarks">Bookmarks</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Companies"
                    value={stats?.total_companies ?? 0}
                    icon={<Building2 className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Avg Score"
                    value={stats?.average_score ? Math.round(stats.average_score) : "N/A"}
                    icon={<TrendingUp className="size-4" />}
                    trend={stats?.average_score ? (stats.average_score >= 70 ? "up" : "down") : undefined}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Active Analyses"
                    value={stats?.active_analyses ?? 0}
                    icon={<BarChart3 className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Reviews"
                    value={stats?.total_reviews ?? 0}
                    icon={<FileText className="size-4" />}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Companies</CardTitle>
                  <CardDescription>Recently added or updated companies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.company_name}</p>
                            <p className="text-xs text-muted-foreground">{item.action}</p>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No recent activity yet
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intelligence Activity</CardTitle>
                  <CardDescription>Recent updates and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50">
                          <Clock className="size-3 text-brand-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{item.company_name}</span>
                            {" — "}
                            <span className="text-muted-foreground">{item.action}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No intelligence activity yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};
