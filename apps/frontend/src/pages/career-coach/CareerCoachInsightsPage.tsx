import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Target,
} from "lucide-react";
import {
  useCareerInsights,
  useCareerTrends,
  useCareerOpportunities,
  useCareerSkillGaps,
  useCareerRisks,
} from "@/hooks/useCareerCoach";

function InsightsTab() {
  const { data: insights, isLoading } = useCareerInsights();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Lightbulb className="mx-auto mb-4 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No insights available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <Badge variant={insight.impact === "high" ? "destructive" : "secondary"}>
                {insight.impact}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrendsTab() {
  const { data: trends, isLoading } = useCareerTrends();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="mx-auto mb-4 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No trends available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trends.map((trend) => (
        <Card key={trend.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{trend.title}</CardTitle>
              <Badge variant="default">{trend.direction}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{trend.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OpportunitiesTab() {
  const { data: opportunities, isLoading } = useCareerOpportunities();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Briefcase className="mx-auto mb-4 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No opportunities identified yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opp) => (
        <Card key={opp.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{opp.title}</CardTitle>
              <Badge variant="default">{opp.relevance}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{opp.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SkillGapsTab() {
  const { data: skillGaps, isLoading } = useCareerSkillGaps();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (!skillGaps || skillGaps.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Target className="mx-auto mb-4 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No skill gaps identified yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {skillGaps.map((gap) => (
        <Card key={gap.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{gap.skill_name}</CardTitle>
              <Badge variant="destructive">Gap: {gap.gap_level}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {gap.recommendation ?? "Consider developing this skill to improve your career readiness."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RisksTab() {
  const { data: risks, isLoading } = useCareerRisks();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (!risks || risks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="mx-auto mb-4 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No career risks identified.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {risks.map((risk) => (
        <Card key={risk.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{risk.title}</CardTitle>
              <Badge variant="destructive">{risk.severity}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{risk.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CareerCoachInsightsPage() {
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Insights"
          description="Data-driven insights about your career trajectory"
          icon={<Lightbulb className="size-5" />}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="skill-gaps">Skill Gaps</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <InsightsTab />
          </TabsContent>
          <TabsContent value="trends">
            <TrendsTab />
          </TabsContent>
          <TabsContent value="opportunities">
            <OpportunitiesTab />
          </TabsContent>
          <TabsContent value="skill-gaps">
            <SkillGapsTab />
          </TabsContent>
          <TabsContent value="risks">
            <RisksTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
