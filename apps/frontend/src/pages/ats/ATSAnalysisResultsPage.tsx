import { type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Download, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useATSAnalysis, useDeleteATSAnalysis, useATSReports, useCreateATSReport } from "@/hooks/useATS";
import { useATSStore } from "@/stores/ats.store";
import type { ATSGrade } from "@/types/ats";

const gradeColor: Record<ATSGrade, string> = {
  "A+": "text-green-600",
  "A": "text-green-500",
  "B+": "text-blue-500",
  "B": "text-blue-400",
  "C+": "text-yellow-500",
  "C": "text-yellow-600",
  "D": "text-orange-500",
  "F": "text-red-500",
};

export const ATSAnalysisResultsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: analysis, isLoading } = useATSAnalysis(id!);
  const deleteAnalysis = useDeleteATSAnalysis();
  const { data: reports } = useATSReports(id!);
  const createReport = useCreateATSReport(id!);
  const scores = useATSStore((s) => s.scores);

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton variant="rectangular" height={400} />
      </PageContainer>
    );
  }

  if (!analysis) {
    return (
      <PageContainer>
        <p>Analysis not found.</p>
        <Button variant="outline" onClick={() => navigate("/ats/analyses")}>Back to Analyses</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={`ATS Analysis - ${analysis.analysis_type}`}
          description={`Grade: ${analysis.grade ?? "N/A"} | Score: ${analysis.overall_score ?? "N/A"}%`}
          icon={<BarChart3 className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} onClick={() => navigate("/ats/analyses")}>
                Back
              </Button>
              <Button variant="outline" size="sm" leftIcon={<RefreshCw className="size-4" />} onClick={() => navigate(0)}>
                Refresh
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Download className="size-4" />} onClick={() => createReport.mutate({})}>
                Generate Report
              </Button>
              <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-4" />} onClick={() => { deleteAnalysis.mutate(analysis.id); navigate("/ats/analyses"); }}>
                Delete
              </Button>
            </>
          }
        />

        <div className="flex items-center gap-2">
          <Badge variant={analysis.status === "completed" ? "success" : analysis.status === "failed" ? "destructive" : "warning"}>
            {analysis.status}
          </Badge>
          {analysis.grade && (
            <span className={`text-2xl font-bold ${gradeColor[analysis.grade]}`}>{analysis.grade}</span>
          )}
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="formatting">Formatting</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scores.map((score) => (
                <Card key={score.id}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground capitalize">{score.dimension}</p>
                      <p className="text-2xl font-bold">{Math.round(score.percentage)}%</p>
                      <p className="text-xs text-muted-foreground">{score.grade ?? "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
                <CardDescription>
                  Matched {analysis.matched_keywords ?? 0} of {analysis.total_keywords ?? 0} keywords
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.keyword_matches?.length ? (
                  <div className="space-y-2">
                    {analysis.keyword_matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{match.keyword}</span>
                        <Badge variant={match.found ? "success" : "destructive"}>
                          {match.found ? "Found" : "Missing"} ({match.match_type})
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No keyword data available</p>
                )}
                {analysis.keyword_gaps?.length ? (
                  <>
                    <h4 className="font-medium mt-4 mb-2">Gaps</h4>
                    {analysis.keyword_gaps.map((gap) => (
                      <div key={gap.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{gap.keyword}</span>
                        <span className="text-sm text-muted-foreground">{gap.suggestion}</span>
                      </div>
                    ))}
                  </>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skill Analysis</CardTitle>
                <CardDescription>
                  Matched {analysis.matched_skills ?? 0} of {analysis.total_skills ?? 0} skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.skill_matches?.length ? (
                  <div className="space-y-2">
                    {analysis.skill_matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{match.skill}</span>
                        <Badge variant={match.found ? "success" : "destructive"}>
                          {match.found ? "Found" : "Missing"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skill data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.experience_matches?.length ? (
                  <div className="space-y-2">
                    {analysis.experience_matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{match.requirement}</span>
                        <Badge variant={match.found ? "success" : "destructive"}>
                          {match.found ? "Met" : "Not Met"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No experience data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formatting">
            <Card>
              <CardHeader>
                <CardTitle>Formatting Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.formatting_analyses?.length ? (
                  <div className="space-y-2">
                    {analysis.formatting_analyses.map((check) => (
                      <div key={check.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{check.check_name}</span>
                        <Badge variant={check.passed ? "success" : "destructive"}>
                          {check.passed ? "Pass" : "Fail"} ({check.score})
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No formatting data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.recommendations?.length ? (
                  analysis.recommendations.map((rec) => (
                    <Card key={rec.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                          <Badge variant={rec.impact === "high" ? "destructive" : rec.impact === "medium" ? "warning" : "default"}>
                            {rec.impact}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recommendations</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {reports?.length ? (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.format}</p>
                        </div>
                        <Badge>{report.report_type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No reports yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
