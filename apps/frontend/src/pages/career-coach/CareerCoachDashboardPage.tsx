import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Target, TrendingUp, Lightbulb, AlertTriangle, RefreshCw, ChevronRight } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCareerDashboard,
  useCareerHealthScores,
  useCareerReadinessScores,
  useCareerRecommendations,
  useCareerGoals,
  useCareerSkillGaps,
  useCareerTrends,
  useRunFullAssessment,
  useGenerateRecommendations,
} from "@/hooks/useCareerCoach";
import { ROUTES } from "@/lib/constants";

export function CareerCoachDashboardPage() {
  const { data: dashboard, isLoading: dashboardLoading } = useCareerDashboard();
  const { data: healthScores, isLoading: healthLoading } = useCareerHealthScores();
  const { data: readinessScores, isLoading: readinessLoading } = useCareerReadinessScores();
  const { data: recommendations, isLoading: recsLoading } = useCareerRecommendations();
  const { data: goals, isLoading: goalsLoading } = useCareerGoals();
  const { data: skillGaps, isLoading: gapsLoading } = useCareerSkillGaps();
  const { data: trends, isLoading: trendsLoading } = useCareerTrends();
  const runAssessment = useRunFullAssessment();
  const generateRecs = useGenerateRecommendations();

  const latestHealth = healthScores?.[0]?.score ?? 0;
  const latestReadiness = readinessScores?.[0]?.score ?? 0;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Intelligence"
          description="Your personalized career coaching dashboard"
          icon={<Activity className="size-5" />}
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Target className="size-4" />}
                asChild
              >
                <Link to={ROUTES.CAREER_COACH_ASSESSMENTS}>Assessments</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<TrendingUp className="size-4" />}
                asChild
              >
                <Link to={ROUTES.CAREER_COACH_INSIGHTS}>Insights</Link>
              </Button>
              <Button
                size="sm"
                leftIcon={<Lightbulb className="size-4" />}
                asChild
              >
                <Link to={ROUTES.CAREER_COACH_RECOMMENDATIONS}>Recommendations</Link>
              </Button>
            </>
          }
        />

        {dashboardLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Activity className="size-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className="text-2xl font-bold">{latestHealth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <Target className="size-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Readiness Score</p>
                    <p className="text-2xl font-bold">{latestReadiness}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <TrendingUp className="size-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Goals</p>
                    <p className="text-2xl font-bold">{goals?.length ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <Lightbulb className="size-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recommendations</p>
                    <p className="text-2xl font-bold">{recommendations?.length ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="size-4" />}
            isLoading={runAssessment.isPending}
            onClick={() => runAssessment.mutate()}
          >
            Run Full Assessment
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Lightbulb className="size-4" />}
            isLoading={generateRecs.isPending}
            onClick={() => generateRecs.mutate()}
          >
            Generate Recommendations
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Recommendations</CardTitle>
              <CardDescription>Top 5 active recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {recsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={56} />
                  ))}
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{rec.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {rec.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          rec.priority === "high"
                            ? "destructive"
                            : rec.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="ml-3 shrink-0"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No recommendations yet. Run an assessment to get started.
                </p>
              )}
              {recommendations && recommendations.length > 5 && (
                <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                  <Link to={ROUTES.CAREER_COACH_RECOMMENDATIONS}>
                    View all <ChevronRight className="ml-1 size-3" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
              <CardDescription>Top 5 career goals</CardDescription>
            </CardHeader>
            <CardContent>
              {goalsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={56} />
                  ))}
                </div>
              ) : goals && goals.length > 0 ? (
                <div className="space-y-3">
                  {goals.slice(0, 5).map((goal) => {
                    const pct = goal.progress ?? 0;
                    return (
                      <div key={goal.id} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="truncate text-sm font-medium">{goal.title}</p>
                          <Badge variant={goal.status === "completed" ? "default" : "secondary"}>
                            {goal.status}
                          </Badge>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                        <p className="mt-1 text-xs text-muted-foreground">{pct}%</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No goals yet. Create your first career goal.
                </p>
              )}
              {goals && goals.length > 5 && (
                <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                  <Link to={ROUTES.CAREER_COACH_GOALS}>
                    View all <ChevronRight className="ml-1 size-3" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skill Gaps</CardTitle>
              <CardDescription>Skills that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              {gapsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={32} />
                  ))}
                </div>
              ) : skillGaps && skillGaps.length > 0 ? (
                <div className="space-y-2">
                  {skillGaps.slice(0, 5).map((gap) => (
                    <div
                      key={gap.id}
                      className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                    >
                      <span>{gap.skill_name}</span>
                      <Badge variant="destructive" className="text-xs">
                        Gap: {gap.gap_level}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No skill gaps identified yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Trends</CardTitle>
              <CardDescription>Market trends relevant to you</CardDescription>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={32} />
                  ))}
                </div>
              ) : trends && trends.length > 0 ? (
                <div className="space-y-2">
                  {trends.slice(0, 5).map((trend) => (
                    <div
                      key={trend.id}
                      className="flex items-center gap-2 rounded border px-3 py-2 text-sm"
                    >
                      <TrendingUp className="size-3.5 shrink-0 text-emerald-500" />
                      <span className="truncate">{trend.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No trends available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
