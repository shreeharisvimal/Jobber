import { useState } from "react";
import { FileText, Play, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalyticsReports,
  useCreateAnalyticsReport,
  useGenerateAnalyticsReport,
} from "@/hooks/useAnalytics";

export const AnalyticsReportsPage: FC = () => {
  const { data: reports, isLoading } = useAnalyticsReports();
  const createReport = useCreateAnalyticsReport();
  const generateReport = useGenerateAnalyticsReport();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReport.mutate(form);
    setForm({ title: "", type: "" });
    setShowForm(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success" as const;
      case "generating":
        return "info" as const;
      case "failed":
        return "danger" as const;
      case "pending":
        return "warning" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Reports"
          description="Generate and manage analytics reports"
          icon={<FileText className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Create Report"}
            </Button>
          }
        />

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Report title"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium">Type</label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="e.g. weekly, monthly"
                  />
                </div>
                <Button type="submit" size="sm" disabled={createReport.isPending}>
                  {createReport.isPending ? "Creating..." : "Create"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </div>
        ) : reports && reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{report.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {report.type}
                      </Badge>
                      <Badge variant={getStatusVariant(report.status)} size="sm">
                        {report.status}
                      </Badge>
                      {report.last_generated && (
                        <span className="text-xs text-muted-foreground">
                          Last generated: {new Date(report.last_generated).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Play className="size-3" />}
                    onClick={() => generateReport.mutate(report.id)}
                    disabled={generateReport.isPending || report.status === "generating"}
                  >
                    Generate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No data yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
