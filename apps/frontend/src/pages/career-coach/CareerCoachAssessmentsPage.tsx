import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck, RefreshCw } from "lucide-react";
import { useCareerAssessments, useRunFullAssessment } from "@/hooks/useCareerCoach";

export function CareerCoachAssessmentsPage() {
  const { data: assessments, isLoading } = useCareerAssessments();
  const runAssessment = useRunFullAssessment();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Assessments"
          description="Track your career readiness and health assessments"
          icon={<ClipboardCheck className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<RefreshCw className="size-4" />}
              isLoading={runAssessment.isPending}
              onClick={() => runAssessment.mutate()}
            >
              Run Assessment
            </Button>
          }
        />

        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={48} />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : assessments && assessments.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>
                {assessments.length} assessment{assessments.length !== 1 ? "s" : ""} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_80px_120px] gap-4 border-b px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Type</span>
                  <span>Score</span>
                  <span>Date</span>
                </div>
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="grid grid-cols-[1fr_80px_120px] items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{assessment.type}</p>
                      {assessment.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {assessment.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <Badge
                        variant={
                          assessment.score >= 80
                            ? "default"
                            : assessment.score >= 50
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {assessment.score}%
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <ClipboardCheck className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No assessments yet. Run your first assessment to get insights into your career
                readiness.
              </p>
              <Button
                className="mt-4"
                leftIcon={<RefreshCw className="size-4" />}
                isLoading={runAssessment.isPending}
                onClick={() => runAssessment.mutate()}
              >
                Run Your First Assessment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
