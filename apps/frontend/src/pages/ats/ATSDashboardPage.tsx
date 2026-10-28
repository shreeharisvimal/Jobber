import { type FC } from "react";
import { Link } from "react-router-dom";
import { BarChart3, FileSearch, Settings, Activity, FileText, BookOpen, TrendingUp, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { useATSAnalysisStats } from "@/hooks/useATS";

export const ATSDashboardPage: FC = () => {
  const { data: stats, isLoading } = useATSAnalysisStats();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="ATS Intelligence"
          description="Analyze and optimize resumes against job descriptions"
          icon={<FileSearch className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/ats/configuration">Configuration</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<BookOpen className="size-4" />} asChild>
                <Link to="/ats/rules">Rule Library</Link>
              </Button>
              <Button size="sm" leftIcon={<Activity className="size-4" />} asChild>
                <Link to="/ats/analyses">Run Analysis</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Total Analyses"
                  value={stats?.total ?? 0}
                  icon={<BarChart3 className="size-4" />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Average Score"
                  value={stats?.average_score ? `${Math.round(stats.average_score)}%` : "N/A"}
                  icon={<TrendingUp className="size-4" />}
                  trend={stats?.average_score ? (stats.average_score >= 70 ? "up" : "down") : undefined}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Completed"
                  value={stats?.completed ?? 0}
                  icon={<FileText className="size-4" />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Pending / Failed"
                  value={(stats?.pending ?? 0) + (stats?.failed ?? 0)}
                  icon={<Activity className="size-4" />}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common ATS tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/ats/analyses">
                  Run New Analysis <ChevronRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/ats/analyses">
                  View Analysis History <ChevronRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/ats/rules">
                  Manage Rules <ChevronRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/ats/reports">
                  Generate Reports <ChevronRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Grade breakdown of all analyses</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.grade_distribution ? (
                <div className="space-y-2">
                  {Object.entries(stats.grade_distribution).map(([grade, count]) => (
                    <div key={grade} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium">{grade}</span>
                      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(count / Math.max(...Object.values(stats.grade_distribution))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
