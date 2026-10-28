import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Plus, Pencil, Trash2, Calendar, GripVertical } from "lucide-react";
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

interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  bullets: string[];
  order: number;
}

interface VolunteerFormData {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  bullets: string;
}

const emptyForm: VolunteerFormData = {
  organization: "", role: "", startDate: "", endDate: "", isCurrent: false, description: "", bullets: "",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

function parseList(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export const VolunteerExperiencePage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<VolunteerFormData>(emptyForm);

  const { data: entries = [], isLoading, error } = useQuery<VolunteerExperience[]>({
    queryKey: ["career-profile", "volunteer"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/volunteer");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      const payload = { ...data, bullets: parseList(data.bullets) };
      const response = await apiClient.post("/career-profile/volunteer", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "volunteer"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Volunteer experience added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add volunteer experience"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VolunteerFormData }) => {
      const payload = { ...data, bullets: parseList(data.bullets) };
      const response = await apiClient.put(`/career-profile/volunteer/${id}`, payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "volunteer"] });
      toast.success("Volunteer experience updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update volunteer experience"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/volunteer/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "volunteer"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Volunteer experience deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete volunteer experience"); },
  });

  const handleEdit = (entry: VolunteerExperience) => {
    setEditingId(entry.id);
    setForm({
      organization: entry.organization,
      role: entry.role,
      startDate: entry.startDate,
      endDate: entry.endDate ?? "",
      isCurrent: entry.isCurrent,
      description: entry.description,
      bullets: entry.bullets.join("\n"),
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
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader title="Volunteer Experience" description="Track your volunteer work" backHref="/profile" />
          <Alert variant="danger" title="Failed to load volunteer experience" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Volunteer Experience"
          description="Track your volunteer work and community involvement"
          backHref="/profile"
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
              Add Experience
            </Button>
          }
        />

        {entries.length === 0 && !showForm && (
          <EmptyState
            icon={<Heart className="size-7" />}
            title="No volunteer experience yet"
            description="Add your volunteer work to showcase your community involvement."
            action={{ label: "Add Experience", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }}
          />
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Volunteer Experience" : "New Volunteer Experience"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Organization" htmlFor="organization" required>
                  <Input id="organization" value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} placeholder="Habitat for Humanity" />
                </Field>
                <Field label="Role" htmlFor="role" required>
                  <Input id="role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Volunteer Coordinator" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start Date" htmlFor="startDate" required>
                  <Input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
                </Field>
                <Field label="End Date" htmlFor="endDate">
                  <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} disabled={form.isCurrent} />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isCurrent" checked={form.isCurrent} onChange={(e) => setForm((p) => ({ ...p, isCurrent: e.target.checked, endDate: e.target.checked ? "" : p.endDate }))} className="size-4 rounded border-neutral-300" />
                <label htmlFor="isCurrent" className="text-sm text-muted-foreground">Currently volunteering</label>
              </div>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </Field>
              <Field label="Key Contributions" htmlFor="bullets" hint="One per line">
                <Textarea id="bullets" value={form.bullets} onChange={(e) => setForm((p) => ({ ...p, bullets: e.target.value }))} placeholder="Organized community events&#10;Raised $5000 for charity" rows={3} />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {editingId ? "Update" : "Add"} Experience
              </Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 cursor-grab text-muted-foreground"><GripVertical className="size-4" /></span>
                    <div>
                      <CardTitle className="text-base">{entry.role}</CardTitle>
                      <CardDescription>{entry.organization}</CardDescription>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {formatDate(entry.startDate)} - {entry.isCurrent ? "Present" : entry.endDate ? formatDate(entry.endDate) : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                      {expandedId === entry.id ? "▲" : "▼"}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(entry)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(entry.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === entry.id && (
                <CardContent>
                  {entry.description && <p className="mb-3 text-sm text-muted-foreground">{entry.description}</p>}
                  {entry.bullets.length > 0 && (
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {entry.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Volunteer Experience"
          description="Are you sure you want to delete this entry?"
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
