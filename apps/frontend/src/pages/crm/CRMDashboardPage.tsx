import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  CheckSquare,
  Network,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight,
  Activity,
  Target,
  Star,
  Settings,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useCRMStats, useCRMActivity, useCRMGoals } from "@/hooks/useCRM";
import type { CRMActivity } from "@/types/crm";

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

function ActivityItem({ activity }: { activity: CRMActivity }) {
  const iconMap: Record<string, React.ReactNode> = {
    recruiter: <Users className="size-4" />,
    application: <Briefcase className="size-4" />,
    task: <CheckSquare className="size-4" />,
    networking: <Network className="size-4" />,
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        {iconMap[activity.type] ?? <Activity className="size-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{activity.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
      </div>
      <Badge variant="outline" className="shrink-0">
        {activity.type}
      </Badge>
    </div>
  );
}

export default function CRMDashboardPage() {
  const { data: stats, isLoading } = useCRMStats();
  const { data: activity = [] } = useCRMActivity();
  const { data: goals = [] } = useCRMGoals();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="CRM Dashboard"
          description="Manage your recruiters, applications, and networking contacts"
          icon={<Briefcase className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/crm/applications/create">New Application</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Network className="size-4" />} asChild>
                <Link to="/crm/networking">Networking</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/crm/settings">Settings</Link>
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
                    label="Total Recruiters"
                    value={stats?.total_recruiters ?? 0}
                    icon={<Users className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Applications"
                    value={stats?.total_applications ?? 0}
                    icon={<Briefcase className="size-4" />}
                    trend={stats?.applications_trend}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Pending Tasks"
                    value={stats?.pending_tasks ?? 0}
                    icon={<CheckSquare className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Networking Contacts"
                    value={stats?.networking_contacts ?? 0}
                    icon={<Network className="size-4" />}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>Your latest CRM updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No recent activity yet. Start by adding a recruiter or application.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {activity.slice(0, 8).map((item) => (
                        <ActivityItem key={item.id} activity={item} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Goals & Progress</CardTitle>
                  <CardDescription>Track your job search goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No goals set. Create goals to track your progress.
                    </p>
                  ) : (
                    goals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{goal.title}</span>
                          <span className="text-muted-foreground">
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Common tasks to keep your job search on track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/recruiters">
                      <Users className="mr-2 size-4" />
                      View Recruiters
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/applications">
                      <Briefcase className="mr-2 size-4" />
                      All Applications
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/referrals">
                      <Star className="mr-2 size-4" />
                      Manage Referrals
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/networking">
                      <Network className="mr-2 size-4" />
                      Networking Hub
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
