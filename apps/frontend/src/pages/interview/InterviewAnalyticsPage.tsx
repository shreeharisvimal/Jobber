import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Flame,
  Target,
  CheckCircle,
  Video,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useInterviewStats, useInterviewAnalytics, useInterviewProgress } from "@/hooks/useInterview";

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const value = score ?? 0;
  const variant = value >= 80 ? "success" : value >= 60 ? "default" : value >= 40 ? "warning" : "danger";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score !== null ? `${score}` : "N/A"}</span>
      </div>
      <Progress value={value} variant={variant as "default" | "success" | "warning" | "danger"} size="sm" />
    </div>
  );
}

export const InterviewAnalyticsPage: FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useInterviewStats();
  const { data: analytics, isLoading: isLoadingAnalytics } = useInterviewAnalytics();
  const { data: progress, isLoading: isLoadingProgress } = useInterviewProgress();

  const isLoading = isLoadingStats || isLoadingAnalytics || isLoadingProgress;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Interview Analytics"
          description="Track your progress, identify strengths, and improve weak areas"
          icon={<BarChart3 className="size-5" />}
          actions={
            <Button variant="outline" size="sm" leftIcon={<Video className="size-4" />} asChild>
              <Link to="/interview">Back to Sessions</Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={100} />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton variant="rectangular" height={300} />
              <Skeleton variant="rectangular" height={300} />
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Video className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-2xl font-bold">{stats?.total_sessions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-2xl font-bold">{stats?.completed_sessions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-2xl font-bold">{stats?.avg_score ? Math.round(stats.avg_score) : "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-2xl font-bold">{analytics?.practice_time_minutes ?? stats?.total_practice_minutes ?? 0}m</p>
                  <p className="text-xs text-muted-foreground">Practice Time</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Score Trends</CardTitle>
                  <CardDescription>Your performance over recent sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.score_trend && analytics.score_trend.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.score_trend.slice(-10).map((score, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-20">Session {i + 1}</span>
                          <Progress value={score} size="sm" className="flex-1" />
                          <span className="text-xs font-medium w-8">{score}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <TrendingUp className="size-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">No score data yet. Complete sessions to see trends.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Practice Streak</CardTitle>
                  <CardDescription>Keep your momentum going</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-brand-50">
                      <Flame className="size-7 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{analytics?.streak_days ?? stats?.streak_days ?? 0}</p>
                      <p className="text-sm text-muted-foreground">day streak</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Practice</p>
                      <p className="font-medium">{analytics?.last_practice_date ? new Date(analytics.last_practice_date).toLocaleDateString() : "Never"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Improvement Rate</p>
                      <p className="font-medium">{analytics?.improvement_trend ? `${analytics.improvement_trend.length}%` : "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Category Performance</CardTitle>
                  <CardDescription>Your scores by interview category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ScoreBar label="Overall" score={analytics?.avg_overall_score ?? stats?.avg_score ?? null} />
                  <ScoreBar label="Technical" score={analytics?.avg_technical_score ?? null} />
                  <ScoreBar label="Communication" score={analytics?.avg_communication_score ?? null} />
                  <ScoreBar label="Confidence" score={analytics?.avg_confidence_score ?? null} />
                  <ScoreBar label="Readiness" score={analytics?.avg_readiness_score ?? null} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Strongest & Weakest Areas</CardTitle>
                  <CardDescription>Focus your practice on what matters most</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics?.strongest_categories && analytics.strongest_categories.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-success-600 mb-2 flex items-center gap-1">
                        <ArrowUpRight className="size-4" /> Strongest Areas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analytics.strongest_categories.map((cat) => (
                          <Badge key={cat} variant="success" size="sm">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {analytics?.weakest_categories && analytics.weakest_categories.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-danger-600 mb-2 flex items-center gap-1">
                        <ArrowDownRight className="size-4" /> Areas to Improve
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analytics.weakest_categories.map((cat) => (
                          <Badge key={cat} variant="danger" size="sm">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {(!analytics?.strongest_categories || analytics.strongest_categories.length === 0) &&
                   (!analytics?.weakest_categories || analytics.weakest_categories.length === 0) && (
                    <div className="flex flex-col items-center py-8 text-center">
                      <Target className="size-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">Complete more sessions to identify your strengths and weaknesses.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Progress Overview</CardTitle>
                  <CardDescription>Your overall interview readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Readiness</span>
                    <span className="font-medium">{analytics?.avg_overall_score ?? stats?.avg_score ?? 0}%</span>
                  </div>
                  <Progress value={analytics?.avg_overall_score ?? stats?.avg_score ?? 0} variant={((analytics?.avg_overall_score ?? stats?.avg_score ?? 0) >= 70 ? "success" : "warning") as "default" | "success" | "warning"} />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Questions Answered</p>
                      <p className="font-semibold">{analytics?.total_questions_answered ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Sessions</p>
                      <p className="font-semibold">{analytics?.total_sessions ?? stats?.total_sessions ?? 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Session Type Distribution</CardTitle>
                  <CardDescription>Types of sessions you practice most</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.top_topics && analytics.top_topics.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.top_topics.map((topic, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Badge variant="secondary" size="sm">{topic}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <BookOpen className="size-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">No topic data available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Weekly Progress</CardTitle>
                <CardDescription>Your progress milestones</CardDescription>
              </CardHeader>
              <CardContent>
                {progress?.weekly_goals && progress.weekly_goals.length > 0 ? (
                  <div className="space-y-2">
                    {progress.weekly_goals.map((goal, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm">{String(goal)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <BookOpen className="size-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No weekly goals set yet. Start practicing to build your streak!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
};


