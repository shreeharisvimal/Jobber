import { useState } from "react";
import { Target, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalyticsKPIs,
  useCreateAnalyticsKPI,
  useUpdateAnalyticsKPI,
  useDeleteAnalyticsKPI,
} from "@/hooks/useAnalytics";

export const AnalyticsKPIsPage: FC = () => {
  const { data: kpis, isLoading } = useAnalyticsKPIs();
  const createKPI = useCreateAnalyticsKPI();
  const deleteKPI = useDeleteAnalyticsKPI();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    value: "",
    target: "",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createKPI.mutate({
      name: form.name,
      value: Number(form.value),
      target: Number(form.target),
      category: form.category,
    });
    setForm({ name: "", value: "", target: "", category: "" });
    setShowForm(false);
  };

  const getProgress = (value: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((value / target) * 100, 100);
  };

  const getStatus = (value: number, target: number) => {
    const pct = target === 0 ? 0 : (value / target) * 100;
    if (pct >= 90) return "on_track";
    if (pct >= 70) return "at_risk";
    return "behind";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "on_track":
        return "success" as const;
      case "at_risk":
        return "warning" as const;
      case "behind":
        return "danger" as const;
      default:
        return "default" as const;
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <TrendingUp className="size-4 text-success-600" />;
    if (trend === "down") return <TrendingDown className="size-4 text-danger-600" />;
    return <Minus className="size-4 text-muted-foreground" />;
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Key Performance Indicators"
          description="Track and manage your key metrics"
          icon={<Target className="size-5" />}
          actions={
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Add KPI"}
            </Button>
          }
        />

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New KPI</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="e.g. Resume Score"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Value</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Target</label>
                  <input
                    type="number"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="e.g. Career"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button type="submit" size="sm" disabled={createKPI.isPending}>
                    {createKPI.isPending ? "Creating..." : "Create KPI"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={160} />
            ))}
          </div>
        ) : kpis && kpis.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi) => {
              const progress = getProgress(kpi.value, kpi.target);
              const status = getStatus(kpi.value, kpi.target);
              return (
                <Card key={kpi.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{kpi.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(kpi.trend)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteKPI.mutate(kpi.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {kpi.category && (
                      <Badge variant="outline" size="sm">
                        {kpi.category}
                      </Badge>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{kpi.value}</span>
                      <span className="text-sm text-muted-foreground">
                        / {kpi.target}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <Badge variant={getStatusVariant(status)} size="sm">
                      {status.replace("_", " ")}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No data yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
