import { type FC } from "react";
import { Settings, Plus, Pencil, Trash2, Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useATSConfigurations, useDeleteATSConfiguration } from "@/hooks/useATS";

export const ATSConfigurationPage: FC = () => {
  const { data: configs, isLoading } = useATSConfigurations();
  const deleteConfig = useDeleteATSConfiguration();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="ATS Configuration"
          description="Manage analysis settings and scoring weights"
          icon={<Settings className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />}>New Configuration</Button>
          }
        />

        {isLoading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {configs?.map((config) => (
              <Card key={config.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{config.name}</CardTitle>
                      {config.description && <CardDescription>{config.description}</CardDescription>}
                    </div>
                    <Badge variant={config.is_active ? "success" : "default"}>
                      {config.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Min Keyword Match</span><span>{config.min_keyword_match_pct}%</span></div>
                    <div className="flex justify-between"><span>Min Skill Match</span><span>{config.min_skill_match_pct}%</span></div>
                    <div className="flex justify-between"><span>Min Overall Score</span><span>{config.min_overall_score}%</span></div>
                    <div className="flex justify-between"><span>Default Type</span><span className="capitalize">{config.default_analysis_type}</span></div>
                    <div className="flex justify-between"><span>Auto Run</span><span>{config.auto_run_on_import ? "Yes" : "No"}</span></div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" leftIcon={<Pencil className="size-4" />}>Edit</Button>
                    <Button variant="outline" size="sm" className="flex-1" leftIcon={<Copy className="size-4" />}>Duplicate</Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteConfig.mutate(config.id)}><Trash2 className="size-4 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!configs?.length && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No configurations yet
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
