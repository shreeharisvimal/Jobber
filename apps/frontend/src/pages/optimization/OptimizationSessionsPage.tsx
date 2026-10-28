import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, Plus, Eye, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useResumeOptimizationSessions, useDeleteResumeOptimizationSession } from "@/hooks/useResumeOptimization";

export const OptimizationSessionsPage: FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useResumeOptimizationSessions();
  const deleteSession = useDeleteResumeOptimizationSession();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Optimization Sessions"
          description="View and manage all optimization sessions"
          icon={<Wand2 className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <a onClick={() => navigate("/optimization/sessions/new")}>New Session</a>
            </Button>
          }
        />

        {isLoading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Suggestions</TableHead>
                    <TableHead>Accepted</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions?.map((s) => (
                    <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/optimization/sessions/${s.id}`)}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell><Badge variant="outline">{s.session_type}</Badge></TableCell>
                      <TableCell><Badge variant={s.status === "completed" ? "success" : s.status === "running" ? "warning" : "default"}>{s.status}</Badge></TableCell>
                      <TableCell>{s.total_suggestions}</TableCell>
                      <TableCell>{s.accepted_count}</TableCell>
                      <TableCell>{s.applied_count}</TableCell>
                      <TableCell>{s.overall_confidence ? `${Math.round(s.overall_confidence * 100)}%` : "N/A"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/optimization/sessions/${s.id}`); }}><Eye className="size-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteSession.mutate(s.id); }}><Trash2 className="size-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!sessions?.length && (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No sessions found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
