import { type FC, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useGenerateCoverLetter, useCoverLetterTemplates } from "@/hooks/useCoverLetter";
import { useCoverLetterStore } from "@/stores/cover-letter.store";
import type {
  CoverLetterTone,
  CoverLetterStyle,
  CoverLetterGenerateRequest,
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

const focusAreaOptions = [
  { id: "experience", label: "Relevant Experience" },
  { id: "skills", label: "Key Skills" },
  { id: "culture", label: "Culture Fit" },
  { id: "achievements", label: "Achievements" },
  { id: "motivation", label: "Motivation" },
  { id: "value", label: "Value Proposition" },
];

export const CoverLetterGenerateDialog: FC = () => {
  const isOpen = useCoverLetterStore((s) => s.generateDialogOpen);
  const setOpen = useCoverLetterStore((s) => s.setGenerateDialogOpen);
  const settings = useCoverLetterStore((s) => s.settings);

  const { data: templates = [] } = useCoverLetterTemplates();
  const generateMutation = useGenerateCoverLetter();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [tone, setTone] = useState<CoverLetterTone>(settings.default_tone);
  const [style, setStyle] = useState<CoverLetterStyle>(settings.default_style);
  const [temperature, setTemperature] = useState(settings.default_temperature);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [additionalContext, setAdditionalContext] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleGenerate = () => {
    const request: CoverLetterGenerateRequest = {
      template_id: selectedTemplateId || undefined,
      company_name: companyName,
      job_title: jobTitle,
      job_description: jobDescription || undefined,
      recipient_name: recipientName || undefined,
      tone,
      style,
      temperature,
      focus_areas: focusAreas.length > 0 ? focusAreas : undefined,
      additional_context: additionalContext || undefined,
    };

    generateMutation.mutate(request, {
      onSuccess: (response) => {
        setPreview(response.content);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setCompanyName("");
    setJobTitle("");
    setJobDescription("");
    setRecipientName("");
    setFocusAreas([]);
    setAdditionalContext("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-600" />
              Generate Cover Letter
            </CardTitle>
            <CardDescription>Configure your generation settings and preview before applying</CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={handleClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {preview ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Generated Content</h3>
                  <Badge variant="success" size="sm">Preview</Badge>
                </div>
                <div className="whitespace-pre-wrap rounded-lg border p-4 text-sm text-muted-foreground min-h-[200px]">
                  {preview}
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => { setPreview(null); }} variant="outline" leftIcon={<Sparkles className="size-4" />}>
                  Regenerate
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Apply to Editor
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Company Name *</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Title *</label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Recipient Name</label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Jane Smith (optional)"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  placeholder="Paste the job description for more targeted content..."
                  className="mt-1"
                />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Template (optional)</label>
                  <select
                    className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                  >
                    <option value="">No template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tone</label>
                  <select
                    className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as CoverLetterTone)}
                  >
                    {Object.entries(toneLabels).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Style</label>
                  <select
                    className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                    value={style}
                    onChange={(e) => setStyle(e.target.value as CoverLetterStyle)}
                  >
                    {Object.entries(styleLabels).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Temperature: {temperature}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium mb-2 block">Focus Areas</label>
                <div className="grid grid-cols-2 gap-2">
                  {focusAreaOptions.map((area) => (
                    <label key={area.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={focusAreas.includes(area.id)}
                        onCheckedChange={() => toggleFocusArea(area.id)}
                      />
                      {area.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Additional Context</label>
                <Textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={3}
                  placeholder="Any additional context or instructions..."
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button
                  leftIcon={<Sparkles className="size-4" />}
                  onClick={handleGenerate}
                  loading={generateMutation.isPending}
                  disabled={!companyName.trim() || !jobTitle.trim()}
                >
                  {generateMutation.isPending ? "Generating..." : "Generate"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
