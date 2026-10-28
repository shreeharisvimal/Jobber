import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  GripVertical,
} from "lucide-react";
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

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  gpa: string | null;
  description: string;
  bullets: string[];
  order: number;
}

interface EducationFormData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: string;
  description: string;
  bullets: string;
}

const emptyForm: EducationFormData = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  gpa: "",
  description: "",
  bullets: "",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function parseList(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export const EducationPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<EducationFormData>(emptyForm);

  const { data: entries = [], isLoading, error } = useQuery<Education[]>({
    queryKey: ["career-profile", "education"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/education");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: EducationFormData) => {
      const payload = { ...data, bullets: parseList(data.bullets) };
      const response = await apiClient.post("/career-profile/education", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "education"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Education added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add education"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EducationFormData }) => {
      const payload = { ...data, bullets: parseList(data.bullets) };
      const response = await apiClient.put(`/career-profile/education/${id}`, payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "education"] });
      toast.success("Education updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update education"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/education/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "education"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Education deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete education"); },
  });

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate ?? "",
      isCurrent: edu.isCurrent,
      gpa: edu.gpa ?? "",
      description: edu.description,
      bullets: edu.bullets.join("\n"),
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
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
          <PageHeader title="Education" description="Manage your educational background" backHref="/profile" />
          <Alert variant="danger" title="Failed to load education" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Education"
          description="Manage your educational background"
          backHref="/profile"
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}
            >
              Add Education
            </Button>
          }
        />

        {entries.length === 0 && !showForm && (
          <EmptyState
            icon={<GraduationCap className="size-7" />}
            title="No education entries yet"
            description="Add your educational background to strengthen your profile."
            action={{ label: "Add Education", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }}
          />
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Education" : "New Education"}</CardTitle>
              <CardDescription>
                {editingId ? "Update your education details." : "Add a new education entry to your profile."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Institution" htmlFor="institution" required>
                  <Input id="institution" value={form.institution} onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))} placeholder="MIT" />
                </Field>
                <Field label="Degree" htmlFor="degree" required>
                  <Input id="degree" value={form.degree} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} placeholder="Bachelor of Science" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Field of Study" htmlFor="fieldOfStudy">
                  <Input id="fieldOfStudy" value={form.fieldOfStudy} onChange={(e) => setForm((p) => ({ ...p, fieldOfStudy: e.target.value }))} placeholder="Computer Science" />
                </Field>
                <Field label="GPA" htmlFor="gpa">
                  <Input id="gpa" value={form.gpa} onChange={(e) => setForm((p) => ({ ...p, gpa: e.target.value }))} placeholder="3.8" />
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
                <label htmlFor="isCurrent" className="text-sm text-muted-foreground">Currently studying here</label>
              </div>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Relevant coursework, achievements..." rows={3} />
              </Field>
              <Field label="Activities & Honors" htmlFor="bullets" hint="One per line">
                <Textarea id="bullets" value={form.bullets} onChange={(e) => setForm((p) => ({ ...p, bullets: e.target.value }))} placeholder="Dean's List&#10;Computer Science Club President&#10;Hackathon Winner" rows={3} />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {editingId ? "Update" : "Add"} Education
              </Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {entries.map((edu) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 cursor-grab text-muted-foreground"><GripVertical className="size-4" /></span>
                    <div>
                      <CardTitle className="text-base">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</CardTitle>
                      <CardDescription>{edu.institution}</CardDescription>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(edu.startDate)} - {edu.isCurrent ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                        </span>
                        {edu.gpa && <Badge variant="secondary" size="sm">GPA: {edu.gpa}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}>
                      {expandedId === edu.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(edu)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(edu.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === edu.id && (
                <CardContent className="space-y-4">
                  {edu.description && <p className="text-sm text-muted-foreground">{edu.description}</p>}
                  {edu.bullets.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-foreground">Activities & Honors</h4>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {edu.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Education"
          description="Are you sure you want to delete this education entry? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
