import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileBadge, Plus, Pencil, Trash2, Calendar } from "lucide-react";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Patent {
  id: string;
  title: string;
  patentNumber: string;
  filingDate: string;
  grantDate: string | null;
  status: string;
  description: string;
  order: number;
}

interface PatentFormData {
  title: string;
  patentNumber: string;
  filingDate: string;
  grantDate: string;
  status: string;
  description: string;
}

const emptyForm: PatentFormData = { title: "", patentNumber: "", filingDate: "", grantDate: "", status: "filed", description: "" };

const statusOptions = [
  { value: "filed", label: "Filed" },
  { value: "pending", label: "Pending" },
  { value: "granted", label: "Granted" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
];

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  filed: "default",
  pending: "warning",
  granted: "success",
  expired: "danger",
  rejected: "danger",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

export const PatentsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<PatentFormData>(emptyForm);

  const { data: patents = [], isLoading, error } = useQuery<Patent[]>({
    queryKey: ["career-profile", "patents"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/patents");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PatentFormData) => {
      const response = await apiClient.post("/career-profile/patents", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "patents"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Patent added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add patent"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PatentFormData }) => {
      const response = await apiClient.put(`/career-profile/patents/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "patents"] });
      toast.success("Patent updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update patent"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/career-profile/patents/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "patents"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Patent deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete patent"); },
  });

  const handleEdit = (patent: Patent) => {
    setEditingId(patent.id);
    setForm({ title: patent.title, patentNumber: patent.patentNumber, filingDate: patent.filingDate, grantDate: patent.grantDate ?? "", status: patent.status, description: patent.description });
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
          <PageHeader title="Patents" description="Manage your patent portfolio" backHref="/profile" />
          <Alert variant="danger" title="Failed to load patents" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Patents"
          description="Manage your patent portfolio"
          backHref="/profile"
          actions={<Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>Add Patent</Button>}
        />

        {patents.length === 0 && !showForm && (
          <EmptyState icon={<FileBadge className="size-7" />} title="No patents yet" description="Add your patents to showcase your innovation." action={{ label: "Add Patent", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }} />
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Edit Patent" : "New Patent"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Patent Title" htmlFor="title" required>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="System and Method for..." />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Patent Number" htmlFor="patentNumber">
                  <Input id="patentNumber" value={form.patentNumber} onChange={(e) => setForm((p) => ({ ...p, patentNumber: e.target.value }))} placeholder="US10123456" />
                </Field>
                <Field label="Status" htmlFor="status">
                  <select id="status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="flex w-full appearance-none rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
                    {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Filing Date" htmlFor="filingDate">
                  <Input id="filingDate" type="date" value={form.filingDate} onChange={(e) => setForm((p) => ({ ...p, filingDate: e.target.value }))} />
                </Field>
                <Field label="Grant Date" htmlFor="grantDate">
                  <Input id="grantDate" type="date" value={form.grantDate} onChange={(e) => setForm((p) => ({ ...p, grantDate: e.target.value }))} />
                </Field>
              </div>
              <Field label="Description" htmlFor="description">
                <textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2" />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{editingId ? "Update" : "Add"} Patent</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {patents.map((patent) => (
            <Card key={patent.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{patent.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      {patent.patentNumber && <span className="font-mono text-xs">{patent.patentNumber}</span>}
                    </CardDescription>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="size-3" />Filed {formatDate(patent.filingDate)}</span>
                      {patent.grantDate && <span>Granted {formatDate(patent.grantDate)}</span>}
                      <Badge variant={statusBadgeVariant[patent.status] ?? "default"} size="sm">{patent.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(patent)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(patent.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              {patent.description && <CardContent><p className="text-sm text-muted-foreground">{patent.description}</p></CardContent>}
            </Card>
          ))}
        </div>

        <ConfirmationDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete Patent" description="Are you sure you want to delete this patent?" confirmLabel="Delete" onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
      </div>
    </PageContainer>
  );
};
