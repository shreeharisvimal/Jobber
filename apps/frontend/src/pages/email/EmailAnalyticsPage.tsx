import { BarChart3, Eye, MousePointerClick, Reply, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailStats } from "@/hooks/useEmail";

export default function EmailAnalyticsPage() {
  const { data: stats, isLoading } = useEmailStats();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Email Analytics"
          description="Track your email performance metrics"
          icon={<BarChart3 className="size-5" />}
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-2xl font-bold">{stats?.open_rate ?? 0}%</p>
                  </div>
                  <Eye className="size-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Click Rate</p>
                    <p className="text-2xl font-bold">{stats?.click_rate ?? 0}%</p>
                  </div>
                  <MousePointerClick className="size-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reply Rate</p>
                    <p className="text-2xl font-bold">{stats?.reply_rate ?? 0}%</p>
                  </div>
                  <Reply className="size-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-bold">{stats?.bounce_rate ?? 0}%</p>
                  </div>
                  <AlertTriangle className="size-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-medium">Total Messages</h3>
              {isLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Sent</span><span className="font-medium">{stats?.total_sent ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Delivered</span><span className="font-medium">{stats?.total_delivered ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Opened</span><span className="font-medium">{stats?.total_opened ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Clicked</span><span className="font-medium">{stats?.total_clicked ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Bounced</span><span className="font-medium">{stats?.total_bounced ?? 0}</span></div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-medium">Campaign Performance</h3>
              {isLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Active Campaigns</span><span className="font-medium">{stats?.active_campaigns ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Active Sequences</span><span className="font-medium">{stats?.active_sequences ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Campaigns</span><span className="font-medium">{stats?.total_campaigns ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Templates</span><span className="font-medium">{stats?.total_templates ?? 0}</span></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
