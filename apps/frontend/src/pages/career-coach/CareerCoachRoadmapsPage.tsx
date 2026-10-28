import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Route, Wand2, ChevronRight } from "lucide-react";
import { useCareerRoadmaps, useGenerateRoadmap } from "@/hooks/useCareerCoach";

export function CareerCoachRoadmapsPage() {
  const { data: roadmaps, isLoading } = useCareerRoadmaps();
  const generateRoadmap = useGenerateRoadmap();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Roadmaps"
          description="AI-generated career path roadmaps"
          icon={<Route className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Wand2 className="size-4" />}
              isLoading={generateRoadmap.isPending}
              onClick={() => generateRoadmap.mutate()}
            >
              Generate Roadmap
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        ) : roadmaps && roadmaps.length > 0 ? (
          <div className="space-y-4">
            {roadmaps.map((roadmap) => (
              <Card key={roadmap.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{roadmap.title}</CardTitle>
                      {roadmap.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {roadmap.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Badge variant="outline">{roadmap.type}</Badge>
                      <Badge
                        variant={
                          roadmap.status === "active"
                            ? "default"
                            : roadmap.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {roadmap.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {roadmap.steps && roadmap.steps.length > 0 ? (
                    <div className="space-y-2">
                      {roadmap.steps.slice(0, 5).map((step, idx) => (
                        <div
                          key={step.id ?? idx}
                          className="flex items-center gap-3 rounded border px-3 py-2 text-sm"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{step.title}</span>
                          {step.completed && (
                            <Badge variant="default" className="shrink-0 text-xs">
                              Done
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No steps defined yet.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Route className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No roadmaps yet. Generate your first career roadmap to visualize your path forward.
              </p>
              <Button
                className="mt-4"
                leftIcon={<Wand2 className="size-4" />}
                isLoading={generateRoadmap.isPending}
                onClick={() => generateRoadmap.mutate()}
              >
                Generate Your First Roadmap
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
