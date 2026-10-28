import { type FC, useState } from "react";
import {
  Layout,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInterviewTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@/hooks/useInterview";
import type { InterviewTemplate } from "@/types/interview";

const sessionTypeLabels: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  coding: "Coding",
  system_design: "System Design",
  case_study: "Case Study",
  leadership: "Leadership",
  hr: "HR",
  mixed: "Mixed",
  custom: "Custom",
};

const difficultyLabels: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

const modeLabels: Record<string, string> = {
  timed: "Timed",
  untimed: "Untimed",
  simulation: "Simulation",
};

function TemplateDialog({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template?: InterviewTemplate;
}) {
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [sessionType, setSessionType] = useState(template?.template_type ?? "mixed");
  const [difficulty, setDifficulty] = useState(template?.difficulty ?? "medium");
  const [durationMinutes, setDurationMinutes] = useState(template?.duration_minutes ?? 30);
  const [questionCount, setQuestionCount] = useState(template?.question_count ?? 10);
  const [targetIndustry, setTargetIndustry] = useState(template?.target_industry ?? "");
  const [targetRole, setTargetRole] = useState(template?.target_role ?? "");
  const [companyName, setCompanyName] = useState(template?.company_name ?? "");

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    const data: Partial<InterviewTemplate> = {
      name,
      description: description || undefined,
      template_type: sessionType,
      difficulty,
      duration_minutes: durationMinutes,
      question_count: questionCount,
      target_industry: targetIndustry || undefined,
      target_role: targetRole || undefined,
      company_name: companyName || undefined,
    };
    if (template) {
      updateMutation.mutate(
        { id: template.id, data },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">
            {template ? "Edit Template" : "Create Template"}
          </CardTitle>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Optional description" className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Session Type</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
                {Object.entries(sessionTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {Object.entries(difficultyLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Question Count</label>
              <Input type="number" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="mt-1" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Target Industry</label>
              <Input value={targetIndustry} onChange={(e) => setTargetIndustry(e.target.value)} placeholder="e.g. Technology" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Target Role</label>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google" className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!name.trim()}>
              {template ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PreviewDialog({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template: InterviewTemplate | null;
}) {
  if (!open || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" size="sm">{sessionTypeLabels[template.template_type ?? "mixed"]}</Badge>
            <Badge variant="outline" size="sm">{difficultyLabels[template.difficulty ?? "medium"]}</Badge>
            <Badge variant="outline" size="sm">{modeLabels[template.mode ?? "untimed"]}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{template.duration_minutes ?? "N/A"} min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Questions</p>
              <p className="font-medium">{template.question_count ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Usage</p>
              <p className="font-medium">{template.usage_count} times</p>
            </div>
          </div>
          {template.target_industry && (
            <div className="text-sm">
              <p className="text-muted-foreground">Target Industry</p>
              <p className="font-medium">{template.target_industry}</p>
            </div>
          )}
          {template.target_role && (
            <div className="text-sm">
              <p className="text-muted-foreground">Target Role</p>
              <p className="font-medium">{template.target_role}</p>
            </div>
          )}
          {template.company_name && (
            <div className="text-sm">
              <p className="text-muted-foreground">Company</p>
              <p className="font-medium">{template.company_name}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const InterviewTemplatesPage: FC = () => {
  const { data: templates = [], isLoading } = useInterviewTemplates();
  const deleteMutation = useDeleteTemplate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InterviewTemplate | undefined>();
  const [previewTemplate, setPreviewTemplate] = useState<InterviewTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  const filteredTemplates = templates.filter((t) => {
    if (filterType && t.template_type !== filterType) return false;
    if (filterDifficulty && t.difficulty !== filterDifficulty) return false;
    return true;
  });

  const systemTemplates = filteredTemplates.filter((t) => t.is_system);
  const customTemplates = filteredTemplates.filter((t) => !t.is_system);

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Interview Templates"
          description="Create and manage reusable interview session templates"
          icon={<Layout className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setEditingTemplate(undefined);
                setDialogOpen(true);
              }}
            >
              New Template
            </Button>
          }
        />

        <TemplateDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingTemplate(undefined);
          }}
          template={editingTemplate}
        />

        <PreviewDialog
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewTemplate(null);
          }}
          template={previewTemplate}
        />

        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {Object.entries(sessionTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            {Object.entries(difficultyLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={180} />
            ))}
          </div>
        ) : (
          <>
            {systemTemplates.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">System Templates</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {systemTemplates.map((template) => (
                    <Card key={template.id} className="group relative overflow-hidden transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            {template.description && (
                              <CardDescription className="line-clamp-2 mt-0.5">{template.description}</CardDescription>
                            )}
                          </div>
                          <Badge variant="info" size="sm">System</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" size="sm">{sessionTypeLabels[template.template_type ?? "mixed"]}</Badge>
                          <Badge variant="outline" size="sm">{difficultyLabels[template.difficulty ?? "medium"]}</Badge>
                          <Badge variant="outline" size="sm">{template.duration_minutes ?? 30}min</Badge>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-muted-foreground">{template.usage_count} uses</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon-sm" onClick={() => { setPreviewTemplate(template); setPreviewOpen(true); }}>
                              <Eye className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Custom Templates</h3>
              {customTemplates.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {customTemplates.map((template) => (
                    <Card key={template.id} className="group relative overflow-hidden transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            {template.description && (
                              <CardDescription className="line-clamp-2 mt-0.5">{template.description}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" size="sm">{sessionTypeLabels[template.template_type ?? "mixed"]}</Badge>
                          <Badge variant="outline" size="sm">{difficultyLabels[template.difficulty ?? "medium"]}</Badge>
                          <Badge variant="outline" size="sm">{template.duration_minutes ?? 30}min</Badge>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-muted-foreground">{template.usage_count} uses</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon-sm" onClick={() => { setPreviewTemplate(template); setPreviewOpen(true); }}>
                              <Eye className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => { setEditingTemplate(template); setDialogOpen(true); }}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => deleteMutation.mutate(template.id)}>
                              <Trash2 className="size-3.5 text-danger-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Layout className="mx-auto size-10 text-muted-foreground/50" />
                    <p className="mt-3 text-sm font-medium">No custom templates yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Create a template to reuse your best interview configurations
                    </p>
                    <Button
                      size="sm"
                      leftIcon={<Plus className="size-4" />}
                      className="mt-4"
                      onClick={() => setDialogOpen(true)}
                    >
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};
