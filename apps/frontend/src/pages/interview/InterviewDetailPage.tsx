import { type FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Video,
  Play,
  Pause,
  Flag,
  FileBarChart,
  Clock,
  CheckCircle,
  BarChart3,
  Settings,
  Lightbulb,
  History,
  MessageSquare,
  Target,
  Brain,
  Save,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useInterview,
  useStartInterview,
  usePauseInterview,
  useResumeInterview,
  useFinishInterview,
  useEvaluateInterview,
  useGenerateReport,
  useInterviewQuestions,
  useInterviewEvaluations,
  useInterviewFeedbacks,
  useInterviewSuggestions,
  useInterviewImprovements,
  useInterviewHistory,
  useInterviewReports,
  useInterviewAnalytics,
  useInterviewSimulations,
  useUpdateInterview,
} from "@/hooks/useInterview";
import { useInterviewStore } from "@/stores/interview.store";
import type {
  InterviewSession,
  InterviewSessionType,
  InterviewStatus,
  InterviewDifficulty,
  InterviewMode,
} from "@/types/interview";

// ─── Labels ───

const statusLabels: Record<InterviewStatus, { label: string; variant: string }> = {
  draft: { label: "Draft", variant: "secondary" },
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  completed: { label: "Completed", variant: "info" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const typeLabels: Record<InterviewSessionType, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  coding: "Coding",
  system_design: "System Design",
  case_study: "Case Study",
  leadership: "Leadership",
  hr: "HR",
  mixed: "Mixed",
  custom: "Custom",
};

const difficultyLabels: Record<InterviewDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

const modeLabels: Record<InterviewMode, string> = {
  timed: "Timed",
  untimed: "Untimed",
  simulation: "Simulation",
};

// ─── Score Helpers ───

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const value = score ?? 0;
  const variant = value >= 80 ? "success" : value >= 60 ? "default" : value >= 40 ? "warning" : "danger";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score !== null ? `${score}/100` : "N/A"}</span>
      </div>
      <Progress value={value} variant={variant as "default" | "success" | "warning" | "danger"} size="sm" />
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge variant="secondary">N/A</Badge>;
  if (score >= 80) return <Badge variant="success">{score}</Badge>;
  if (score >= 60) return <Badge variant="info">{score}</Badge>;
  if (score >= 40) return <Badge variant="warning">{score}</Badge>;
  return <Badge variant="danger">{score}</Badge>;
}

// ─── Tab Components ───

function OverviewTab({ session }: { session: InterviewSession }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <p className="text-sm text-muted-foreground mt-1">{session.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">{session.description ?? "No description"}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground mt-1">{typeLabels[session.session_type]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <p className="text-sm text-muted-foreground mt-1">{difficultyLabels[session.difficulty]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Mode</label>
                  <p className="text-sm text-muted-foreground mt-1">{modeLabels[session.mode]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Questions Answered</span>
                <span className="font-medium">{session.answered_questions ?? 0} / {session.total_questions ?? 0}</span>
              </div>
              <Progress
                value={session.total_questions ? ((session.answered_questions ?? 0) / session.total_questions) * 100 : 0}
                size="sm"
              />
              {session.duration_minutes != null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Limit</span>
                  <span className="font-medium">{session.duration_minutes} min</span>
                </div>
              )}
              {session.time_spent_seconds != null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Spent</span>
                  <span className="font-medium">{Math.round(session.time_spent_seconds / 60)} min</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Overall" score={session.overall_score} />
              <ScoreBar label="Technical" score={session.technical_score} />
              <ScoreBar label="Communication" score={session.communication_score} />
              <ScoreBar label="Confidence" score={session.confidence_score} />
              <ScoreBar label="Problem Solving" score={session.problem_solving_score} />
              <ScoreBar label="Behavioral" score={session.behavioral_score} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={statusLabels[session.status].variant as "secondary" | "success" | "warning" | "info" | "outline"} size="sm">{statusLabels[session.status].label}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(session.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(session.updated_at).toLocaleDateString()}</span>
              </div>
              {session.ai_provider && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Provider</span>
                  <span>{session.ai_provider}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuestionsTab({ sessionId }: { sessionId: string }) {
  const { data: questions = [], isLoading } = useInterviewQuestions(sessionId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={120} />
        ))}
      </div>
    );
  }

  if ((questions as unknown[]).length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No questions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Start the session to generate questions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {(questions as unknown as Record<string, unknown>[]).map((q, index) => (
        <Card key={(q as { id?: string }).id ?? index}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {index + 1}
                </span>
                <Badge variant="secondary" size="sm">{(q as { question_type?: string }).question_type ?? "general"}</Badge>
              </div>
              <Badge variant="outline" size="sm">{(q as { difficulty?: string }).difficulty ?? "medium"}</Badge>
            </div>
            <p className="text-sm font-medium">{(q as { question_text?: string }).question_text ?? "Question"}</p>
            {(q as { expected_answer?: string }).expected_answer && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Expected Answer</p>
                <p className="text-sm">{(q as { expected_answer?: string }).expected_answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EvaluationTab({ sessionId }: { sessionId: string }) {
  const { data: evaluations = [], isLoading } = useInterviewEvaluations(sessionId);
  const { data: feedbacks = [] } = useInterviewFeedbacks(sessionId);
  const evaluateMutation = useEvaluateInterview();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={120} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-semibold">AI Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            Run an AI evaluation to get detailed scoring and feedback on your session.
          </p>
          <Button
            leftIcon={<Brain className="size-4" />}
            onClick={() => evaluateMutation.mutate({ sessionId })}
            loading={evaluateMutation.isPending}
          >
            Run Evaluation
          </Button>
        </CardContent>
      </Card>

      {(evaluations as unknown[]).length > 0 ? (
        (evaluations as unknown as Record<string, unknown>[]).map((evalItem, index) => (
          <Card key={(evalItem as { id?: string }).id ?? index}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="info" size="sm">{(evalItem as { evaluation_type?: string }).evaluation_type ?? "ai"}</Badge>
                <span className="text-sm font-bold">{(evalItem as { score?: number }).score ?? 0}/{(evalItem as { max_score?: number }).max_score ?? 100}</span>
              </div>
              {(evalItem as { feedback_text?: string }).feedback_text && (
                <p className="text-sm text-muted-foreground">{(evalItem as { feedback_text?: string }).feedback_text}</p>
              )}
              {(evalItem as { strengths?: string[] }).strengths && ((evalItem as { strengths?: string[] }).strengths ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Strengths</p>
                  <ul className="list-disc list-inside text-sm space-y-0.5">
                    {((evalItem as { strengths?: string[] }).strengths ?? []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(evalItem as { weaknesses?: string[] }).weaknesses && ((evalItem as { weaknesses?: string[] }).weaknesses ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Weaknesses</p>
                  <ul className="list-disc list-inside text-sm space-y-0.5">
                    {((evalItem as { weaknesses?: string[] }).weaknesses ?? []).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Brain className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No evaluations yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Run an evaluation to get scored feedback</p>
          </CardContent>
        </Card>
      )}

      {(feedbacks as unknown[]).length > 0 && (
        <>
          <h3 className="text-sm font-semibold">Feedback</h3>
          {(feedbacks as unknown as Record<string, unknown>[]).map((fb, index) => (
            <Card key={(fb as { id?: string }).id ?? index}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">{(fb as { feedback_type?: string }).feedback_type ?? "ai"}</Badge>
                  {(fb as { overall_rating?: number }).overall_rating != null && (
                    <span className="text-sm font-medium">Rating: {(fb as { overall_rating?: number }).overall_rating}/5</span>
                  )}
                </div>
                {(fb as { detailed_feedback?: string }).detailed_feedback && (
                  <p className="text-sm text-muted-foreground">{(fb as { detailed_feedback?: string }).detailed_feedback}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

function SuggestionsTab({ sessionId }: { sessionId: string }) {
  const { data: suggestions = [], isLoading } = useInterviewSuggestions(sessionId);
  const applyMutation = useApplySuggestion();
  const dismissMutation = useDismissSuggestion();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={120} />
        ))}
      </div>
    );
  }

  if ((suggestions as unknown[]).length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Lightbulb className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No suggestions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Complete a session to get improvement suggestions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {(suggestions as unknown as Record<string, unknown>[]).map((s, index) => (
        <Card key={(s as { id?: string }).id ?? index}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="secondary" size="sm">{(s as { suggestion_type?: string }).suggestion_type ?? "general"}</Badge>
              {(s as { priority?: string }) && (
                <Badge variant={(s as { priority?: string }).priority === "high" ? "danger" : "secondary"} size="sm">
                  {(s as { priority?: string }).priority}
                </Badge>
              )}
            </div>
            {(s as { title?: string }).title && (
              <p className="text-sm font-medium">{(s as { title?: string }).title}</p>
            )}
            {(s as { description?: string }).description && (
              <p className="text-sm text-muted-foreground">{(s as { description?: string }).description}</p>
            )}
            {(s as { original_text?: string }).original_text && (s as { suggested_text?: string }).suggested_text && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Original</p>
                  <p className="text-sm rounded-md bg-muted p-3">{(s as { original_text?: string }).original_text}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Suggested</p>
                  <p className="text-sm rounded-md bg-success-50 p-3">{(s as { suggested_text?: string }).suggested_text}</p>
                </div>
              </div>
            )}
            {!(s as { is_applied?: boolean }).is_applied && !(s as { is_dismissed?: boolean }).is_dismissed && (
              <div className="flex gap-2">
                <Button size="sm" leftIcon={<CheckCircle className="size-3.5" />} onClick={() => applyMutation.mutate({ sessionId, suggestionId: (s as { id: string }).id })} loading={applyMutation.isPending}>
                  Apply
                </Button>
                <Button variant="outline" size="sm" leftIcon={<Trash2 className="size-3.5" />} onClick={() => dismissMutation.mutate({ sessionId, suggestionId: (s as { id: string }).id })} loading={dismissMutation.isPending}>
                  Dismiss
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ImprovementsTab({ sessionId }: { sessionId: string }) {
  const { data: improvements = [], isLoading } = useInterviewImprovements(sessionId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={100} />
        ))}
      </div>
    );
  }

  if ((improvements as unknown[]).length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Target className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No improvements tracked yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Improvement areas will appear after evaluation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {(improvements as unknown as Record<string, unknown>[]).map((imp, index) => (
        <Card key={(imp as { id?: string }).id ?? index}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">{(imp as { category?: string }).category ?? "general"}</Badge>
                <Badge variant={(imp as { status?: string }).status === "completed" ? "success" : "secondary"} size="sm">
                  {(imp as { status?: string }).status ?? "pending"}
                </Badge>
              </div>
              <Badge variant={(imp as { priority?: string }).priority === "high" ? "danger" : "secondary"} size="sm">
                {(imp as { priority?: string }).priority ?? "medium"}
              </Badge>
            </div>
            {(imp as { title?: string }).title && (
              <p className="text-sm font-medium">{(imp as { title?: string }).title}</p>
            )}
            {(imp as { description?: string }).description && (
              <p className="text-sm text-muted-foreground">{(imp as { description?: string }).description}</p>
            )}
            {(imp as { before_score?: number }).before_score != null && (imp as { after_score?: number }).after_score != null && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{(imp as { before_score?: number }).before_score}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-bold">{(imp as { after_score?: number }).after_score}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HistoryTab({ sessionId }: { sessionId: string }) {
  const { data: history = [], isLoading } = useInterviewHistory(sessionId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} />
        ))}
      </div>
    );
  }

  if ((history as unknown[]).length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No history yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Activity will appear here as you work on this session</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {(history as unknown as Record<string, unknown>[]).map((event, index) => (
        <div key={(event as { id?: string }).id ?? index} className="flex items-start gap-3">
          <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <Clock className="size-3 text-brand-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              <span className="text-muted-foreground">{(event as { action?: string }).action ?? "Activity"}</span>
              {(event as { action_detail?: string }).action_detail && (
                <span className="text-muted-foreground"> - {(event as { action_detail?: string }).action_detail}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{new Date((event as { created_at?: string }).created_at ?? "").toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsTab({ sessionId }: { sessionId: string }) {
  const { data: reports = [], isLoading } = useInterviewReports(sessionId);
  const generateMutation = useGenerateReport();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={100} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-semibold">Generate Report</h3>
          <p className="text-sm text-muted-foreground">Generate a detailed analysis report for this session.</p>
          <Button
            leftIcon={<FileBarChart className="size-4" />}
            onClick={() => generateMutation.mutate({ sessionId })}
            loading={generateMutation.isPending}
          >
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {(reports as unknown[]).length > 0 ? (
        (reports as unknown as Record<string, unknown>[]).map((report, index) => (
          <Card key={(report as { id?: string }).id ?? index}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <FileBarChart className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{(report as { title?: string }).title ?? "Report"}</p>
                  <p className="text-xs text-muted-foreground">{new Date((report as { created_at?: string }).created_at ?? "").toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">{(report as { report_type?: string }).report_type ?? "summary"}</Badge>
                {(report as { score?: number }).score != null && <ScoreBadge score={(report as { score?: number }).score} />}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <FileBarChart className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No reports generated yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalyticsTab({ sessionId: _sessionId }: { sessionId: string }) {
  const { data: analytics, isLoading } = useInterviewAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={200} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.total_sessions ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.completed_sessions ?? 0}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.practice_time_minutes ?? 0}m</p>
            <p className="text-xs text-muted-foreground">Practice Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Sparkles className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.streak_days ?? 0}d</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.score_trend && analytics.score_trend.length > 0 ? (
            <div className="space-y-2">
              {analytics.score_trend.map((score, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">Session {i + 1}</span>
                  <Progress value={score} size="sm" className="flex-1" />
                  <span className="text-xs font-medium w-8">{score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No score trend data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SimulationTab({ sessionId }: { sessionId: string }) {
  const { data: simulations = [], isLoading } = useInterviewSimulations(sessionId);
  const simulationMode = useInterviewStore((s) => s.simulationMode);
  const setSimulationMode = useInterviewStore((s) => s.setSimulationMode);
  const simulationStep = useInterviewStore((s) => s.simulationStep);
  const setSimulationStep = useInterviewStore((s) => s.setSimulationStep);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={200} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-semibold">Simulation Mode</h3>
          <p className="text-sm text-muted-foreground">
            Enter a realistic interview simulation with AI-powered interviewers.
          </p>
          <Button
            leftIcon={simulationMode ? <Pause className="size-4" /> : <Play className="size-4" />}
            variant={simulationMode ? "outline" : "default"}
            onClick={() => {
              setSimulationMode(!simulationMode);
              if (!simulationMode) setSimulationStep(0);
            }}
          >
            {simulationMode ? "Exit Simulation" : "Start Simulation"}
          </Button>
        </CardContent>
      </Card>

      {simulationMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Simulation Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Step</span>
              <span className="font-medium">{simulationStep}</span>
            </div>
            <Progress value={simulationStep * 20} size="sm" />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSimulationStep(Math.max(0, simulationStep - 1))}>
                Previous
              </Button>
              <Button size="sm" onClick={() => setSimulationStep(simulationStep + 1)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(simulations as unknown[]).length > 0 ? (
        (simulations as unknown as Record<string, unknown>[]).map((sim, index) => (
          <Card key={(sim as { id?: string }).id ?? index}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={(sim as { status?: string }).status === "completed" ? "success" : "secondary"} size="sm">
                  {(sim as { status?: string }).status ?? "pending"}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{(sim as { simulation_type?: string }).simulation_type ?? "Interview Simulation"}</p>
                  <p className="text-xs text-muted-foreground">{new Date((sim as { created_at?: string }).created_at ?? "").toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Video className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No simulations yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SettingsTab({ session }: { session: InterviewSession }) {
  const [title, setTitle] = useState(session.title);
  const [description, setDescription] = useState(session.description ?? "");
  const updateMutation = useUpdateInterview();

  const handleSave = () => {
    updateMutation.mutate({
      id: session.id,
      data: { title, description },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Session Settings</CardTitle>
          <CardDescription>Update session configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
          </div>
          <Button leftIcon={<Save className="size-4" />} onClick={handleSave} loading={updateMutation.isPending}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ───

export const InterviewDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const sessionId = id ?? "";
  const [activeTab, setActiveTab] = useState("overview");

  const { data: session, isLoading: isLoadingSession } = useInterview(sessionId);
  const startMutation = useStartInterview();
  const pauseMutation = usePauseInterview();
  const resumeMutation = useResumeInterview();
  const finishMutation = useFinishInterview();

  if (isLoadingSession) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={500} />
        </div>
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Session Not Found"
            description="The interview session you're looking for doesn't exist or has been removed"
            icon={<Video className="size-5" />}
            backHref="/interview"
          />
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">Session not found</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/interview">Back to Sessions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const isActive = session.status === "active";
  const isPaused = session.status === "paused";
  const isDraft = session.status === "draft";
  const isCompleted = session.status === "completed";

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={session.title}
          description={`${typeLabels[session.session_type]} · ${difficultyLabels[session.difficulty]} · ${modeLabels[session.mode]}`}
          icon={<Video className="size-5" />}
          backHref="/interview"
          actions={
            <>
              <Badge variant={statusLabels[session.status].variant as "secondary" | "success" | "warning" | "info" | "outline"} size="sm">{statusLabels[session.status].label}</Badge>
              {session.overall_score !== null && <ScoreBadge score={session.overall_score} />}
            </>
          }
        />

        <div className="flex flex-wrap gap-2">
          {isDraft && (
            <Button size="sm" leftIcon={<Play className="size-4" />} onClick={() => startMutation.mutate(sessionId)} loading={startMutation.isPending}>
              Start
            </Button>
          )}
          {isActive && (
            <>
              <Button size="sm" variant="outline" leftIcon={<Pause className="size-4" />} onClick={() => pauseMutation.mutate(sessionId)} loading={pauseMutation.isPending}>
                Pause
              </Button>
              <Button size="sm" leftIcon={<Flag className="size-4" />} onClick={() => finishMutation.mutate(sessionId)} loading={finishMutation.isPending}>
                Finish
              </Button>
            </>
          )}
          {isPaused && (
            <Button size="sm" leftIcon={<Play className="size-4" />} onClick={() => resumeMutation.mutate(sessionId)} loading={resumeMutation.isPending}>
              Resume
            </Button>
          )}
          {isCompleted && (
            <>
              <Button size="sm" variant="outline" leftIcon={<Brain className="size-4" />} onClick={() => setActiveTab("evaluation")}>
                View Evaluation
              </Button>
              <Button size="sm" variant="outline" leftIcon={<FileBarChart className="size-4" />} onClick={() => setActiveTab("reports")}>
                View Reports
              </Button>
            </>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview"><BarChart3 className="size-3.5 mr-1.5" />Overview</TabsTrigger>
            <TabsTrigger value="questions"><MessageSquare className="size-3.5 mr-1.5" />Questions</TabsTrigger>
            <TabsTrigger value="evaluation"><Brain className="size-3.5 mr-1.5" />Evaluation</TabsTrigger>
            <TabsTrigger value="suggestions"><Lightbulb className="size-3.5 mr-1.5" />Suggestions</TabsTrigger>
            <TabsTrigger value="improvements"><Target className="size-3.5 mr-1.5" />Improvements</TabsTrigger>
            <TabsTrigger value="history"><History className="size-3.5 mr-1.5" />History</TabsTrigger>
            <TabsTrigger value="reports"><FileBarChart className="size-3.5 mr-1.5" />Reports</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="size-3.5 mr-1.5" />Analytics</TabsTrigger>
            <TabsTrigger value="simulation"><Video className="size-3.5 mr-1.5" />Simulation</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="size-3.5 mr-1.5" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab session={session} />
          </TabsContent>

          <TabsContent value="questions">
            <QuestionsTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="evaluation">
            <EvaluationTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="suggestions">
            <SuggestionsTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="improvements">
            <ImprovementsTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationTab sessionId={sessionId} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
