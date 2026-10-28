import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Pencil, Trash2, Calendar, ExternalLink } from "lucide-react";
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

interface Publication {
  id: string;
  title: string;
  publisher: string;
  publicationDate: string;
  url: string | null;
  description: string;
  order: number;
}

interface PublicationFormData {
  title: string;
  publisher: string;
  publicationDate: string;
  url: string;
  description: string;
}

const emptyForm: PublicationFormData = { title: "", publisher: "", publicationDate: "", url: "", description: "" };

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

export const PublicationsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<PublicationFormData>(emptyForm);

  const { data: publications = [], isLoading, error } = useQuery<Publication[]>({
    queryKey: ["career-profile", "publications"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/publications");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PublicationFormData) => {
      const response = await apiClient.post("/career-profile/publications", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "publications"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Publication added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add publication"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PublicationFormData }) => {
      const response = await apiClient.put(`/career-profile/publications/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "publications"] });
      toast.success("Publication updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update publication"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/career-profile/publications/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "publications"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Publication deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete publication"); },
  });

  const handleEdit = (pub: Publication) => {
    setEditingId(pub.id);
    setForm({ title: pub.title, publisher: pub.publisher, publicationDate: pub.publicationDate, url: pub.url ?? "", description: pub.description });
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
          <PageHeader title="Publications" description="Manage your published works" backHref="/profile" />
          <Alert variant="danger" title="Failed to load publications" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Publications"
          description="Manage your published works and articles"
          backHref="/profile"
          actions={<Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>Add Publication</Button>}
        />

        {publications.length === 0 && !showForm && (
          <EmptyState icon={<BookOpen className="size-7" />} title="No publications yet" description="Add your published works to showcase your thought leadership." action={{ label: "Add Publication", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }} />
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Edit Publication" : "New Publication"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Title" htmlFor="title" required>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Article or Paper Title" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Publisher" htmlFor="publisher" required>
                  <Input id="publisher" value={form.publisher} onChange={(e) => setForm((p) => ({ ...p, publisher: e.target.value }))} placeholder="IEEE, Medium, etc." />
                </Field>
                <Field label="Publication Date" htmlFor="publicationDate">
                  <Input id="publicationDate" type="date" value={form.publicationDate} onChange={(e) => setForm((p) => ({ ...p, publicationDate: e.target.value }))} />
                </Field>
              </div>
              <Field label="URL" htmlFor="url">
                <Input id="url" type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
              </Field>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{editingId ? "Update" : "Add"} Publication</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {publications.map((pub) => (
            <Card key={pub.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{pub.title}</CardTitle>
                    <CardDescription>{pub.publisher}</CardDescription>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{formatDate(pub.publicationDate)}</span>
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-600 hover:underline">
                          <ExternalLink className="size-3" /> Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(pub)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(pub.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              {pub.description && <CardContent><p className="text-sm text-muted-foreground">{pub.description}</p></CardContent>}
            </Card>
          ))}
        </div>

        <ConfirmationDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete Publication" description="Are you sure you want to delete this publication?" confirmLabel="Delete" onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
      </div>
    </PageContainer>
  );
};
