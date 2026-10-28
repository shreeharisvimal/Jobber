import { type FC } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Clock,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface JobAnalysis {
  jobId: string;
  jobTitle: string;
  company: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  overallScore: number | null;
  skillMatch: SkillMatch;
  gaps: SkillGap[];
  recommendations: Recommendation[];
  analyzedAt: string | null;
}

interface SkillMatch {
  matched: string[];
  missing: string[];
  matchPercentage: number | null;
}

interface SkillGap {
  type: "skill" | "experience" | "qualification";
  description: string;
  severity: "critical" | "major" | "minor";
  suggestion: string;
}

interface Recommendation {
  type: "resume" | "cover-letter" | "skills" | "interview";
  title: string;
  description: string;
  actionItems: string[];
  priority: "high" | "medium" | "low";
}

const severityVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  critical: "default",
  major: "warning",
  minor: "info",
};

const priorityVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  high: "default",
  medium: "warning",
  low: "info",
};

const statusIcon: Record<string, typeof CheckCircle2> = {
  pending: Clock,
  "in-progress": RefreshCw,
  completed: CheckCircle2,
  failed: AlertTriangle,
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export const JobAnalysisPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: analysis, isLoading, error } = useQuery<JobAnalysis>({
    queryKey: ["jobs", id, "analysis"],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${id}/analysis`);
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const requestAnalysisMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post(`/jobs/${id}/analysis`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "analysis"] });
      toast.success("Analysis started");
    },
    onError: () => {
      toast.error("Failed to start analysis");
    },
  });

  const StatusIcon = statusIcon[analysis?.status ?? "pending"] ?? Clock;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={200} />
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
            title="Job Analysis"
            description="Analyze job requirements and get recommendations"
            backHref={id ? `/jobs/${id}` : "/jobs"}
          />
          <Alert variant="danger" title="Failed to load analysis" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Job Analysis"
          description={analysis ? `${analysis.jobTitle} at ${analysis.company}` : "Analyze job requirements"}
          backHref={id ? `/jobs/${id}` : "/jobs"}
          actions={
            <Button
              size="sm"
              leftIcon={<Sparkles className="size-4" />}
              onClick={() => requestAnalysisMutation.mutate()}
              loading={requestAnalysisMutation.isPending}
            >
              {analysis?.status === "completed" ? "Re-analyze" : "Run Analysis"}
            </Button>
          }
        />

        <div className="flex items-center gap-3">
          <Badge variant={analysis?.status === "completed" ? "success" : analysis?.status === "in-progress" ? "warning" : "default"} size="sm">
            <StatusIcon className="mr-1 size-3" />
            {analysis?.status ?? "pending"}
          </Badge>
          {analysis?.analyzedAt && (
            <span className="text-xs text-muted-foreground">
              Last analyzed: {formatDate(analysis.analyzedAt)}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.overallScore !== null && analysis?.overallScore !== undefined ? (
                <div className="flex items-center gap-4">
                  <div className="flex size-20 items-center justify-center rounded-full border-4 border-brand-500 bg-brand-50">
                    <span className="text-2xl font-bold text-brand-700">{analysis.overallScore}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">out of 100</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analysis.overallScore >= 80 ? "Strong match" : analysis.overallScore >= 60 ? "Good match" : "Needs improvement"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
                  <BarChart3 className="mx-auto mb-2 size-6 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No score available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Match</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.skillMatch.matchPercentage !== null && analysis?.skillMatch.matchPercentage !== undefined ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${analysis.skillMatch.matchPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analysis.skillMatch.matchPercentage}%</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{analysis.skillMatch.matched.length} matched</span>
                    <span>{analysis.skillMatch.missing.length} missing</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
                  <Info className="mx-auto mb-2 size-6 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No skill match data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis && analysis.gaps.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Suggestion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysis.gaps.map((gap, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge variant="secondary" size="sm">{gap.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{gap.description}</TableCell>
                      <TableCell>
                        <Badge variant={severityVariant[gap.severity] ?? "default"} size="sm">{gap.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{gap.suggestion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <CheckCircle2 className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No gaps identified</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis && analysis.recommendations.length > 0 ? (
              <div className="space-y-4">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={priorityVariant[rec.priority] ?? "default"} size="sm">{rec.priority}</Badge>
                        <Badge variant="secondary" size="sm">{rec.type}</Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    {rec.actionItems.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Action Items</p>
                        <ul className="space-y-1">
                          {rec.actionItems.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-success-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <Sparkles className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No recommendations available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
