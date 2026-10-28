import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  ExternalLink,
  Github,
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

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  url: string | null;
  githubUrl: string | null;
  bullets: string[];
  skillsUsed: string[];
  techStack: string[];
  order: number;
}

interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
  githubUrl: string;
  bullets: string;
  skillsUsed: string;
  techStack: string;
}

const emptyForm: ProjectFormData = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  url: "",
  githubUrl: "",
  bullets: "",
  skillsUsed: "",
  techStack: "",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function parseList(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export const ProjectsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(emptyForm);

  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ["career-profile", "projects"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/projects");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const payload = {
        ...data,
        bullets: parseList(data.bullets),
        skillsUsed: parseList(data.skillsUsed),
        techStack: parseList(data.techStack),
      };
      const response = await apiClient.post("/career-profile/projects", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Project added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add project"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProjectFormData }) => {
      const payload = {
        ...data,
        bullets: parseList(data.bullets),
        skillsUsed: parseList(data.skillsUsed),
        techStack: parseList(data.techStack),
      };
      const response = await apiClient.put(`/career-profile/projects/${id}`, payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "projects"] });
      toast.success("Project updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update project"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Project deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete project"); },
  });

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate ?? "",
      url: project.url ?? "",
      githubUrl: project.githubUrl ?? "",
      bullets: project.bullets.join("\n"),
      skillsUsed: project.skillsUsed.join("\n"),
      techStack: project.techStack.join("\n"),
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
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={160} />
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
          <PageHeader title="Projects" description="Showcase your project portfolio" backHref="/profile" />
          <Alert variant="danger" title="Failed to load projects" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Projects"
          description="Showcase your project portfolio"
          backHref="/profile"
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
              Add Project
            </Button>
          }
        />

        {projects.length === 0 && !showForm && (
          <EmptyState
            icon={<FolderGit2 className="size-7" />}
            title="No projects yet"
            description="Add your projects to showcase your work and technical skills."
            action={{ label: "Add Project", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }}
          />
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Project" : "New Project"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Project Name" htmlFor="name" required>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="My Awesome Project" />
              </Field>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="A brief description of the project..." rows={3} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start Date" htmlFor="startDate">
                  <Input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
                </Field>
                <Field label="End Date" htmlFor="endDate">
                  <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Project URL" htmlFor="url">
                  <Input id="url" type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
                </Field>
                <Field label="GitHub URL" htmlFor="githubUrl">
                  <Input id="githubUrl" type="url" value={form.githubUrl} onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
                </Field>
              </div>
              <Field label="Tech Stack" htmlFor="techStack" hint="One per line">
                <Textarea id="techStack" value={form.techStack} onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))} placeholder="React&#10;TypeScript&#10;PostgreSQL" rows={3} />
              </Field>
              <Field label="Skills Used" htmlFor="skillsUsed" hint="One per line">
                <Textarea id="skillsUsed" value={form.skillsUsed} onChange={(e) => setForm((p) => ({ ...p, skillsUsed: e.target.value }))} placeholder="Full-stack development&#10;API design" rows={3} />
              </Field>
              <Field label="Key Features" htmlFor="bullets" hint="One per line">
                <Textarea id="bullets" value={form.bullets} onChange={(e) => setForm((p) => ({ ...p, bullets: e.target.value }))} placeholder="Real-time collaboration&#10;CI/CD pipeline&#10;99.9% uptime" rows={4} />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {editingId ? "Update" : "Add"} Project
              </Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    {project.description && (
                      <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(project.startDate)}
                        {project.endDate ? ` - ${formatDate(project.endDate)}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(project)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(project.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary" size="sm">{tech}</Badge>
                    ))}
                  </div>
                )}
                {project.bullets.length > 0 && (
                  <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                    {project.bullets.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="gap-2 pt-0">
                {project.url && (
                  <Button variant="outline" size="xs" asChild>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="gap-1">
                      <ExternalLink className="size-3" /> Live
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" size="xs" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="gap-1">
                      <Github className="size-3" /> Code
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Project"
          description="Are you sure you want to delete this project?"
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
