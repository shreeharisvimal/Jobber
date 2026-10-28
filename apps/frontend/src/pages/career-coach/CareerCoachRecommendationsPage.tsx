import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, CheckCircle2, XCircle, Check } from "lucide-react";
import {
  useCareerRecommendations,
  useAcceptRecommendation,
  useDismissRecommendation,
  useCompleteRecommendation,
} from "@/hooks/useCareerCoach";

export function CareerCoachRecommendationsPage() {
  const [filter, setFilter] = useState("all");
  const { data: recommendations, isLoading } = useCareerRecommendations();
  const acceptRec = useAcceptRecommendation();
  const dismissRec = useDismissRecommendation();
  const completeRec = useCompleteRecommendation();

  const filteredRecommendations = recommendations?.filter((rec) => {
    switch (filter) {
      case "high":
        return rec.priority === "high";
      case "active":
        return rec.status === "active" || rec.status === "accepted";
      case "completed":
        return rec.status === "completed";
      default:
        return true;
    }
  });

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Recommendations"
          description="AI-powered recommendations to advance your career"
          icon={<Lightbulb className="size-5" />}
        />

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={160} />
              ))}
            </div>
          ) : filteredRecommendations && filteredRecommendations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRecommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <div className="flex shrink-0 gap-1">
                        <Badge
                          variant={
                            rec.priority === "high"
                              ? "destructive"
                              : rec.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {rec.priority}
                        </Badge>
                        {rec.category && (
                          <Badge variant="outline">{rec.category}</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {rec.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {rec.status !== "completed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<CheckCircle2 className="size-3.5" />}
                            isLoading={acceptRec.isPending}
                            onClick={() => acceptRec.mutate(rec.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Check className="size-3.5" />}
                            isLoading={completeRec.isPending}
                            onClick={() => completeRec.mutate(rec.id)}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<XCircle className="size-3.5" />}
                            isLoading={dismissRec.isPending}
                            onClick={() => dismissRec.mutate(rec.id)}
                          >
                            Dismiss
                          </Button>
                        </>
                      )}
                      {rec.status === "completed" && (
                        <Badge variant="default">
                          <CheckCircle2 className="mr-1 size-3" /> Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Lightbulb className="mx-auto mb-4 size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {filter === "all"
                    ? "No recommendations yet. Run an assessment to generate personalized recommendations."
                    : `No ${filter} recommendations found.`}
                </p>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </PageContainer>
  );
}
