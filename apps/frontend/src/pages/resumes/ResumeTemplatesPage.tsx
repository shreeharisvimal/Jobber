import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Layout,
  Check,
  Eye,
  Type,
  Columns,
  Plus,
  Star,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/layout/Tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  layout: string;
  colors: string[];
  typography: string;
  thumbnail: string;
  isCustom: boolean;
  isDefault: boolean;
  rating: number;
}

const categories = [
  { value: "all", label: "All" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "executive", label: "Executive" },
  { value: "engineering", label: "Engineering" },
  { value: "designer", label: "Designer" },
  { value: "academic", label: "Academic" },
  { value: "compact", label: "Compact" },
  { value: "creative", label: "Creative" },
];

const layoutOptions = [
  { value: "single-column", label: "Single Column" },
  { value: "two-column", label: "Two Column" },
  { value: "sidebar", label: "Sidebar Layout" },
  { value: "grid", label: "Grid Layout" },
];

const colorPalettes = [
  { name: "Professional", colors: ["#1a1a2e", "#16213e", "#0f3460"] },
  { name: "Modern", colors: ["#2d3436", "#636e72", "#b2bec3"] },
  { name: "Creative", colors: ["#6c5ce7", "#a29bfe", "#fd79a8"] },
  { name: "Corporate", colors: ["#0c2461", "#1e3799", "#4a69bd"] },
  { name: "Nature", colors: ["#1B9CFC", "#25CCF7", "#55E6C1"] },
  { name: "Sunset", colors: ["#e17055", "#fdcb6e", "#e84393"] },
];

interface TemplateFormData {
  name: string;
  description: string;
  layout: string;
  colors: string[];
  typography: string;
}

const emptyForm: TemplateFormData = {
  name: "",
  description: "",
  layout: "single-column",
  colors: ["#1a1a2e"],
  typography: "Inter",
};

export const ResumeTemplatesPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState<TemplateFormData>(emptyForm);

  const { data: templates = [], isLoading, error } = useQuery<ResumeTemplate[]>({
    queryKey: ["templates", activeCategory],
    queryFn: async () => {
      const response = await apiClient.get("/templates", {
        params: activeCategory === "all" ? {} : { category: activeCategory },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const applyTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await apiClient.post(`/templates/${templateId}/apply`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Template applied");
      setPreviewTemplate(null);
    },
    onError: () => {
      toast.error("Failed to apply template");
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      const response = await apiClient.post("/templates", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template created");
      setShowCreateForm(false);
      setForm(emptyForm);
    },
    onError: () => {
      toast.error("Failed to create template");
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={50} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={300} />
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
            title="Templates"
            description="Choose a template for your resume"
            backHref="/resumes"
          />
          <Alert variant="danger" title="Failed to load templates" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Templates"
          description="Choose a template to style your resume"
          backHref="/resumes"
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setShowCreateForm(true);
                setForm(emptyForm);
              }}
            >
              Create Custom Template
            </Button>
          }
        />

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {templates.length === 0 ? (
          <EmptyState
            icon={<Layout className="size-7" />}
            title="No templates found"
            description="No templates available in this category."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted p-4">
                  <div className="h-full w-full rounded border border-border bg-background p-4 shadow-sm">
                    <div className="mb-2 h-2 w-1/3 rounded bg-foreground/20" />
                    <div className="mb-1 h-1 w-2/3 rounded bg-foreground/10" />
                    <div className="mb-3 h-1 w-1/2 rounded bg-foreground/10" />
                    <div className="mb-2 h-1 w-full rounded bg-foreground/5" />
                    <div className="mb-1 h-1 w-4/5 rounded bg-foreground/5" />
                    <div className="mb-3 h-1 w-3/4 rounded bg-foreground/5" />
                    <div className="mb-2 h-1 w-2/3 rounded bg-foreground/10" />
                    <div className="mb-1 h-1 w-3/4 rounded bg-foreground/5" />
                    <div className="h-1 w-1/2 rounded bg-foreground/5" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    {template.isCustom && (
                      <Badge variant="brand" size="sm">Custom</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Columns className="size-3" />
                    {template.layout}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Type className="size-3" />
                    {template.typography}
                  </div>
                  <div className="flex gap-1">
                    {template.colors.map((color, i) => (
                      <div
                        key={i}
                        className="size-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3",
                          i < template.rating ? "fill-warning-400 text-warning-400" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="size-3" />}
                    onClick={() => setPreviewTemplate(template)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Check className="size-3" />}
                    onClick={() => applyTemplateMutation.mutate(template.id)}
                    loading={applyTemplateMutation.isPending}
                  >
                    Apply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {previewTemplate && (
          <Modal
            open={!!previewTemplate}
            onOpenChange={(open) => !open && setPreviewTemplate(null)}
            title={`Preview: ${previewTemplate.name}`}
            size="lg"
            footer={
              <>
                <Button variant="ghost" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
                <Button
                  leftIcon={<Check className="size-4" />}
                  onClick={() => applyTemplateMutation.mutate(previewTemplate.id)}
                  loading={applyTemplateMutation.isPending}
                >
                  Apply Template
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-lg border border-border bg-muted p-6">
                <div className="mx-auto max-w-md space-y-4">
                  <div className="h-3 w-1/3 rounded bg-foreground/20" />
                  <div className="h-2 w-2/3 rounded bg-foreground/10" />
                  <div className="h-2 w-1/2 rounded bg-foreground/10" />
                  <div className="h-px w-full bg-border" />
                  <div className="space-y-2">
                    <div className="h-2 w-1/4 rounded bg-foreground/10" />
                    <div className="h-1.5 w-full rounded bg-foreground/5" />
                    <div className="h-1.5 w-4/5 rounded bg-foreground/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-1/3 rounded bg-foreground/10" />
                    <div className="h-1.5 w-3/4 rounded bg-foreground/5" />
                    <div className="h-1.5 w-2/3 rounded bg-foreground/5" />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Layout</p>
                  <p className="text-sm">{previewTemplate.layout}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Typography</p>
                  <p className="text-sm">{previewTemplate.typography}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Category</p>
                  <p className="text-sm">{previewTemplate.category}</p>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {showCreateForm && (
          <Modal
            open={showCreateForm}
            onOpenChange={(open) => !open && setShowCreateForm(false)}
            title="Create Custom Template"
            size="lg"
            footer={
              <>
                <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => createTemplateMutation.mutate(form)}
                  loading={createTemplateMutation.isPending}
                >
                  Create Template
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Field label="Template Name" htmlFor="templateName" required>
                <Input
                  id="templateName"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="My Custom Template"
                />
              </Field>
              <Field label="Description" htmlFor="templateDesc">
                <Textarea
                  id="templateDesc"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your template..."
                  rows={3}
                />
              </Field>
              <Field label="Layout" htmlFor="templateLayout">
                <Select
                  id="templateLayout"
                  value={form.layout}
                  onChange={(e) => setForm((p) => ({ ...p, layout: e.target.value }))}
                >
                  {layoutOptions.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Color Palette" htmlFor="templateColors">
                <div className="flex gap-3">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, colors: palette.colors }))}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors",
                        form.colors[0] === palette.colors[0]
                          ? "border-brand-300 bg-brand-50"
                          : "border-border hover:bg-accent/50"
                      )}
                    >
                      <div className="flex gap-0.5">
                        {palette.colors.map((c, i) => (
                          <div
                            key={i}
                            className="size-4 rounded-full border border-border"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{palette.name}</span>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Typography" htmlFor="templateTypography">
                <Input
                  id="templateTypography"
                  value={form.typography}
                  onChange={(e) => setForm((p) => ({ ...p, typography: e.target.value }))}
                  placeholder="Inter"
                />
              </Field>
            </div>
          </Modal>
        )}
      </div>
    </PageContainer>
  );
};
