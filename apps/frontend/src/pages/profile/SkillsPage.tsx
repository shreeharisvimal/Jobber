import { type FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wrench,
  Plus,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/layout/Tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Statistic } from "@/components/ui/statistic";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  yearsOfExperience: number | null;
  isPrimary: boolean;
  order: number;
}

interface SkillFormData {
  name: string;
  category: string;
  proficiency: string;
  yearsOfExperience: string;
  isPrimary: boolean;
}

const emptyForm: SkillFormData = {
  name: "",
  category: "general",
  proficiency: "intermediate",
  yearsOfExperience: "",
  isPrimary: false,
};

const proficiencyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const defaultCategories = ["general", "programming", "frameworks", "tools", "soft-skills", "languages", "design"];

const proficiencyBadgeVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  beginner: "default",
  intermediate: "info",
  advanced: "warning",
  expert: "success",
};

export const SkillsPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormData>(emptyForm);
  const [activeTab, setActiveTab] = useState("all");

  const { data: skills = [], isLoading, error } = useQuery<Skill[]>({
    queryKey: ["career-profile", "skills"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/skills");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: SkillFormData) => {
      const payload = { ...data, yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : null };
      const response = await apiClient.post("/career-profile/skills", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "skills"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Skill added");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to add skill"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SkillFormData }) => {
      const payload = { ...data, yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : null };
      const response = await apiClient.put(`/career-profile/skills/${id}`, payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "skills"] });
      toast.success("Skill updated");
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => { toast.error("Failed to update skill"); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/career-profile/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-profile", "skills"] });
      queryClient.invalidateQueries({ queryKey: ["career-profile", "overview"] });
      toast.success("Skill deleted");
      setDeletingId(null);
    },
    onError: () => { toast.error("Failed to delete skill"); },
  });

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience?.toString() ?? "",
      isPrimary: skill.isPrimary,
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

  const categories = Array.from(new Set([...defaultCategories, ...skills.map((s) => s.category)]));

  const filteredSkills = activeTab === "all"
    ? skills
    : skills.filter((s) => s.category === activeTab);

  const skillsByCategory = categories.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  const proficiencyCounts = skills.reduce<Record<string, number>>((acc, s) => {
    acc[s.proficiency] = (acc[s.proficiency] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </div>
          <Skeleton variant="rectangular" height={400} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader title="Skills" description="Manage your professional skills" backHref="/profile" />
          <Alert variant="danger" title="Failed to load skills" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Skills"
          description="Manage and organize your professional skills"
          backHref="/profile"
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
              Add Skill
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic label="Total Skills" value={skills.length} icon={<Wrench className="size-5" />} variant="brand" />
          <Statistic label="Expert" value={proficiencyCounts["expert"] ?? 0} icon={<Star className="size-5" />} variant="success" />
          <Statistic label="Advanced" value={proficiencyCounts["advanced"] ?? 0} icon={<Star className="size-5" />} variant="warning" />
          <Statistic label="Primary Skills" value={skills.filter((s) => s.isPrimary).length} icon={<Star className="size-5" />} variant="brand" />
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Skill" : "New Skill"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Skill Name" htmlFor="name" required>
                  <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="React" />
                </Field>
                <Field label="Category" htmlFor="category">
                  <Input id="category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="frameworks" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Proficiency" htmlFor="proficiency">
                  <Select id="proficiency" value={form.proficiency} onChange={(e) => setForm((p) => ({ ...p, proficiency: e.target.value }))}>
                    {proficiencyLevels.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Years of Experience" htmlFor="yearsOfExperience">
                  <Input id="yearsOfExperience" type="number" min={0} max={50} value={form.yearsOfExperience} onChange={(e) => setForm((p) => ({ ...p, yearsOfExperience: e.target.value }))} placeholder="5" />
                </Field>
              </div>
              <Switch checked={form.isPrimary} onChange={(checked) => setForm((p) => ({ ...p, isPrimary: checked }))} label="Primary skill" />
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {editingId ? "Update" : "Add"} Skill
              </Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </CardFooter>
          </Card>
        )}

        {skills.length === 0 && !showForm ? (
          <EmptyState
            icon={<Wrench className="size-7" />}
            title="No skills yet"
            description="Add your professional skills to showcase your expertise."
            action={{ label: "Add Skill", onClick: () => { setEditingId(null); setForm(emptyForm); setShowForm(true); } }}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="pills">
              <TabsTrigger value="all" count={skills.length}>All</TabsTrigger>
              {categories.filter((c) => skillsByCategory[c]?.length).map((cat) => (
                <TabsTrigger key={cat} value={cat} count={skillsByCategory[cat]?.length}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab}>
              {activeTab === "all" ? (
                <div className="space-y-6">
                  {categories.filter((c) => skillsByCategory[c]?.length).map((cat) => (
                    <div key={cat}>
                      <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillsByCategory[cat]?.map((skill) => (
                          <div key={skill.id} className="group relative flex items-center gap-1.5">
                            <Badge
                              variant={proficiencyBadgeVariant[skill.proficiency] ?? "default"}
                              size="lg"
                              className="pr-1"
                            >
                              {skill.isPrimary && <Star className="size-3 fill-current" />}
                              {skill.name}
                              {skill.yearsOfExperience != null && (
                                <span className="ml-1 text-[10px] opacity-70">{skill.yearsOfExperience}y</span>
                              )}
                              <span className="ml-0.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                <button type="button" onClick={() => handleEdit(skill)} className="rounded p-0.5 hover:bg-black/10">
                                  <Pencil className="size-2.5" />
                                </button>
                                <button type="button" onClick={() => setDeletingId(skill.id)} className="rounded p-0.5 hover:bg-black/10">
                                  <Trash2 className="size-2.5" />
                                </button>
                              </span>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.map((skill) => (
                    <div key={skill.id} className="group relative flex items-center gap-1.5">
                      <Badge
                        variant={proficiencyBadgeVariant[skill.proficiency] ?? "default"}
                        size="lg"
                        className="pr-1"
                      >
                        {skill.isPrimary && <Star className="size-3 fill-current" />}
                        {skill.name}
                        {skill.yearsOfExperience != null && (
                          <span className="ml-1 text-[10px] opacity-70">{skill.yearsOfExperience}y</span>
                        )}
                        <span className="ml-0.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button type="button" onClick={() => handleEdit(skill)} className="rounded p-0.5 hover:bg-black/10">
                            <Pencil className="size-2.5" />
                          </button>
                          <button type="button" onClick={() => setDeletingId(skill.id)} className="rounded p-0.5 hover:bg-black/10">
                            <Trash2 className="size-2.5" />
                          </button>
                        </span>
                      </Badge>
                    </div>
                  ))}
                  {filteredSkills.length === 0 && (
                    <p className="text-sm text-muted-foreground">No skills in this category.</p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <ConfirmationDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Delete Skill"
          description="Are you sure you want to delete this skill?"
          confirmLabel="Delete"
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          loading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
};
