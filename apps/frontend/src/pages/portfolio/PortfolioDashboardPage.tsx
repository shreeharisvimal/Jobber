import { Link } from "react-router-dom";
import {
  Globe,
  Plus,
  Layout,
  Eye,
  FileText,
  ArrowRight,
  Settings,
  Palette,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioStats, usePortfolios } from "@/hooks/usePortfolio";

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

function PortfolioItem({ portfolio }: { portfolio: Record<string, unknown> }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <Globe className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {portfolio.name}
          </p>
          <Badge variant={portfolio.status === "published" ? "default" : "secondary"}>
            {portfolio.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {portfolio.description ?? "No description"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {portfolio.updated_at}
        </p>
      </div>
    </div>
  );
}

export default function PortfolioDashboardPage() {
  const { data: stats, isLoading: statsLoading } = usePortfolioStats();
  const { data: portfoliosData, isLoading: portfoliosLoading } = usePortfolios();

  const recentPortfolios = portfoliosData?.items ?? [];

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio"
          description="Manage your portfolio, projects, and online presence"
          icon={<Globe className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/portfolio/new">New Portfolio</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Layout className="size-4" />} asChild>
                <Link to="/portfolio/templates">Templates</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Palette className="size-4" />} asChild>
                <Link to="/portfolio/themes">Themes</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/portfolio/settings">Settings</Link>
              </Button>
            </>
          }
        />

        {statsLoading ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Portfolios"
                    value={stats?.total_portfolios ?? 0}
                    icon={<Globe className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Published"
                    value={stats?.published ?? 0}
                    icon={<Eye className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Drafts"
                    value={stats?.drafts ?? 0}
                    icon={<FileText className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Views"
                    value={stats?.total_views ?? 0}
                    icon={<Eye className="size-4" />}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Portfolios</CardTitle>
                  <CardDescription>Your latest portfolio activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {portfoliosLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={64} />
                      ))}
                    </div>
                  ) : recentPortfolios.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No portfolios yet. Create your first portfolio to get started.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {recentPortfolios.slice(0, 8).map((portfolio) => (
                        <PortfolioItem key={portfolio.id} portfolio={portfolio} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                  <CardDescription>Common tasks for your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/portfolio/new">
                        <Plus className="mr-2 size-4" />
                        New Portfolio
                        <ArrowRight className="ml-auto size-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/portfolio/templates">
                        <Layout className="mr-2 size-4" />
                        Browse Templates
                        <ArrowRight className="ml-auto size-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/portfolio/themes">
                        <Palette className="mr-2 size-4" />
                        Customize Themes
                        <ArrowRight className="ml-auto size-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/portfolio/settings">
                        <Settings className="mr-2 size-4" />
                        Portfolio Settings
                        <ArrowRight className="ml-auto size-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
