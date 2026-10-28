import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInterview, useInterviewTemplates } from "@/hooks/useInterview";
import type {
  InterviewSessionType,
  InterviewDifficulty,
  InterviewMode,
} from "@/types/interview";

const sessionTypes: { value: InterviewSessionType; label: string; description: string }[] = [
  { value: "behavioral", label: "Behavioral", description: "STAR method questions about past experiences" },
  { value: "technical", label: "Technical", description: "Domain-specific technical knowledge questions" },
  { value: "coding", label: "Coding", description: "Live coding and algorithm challenges" },
  { value: "system_design", label: "System Design", description: "Architecture and system design problems" },
  { value: "case_study", label: "Case Study", description: "Business case analysis and problem-solving" },
  { value: "leadership", label: "Leadership", description: "Management and leadership scenarios" },
  { value: "hr", label: "HR", description: "Culture fit and general HR questions" },
  { value: "mixed", label: "Mixed", description: "Combination of question types" },
  { value: "custom", label: "Custom", description: "Custom session with your own questions" },
];

const difficulties: { value: InterviewDifficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];

const modes: { value: InterviewMode; label: string; description: string }[] = [
  { value: "timed", label: "Timed", description: "Answer questions within a time limit" },
  { value: "untimed", label: "Untimed", description: "Take your time to think and answer" },
  { value: "simulation", label: "Simulation", description: "Realistic interview simulation with AI" },
];

export const InterviewCreatePage: FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateInterview();
  const { data: templates = [] } = useInterviewTemplates();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionType, setSessionType] = useState<InterviewSessionType>("mixed");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("medium");
  const [mode, setMode] = useState<InterviewMode>("untimed");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questionCount, setQuestionCount] = useState(10);
  const [templateId, setTemplateId] = useState("");
  const [careerProfileId, setCareerProfileId] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    createMutation.mutate(
      {
        title,
        description: description || undefined,
        session_type: sessionType,
        difficulty,
        mode,
        duration_minutes: durationMinutes,
        is_timed: mode === "timed",
        is_simulated: mode === "simulation",
        template_id: templateId || undefined,
        career_profile_id: careerProfileId || undefined,
        resume_id: resumeId || undefined,
        job_id: jobId || undefined,
      },
      {
        onSuccess: (session) => {
          navigate(`/interview/${session.id}`);
        },
      },
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Create Interview Session"
          description="Set up a new interview practice session with AI-powered coaching"
          icon={<Video className="size-5" />}
          backHref="/interview"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Basic Information</CardTitle>
                <CardDescription>Give your session a title and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Google SWE Interview Practice"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="What is this session for?"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Session Type</CardTitle>
                <CardDescription>Choose the type of interview to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSessionType(type.value)}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        sessionType === type.value
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-muted"
                      }`}
                    >
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mode</CardTitle>
                <CardDescription>Choose how you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {modes.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMode(m.value)}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        mode === m.value
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-muted"
                      }`}
                    >
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as InterviewDifficulty)}
                  >
                    {difficulties.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Question Count</label>
                  <Input
                    type="number"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Template (optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                >
                  <option value="">No template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Links (optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Career Profile ID</label>
                  <Input value={careerProfileId} onChange={(e) => setCareerProfileId(e.target.value)} placeholder="Optional" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Resume ID</label>
                  <Input value={resumeId} onChange={(e) => setResumeId(e.target.value)} placeholder="Optional" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Job ID</label>
                  <Input value={jobId} onChange={(e) => setJobId(e.target.value)} placeholder="Optional" className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              leftIcon={<Sparkles className="size-4" />}
              onClick={handleCreate}
              loading={createMutation.isPending}
              disabled={!title.trim()}
            >
              Create Session
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
