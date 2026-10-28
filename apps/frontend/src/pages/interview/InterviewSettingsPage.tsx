import { type FC, useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useInterviewSettings, useUpdateInterviewSettings } from "@/hooks/useInterview";
import type {
  InterviewSettings,
} from "@/types/interview";

const sessionTypeLabels: Record<string, string> = {
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

const difficultyLabels: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

const modeLabels: Record<string, string> = {
  timed: "Timed",
  untimed: "Untimed",
  simulation: "Simulation",
};

export const InterviewSettingsPage: FC = () => {
  const { data: settings, isLoading } = useInterviewSettings();
  const updateMutation = useUpdateInterviewSettings();

  const [form, setForm] = useState<InterviewSettings>({
    default_session_type: "mixed",
    default_difficulty: "medium",
    default_mode: "untimed",
    default_duration_minutes: 30,
    default_questions_per_session: 10,
    auto_evaluate: true,
    auto_generate_follow_ups: true,
    show_timer: true,
    show_confidence: true,
    preferred_ai_provider: "openai",
    preferred_ai_model: "gpt-4",
    default_temperature: 0.7,
    default_max_tokens: 4096,
    notifications_enabled: true,
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  const updateField = <K extends keyof InterviewSettings>(key: K, value: InterviewSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={400} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Interview Settings"
          description="Configure defaults, AI preferences, and session options"
          icon={<Settings className="size-5" />}
          actions={
            <Button leftIcon={<Save className="size-4" />} onClick={handleSave} loading={updateMutation.isPending}>
              Save Settings
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Defaults</CardTitle>
              <CardDescription>Default settings for new interview sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default Session Type</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={form.default_session_type ?? "mixed"}
                  onChange={(e) => updateField("default_session_type", e.target.value)}
                >
                  {Object.entries(sessionTypeLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Default Difficulty</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={form.default_difficulty ?? "medium"}
                  onChange={(e) => updateField("default_difficulty", e.target.value)}
                >
                  {Object.entries(difficultyLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Default Mode</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={form.default_mode ?? "untimed"}
                  onChange={(e) => updateField("default_mode", e.target.value)}
                >
                  {Object.entries(modeLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Default Duration (min)</label>
                  <Input
                    type="number"
                    value={form.default_duration_minutes ?? 30}
                    onChange={(e) => updateField("default_duration_minutes", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Questions per Session</label>
                  <Input
                    type="number"
                    value={form.default_questions_per_session ?? 10}
                    onChange={(e) => updateField("default_questions_per_session", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automation</CardTitle>
              <CardDescription>Configure automatic behaviors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-evaluate</p>
                  <p className="text-xs text-muted-foreground">Automatically evaluate sessions when completed</p>
                </div>
                <Switch
                  checked={form.auto_evaluate}
                  onChange={(checked) => updateField("auto_evaluate", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-generate follow-ups</p>
                  <p className="text-xs text-muted-foreground">Generate follow-up questions automatically</p>
                </div>
                <Switch
                  checked={form.auto_generate_follow_ups}
                  onChange={(checked) => updateField("auto_generate_follow_ups", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Show timer</p>
                  <p className="text-xs text-muted-foreground">Display a timer during timed sessions</p>
                </div>
                <Switch
                  checked={form.show_timer}
                  onChange={(checked) => updateField("show_timer", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Show confidence</p>
                  <p className="text-xs text-muted-foreground">Display AI confidence scores</p>
                </div>
                <Switch
                  checked={form.show_confidence}
                  onChange={(checked) => updateField("show_confidence", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Provider</CardTitle>
              <CardDescription>Configure which AI provider to use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Provider</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={form.preferred_ai_provider ?? "openai"}
                  onChange={(e) => updateField("preferred_ai_provider", e.target.value)}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={form.preferred_ai_model ?? ""}
                  onChange={(e) => updateField("preferred_ai_model", e.target.value)}
                  placeholder="e.g. gpt-4"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Temperature: {form.default_temperature ?? 0.7}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={form.default_temperature ?? 0.7}
                  onChange={(e) => updateField("default_temperature", Number(e.target.value))}
                  className="mt-1 w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Max Tokens</label>
                <Input
                  type="number"
                  value={form.default_max_tokens ?? 4096}
                  onChange={(e) => updateField("default_max_tokens", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable notifications</p>
                  <p className="text-xs text-muted-foreground">Receive notifications about session updates and reminders</p>
                </div>
                <Switch
                  checked={form.notifications_enabled}
                  onChange={(checked) => updateField("notifications_enabled", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
