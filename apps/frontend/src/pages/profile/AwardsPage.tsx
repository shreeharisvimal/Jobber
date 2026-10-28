import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Plus, Pencil, Trash2, Calendar } from "lucide-react";
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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  order: number;
}

interface AwardFormData {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

const emptyForm: AwardFormData = { title: "", issuer: "", date: "", description: "" };

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

export const AwardsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<AwardFormData>(emptyForm);

  const { data: awards = [], isLoading, error } = useQuery<Award[]>({
    queryKey: ["career-profile", "awards"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/awards");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: AwardFormData) => {
      const response = await apiClient.post("/career-profile/awards", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "awards"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Award added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add award"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AwardFormData }) => {
      const response = await apiClient.put(`/career-profile/awards/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "awards"] });
      toast.success("Award updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update award"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/career-profile/awards/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "awards"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Award deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete award"); },
  });

  const handleEdit = (award: Award) => {
    setEditingId(award.id);
    setForm({ title: award.title, issuer: award.issuer, date: award.date, description: award.description });
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
          <PageHeader title="Awards" description="Manage your awards and honors" backHref="/profile" />
          <Alert variant="danger" title="Failed to load awards" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Awards"
          description="Manage your awards and honors"
          backHref="/profile"
          actions={<Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>Add Award</Button>}
        />

        {awards.length === 0 && !showForm && (
          <EmptyState icon={<Trophy className="size-7" />} title="No awards yet" description="Add your awards and honors to highlight your achievements." action={{ label: "Add Award", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }} />
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Edit Award" : "New Award"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Award Title" htmlFor="title" required>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Employee of the Year" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Issuing Organization" htmlFor="issuer" required>
                  <Input id="issuer" value={form.issuer} onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="Acme Corp" />
                </Field>
                <Field label="Date" htmlFor="date">
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                </Field>
              </div>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{editingId ? "Update" : "Add"} Award</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {awards.map((award) => (
            <Card key={award.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{award.title}</CardTitle>
                    <CardDescription>{award.issuer}</CardDescription>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />{formatDate(award.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(award)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(award.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              {award.description && <CardContent><p className="text-sm text-muted-foreground">{award.description}</p></CardContent>}
            </Card>
          ))}
        </div>

        <ConfirmationDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete Award" description="Are you sure you want to delete this award?" confirmLabel="Delete" onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
      </div>
    </PageContainer>
  );
};
