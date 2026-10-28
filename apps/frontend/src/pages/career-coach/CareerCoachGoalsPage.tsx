import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Plus, Trash2 } from "lucide-react";
import {
  useCareerGoals,
  useCreateCareerGoal,
  useDeleteCareerGoal,
  useCompleteMilestone,
} from "@/hooks/useCareerCoach";

export function CareerCoachGoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const { data: goals, isLoading } = useCareerGoals();
  const createGoal = useCreateCareerGoal();
  const deleteGoal = useDeleteCareerGoal();
  const completeMilestone = useCompleteMilestone();

  const handleSubmit = () => {
    if (!title.trim()) return;
    createGoal.mutate(
      { title: title.trim(), description: description.trim() || undefined, deadline: deadline || undefined },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setDeadline("");
          setShowForm(false);
        },
      },
    );
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Goals"
          description="Define and track your career milestones"
          icon={<Target className="size-5" />}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              onClick={() => setShowForm(!showForm)}
            >
              Add Goal
            </Button>
          }
        />

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New Career Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Become a Senior Engineer"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your goal..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    isLoading={createGoal.isPending}
                    onClick={handleSubmit}
                  >
                    Create Goal
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        ) : goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => {
              const pct = goal.progress ?? 0;
              const completedMilestones = goal.milestones?.filter((m) => m.completed).length ?? 0;
              const totalMilestones = goal.milestones?.length ?? 0;

              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        {goal.description && (
                          <CardDescription className="mt-1 line-clamp-2">
                            {goal.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant={
                            goal.status === "completed"
                              ? "default"
                              : goal.status === "active"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {goal.status}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteGoal.mutate(goal.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {completedMilestones}/{totalMilestones} milestones
                      </span>
                      {goal.deadline && (
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Target className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No goals yet. Define your first career goal to start tracking your progress.
              </p>
              <Button
                className="mt-4"
                leftIcon={<Plus className="size-4" />}
                onClick={() => setShowForm(true)}
              >
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
