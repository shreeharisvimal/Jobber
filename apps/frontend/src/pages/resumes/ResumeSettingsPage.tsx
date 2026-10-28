import { type FC, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Globe,
  Lock,
  Users,
  Copy,
  Trash2,
  Briefcase,
  Building,
  Target,
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ResumeSettings {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  targetCompany: string;
  targetIndustry: string;
  language: string;
  visibility: "private" | "contacts_only" | "public";
  isDefault: boolean;
}

const visibilityOptions = [
  { value: "private", label: "Private", icon: Lock, description: "Only you can see this resume" },
  { value: "contacts_only", label: "Contacts Only", icon: Users, description: "Visible to your contacts" },
  { value: "public", label: "Public", icon: Globe, description: "Anyone with the link can view" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

export const ResumeSettingsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [form, setForm] = useState<Partial<ResumeSettings>>({});

  const { data: settings, isLoading, error } = useQuery<ResumeSettings>({
    queryKey: ["resumes", id, "settings"],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}/settings`);
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<ResumeSettings>) => {
      const response = await apiClient.put(`/resumes/${id}/settings`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "settings"] });
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      toast.success("Settings updated");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted");
      setShowDeleteDialog(false);
      navigate("/resumes");
    },
    onError: () => {
      toast.error("Failed to delete resume");
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/resumes/${id}/duplicate`);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume duplicated");
      setShowDuplicateDialog(false);
    },
    onError: () => {
      toast.error("Failed to duplicate resume");
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(form);
  };

  const handleFieldChange = (field: keyof ResumeSettings, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={400} />
        </div>
      </PageContainer>
    );
  }

  if (error || !settings) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Resume Settings"
            description="Configure resume settings"
            backHref={`/resumes/${id}`}
          />
          <Alert variant="danger" title="Failed to load settings" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  const hasChanges = Object.keys(form).length > 0;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Resume Settings"
          description="Configure your resume settings and preferences"
          backHref={`/resumes/${id}`}
          actions={
            <Button
              size="sm"
              onClick={handleSave}
              loading={updateSettingsMutation.isPending}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          }
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Basic resume information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Resume Title" htmlFor="title" required>
                  <Input
                    id="title"
                    value={form.title ?? settings.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                  />
                </Field>
                <Field label="Description" htmlFor="description">
                  <Textarea
                    id="description"
                    value={form.description ?? settings.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    rows={3}
                    placeholder="Brief description of this resume..."
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target</CardTitle>
                <CardDescription>Who this resume is targeted at</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Target Role" htmlFor="targetRole">
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="targetRole"
                      value={form.targetRole ?? settings.targetRole}
                      onChange={(e) => handleFieldChange("targetRole", e.target.value)}
                      placeholder="Software Engineer"
                      className="pl-9"
                    />
                  </div>
                </Field>
                <Field label="Target Company" htmlFor="targetCompany">
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="targetCompany"
                      value={form.targetCompany ?? settings.targetCompany}
                      onChange={(e) => handleFieldChange("targetCompany", e.target.value)}
                      placeholder="Google, Meta, etc."
                      className="pl-9"
                    />
                  </div>
                </Field>
                <Field label="Industry" htmlFor="targetIndustry">
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="targetIndustry"
                      value={form.targetIndustry ?? settings.targetIndustry}
                      onChange={(e) => handleFieldChange("targetIndustry", e.target.value)}
                      placeholder="Technology, Finance, etc."
                      className="pl-9"
                    />
                  </div>
                </Field>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>Control who can see this resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {visibilityOptions.map((option) => {
                  const Icon = option.icon;
                  const currentValue = form.visibility ?? settings.visibility;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFieldChange("visibility", option.value)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        currentValue === option.value
                          ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                          : "border-border hover:bg-accent/50"
                      )}
                    >
                      <Icon className="size-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      {currentValue === option.value && (
                        <Badge variant="brand" size="sm">Active</Badge>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Additional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Language" htmlFor="language">
                  <Select
                    id="language"
                    value={form.language ?? settings.language}
                    onChange={(e) => handleFieldChange("language", e.target.value)}
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </Select>
                </Field>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Default Resume</p>
                    <p className="text-xs text-muted-foreground">
                      Use as default when creating new applications
                    </p>
                  </div>
                  <Switch
                    checked={form.isDefault ?? settings.isDefault}
                    onChange={(checked) => handleFieldChange("isDefault", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-danger-200">
              <CardHeader>
                <CardTitle className="text-danger-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">Duplicate Resume</p>
                    <p className="text-xs text-muted-foreground">Create a copy of this resume</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Copy className="size-3" />}
                    onClick={() => setShowDuplicateDialog(true)}
                  >
                    Duplicate
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-danger-200 p-4">
                  <div>
                    <p className="text-sm font-medium text-danger-600">Delete Resume</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete this resume and all its versions
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 className="size-3" />}
                    onClick={() => setShowDeleteDialog(true)}
                    className="border-danger-200 text-danger-600 hover:bg-danger-50"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Resume"
          description="This will permanently delete this resume and all its versions. This action cannot be undone."
          confirmLabel="Delete Resume"
          onConfirm={() => deleteMutation.mutate()}
          loading={deleteMutation.isPending}
          variant="danger"
        />

        <ConfirmationDialog
          open={showDuplicateDialog}
          onOpenChange={setShowDuplicateDialog}
          title="Duplicate Resume"
          description="Create a complete copy of this resume including all sections and settings."
          confirmLabel="Duplicate"
          onConfirm={() => duplicateMutation.mutate()}
          loading={duplicateMutation.isPending}
          variant="info"
        />
      </div>
    </PageContainer>
  );
};
