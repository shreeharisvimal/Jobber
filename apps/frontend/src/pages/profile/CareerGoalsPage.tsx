import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Target, Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate: string | null;
  isActive: boolean;
  order: number;
}

interface GoalFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate: string;
  isActive: boolean;
}

const emptyForm: GoalFormData = { title: "", description: "", category: "", priority: "medium", targetDate: "", isActive: true };

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const priorityBadgeVariant: Record<string, "danger" | "warning" | "default"> = {
  high: "danger",
  medium: "warning",
  low: "default",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

export const CareerGoalsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<GoalFormData>(emptyForm);

  const { data: goals = [], isLoading, error } = useQuery<CareerGoal[]>({
    queryKey: ["career-profile", "goals"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/goals");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      const response = await apiClient.post("/career-profile/goals", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "goals"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Goal added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add goal"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GoalFormData }) => {
      const response = await apiClient.put(`/career-profile/goals/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "goals"] });
      toast.success("Goal updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update goal"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/career-profile/goals/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "goals"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Goal deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete goal"); },
  });

  const handleEdit = (goal: CareerGoal) => {
    setEditingId(goal.id);
    setForm({ title: goal.title, description: goal.description, category: goal.category, priority: goal.priority, targetDate: goal.targetDate ?? "", isActive: goal.isActive });
    setShowForm(true);
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };
  const handleSubmit = () => {
    if (editingId) { updateMutation.mutate({ id: editingId, data: form }); }
    else { createMutation.mutate(form); }
  };
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={120} />)}</div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader title="Career Goals" description="Define and track your career objectives" backHref="/profile" />
          <Alert variant="danger" title="Failed to load goals" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Goals"
          description="Define and track your career objectives"
          backHref="/profile"
          actions={<Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>Add Goal</Button>}
        />

        {goals.length === 0 && !showForm && (
          <EmptyState icon={<Target className="size-7" />} title="No career goals yet" description="Set career goals to guide your professional development." action={{ label: "Add Goal", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }} />
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Edit Goal" : "New Goal"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Goal Title" htmlFor="title" required>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Become a tech lead" />
              </Field>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Category" htmlFor="category">
                  <Input id="category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Leadership" />
                </Field>
                <Field label="Priority" htmlFor="priority">
                  <select id="priority" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))} className="flex w-full appearance-none rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
                    {priorityOptions.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </Field>
                <Field label="Target Date" htmlFor="targetDate">
                  <Input id="targetDate" type="date" value={form.targetDate} onChange={(e) => setForm((p) => ({ ...p, targetDate: e.target.value }))} />
                </Field>
              </div>
              <Switch checked={form.isActive} onChange={(checked) => setForm((p) => ({ ...p, isActive: checked }))} label="Active goal" />
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{editingId ? "Update" : "Add"} Goal</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {goal.title}
                      {!goal.isActive && <Badge variant="secondary" size="sm">Inactive</Badge>}
                    </CardTitle>
                    <CardDescription>{goal.description || "No description"}</CardDescription>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant={priorityBadgeVariant[goal.priority] ?? "default"} size="sm">{goal.priority} priority</Badge>
                      {goal.category && <Badge variant="outline" size="sm">{goal.category}</Badge>}
                      {goal.targetDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" />Target: {formatDate(goal.targetDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(goal)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(goal.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <ConfirmationDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete Goal" description="Are you sure you want to delete this career goal?" confirmLabel="Delete" onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
      </div>
    </PageContainer>
  );
};
