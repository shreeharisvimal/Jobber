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
import { useCoverLetterSettings, useUpdateCoverLetterSettings } from "@/hooks/useCoverLetter";
import type {
  CoverLetterTone,
  CoverLetterStyle,
  CoverLetterSettings,
  AIProvider,
} from "@/types/cover-letter";

const toneLabels: Record<CoverLetterTone, string> = {
  professional: "Professional",
  casual: "Casual",
  enthusiastic: "Enthusiastic",
  formal: "Formal",
  creative: "Creative",
  confident: "Confident",
  humble: "Humble",
};

const styleLabels: Record<CoverLetterStyle, string> = {
  standard: "Standard",
  narrative: "Narrative",
  achievement: "Achievement",
  value_proposition: "Value Proposition",
  storytelling: "Storytelling",
  minimal: "Minimal",
};

const providerLabels: Record<AIProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  local: "Local",
};

export const CoverLetterSettingsPage: FC = () => {
  const { data: settings, isLoading } = useCoverLetterSettings();
  const updateMutation = useUpdateCoverLetterSettings();

  const [form, setForm] = useState<CoverLetterSettings>({
    default_tone: "professional",
    default_style: "standard",
    default_temperature: 0.7,
    max_tokens: 2000,
    auto_generate: false,
    auto_optimize: false,
    signature_name: "",
    signature_title: "",
    signature_email: "",
    signature_phone: "",
    signature_linkedin: "",
    ai_provider: "openai",
    ai_model: "gpt-4",
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  const updateField = <K extends keyof CoverLetterSettings>(key: K, value: CoverLetterSettings[K]) => {
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
          title="Cover Letter Settings"
          description="Configure defaults, AI preferences, and signature settings"
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
              <CardTitle>Defaults</CardTitle>
              <CardDescription>Default settings for new cover letters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default Tone</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={form.default_tone}
                  onChange={(e) => updateField("default_tone", e.target.value as CoverLetterTone)}
                >
                  {Object.entries(toneLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Default Style</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={form.default_style}
                  onChange={(e) => updateField("default_style", e.target.value as CoverLetterStyle)}
                >
                  {Object.entries(styleLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Temperature: {form.default_temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={form.default_temperature}
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
                  value={form.max_tokens}
                  onChange={(e) => updateField("max_tokens", Number(e.target.value))}
                  className="mt-1"
                />
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
                  <p className="text-sm font-medium">Auto-generate on create</p>
                  <p className="text-xs text-muted-foreground">Automatically generate content when creating a new letter</p>
                </div>
                <Switch
                  checked={form.auto_generate}
                  onCheckedChange={(checked) => updateField("auto_generate", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-optimize</p>
                  <p className="text-xs text-muted-foreground">Automatically suggest optimizations after generation</p>
                </div>
                <Switch
                  checked={form.auto_optimize}
                  onCheckedChange={(checked) => updateField("auto_optimize", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signature</CardTitle>
              <CardDescription>Default signature appended to cover letters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={form.signature_name} onChange={(e) => updateField("signature_name", e.target.value)} placeholder="Your full name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={form.signature_title} onChange={(e) => updateField("signature_title", e.target.value)} placeholder="e.g. Software Engineer" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={form.signature_email} onChange={(e) => updateField("signature_email", e.target.value)} placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input value={form.signature_phone} onChange={(e) => updateField("signature_phone", e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">LinkedIn</label>
                <Input value={form.signature_linkedin} onChange={(e) => updateField("signature_linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" className="mt-1" />
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
                  value={form.ai_provider}
                  onChange={(e) => updateField("ai_provider", e.target.value as AIProvider)}
                >
                  {Object.entries(providerLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Model</label>
                <Input value={form.ai_model} onChange={(e) => updateField("ai_model", e.target.value)} placeholder="e.g. gpt-4" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
