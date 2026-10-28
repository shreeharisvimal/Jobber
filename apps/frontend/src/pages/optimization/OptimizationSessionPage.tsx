import { type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Wand2, ArrowLeft, Play, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useResumeOptimizationSession, useResumeSuggestions, useAcceptResumeSuggestion, useRejectResumeSuggestion, useApplyResumeSuggestion, useStartResumeOptimizationSession, useCompleteResumeOptimizationSession, useDeleteResumeOptimizationSession, useResumeOptimizationResults, useResumeOptimizationSessionHistory } from "@/hooks/useResumeOptimization";
import { useResumeOptimizationStore } from "@/stores/resume-optimization.store";

const severityColor: Record<string, "default" | "destructive" | "warning" | "info"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
};

export const OptimizationSessionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useResumeOptimizationSession(id!);
  const { data: suggestions } = useResumeSuggestions(id!);
  const { data: results } = useResumeOptimizationResults(id!);
  const { data: history } = useResumeOptimizationSessionHistory(id!);
  const acceptSuggestion = useAcceptResumeSuggestion();
  const rejectSuggestion = useRejectResumeSuggestion();
  const applySuggestion = useApplyResumeSuggestion();
  const startSession = useStartResumeOptimizationSession();
  const completeSession = useCompleteResumeOptimizationSession();
  const deleteSession = useDeleteResumeOptimizationSession();
  const selectedIds = useResumeOptimizationStore((s) => s.selectedSuggestionIds);
  const toggleSelection = useResumeOptimizationStore((s) => s.toggleSuggestionSelection);
  const clearSelection = useResumeOptimizationStore((s) => s.clearSelection);

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton variant="rectangular" height={400} />
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <p>Session not found.</p>
        <Button variant="outline" onClick={() => navigate("/optimization/sessions")}>Back to Sessions</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={session.name}
          description={`${session.session_type} session · ${session.total_suggestions} suggestions`}
          icon={<Wand2 className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} onClick={() => navigate("/optimization/sessions")}>Back</Button>
              {session.status === "draft" && (
                <Button size="sm" leftIcon={<Play className="size-4" />} onClick={() => startSession.mutate(session.id)}>Start</Button>
              )}
              {session.status === "running" && (
                <Button size="sm" leftIcon={<CheckCircle2 className="size-4" />} onClick={() => completeSession.mutate(session.id)}>Complete</Button>
              )}
              <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-4" />} onClick={() => { deleteSession.mutate(session.id); navigate("/optimization/sessions"); }}>Delete</Button>
            </>
          }
        />

        <div className="flex items-center gap-3">
          <Badge variant={session.status === "completed" ? "success" : session.status === "running" ? "warning" : "default"}>{session.status}</Badge>
          <span className="text-sm text-muted-foreground">Confidence: {session.overall_confidence ? `${Math.round(session.overall_confidence * 100)}%` : "N/A"}</span>
          <span className="text-sm text-muted-foreground">Accepted: {session.accepted_count}</span>
          <span className="text-sm text-muted-foreground">Applied: {session.applied_count}</span>
        </div>

        <Tabs defaultValue="suggestions">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions ({suggestions?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">
                        <input type="checkbox" onChange={(e) => { if (e.target.checked) { useResumeOptimizationStore.getState().selectAllSuggestions(); } else { clearSelection(); } }} checked={selectedIds.length === suggestions?.length && suggestions?.length > 0} />
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions?.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelection(s.id)} />
                        </TableCell>
                        <TableCell><Badge variant="outline">{s.suggestion_type}</Badge></TableCell>
                        <TableCell className="text-sm">{s.target_section ?? "—"}</TableCell>
                        <TableCell>{Math.round(s.confidence * 100)}%</TableCell>
                        <TableCell>{s.priority}</TableCell>
                        <TableCell><Badge variant={severityColor[s.severity]}>{s.severity}</Badge></TableCell>
                        <TableCell><Badge variant={s.status === "applied" ? "success" : s.status === "accepted" ? "info" : s.status === "rejected" ? "destructive" : "warning"}>{s.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => acceptSuggestion.mutate(s.id)}><CheckCircle2 className="size-4 text-green-500" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => rejectSuggestion.mutate(s.id)}><XCircle className="size-4 text-destructive" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => applySuggestion.mutate(s.id)}><Play className="size-4 text-blue-500" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!suggestions?.length && (
                      <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No suggestions yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results?.map((r) => (
                <Card key={r.id}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground capitalize">{r.dimension}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg font-medium">{r.score_before ? `${Math.round(r.score_before)}%` : "—"}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-lg font-medium">{r.score_after ? `${Math.round(r.score_after)}%` : "—"}</span>
                      </div>
                      {r.improvement_pct && (
                        <Badge variant={r.improvement_pct > 0 ? "success" : "destructive"} className="mt-2">
                          {r.improvement_pct > 0 ? "+" : ""}{Math.round(r.improvement_pct)}%
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Old Value</TableHead>
                      <TableHead>New Value</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history?.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell><Badge variant="outline">{h.action}</Badge></TableCell>
                        <TableCell className="text-sm">{h.field_name ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{h.old_value ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{h.new_value ?? "—"}</TableCell>
                        <TableCell className="text-sm">{new Date(h.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {!history?.length && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No history yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
