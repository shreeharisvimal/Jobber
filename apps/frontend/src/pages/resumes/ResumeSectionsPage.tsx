import { type FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Pencil,
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

interface ResumeSectionConfig {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  visible: boolean;
  order: number;
  customTitle: string;
  maxItems: number;
  showDates: boolean;
  showDescriptions: boolean;
  showBullets: boolean;
  descriptionMode: "expanded" | "condensed";
}

const descriptionModes = [
  { value: "expanded", label: "Expanded" },
  { value: "condensed", label: "Condensed" },
];

export const ResumeSectionsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const { data: sections = [], isLoading, error } = useQuery<ResumeSectionConfig[]>({
    queryKey: ["resumes", id, "sections"],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}/sections`);
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  const updateSectionMutation = useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: Partial<ResumeSectionConfig> }) => {
      const response = await apiClient.put(`/resumes/${id}/sections/${sectionId}`, data);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "sections"] });
      toast.success("Section updated");
    },
    onError: () => {
      toast.error("Failed to update section");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const response = await apiClient.put(`/resumes/${id}/sections/reorder`, { orderedIds });
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id, "sections"] });
      toast.success("Sections reordered");
    },
    onError: () => {
      toast.error("Failed to reorder sections");
    },
  });

  const handleToggleEnabled = (sectionId: string, enabled: boolean) => {
    updateSectionMutation.mutate({ sectionId, data: { enabled } });
  };

  const handleToggleVisible = (sectionId: string, visible: boolean) => {
    updateSectionMutation.mutate({ sectionId, data: { visible } });
  };

  const handleUpdateMaxItems = (sectionId: string, maxItems: number) => {
    updateSectionMutation.mutate({ sectionId, data: { maxItems } });
  };

  const handleUpdateDescriptionMode = (sectionId: string, descriptionMode: "expanded" | "condensed") => {
    updateSectionMutation.mutate({ sectionId, data: { descriptionMode } });
  };

  const handleToggleDates = (sectionId: string, showDates: boolean) => {
    updateSectionMutation.mutate({ sectionId, data: { showDates } });
  };

  const handleToggleDescriptions = (sectionId: string, showDescriptions: boolean) => {
    updateSectionMutation.mutate({ sectionId, data: { showDescriptions } });
  };

  const handleToggleBullets = (sectionId: string, showBullets: boolean) => {
    updateSectionMutation.mutate({ sectionId, data: { showBullets } });
  };

  const handleSaveTitle = (sectionId: string) => {
    updateSectionMutation.mutate({ sectionId, data: { customTitle: editTitle } });
    setEditingId(null);
    setEditTitle("");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index]!, newSections[index - 1]!];
    reorderMutation.mutate(newSections.map((s) => s.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1]!, newSections[index]!];
    reorderMutation.mutate(newSections.map((s) => s.id));
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
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
            title="Section Management"
            description="Manage resume sections"
            backHref={`/resumes/${id}`}
          />
          <Alert variant="danger" title="Failed to load sections" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Section Management"
          description="Configure which sections appear in your resume and how they display"
          backHref={`/resumes/${id}`}
          actions={
            <Badge variant="info" size="sm">
              {sections.filter((s) => s.enabled).length} / {sections.length} enabled
            </Badge>
          }
        />

        <div className="space-y-3">
          {sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="cursor-grab text-muted-foreground">
                    <GripVertical className="size-4" />
                  </span>
                  <div className="flex-1">
                    {editingId === section.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="max-w-[300px]"
                          placeholder={section.title}
                        />
                        <Button size="sm" onClick={() => handleSaveTitle(section.id)}>
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">
                          {section.customTitle || section.title}
                        </CardTitle>
                        {section.customTitle && (
                          <Badge variant="secondary" size="sm">Custom</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setEditingId(section.id);
                            setEditTitle(section.customTitle);
                          }}
                        >
                          <Pencil className="size-3" />
                        </Button>
                      </div>
                    )}
                    <CardDescription>{section.type}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={section.enabled}
                      onChange={(checked) => handleToggleEnabled(section.id, checked)}
                      size="sm"
                    />
                    <Switch
                      checked={section.visible}
                      onChange={(checked) => handleToggleVisible(section.id, checked)}
                      size="sm"
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === sections.length - 1}
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {section.enabled && (
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Max Items" htmlFor={`max-${section.id}`}>
                      <Input
                        id={`max-${section.id}`}
                        type="number"
                        min={1}
                        max={20}
                        value={section.maxItems}
                        onChange={(e) =>
                          handleUpdateMaxItems(section.id, parseInt(e.target.value, 10) || 5)
                        }
                      />
                    </Field>
                    <Field label="Description Mode" htmlFor={`desc-${section.id}`}>
                      <Select
                        id={`desc-${section.id}`}
                        value={section.descriptionMode}
                        onChange={(e) =>
                          handleUpdateDescriptionMode(
                            section.id,
                            e.target.value as "expanded" | "condensed"
                          )
                        }
                      >
                        {descriptionModes.map((dm) => (
                          <option key={dm.value} value={dm.value}>{dm.label}</option>
                        ))}
                      </Select>
                    </Field>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Show Dates</label>
                      <Switch
                        checked={section.showDates}
                        onChange={(checked) => handleToggleDates(section.id, checked)}
                        size="sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Show Descriptions</label>
                      <Switch
                        checked={section.showDescriptions}
                        onChange={(checked) => handleToggleDescriptions(section.id, checked)}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Show Bullets</label>
                    <Switch
                      checked={section.showBullets}
                      onChange={(checked) => handleToggleBullets(section.id, checked)}
                      size="sm"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
