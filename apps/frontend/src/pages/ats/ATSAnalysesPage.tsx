import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Search, SlidersHorizontal, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useATSAnalyses, useDeleteATSAnalysis } from "@/hooks/useATS";
import { useATSStore } from "@/stores/ats.store";
import type { ATSAnalysisStatus, ATSAnalysisType, ATSGrade } from "@/types/ats";

const gradeColor: Record<ATSGrade, string> = {
  "A+": "text-green-600", "A": "text-green-500", "B+": "text-blue-500", "B": "text-blue-400",
  "C+": "text-yellow-500", "C": "text-yellow-600", "D": "text-orange-500", "F": "text-red-500",
};

export const ATSAnalysesPage: FC = () => {
  const navigate = useNavigate();
  const { data: analyses, isLoading } = useATSAnalyses();
  const deleteAnalysis = useDeleteATSAnalysis();
  const filters = useATSStore((s) => s.filters);
  const setFilters = useATSStore((s) => s.setFilters);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = analyses?.filter((a) => {
    if (filters.search && !a.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (filters.type && a.analysis_type !== filters.type) return false;
    if (filters.grade && a.grade !== filters.grade) return false;
    return true;
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="ATS Analyses"
          description="View and manage resume analysis results"
          icon={<BarChart3 className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<SlidersHorizontal className="size-4" />} onClick={() => setShowFilters(!showFilters)}>
                Filters
              </Button>
              <Button size="sm" leftIcon={<Play className="size-4" />}>
                New Analysis
              </Button>
            </>
          }
        />

        {showFilters && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-3">
                <Input
                  placeholder="Search by ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="max-w-xs"
                  leftIcon={<Search className="size-4" />}
                />
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={filters.status ?? ""}
                  onChange={(e) => setFilters({ status: (e.target.value || null) as ATSAnalysisStatus | null })}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={filters.type ?? ""}
                  onChange={(e) => setFilters({ type: (e.target.value || null) as ATSAnalysisType | null })}
                >
                  <option value="">All Types</option>
                  <option value="comprehensive">Comprehensive</option>
                  <option value="quick">Quick</option>
                  <option value="keyword_only">Keyword Only</option>
                  <option value="skill_only">Skill Only</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Keywords</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered?.map((a) => (
                    <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/ats/analyses/${a.id}`)}>
                      <TableCell className="font-mono text-xs">{a.id.slice(0, 8)}...</TableCell>
                      <TableCell><Badge variant="outline">{a.analysis_type}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={a.status === "completed" ? "success" : a.status === "failed" ? "destructive" : "warning"}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{a.overall_score ? `${Math.round(a.overall_score)}%` : "N/A"}</TableCell>
                      <TableCell className={a.grade ? gradeColor[a.grade] : ""}>{a.grade ?? "N/A"}</TableCell>
                      <TableCell>{a.matched_keywords ?? 0}/{a.total_keywords ?? 0}</TableCell>
                      <TableCell>{a.matched_skills ?? 0}/{a.total_skills ?? 0}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/ats/analyses/${a.id}`); }}>
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteAnalysis.mutate(a.id); }}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filtered?.length && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No analyses found
                      </TableCell>
                    </TableRow>
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
