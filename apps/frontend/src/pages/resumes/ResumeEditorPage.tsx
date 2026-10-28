import { type FC, type ChangeEvent, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FolderGit2,
  Languages,
  Heart,
  BookOpen,
  Trophy,
  Target,
  Save,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

interface ResumeSection {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  order: number;
  customTitle: string;
}

interface ResumeDetail {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  version: number;
  sections: ResumeSection[];
  autosaveStatus: "saved" | "unsaved" | "saving";
  updatedAt: string;
}

const sectionIcons: Record<string, typeof FileText> = {
  header: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  certifications: Award,
  projects: FolderGit2,
  languages: Languages,
  volunteer: Heart,
  publications: BookOpen,
  awards: Trophy,
  goals: Target,
  summary: FileText,
  custom: FileText,
};

export const ResumeEditorPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("header");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [customTitle, setCustomTitle] = useState("");
  const [descriptionMode, setDescriptionMode] = useState<"expanded" | "condensed">("expanded");
  const { data: resume, isLoading, error } = useQuery<ResumeDetail>({
    queryKey: ["resumes", id],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}`);
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<ResumeDetail>) => {
      const response = await apiClient.put(`/resumes/${id}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      toast.success("Resume saved");
    },
    onError: () => {
      toast.error("Failed to save resume");
    },
  });

  const toggleSectionMutation = useMutation({
    mutationFn: async ({ sectionId, enabled }: { sectionId: string; enabled: boolean }) => {
      const response = await apiClient.put(`/resumes/${id}/sections/${sectionId}`, { enabled });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      toast.success("Section updated");
    },
    onError: () => {
      toast.error("Failed to update section");
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async ({ sectionId, title }: { sectionId: string; title: string }) => {
      const response = await apiClient.put(`/resumes/${id}/sections/${sectionId}`, { customTitle: title });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      toast.success("Section title updated");
    },
    onError: () => {
      toast.error("Failed to update section title");
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ title: resume?.title });
  };

  const handlePublish = () => {
    saveMutation.mutate({ status: "published" });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 lg:grid-cols-[260px_1fr_300px]">
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="rectangular" height={600} />
            <Skeleton variant="rectangular" height={400} />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !resume) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Resume Editor"
            description="Edit your resume"
            backHref="/resumes"
          />
          <Alert variant="danger" title="Failed to load resume" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  const activeSectionData = resume.sections.find((s) => s.id === activeSection);

  return (
    <PageContainer fullWidth padding={false}>
      <div className="flex h-[calc(100vh-var(--header-height,64px))] overflow-hidden">
        <aside
          className={cn(
            "flex flex-col border-r border-border bg-background transition-all duration-200",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex items-center justify-between p-4">
            {!sidebarCollapsed && (
              <h2 className="text-sm font-semibold text-foreground">Sections</h2>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(sidebarCollapsed && "mx-auto")}
            >
              {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1 py-2">
            <nav className="flex flex-col gap-0.5 px-2">
              {resume.sections.map((section) => {
                const Icon = sectionIcons[section.type] ?? FileText;
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left w-full",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      !section.enabled && "opacity-50"
                    )}
                    title={sidebarCollapsed ? section.title : undefined}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 truncate">{section.customTitle || section.title}</span>
                        <Switch
                          checked={section.enabled}
                          onChange={(checked) =>
                            toggleSectionMutation.mutate({ sectionId: section.id, enabled: checked })
                          }
                          size="sm"
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/resumes"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </Link>
                <Separator orientation="vertical" className="h-5" />
                <h1 className="text-lg font-semibold text-foreground">{resume.title}</h1>
                <Badge variant={resume.status === "published" ? "success" : "warning"} size="sm">
                  {resume.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {resume.autosaveStatus === "saving" && "Saving..."}
                  {resume.autosaveStatus === "saved" && "Saved"}
                  {resume.autosaveStatus === "unsaved" && "Unsaved changes"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Save className="size-4" />}
                  onClick={handleSave}
                  loading={saveMutation.isPending}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  leftIcon={<CheckCircle2 className="size-4" />}
                  onClick={handlePublish}
                  loading={saveMutation.isPending}
                >
                  Publish
                </Button>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <Badge variant="info" size="sm">v{resume.version}</Badge>
              <Link to={`/resumes/${id}/versions`} className="text-xs text-brand-600 hover:underline">
                View version history
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
              {activeSectionData ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      {activeSectionData.customTitle || activeSectionData.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Field label="Custom Title" htmlFor="customTitle">
                        <Input
                          id="customTitle"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder={activeSectionData.title}
                          className="max-w-[200px]"
                        />
                      </Field>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateTitleMutation.mutate({
                            sectionId: activeSectionData.id,
                            title: customTitle,
                          })
                        }
                        disabled={!customTitle}
                      >
                        Update Title
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="min-h-[300px] rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
                    <Pencil className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Edit {activeSectionData.title.toLowerCase()} content here
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      Section ID: {activeSectionData.id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileText className="mb-3 size-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Select a section to edit</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <aside
          className={cn(
            "border-l border-border bg-background transition-all duration-200 overflow-auto",
            rightPanelOpen ? "w-80" : "w-12"
          )}
        >
          <div className="flex items-center justify-between p-4">
            {rightPanelOpen && (
              <h2 className="text-sm font-semibold text-foreground">Customize</h2>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
            >
              {rightPanelOpen ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>
          </div>
          {rightPanelOpen && (
            <div className="space-y-6 px-4 pb-4">
              <Separator />

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Description Mode</h3>
                <Select
                  value={descriptionMode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setDescriptionMode(e.target.value as "expanded" | "condensed")}
                >
                  <option value="expanded">Expanded</option>
                  <option value="condensed">Condensed</option>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Quick Actions</h3>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/resumes/${id}/sections`}>
                    <Settings className="mr-2 size-4" />
                    Manage Sections
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/resumes/${id}/versions`}>
                    <FileText className="mr-2 size-4" />
                    Version History
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/resumes/${id}/analytics`}>
                    <Sparkles className="mr-2 size-4" />
                    Analytics
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/resumes/${id}/settings`}>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </PageContainer>
  );
};
