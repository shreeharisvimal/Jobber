import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, FileText, Lightbulb, Bell, Target, ChevronRight, Plus, AlertTriangle } from "lucide-react";
import {
  useAnalyticsDashboard,
  useAnalyticsInsights,
  useAnalyticsAlerts,
  useAnalyticsRecommendations,
} from "@/hooks/useAnalytics";

export function AnalyticsDashboardPage() {
  const { data: dashboard, isLoading: dashboardLoading } = useAnalyticsDashboard();
  const { data: insights, isLoading: insightsLoading } = useAnalyticsInsights();
  const { data: alerts, isLoading: alertsLoading } = useAnalyticsAlerts();
  const { data: recommendations, isLoading: recommendationsLoading } = useAnalyticsRecommendations();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Analytics & Insights"
          description="Centralized intelligence and reporting"
          icon={<BarChart3 className="size-5" />}
        />

        {dashboardLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Total Dashboards"
                  value={dashboard?.total_dashboards ?? 0}
                  icon={<BarChart3 className="size-4" />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Total Reports"
                  value={dashboard?.total_reports ?? 0}
                  icon={<FileText className="size-4" />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Active Insights"
                  value={dashboard?.active_insights ?? 0}
                  icon={<Lightbulb className="size-4" />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Pending Recommendations"
                  value={dashboard?.pending_recommendations ?? 0}
                  icon={<Target className="size-4" />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Statistic
                  label="Active Alerts"
                  value={dashboard?.active_alerts ?? 0}
                  icon={<Bell className="size-4" />}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
              <CardDescription>Latest intelligence from your data</CardDescription>
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={60} />
                  ))}
                </div>
              ) : insights && insights.length > 0 ? (
                <div className="space-y-3">
                  {insights.slice(0, 5).map((insight) => (
                    <div key={insight.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{insight.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No insights yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Alerts requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={60} />
                  ))}
                </div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{alert.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active alerts</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common analytics tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              Create Dashboard <Plus className="size-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Generate Report <FileText className="size-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              View Insights <Lightbulb className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
