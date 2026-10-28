import { type FC } from "react";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const OptimizationSettingsPage: FC = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Optimization Settings"
          description="Configure optimization engine behavior"
          icon={<Settings className="size-5" />}
        />

        <Card>
          <CardHeader>
            <CardTitle>Engine Configuration</CardTitle>
            <CardDescription>Global settings for the resume optimization engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Optimization settings will be available here. Configure default confidence thresholds, 
              suggestion limits, AI provider preferences, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
