import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Layout,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoverLetterStats } from "@/hooks/useCoverLetter";

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

export const CoverLetterDashboardPage: FC = () => {
  const { data: stats, isLoading } = useCoverLetterStats();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Cover Letter Intelligence"
          description="Generate, optimize, and manage AI-powered cover letters tailored to each opportunity"
          icon={<FileText className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/cover-letter/generate">Create New</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Layout className="size-4" />} asChild>
                <Link to="/cover-letter/templates">Templates</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/cover-letter/settings">Settings</Link>
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
                    label="Total Cover Letters"
                    value={stats?.total_letters ?? 0}
                    icon={<FileText className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Generated"
                    value={stats?.generated_count ?? 0}
                    icon={<Sparkles className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Approved"
                    value={stats?.approved_count ?? 0}
                    icon={<CheckCircle className="size-4" />}
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
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cover Letters</CardTitle>
                  <CardDescription>Your most recently edited cover letters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileText className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.description ?? "Cover Letter"}</p>
                            <p className="text-xs text-muted-foreground">{item.event_type}</p>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No cover letters yet. Create your first one!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started quickly with common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Sparkles className="size-4" />} asChild>
                    <Link to="/cover-letter/generate">Generate New Cover Letter</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Layout className="size-4" />} asChild>
                    <Link to="/cover-letter/templates">Browse Templates</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Settings className="size-4" />} asChild>
                    <Link to="/cover-letter/settings">View Settings</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<FileText className="size-4" />} asChild>
                    <Link to="/cover-letter">View All Cover Letters</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>Recent updates and activity</CardDescription>
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
                            <span className="text-muted-foreground">{item.description ?? item.event_type}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No activity yet
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tone Distribution</CardTitle>
                  <CardDescription>How your cover letters are styled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats?.tone_distribution && Object.keys(stats.tone_distribution).length > 0 ? (
                    Object.entries(stats.tone_distribution).map(([tone, count]) => (
                      <div key={tone} className="flex items-center justify-between">
                        <Badge variant="secondary" size="sm">{tone}</Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No tone data available yet
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
