import { useParams, Link } from "react-router-dom";
import {
  BarChart3,
  Eye,
  Users,
  Download,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioAnalytics } from "@/hooks/usePortfolio";

export default function PortfolioAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: analytics, isLoading } = usePortfolioAnalytics(id!);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Analytics"
          description="Track views, visitors, and engagement"
          icon={<BarChart3 className="size-5" />}
          actions={
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
              <Link to={`/portfolio/${id}`}>Back</Link>
            </Button>
          }
        />

        {isLoading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={100} />
              ))}
            </div>
            <Skeleton variant="rectangular" height={300} />
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Views"
                    value={analytics?.total_views ?? 0}
                    icon={<Eye className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Unique Visitors"
                    value={analytics?.unique_visitors ?? 0}
                    icon={<Users className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Downloads"
                    value={analytics?.downloads ?? 0}
                    icon={<Download className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Shares"
                    value={analytics?.shares ?? 0}
                    icon={<Share2 className="size-4" />}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Views Over Time</CardTitle>
                <CardDescription>Daily views for the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Chart placeholder</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
