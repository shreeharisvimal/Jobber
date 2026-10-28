import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Quote, Plus, Pencil, Trash2 } from "lucide-react";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Recommendation {
  id: string;
  recommenderName: string;
  recommenderTitle: string;
  recommenderCompany: string;
  relationship: string;
  content: string;
  date: string;
  order: number;
}

interface RecommendationFormData {
  recommenderName: string;
  recommenderTitle: string;
  recommenderCompany: string;
  relationship: string;
  content: string;
  date: string;
}

const emptyForm: RecommendationFormData = {
  recommenderName: "", recommenderTitle: "", recommenderCompany: "", relationship: "manager", content: "", date: "",
};

const relationshipOptions = [
  { value: "manager", label: "Manager" },
  { value: "colleague", label: "Colleague" },
  { value: "direct-report", label: "Direct Report" },
  { value: "client", label: "Client" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other" },
];

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

export const RecommendationsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecommendationFormData>(emptyForm);

  const { data: recommendations = [], isLoading, error } = useQuery<Recommendation[]>({
    queryKey: ["career-profile", "recommendations"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/recommendations");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: RecommendationFormData) => {
      const response = await apiClient.post("/career-profile/recommendations", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Recommendation added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add recommendation"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RecommendationFormData }) => {
      const response = await apiClient.put(`/career-profile/recommendations/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "recommendations"] });
      toast.success("Recommendation updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update recommendation"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/career-profile/recommendations/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Recommendation deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete recommendation"); },
  });

  const handleEdit = (rec: Recommendation) => {
    setEditingId(rec.id);
    setForm({
      recommenderName: rec.recommenderName,
      recommenderTitle: rec.recommenderTitle,
      recommenderCompany: rec.recommenderCompany,
      relationship: rec.relationship,
      content: rec.content,
      date: rec.date,
    });
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
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={160} />)}</div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader title="Recommendations" description="Manage your professional recommendations" backHref="/profile" />
          <Alert variant="danger" title="Failed to load recommendations" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Recommendations"
          description="Manage your professional recommendations"
          backHref="/profile"
          actions={<Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>Add Recommendation</Button>}
        />

        {recommendations.length === 0 && !showForm && (
          <EmptyState icon={<Quote className="size-7" />} title="No recommendations yet" description="Add recommendations from colleagues and managers to build credibility." action={{ label: "Add Recommendation", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }} />
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Edit Recommendation" : "New Recommendation"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Recommender Name" htmlFor="recommenderName" required>
                  <Input id="recommenderName" value={form.recommenderName} onChange={(e) => setForm((p) => ({ ...p, recommenderName: e.target.value }))} placeholder="Jane Smith" />
                </Field>
                <Field label="Title" htmlFor="recommenderTitle">
                  <Input id="recommenderTitle" value={form.recommenderTitle} onChange={(e) => setForm((p) => ({ ...p, recommenderTitle: e.target.value }))} placeholder="VP of Engineering" />
                </Field>
                <Field label="Company" htmlFor="recommenderCompany">
                  <Input id="recommenderCompany" value={form.recommenderCompany} onChange={(e) => setForm((p) => ({ ...p, recommenderCompany: e.target.value }))} placeholder="Acme Corp" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Relationship" htmlFor="relationship">
                  <select id="relationship" value={form.relationship} onChange={(e) => setForm((p) => ({ ...p, relationship: e.target.value }))} className="flex w-full appearance-none rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
                    {relationshipOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </Field>
                <Field label="Date" htmlFor="date">
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                </Field>
              </div>
              <Field label="Recommendation Content" htmlFor="content" required>
                <Textarea id="content" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={5} placeholder="Write or paste the recommendation text here..." />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{editingId ? "Update" : "Add"} Recommendation</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                      {rec.recommenderName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{rec.recommenderName}</CardTitle>
                      <CardDescription>
                        {rec.recommenderTitle}{rec.recommenderCompany ? ` at ${rec.recommenderCompany}` : ""}
                      </CardDescription>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" size="sm">{relationshipOptions.find((r) => r.value === rec.relationship)?.label ?? rec.relationship}</Badge>
                        {rec.date && <span className="text-xs text-muted-foreground">{formatDate(rec.date)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(rec)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(rec.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-2 border-brand-200 pl-4 text-sm text-muted-foreground italic">
                  "{rec.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        <ConfirmationDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete Recommendation" description="Are you sure you want to delete this recommendation?" confirmLabel="Delete" onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
      </div>
    </PageContainer>
  );
};
