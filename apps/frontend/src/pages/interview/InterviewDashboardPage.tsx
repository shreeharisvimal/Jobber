import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Plus,
  BarChart3,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  Flame,
  Play,
  Target,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useInterviewStats, useInterviewRecommendations, useInterviewGoals } from "@/hooks/useInterview";

function SkeletonGrid() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
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

export const InterviewDashboardPage: FC = () => {
  const { data: stats, isLoading } = useInterviewStats();
  const { data: recommendations = [] } = useInterviewRecommendations();
  const { data: goals = [] } = useInterviewGoals();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Interview Intelligence"
          description="Practice, evaluate, and master your interview skills with AI-powered coaching"
          icon={<Video className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/interview/create">New Session</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<BookOpen className="size-4" />} asChild>
                <Link to="/interview/analytics">Analytics</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/interview/settings">Settings</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Sessions"
                    value={stats?.total_sessions ?? 0}
                    icon={<Video className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Completed"
                    value={stats?.completed_sessions ?? 0}
                    icon={<CheckCircle className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Avg Score"
                    value={stats?.avg_score ? Math.round(stats.avg_score) : "N/A"}
                    icon={<TrendingUp className="size-4" />}
                    trend={stats?.avg_score ? (stats.avg_score >= 70 ? "up" : "down") : undefined}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Practice Time"
                    value={`${stats?.total_practice_minutes ?? 0}m`}
                    icon={<Clock className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Streak"
                    value={`${stats?.streak_days ?? 0}d`}
                    icon={<Flame className="size-4" />}
                    trend={stats?.streak_days && stats.streak_days > 0 ? "up" : undefined}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Plus className="size-4" />} asChild>
                    <Link to="/interview/create">Start New Interview Session</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Play className="size-4" />} asChild>
                    <Link to="/interview">Continue Practice</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<BarChart3 className="size-4" />} asChild>
                    <Link to="/interview/analytics">View Analytics</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Target className="size-4" />} asChild>
                    <Link to="/interview/templates">Browse Templates</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Chart</CardTitle>
                  <CardDescription>Your interview performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Readiness</span>
                      <span className="font-medium">{stats?.avg_score ?? 0}%</span>
                    </div>
                    <Progress value={stats?.avg_score ?? 0} variant={((stats?.avg_score ?? 0) >= 70 ? "success" : (stats?.avg_score ?? 0) >= 40 ? "warning" : "danger") as "default" | "success" | "warning" | "danger"} />
                    <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sessions this week</p>
                        <p className="font-semibold">{stats?.completed_sessions ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current streak</p>
                        <p className="font-semibold">{stats?.streak_days ?? 0} days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>AI-suggested next steps for improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.length > 0 ? (
                    recommendations.slice(0, 4).map((rec) => (
                      <div key={rec.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Target className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{rec.title ?? "Recommendation"}</p>
                            <p className="text-xs text-muted-foreground">{rec.description ?? rec.recommendation_type}</p>
                          </div>
                        </div>
                        <Badge variant={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "secondary"} size="sm">
                          {rec.priority ?? "low"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No recommendations yet. Complete a session to get personalized tips!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals Progress</CardTitle>
                  <CardDescription>Track your interview preparation goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {goals.length > 0 ? (
                    goals.slice(0, 4).map((goal) => (
                      <div key={goal.id} className="space-y-2 rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{goal.title}</p>
                          <Badge variant={goal.status === "completed" ? "success" : goal.status === "active" ? "info" : "outline"} size="sm">
                            {goal.status}
                          </Badge>
                        </div>
                        {goal.target_value != null && (
                          <Progress value={(goal.current_value / goal.target_value) * 100} size="sm" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No goals set yet. Create a goal to track your progress!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interview sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Complete your first interview session to see activity here
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
};
