import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Languages, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
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
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Language {
  id: string;
  name: string;
  proficiency: string;
  order: number;
}

interface LanguageFormData {
  name: string;
  proficiency: string;
}

const emptyForm: LanguageFormData = { name: "", proficiency: "conversational" };

const proficiencyLevels = [
  { value: "elementary", label: "Elementary" },
  { value: "conversational", label: "Conversational" },
  { value: "professional", label: "Professional" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

const proficiencyProgress: Record<string, number> = {
  elementary: 20,
  conversational: 40,
  professional: 65,
  fluent: 85,
  native: 100,
};

const proficiencyVariant: Record<string, "default" | "success" | "warning"> = {
  elementary: "default",
  conversational: "default",
  professional: "warning",
  fluent: "success",
  native: "success",
};

export const LanguagesPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<LanguageFormData>(emptyForm);

  const { data: languages = [], isLoading, error } = useQuery<Language[]>({
    queryKey: ["career-profile", "languages"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/languages");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: LanguageFormData) => {
      const response = await apiClient.post("/career-profile/languages", data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "languages"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Language added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add language"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LanguageFormData }) => {
      const response = await apiClient.put(`/career-profile/languages/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "languages"] });
      toast.success("Language updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update language"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/languages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "languages"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Language deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete language"); },
  });

  const handleEdit = (lang: Language) => {
    setEditingId(lang.id);
    setForm({ name: lang.name, proficiency: lang.proficiency });
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
          <Skeleton variant="rectangular" height={300} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader title="Languages" description="Manage your language proficiencies" backHref="/profile" />
          <Alert variant="danger" title="Failed to load languages" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Languages"
          description="Manage your language proficiencies"
          backHref="/profile"
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
              Add Language
            </Button>
          }
        />

        {languages.length === 0 && !showForm && (
          <EmptyState
            icon={<Languages className="size-7" />}
            title="No languages yet"
            description="Add languages you speak to highlight your communication skills."
            action={{ label: "Add Language", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }}
          />
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Language" : "New Language"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Language" htmlFor="name" required>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Spanish" />
              </Field>
              <Field label="Proficiency" htmlFor="proficiency">
                <Select id="proficiency" value={form.proficiency} onChange={(e) => setForm((p) => ({ ...p, proficiency: e.target.value }))}>
                  {proficiencyLevels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </Select>
              </Field>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {editingId ? "Update" : "Add"} Language
              </Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>{languages.length} {languages.length === 1 ? "language" : "languages"} added</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-4">
                <span className="cursor-grab text-muted-foreground"><GripVertical className="size-4" /></span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{lang.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={proficiencyVariant[lang.proficiency] ?? "default"} size="sm">
                        {proficiencyLevels.find((l) => l.value === lang.proficiency)?.label ?? lang.proficiency}
                      </Badge>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(lang)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeletingId(lang.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={proficiencyProgress[lang.proficiency] ?? 50}
                    variant={proficiencyVariant[lang.proficiency] ?? "default"}
                    size="sm"
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Language"
          description="Are you sure you want to delete this language?"
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
