import { Link } from "react-router-dom";
import {
  Network,
  Plus,
  Users,
  Calendar,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useNetworkingStats, useNetworkingGoals, useNetworkingUpcomingEvents } from "@/hooks/useCRM";
import { format } from "date-fns";

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

export default function NetworkingDashboardPage() {
  const { data: stats, isLoading } = useNetworkingStats();
  const { data: goals = [] } = useNetworkingGoals();
  const { data: upcomingEvents = [] } = useNetworkingUpcomingEvents();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Networking Hub"
          description="Build and maintain your professional network"
          icon={<Network className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/crm/networking/contacts/create">Add Contact</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Calendar className="size-4" />} asChild>
                <Link to="/crm/networking/events">Events</Link>
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
                    label="Total Contacts"
                    value={stats?.total_contacts ?? 0}
                    icon={<Users className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Events Attended"
                    value={stats?.events_attended ?? 0}
                    icon={<Calendar className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Follow-ups Due"
                    value={stats?.followups_due ?? 0}
                    icon={<Clock className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Connections This Month"
                    value={stats?.connections_this_month ?? 0}
                    icon={<TrendingUp className="size-4" />}
                    trend={stats?.connections_trend}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Networking Goals</CardTitle>
                  <CardDescription>Track your networking targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No goals set. Create networking goals to stay motivated.
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Events</CardTitle>
                  <CardDescription>Networking events on your calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No upcoming events. Add networking events to your calendar.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="text-sm font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/networking/contacts">
                      <Users className="mr-2 size-4" />
                      All Contacts
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/networking/events">
                      <Calendar className="mr-2 size-4" />
                      Manage Events
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/crm/networking/contacts/create">
                      <Plus className="mr-2 size-4" />
                      Add New Contact
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
