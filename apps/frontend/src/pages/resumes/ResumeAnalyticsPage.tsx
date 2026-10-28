import { type FC } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Download,
  Share2,
  BarChart3,
  Target,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

interface ResumeAnalytics {
  overview: {
    views: number;
    downloads: number;
    shares: number;
    completeness: number;
  };
  optimizationScore: number;
  atsScore: number;
  sectionCompleteness: {
    section: string;
    score: number;
    status: "complete" | "partial" | "missing";
  }[];
  exportHistory: {
    id: string;
    format: string;
    date: string;
    downloadedBy: string;
  }[];
  timeTrends: {
    period: string;
    views: number;
    downloads: number;
  }[];
}

const statusColor: Record<string, "success" | "warning" | "danger"> = {
  complete: "success",
  partial: "warning",
  missing: "danger",
};

const statusIcon: Record<string, typeof CheckCircle2> = {
  complete: CheckCircle2,
  partial: AlertTriangle,
  missing: AlertTriangle,
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export const ResumeAnalyticsPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: analytics, isLoading, error } = useQuery<ResumeAnalytics>({
    queryKey: ["resumes", id, "analytics"],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}/analytics`);
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
          <Skeleton variant="rectangular" height={300} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Analytics"
            description="Resume performance analytics"
            backHref={`/resumes/${id}`}
          />
          <Alert variant="danger" title="Failed to load analytics" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  if (!analytics) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Analytics"
            description="Resume performance analytics"
            backHref={`/resumes/${id}`}
          />
          <EmptyState
            icon={<BarChart3 className="size-7" />}
            title="No analytics data"
            description="Analytics will appear once your resume starts getting views."
          />
        </div>
      </PageContainer>
    );
  }

  const maxViews = Math.max(...analytics.timeTrends.map((t) => t.views), 1);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Analytics"
          description="Track resume performance and optimization"
          backHref={`/resumes/${id}`}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic
            label="Total Views"
            value={analytics.overview.views}
            icon={<Eye className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Downloads"
            value={analytics.overview.downloads}
            icon={<Download className="size-5" />}
            variant="success"
          />
          <Statistic
            label="Shares"
            value={analytics.overview.shares}
            icon={<Share2 className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Completeness"
            value={`${analytics.overview.completeness}%`}
            icon={<Target className="size-5" />}
            variant="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Score</CardTitle>
              <CardDescription>How well your resume is optimized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative size-24">
                  <svg className="size-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/50"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(analytics.optimizationScore / 100) * 251} 251`}
                      className="text-brand-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-foreground">{analytics.optimizationScore}%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {analytics.optimizationScore >= 80
                      ? "Your resume is well optimized!"
                      : "Consider improving your resume to reach a higher score."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Applicant Tracking System compatibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative size-24">
                  <svg className="size-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/50"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(analytics.atsScore / 100) * 251} 251`}
                      className="text-success-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-foreground">{analytics.atsScore}%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {analytics.atsScore >= 70
                      ? "Your resume passes most ATS systems."
                      : "Improve ATS compatibility for better results."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Time Trends</CardTitle>
            <CardDescription>Views and downloads over time</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.timeTrends.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No trend data available yet</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-end gap-2 h-40">
                  {analytics.timeTrends.map((trend, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex w-full gap-0.5">
                        <div
                          className="flex-1 rounded-t bg-brand-400"
                          style={{ height: `${(trend.views / maxViews) * 100}%` }}
                        />
                        <div
                          className="flex-1 rounded-t bg-success-400"
                          style={{ height: `${(trend.downloads / maxViews) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{trend.period}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-brand-400" /> Views
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-success-400" /> Downloads
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Section Completeness</CardTitle>
            <CardDescription>How complete each section is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.sectionCompleteness.map((section) => {
              const Icon = statusIcon[section.status]!;
              return (
                <div key={section.section} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn(
                        "size-4",
                        section.status === "complete" && "text-success-600",
                        section.status === "partial" && "text-warning-600",
                        section.status === "missing" && "text-danger-600"
                      )} />
                      <span className="text-sm font-medium">{section.section}</span>
                    </div>
                    <Badge variant={statusColor[section.status]} size="sm">
                      {section.score}%
                    </Badge>
                  </div>
                  <Progress value={section.score} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>Recent resume exports</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.exportHistory.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No exports yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Format</TableHead>
                    <TableHead>Downloaded By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.exportHistory.map((exportItem) => (
                    <TableRow key={exportItem.id}>
                      <TableCell>
                        <Badge variant="secondary" size="sm">
                          {exportItem.format.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{exportItem.downloadedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(exportItem.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
