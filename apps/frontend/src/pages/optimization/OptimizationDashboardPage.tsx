import { type FC } from "react";
import { Link } from "react-router-dom";
import { Wand2, Plus, BarChart3, FileText, Settings, ChevronRight, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeOptimizationStats, useResumeOptimizationSessions } from "@/hooks/useResumeOptimization";

export const OptimizationDashboardPage: FC = () => {
  const { data: stats, isLoading: statsLoading } = useResumeOptimizationStats();
  const { data: sessions, isLoading: sessionsLoading } = useResumeOptimizationSessions();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Resume Optimization Engine"
          description="AI-powered resume improvements with explainable, reviewable, reversible suggestions"
          icon={<Wand2 className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/optimization/rules">Rules</Link>
              </Button>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/optimization/sessions/new">New Session</Link>
              </Button>
            </>
          }
        />

        {statsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <Statistic label="Total Sessions" value={stats?.total_sessions ?? 0} icon={<BarChart3 className="size-4" />} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic label="Total Suggestions" value={stats?.total_suggestions ?? 0} icon={<FileText className="size-4" />} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic label="Applied" value={stats?.applied_count ?? 0} icon={<TrendingUp className="size-4" />} trend="up" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic label="Avg Confidence" value={stats?.average_confidence ? `${Math.round(stats.average_confidence * 100)}%` : "N/A"} icon={<Wand2 className="size-4" />} />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest optimization sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : sessions?.length ? (
                <div className="space-y-2">
                  {sessions.slice(0, 5).map((session) => (
                    <Link key={session.id} to={`/optimization/sessions/${session.id}`} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.session_type} - {new Date(session.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.status === "completed" ? "success" : session.status === "running" ? "warning" : "default"}>{session.status}</Badge>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No sessions yet. Start a new optimization session.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common optimization tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/optimization/sessions/new">New Optimization Session <ChevronRight className="size-4" /></Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/optimization/sessions">View All Sessions <ChevronRight className="size-4" /></Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/optimization/rules">Manage Rules <ChevronRight className="size-4" /></Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/optimization/history">View History <ChevronRight className="size-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
