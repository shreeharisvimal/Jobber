import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
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

interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface CustomSectionFormData {
  title: string;
  content: string;
}

const emptyForm: CustomSectionFormData = { title: "", content: "" };

export const CustomSectionsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomSectionFormData>(emptyForm);

  const { data: sections = [], isLoading, error } = useQuery<CustomSection[]>({
    queryKey: ["career-profile", "custom-sections"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/custom-sections");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CustomSectionFormData) => {
      const response = await apiClient.post("/career-profile/custom-sections", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "custom-sections"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Section added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add section"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CustomSectionFormData }) => {
      const response = await apiClient.put(`/career-profile/custom-sections/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "custom-sections"] });
      toast.success("Section updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update section"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/career-profile/custom-sections/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "custom-sections"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Section deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete section"); },
  });

  const handleEdit = (section: CustomSection) => {
    setEditingId(section.id);
    setForm({ title: section.title, content: section.content });
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
          <PageHeader title="Custom Sections" description="Create custom sections for your profile" backHref="/profile" />
          <Alert variant="danger" title="Failed to load sections" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Custom Sections"
          description="Create custom sections to add any additional information to your profile"
          backHref="/profile"
          actions={<Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>Add Section</Button>}
        />

        {sections.length === 0 && !showForm && (
          <EmptyState icon={<FileText className="size-7" />} title="No custom sections yet" description="Create custom sections to add any additional information to your profile." action={{ label: "Add Section", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }} />
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Edit Section" : "New Section"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Section Title" htmlFor="title" required>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="My Custom Section" />
              </Field>
              <Field label="Content" htmlFor="content">
                <Textarea id="content" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={8} placeholder="Add your content here. You can include detailed information about anything relevant to your career profile." />
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{editingId ? "Update" : "Add"} Section</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 cursor-grab text-muted-foreground"><GripVertical className="size-4" /></span>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}>
                      {expandedId === section.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(section)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(section.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === section.id && section.content && (
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground">{section.content}</div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <ConfirmationDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)} title="Delete Section" description="Are you sure you want to delete this custom section?" confirmLabel="Delete" onConfirm={() => deletingId && deleteMutation.mutate(deletingId)} loading={deleteMutation.isPending} />
      </div>
    </PageContainer>
  );
};
