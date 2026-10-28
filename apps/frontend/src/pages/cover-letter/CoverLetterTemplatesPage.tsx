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
  useCoverLetterTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@/hooks/useCoverLetter";
import type {
  CoverLetterTemplate,
  CoverLetterTemplateCreate,
  CoverLetterTone,
  CoverLetterStyle,
  TemplateIndustry,
} from "@/types/cover-letter";

const toneLabels: Record<CoverLetterTone, string> = {
  professional: "Professional",
  casual: "Casual",
  enthusiastic: "Enthusiastic",
  formal: "Formal",
  creative: "Creative",
  confident: "Confident",
  humble: "Humble",
};

const styleLabels: Record<CoverLetterStyle, string> = {
  standard: "Standard",
  narrative: "Narrative",
  achievement: "Achievement",
  value_proposition: "Value Proposition",
  storytelling: "Storytelling",
  minimal: "Minimal",
};

const industryLabels: Record<TemplateIndustry, string> = {
  technology: "Technology",
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  marketing: "Marketing",
  design: "Design",
  engineering: "Engineering",
  sales: "Sales",
  general: "General",
};

function TemplateDialog({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template?: CoverLetterTemplate;
}) {
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [industry, setIndustry] = useState<TemplateIndustry>(template?.industry ?? "general");
  const [tone, setTone] = useState<CoverLetterTone>(template?.tone ?? "professional");
  const [style, setStyle] = useState<CoverLetterStyle>(template?.style ?? "standard");
  const [content, setContent] = useState(template?.content ?? "");
  const [tagsInput, setTagsInput] = useState(template?.tags?.join(", ") ?? "");

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim() || !content.trim()) return;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const data: CoverLetterTemplateCreate = {
      name,
      description: description || undefined,
      industry,
      tone,
      style,
      content,
      tags,
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
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Industry</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={industry} onChange={(e) => setIndustry(e.target.value as TemplateIndustry)}>
                {Object.entries(industryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Tone</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={tone} onChange={(e) => setTone(e.target.value as CoverLetterTone)}>
                {Object.entries(toneLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Style</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={style} onChange={(e) => setStyle(e.target.value as CoverLetterStyle)}>
                {Object.entries(styleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Template content with {{placeholders}}..." className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. tech, startup, senior" className="mt-1" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!name.trim() || !content.trim()}>
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
  template: CoverLetterTemplate | null;
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
            <Badge variant="secondary" size="sm">{industryLabels[template.industry]}</Badge>
            <Badge variant="outline" size="sm">{toneLabels[template.tone]}</Badge>
            <Badge variant="outline" size="sm">{styleLabels[template.style]}</Badge>
          </div>
          <Separator />
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">{template.content}</div>
          {template.placeholders && template.placeholders.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1">Placeholders</p>
              <div className="flex flex-wrap gap-1.5">
                {template.placeholders.map((p) => (
                  <Badge key={p} variant="info" size="sm">{`{{${p}}}`}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const CoverLetterTemplatesPage: FC = () => {
  const { data: templates = [], isLoading } = useCoverLetterTemplates();
  const deleteMutation = useDeleteTemplate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CoverLetterTemplate | undefined>();
  const [previewTemplate, setPreviewTemplate] = useState<CoverLetterTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Cover Letter Templates"
          description="Create and manage reusable cover letter templates"
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

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={180} />
            ))}
          </div>
        ) : templates.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
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
                    <Badge variant="secondary" size="sm">{industryLabels[template.industry]}</Badge>
                    <Badge variant="outline" size="sm">{toneLabels[template.tone]}</Badge>
                    <Badge variant="outline" size="sm">{styleLabels[template.style]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{template.content}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">{template.usage_count} uses</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setPreviewTemplate(template);
                          setPreviewOpen(true);
                        }}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingTemplate(template);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteMutation.mutate(template.id)}
                      >
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
              <p className="mt-3 text-sm font-medium">No templates yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a template to reuse your best cover letter structures
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
    </PageContainer>
  );
};
