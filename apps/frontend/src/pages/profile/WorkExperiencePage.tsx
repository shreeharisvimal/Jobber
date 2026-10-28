import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
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
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  bullets: string[];
  skillsUsed: string[];
  highlights: string[];
  order: number;
}

interface ExperienceFormData {
  company: string;
  position: string;
  location: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  bullets: string;
  skillsUsed: string;
  highlights: string;
}

const emptyForm: ExperienceFormData = {
  company: "",
  position: "",
  location: "",
  employmentType: "full-time",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  bullets: "",
  skillsUsed: "",
  highlights: "",
};

const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

const employmentTypeBadgeVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  "full-time": "success",
  "part-time": "info",
  "contract": "warning",
  "freelance": "brand",
  "internship": "default",
  "temporary": "default",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function parseList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const WorkExperiencePage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceFormData>(emptyForm);

  const { data: experiences = [], isLoading, error } = useQuery<WorkExperience[]>({
    queryKey: ["career-profile", "experience"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/experience");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ExperienceFormData) => {
      const payload = {
        ...data,
        bullets: parseList(data.bullets),
        skillsUsed: parseList(data.skillsUsed),
        highlights: parseList(data.highlights),
      };
      const response = await apiClient.post("/career-profile/experience", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "experience"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Experience added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to add experience");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExperienceFormData }) => {
      const payload = {
        ...data,
        bullets: parseList(data.bullets),
        skillsUsed: parseList(data.skillsUsed),
        highlights: parseList(data.highlights),
      };
      const response = await apiClient.put(`/career-profile/experience/${id}`, payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "experience"] });
      toast.success("Experience updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to update experience");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "experience"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Experience deleted");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete experience");
    },
  });

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      position: exp.position,
      location: exp.location ?? "",
      employmentType: exp.employmentType,
      startDate: exp.startDate,
      endDate: exp.endDate ?? "",
      isCurrent: exp.isCurrent,
      description: exp.description,
      bullets: exp.bullets.join("\n"),
      skillsUsed: exp.skillsUsed.join("\n"),
      highlights: exp.highlights.join("\n"),
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
              <Skeleton key={i} variant="rectangular" height={140} />
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
          <PageHeader
            title="Work Experience"
            description="Manage your professional work history"
            backHref="/profile"
          />
          <Alert variant="danger" title="Failed to load experiences" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Work Experience"
          description="Manage your professional work history"
          backHref="/profile"
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setShowForm(true);
              }}
            >
              Add Experience
            </Button>
          }
        />

        {experiences.length === 0 && !showForm && (
          <EmptyState
            icon={<Briefcase className="size-7" />}
            title="No work experiences yet"
            description="Add your work history to build your professional profile."
            action={{
              label: "Add Experience",
              onClick: () => {
                setEditingId(null);
                setForm(emptyForm);
                setShowForm(true);
              },
            }}
          />
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Experience" : "New Experience"}</CardTitle>
              <CardDescription>
                {editingId ? "Update your work experience details." : "Add a new work experience to your profile."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company" htmlFor="company" required>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Acme Corp"
                  />
                </Field>
                <Field label="Position" htmlFor="position" required>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                    placeholder="Software Engineer"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location" htmlFor="location">
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                  />
                </Field>
                <Field label="Employment Type" htmlFor="employmentType">
                  <Select
                    id="employmentType"
                    value={form.employmentType}
                    onChange={(e) => setForm((p) => ({ ...p, employmentType: e.target.value }))}
                  >
                    {employmentTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start Date" htmlFor="startDate" required>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  />
                </Field>
                <Field label="End Date" htmlFor="endDate">
                  <Input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    disabled={form.isCurrent}
                  />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={form.isCurrent}
                  onChange={(e) => setForm((p) => ({
                    ...p,
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? "" : p.endDate,
                  }))}
                  className="size-4 rounded border-neutral-300"
                />
                <label htmlFor="isCurrent" className="text-sm text-muted-foreground">
                  Currently working here
                </label>
              </div>
              <Field label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of your role..."
                  rows={3}
                />
              </Field>
              <Field
                label="Bullet Points"
                htmlFor="bullets"
                hint="One per line"
              >
                <Textarea
                  id="bullets"
                  value={form.bullets}
                  onChange={(e) => setForm((p) => ({ ...p, bullets: e.target.value }))}
                  placeholder="Led a team of 5 engineers&#10;Reduced latency by 40%&#10;Implemented CI/CD pipeline"
                  rows={4}
                />
              </Field>
              <Field
                label="Skills Used"
                htmlFor="skillsUsed"
                hint="One per line"
              >
                <Textarea
                  id="skillsUsed"
                  value={form.skillsUsed}
                  onChange={(e) => setForm((p) => ({ ...p, skillsUsed: e.target.value }))}
                  placeholder="React&#10;TypeScript&#10;Node.js"
                  rows={3}
                />
              </Field>
              <Field
                label="Highlights"
                htmlFor="highlights"
                hint="One per line"
              >
                <Textarea
                  id="highlights"
                  value={form.highlights}
                  onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))}
                  placeholder="Promoted twice in 3 years&#10;Awarded Employee of the Month"
                  rows={3}
                />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {editingId ? "Update" : "Add"} Experience
              </Button>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 cursor-grab text-muted-foreground">
                      <GripVertical className="size-4" />
                    </span>
                    <div>
                      <CardTitle className="text-base">{exp.position}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{exp.company}</span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {exp.location}
                          </span>
                        )}
                      </CardDescription>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                        </span>
                        <Badge variant={employmentTypeBadgeVariant[exp.employmentType] ?? "default"} size="sm">
                          {employmentTypes.find((t) => t.value === exp.employmentType)?.label ?? exp.employmentType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                    >
                      {expandedId === exp.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(exp)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(exp.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === exp.id && (
                <CardContent className="space-y-4">
                  {exp.description && (
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  )}
                  {exp.bullets.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-foreground">Responsibilities</h4>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exp.skillsUsed.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-foreground">Skills Used</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skillsUsed.map((s, i) => (
                          <Badge key={i} variant="secondary" size="sm">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {exp.highlights.length > 0 && (
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-foreground">Highlights</h4>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
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
          title="Delete Experience"
          description="Are you sure you want to delete this work experience? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
