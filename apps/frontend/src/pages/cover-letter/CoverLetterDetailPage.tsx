import { type FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  Save,
  Send,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  History,
  MessageSquare,
  Share2,
  BarChart3,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  GitCompare,
  Lightbulb,
  Repeat,
  Zap,
  FileBarChart,
  RotateCcw,
  Pencil,
  Trash2,
  ThumbsUp,
  AlertCircle,
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
  useCoverLetterDetail,
  useCoverLetterVersions,
  useCoverLetterSuggestions,
  useCoverLetterRewrites,
  useCoverLetterOptimizations,
  useCoverLetterApprovals,
  useCoverLetterShares,
  useCoverLetterComments,
  useCoverLetterHistory,
  useCoverLetterReports,
  useCoverLetterAnalytics,
  useUpdateCoverLetter,
  useSaveAsVersion,
  useSetCurrentVersion,
  useApplySuggestion,
  useDismissSuggestion,
  useApplyRewrite,
  useUndoRewrite,
  useSubmitForApproval,
  useApproveLetter,
  useRejectLetter,
  useCreateShare,
  useRevokeShare,
  useAddComment,
  useResolveComment,
  useBookmarkCoverLetter,
  useUnbookmarkCoverLetter,
  useGenerateCoverLetter,
} from "@/hooks/useCoverLetter";
import { useCoverLetterStore } from "@/stores/cover-letter.store";
import type {
  CoverLetter,
  CoverLetterTone,
  CoverLetterStyle,
  SuggestionType,
  SharePermission,
} from "@/types/cover-letter";

// ─── Score helpers ───

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

const suggestionTypeLabels: Record<SuggestionType, { label: string; variant: string }> = {
  grammar: { label: "Grammar", variant: "danger" },
  tone: { label: "Tone", variant: "warning" },
  clarity: { label: "Clarity", variant: "info" },
  impact: { label: "Impact", variant: "success" },
  relevance: { label: "Relevance", variant: "default" },
  conciseness: { label: "Conciseness", variant: "secondary" },
  flow: { label: "Flow", variant: "outline" },
  keyword: { label: "Keyword", variant: "info" },
};

// ─── Sub-Components ───

function EditorTab({ letter }: { letter: CoverLetter }) {
  const [title, setTitle] = useState(letter.title);
  const [content, setContent] = useState(letter.content);
  const [recipientName, setRecipientName] = useState(letter.recipient_name ?? "");
  const [tone, setTone] = useState<CoverLetterTone>(letter.tone);
  const [style, setStyle] = useState<CoverLetterStyle>(letter.style);
  const updateMutation = useUpdateCoverLetter();
  const versionMutation = useSaveAsVersion();
  const generateMutation = useGenerateCoverLetter();
  const setGenerateDialogOpen = useCoverLetterStore((s) => s.setGenerateDialogOpen);

  const handleSave = () => {
    updateMutation.mutate({
      id: letter.id,
      data: { title, content, recipient_name: recipientName, tone, style },
    });
  };

  const handleSaveAsVersion = () => {
    versionMutation.mutate({ id: letter.id, change_summary: "Manual save" });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Letter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Recipient</label>
                  <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Hiring Manager" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Company & Role</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {letter.job_title} at {letter.company_name}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Content</CardTitle>
              <CardDescription>
                {letter.word_count} words &middot; {letter.char_count} characters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Write or paste your cover letter content here..."
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button leftIcon={<Save className="size-4" />} onClick={handleSave} loading={updateMutation.isPending}>
              Save Changes
            </Button>
            <Button variant="outline" leftIcon={<Save className="size-4" />} onClick={handleSaveAsVersion} loading={versionMutation.isPending}>
              Save as Version
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">AI Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tone</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as CoverLetterTone)}
                >
                  {Object.entries(toneLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Style</label>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                  value={style}
                  onChange={(e) => setStyle(e.target.value as CoverLetterStyle)}
                >
                  {Object.entries(styleLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <Button className="w-full" leftIcon={<Sparkles className="size-4" />} onClick={() => setGenerateDialogOpen(true)} loading={generateMutation.isPending}>
                Generate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Overall" score={letter.overall_score} />
              <ScoreBar label="ATS" score={letter.ats_score} />
              <ScoreBar label="Tone" score={letter.tone_score} />
              <ScoreBar label="Clarity" score={letter.clarity_score} />
              <ScoreBar label="Impact" score={letter.impact_score} />
              <ScoreBar label="Relevance" score={letter.relevance_score} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" size="sm">{letter.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>{letter.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(letter.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(letter.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SuggestionsTab({ letterId }: { letterId: string }) {
  const { data: suggestions = [], isLoading } = useCoverLetterSuggestions(letterId);
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

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Lightbulb className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No suggestions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Run an optimization to get AI suggestions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={suggestionTypeLabels[suggestion.suggestion_type].variant as "danger" | "warning" | "info" | "success" | "default" | "secondary" | "outline"} size="sm">
                  {suggestionTypeLabels[suggestion.suggestion_type].label}
                </Badge>
                {suggestion.confidence !== null && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </span>
                )}
              </div>
              <Badge variant={suggestion.status === "applied" ? "success" : suggestion.status === "dismissed" ? "outline" : "secondary"} size="sm">
                {suggestion.status}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Original</p>
                <p className="text-sm rounded-md bg-muted p-3">{suggestion.original_text}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Suggested</p>
                <p className="text-sm rounded-md bg-success-50 p-3">{suggestion.suggested_text}</p>
              </div>
            </div>
            {suggestion.reasoning && (
              <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
            )}
            {suggestion.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" leftIcon={<CheckCircle className="size-3.5" />} onClick={() => applyMutation.mutate({ letterId, suggestionId: suggestion.id })} loading={applyMutation.isPending}>
                  Apply
                </Button>
                <Button variant="outline" size="sm" leftIcon={<XCircle className="size-3.5" />} onClick={() => dismissMutation.mutate({ letterId, suggestionId: suggestion.id })} loading={dismissMutation.isPending}>
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

function RewritesTab({ letterId }: { letterId: string }) {
  const { data: rewrites = [], isLoading } = useCoverLetterRewrites(letterId);
  const applyMutation = useApplyRewrite();
  const undoMutation = useUndoRewrite();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={140} />
        ))}
      </div>
    );
  }

  if (rewrites.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Repeat className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No rewrites yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Rewrites will appear here after generation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rewrites.map((rewrite) => (
        <Card key={rewrite.id}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant={rewrite.status === "accepted" ? "success" : rewrite.status === "undone" ? "outline" : "secondary"} size="sm">
                {rewrite.status}
              </Badge>
              <span className="text-xs text-muted-foreground">{new Date(rewrite.created_at).toLocaleDateString()}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Original</p>
                <p className="text-sm rounded-md bg-muted p-3">{rewrite.original_text}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Rewritten</p>
                <p className="text-sm rounded-md bg-success-50 p-3">{rewrite.rewritten_text}</p>
              </div>
            </div>
            {rewrite.rewrite_reason && (
              <p className="text-xs text-muted-foreground">{rewrite.rewrite_reason}</p>
            )}
            <div className="flex gap-2">
              {rewrite.status === "pending" && (
                <Button size="sm" leftIcon={<CheckCircle className="size-3.5" />} onClick={() => applyMutation.mutate({ letterId, rewriteId: rewrite.id })} loading={applyMutation.isPending}>
                  Apply
                </Button>
              )}
              {rewrite.status === "accepted" && (
                <Button variant="outline" size="sm" leftIcon={<RotateCcw className="size-3.5" />} onClick={() => undoMutation.mutate({ letterId, rewriteId: rewrite.id })} loading={undoMutation.isPending}>
                  Undo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OptimizationsTab({ letterId }: { letterId: string }) {
  const { data: optimizations = [], isLoading } = useCoverLetterOptimizations(letterId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={100} />
        ))}
      </div>
    );
  }

  if (optimizations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Zap className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No optimizations yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Optimizations track improvements over time</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {optimizations.map((opt) => (
        <Card key={opt.id}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="info" size="sm">{opt.optimization_type}</Badge>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{opt.score_before ?? "N/A"}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-bold">{opt.score_after ?? "N/A"}</span>
                </div>
                {opt.improvement_percentage !== null && (
                  <Badge variant="success" size="sm">+{opt.improvement_percentage}%</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {opt.applied && <Badge variant="success" size="sm">Applied</Badge>}
                <span className="text-xs text-muted-foreground">{new Date(opt.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {opt.changes_summary && (
              <p className="mt-2 text-xs text-muted-foreground">{opt.changes_summary}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function VersionsTab({ letterId }: { letterId: string }) {
  const { data: versions = [], isLoading } = useCoverLetterVersions(letterId);
  const setCurrentMutation = useSetCurrentVersion();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <History className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No versions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Save a version to start tracking changes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version) => (
        <Card key={version.id} className={version.is_current ? "ring-2 ring-brand-500" : ""}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                v{version.version_number}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Version {version.version_number}</p>
                  {version.is_current && <Badge variant="success" size="sm">Current</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(version.created_at).toLocaleDateString()}
                  {version.change_summary && ` · ${version.change_summary}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ScoreBadge score={version.overall_score} />
              {!version.is_current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMutation.mutate({ letterId, versionId: version.id })}
                  loading={setCurrentMutation.isPending}
                >
                  Set as Current
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ComparisonTab({ letterId }: { letterId: string }) {
  const { data: versions = [] } = useCoverLetterVersions(letterId);
  const leftId = useCoverLetterStore((s) => s.comparisonLeftVersionId);
  const rightId = useCoverLetterStore((s) => s.comparisonRightVersionId);
  const setLeft = useCoverLetterStore((s) => s.setComparisonLeftVersionId);
  const setRight = useCoverLetterStore((s) => s.setComparisonRightVersionId);

  const leftVersion = versions.find((v) => v.id === leftId);
  const rightVersion = versions.find((v) => v.id === rightId);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">Version A (Left)</label>
              <select
                className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                value={leftId ?? ""}
                onChange={(e) => setLeft(e.target.value || null)}
              >
                <option value="">Select version</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>Version {v.version_number}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">Version B (Right)</label>
              <select
                className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                value={rightId ?? ""}
                onChange={(e) => setRight(e.target.value || null)}
              >
                <option value="">Select version</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>Version {v.version_number}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!leftVersion && !rightVersion ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GitCompare className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">Select two versions to compare</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {leftVersion ? `Version ${leftVersion.version_number}` : "Select Version A"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leftVersion ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={leftVersion.overall_score} />
                    <span className="text-xs text-muted-foreground">{leftVersion.word_count} words</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">{leftVersion.content || "No content"}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a version from the dropdown</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {rightVersion ? `Version ${rightVersion.version_number}` : "Select Version B"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rightVersion ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={rightVersion.overall_score} />
                    <span className="text-xs text-muted-foreground">{rightVersion.word_count} words</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">{rightVersion.content || "No content"}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a version from the dropdown</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ApprovalsTab({ letterId }: { letterId: string }) {
  const { data: approvals = [], isLoading } = useCoverLetterApprovals(letterId);
  const submitMutation = useSubmitForApproval();
  const approveMutation = useApproveLetter();
  const rejectMutation = useRejectLetter();

  const pendingApproval = approvals.find((a) => a.status === "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-semibold">Approval Workflow</h3>
          <p className="text-sm text-muted-foreground">
            Submit this cover letter for approval or manage existing approvals.
          </p>
          {!pendingApproval && (
            <Button
              leftIcon={<Send className="size-4" />}
              onClick={() => submitMutation.mutate({ letterId })}
              loading={submitMutation.isPending}
            >
              Submit for Approval
            </Button>
          )}
          {pendingApproval && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-50">
              <AlertCircle className="size-4 text-warning-600" />
              <span className="text-sm text-warning-700">Awaiting review</span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" leftIcon={<CheckCircle className="size-3.5" />} onClick={() => approveMutation.mutate({ letterId, approvalId: pendingApproval.id })} loading={approveMutation.isPending}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" leftIcon={<XCircle className="size-3.5" />} onClick={() => rejectMutation.mutate({ letterId, approvalId: pendingApproval.id })} loading={rejectMutation.isPending}>
                  Reject
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} />
          ))}
        </div>
      ) : approvals.length > 0 ? (
        <div className="space-y-3">
          {approvals.map((approval) => (
            <Card key={approval.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={approval.status === "approved" ? "success" : approval.status === "rejected" ? "danger" : "warning"}
                    size="sm"
                  >
                    {approval.status}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{approval.reviewer_name ?? "Unknown reviewer"}</p>
                    <p className="text-xs text-muted-foreground">
                      {approval.reviewed_at ? new Date(approval.reviewed_at).toLocaleDateString() : "Pending"}
                    </p>
                  </div>
                </div>
                {approval.notes && (
                  <p className="text-xs text-muted-foreground max-w-xs truncate">{approval.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Shield className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No approvals yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HistoryTab({ letterId }: { letterId: string }) {
  const { data: history = [], isLoading } = useCoverLetterHistory(letterId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No history yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Activity will appear here as you work on this letter</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((event) => (
        <div key={event.id} className="flex items-start gap-3">
          <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <Clock className="size-3 text-brand-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              <span className="text-muted-foreground">{event.description ?? event.event_type}</span>
            </p>
            <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab({ letterId }: { letterId: string }) {
  const { data: analytics, isLoading } = useCoverLetterAnalytics(letterId);

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
            <Eye className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.view_count ?? 0}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Share2 className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.share_count ?? 0}</p>
            <p className="text-xs text-muted-foreground">Shares</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Download className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.export_count ?? 0}</p>
            <p className="text-xs text-muted-foreground">Exports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ThumbsUp className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{analytics?.average_rating ?? "N/A"}</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
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
              {analytics.score_trend.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">{point.date}</span>
                  <Progress value={point.score} size="sm" className="flex-1" />
                  <span className="text-xs font-medium w-8">{point.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No score trend data yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tone Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.top_tones && analytics.top_tones.length > 0 ? (
            <div className="space-y-2">
              {analytics.top_tones.map((item) => (
                <div key={item.tone} className="flex items-center justify-between">
                  <Badge variant="secondary" size="sm">{toneLabels[item.tone] ?? item.tone}</Badge>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tone data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SharingTab({ letterId }: { letterId: string }) {
  const { data: shares = [], isLoading } = useCoverLetterShares(letterId);
  const createMutation = useCreateShare();
  const revokeMutation = useRevokeShare();
  const [permission, setPermission] = useState<SharePermission>("view");

  const handleCreateShare = () => {
    createMutation.mutate({ letterId, data: { permission } });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-semibold">Create Share Link</h3>
          <div className="flex gap-3">
            <select
              className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
              value={permission}
              onChange={(e) => setPermission(e.target.value as SharePermission)}
            >
              <option value="view">View Only</option>
              <option value="comment">Can Comment</option>
              <option value="edit">Can Edit</option>
            </select>
            <Button leftIcon={<Share2 className="size-4" />} onClick={handleCreateShare} loading={createMutation.isPending}>
              Create Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} />
          ))}
        </div>
      ) : shares.length > 0 ? (
        <div className="space-y-3">
          {shares.map((share) => (
            <Card key={share.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={share.is_active ? "success" : "outline"} size="sm">
                    {share.permission}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{share.share_url}</p>
                    <p className="text-xs text-muted-foreground">
                      {share.access_count} views
                      {share.expires_at && ` · Expires ${new Date(share.expires_at).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => revokeMutation.mutate({ letterId, shareId: share.id })}
                  loading={revokeMutation.isPending}
                >
                  <Trash2 className="size-3.5 text-danger-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Share2 className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No shares yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CommentsTab({ letterId }: { letterId: string }) {
  const { data: comments = [], isLoading } = useCoverLetterComments(letterId);
  const addMutation = useAddComment();
  const resolveMutation = useResolveComment();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addMutation.mutate({ letterId, data: { content: newComment } }, { onSuccess: () => setNewComment("") });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-semibold">Add Comment</h3>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
          />
          <div className="flex justify-end">
            <Button leftIcon={<MessageSquare className="size-4" />} onClick={handleAddComment} loading={addMutation.isPending} disabled={!newComment.trim()}>
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className={comment.status === "resolved" ? "opacity-60" : ""}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.user_name}</span>
                    <Badge variant={comment.status === "resolved" ? "success" : "secondary"} size="sm">
                      {comment.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
                {comment.selected_text && (
                  <p className="text-xs text-muted-foreground italic">Re: "{comment.selected_text}"</p>
                )}
                {comment.status === "open" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<CheckCircle className="size-3.5" />}
                    onClick={() => resolveMutation.mutate({ letterId, commentId: comment.id })}
                    loading={resolveMutation.isPending}
                  >
                    Resolve
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageSquare className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No comments yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReportsTab({ letterId }: { letterId: string }) {
  const { data: reports = [], isLoading } = useCoverLetterReports(letterId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={100} />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileBarChart className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No reports generated yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Reports provide detailed analysis of your cover letter</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <FileBarChart className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{report.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm">{report.report_type}</Badge>
              {report.score !== null && <ScoreBadge score={report.score} />}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookmarksTab({ letter }: { letter: CoverLetter }) {
  const bookmarkMutation = useBookmarkCoverLetter();
  const unbookmarkMutation = useUnbookmarkCoverLetter();

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-sm font-semibold">Bookmarks</h3>
        <p className="text-sm text-muted-foreground">
          Save this cover letter for quick access later.
        </p>
        {letter.is_bookmarked ? (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookmarkCheck className="size-4" />}
            onClick={() => unbookmarkMutation.mutate(letter.id)}
            loading={unbookmarkMutation.isPending}
          >
            Bookmarked
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Bookmark className="size-4" />}
            onClick={() => bookmarkMutation.mutate(letter.id)}
            loading={bookmarkMutation.isPending}
          >
            Bookmark
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───

export const CoverLetterDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const letterId = id ?? "";
  const [activeTab, setActiveTab] = useState("editor");

  const { data: letter, isLoading: isLoadingLetter } = useCoverLetterDetail(letterId);

  if (isLoadingLetter) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={500} />
        </div>
      </PageContainer>
    );
  }

  if (!letter) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Cover Letter Not Found"
            description="The cover letter you're looking for doesn't exist or has been removed"
            icon={<FileText className="size-5" />}
            backHref="/cover-letter"
          />
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">Cover letter not found</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/cover-letter">Back to Cover Letters</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={letter.title}
          description={`${letter.job_title} at ${letter.company_name}`}
          icon={<FileText className="size-5" />}
          backHref="/cover-letter"
          actions={
            <>
              <Badge variant="secondary" size="sm">{letter.status}</Badge>
              <Badge variant="outline" size="sm">v{letter.version}</Badge>
              {letter.overall_score !== null && <ScoreBadge score={letter.overall_score} />}
            </>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="editor"><Pencil className="size-3.5 mr-1.5" />Editor</TabsTrigger>
            <TabsTrigger value="suggestions"><Lightbulb className="size-3.5 mr-1.5" />Suggestions</TabsTrigger>
            <TabsTrigger value="rewrites"><Repeat className="size-3.5 mr-1.5" />Rewrites</TabsTrigger>
            <TabsTrigger value="optimizations"><Zap className="size-3.5 mr-1.5" />Optimizations</TabsTrigger>
            <TabsTrigger value="versions"><History className="size-3.5 mr-1.5" />Versions</TabsTrigger>
            <TabsTrigger value="comparison"><GitCompare className="size-3.5 mr-1.5" />Comparison</TabsTrigger>
            <TabsTrigger value="approvals"><Shield className="size-3.5 mr-1.5" />Approvals</TabsTrigger>
            <TabsTrigger value="history"><Clock className="size-3.5 mr-1.5" />History</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="size-3.5 mr-1.5" />Analytics</TabsTrigger>
            <TabsTrigger value="sharing"><Share2 className="size-3.5 mr-1.5" />Sharing</TabsTrigger>
            <TabsTrigger value="comments"><MessageSquare className="size-3.5 mr-1.5" />Comments</TabsTrigger>
            <TabsTrigger value="reports"><FileBarChart className="size-3.5 mr-1.5" />Reports</TabsTrigger>
            <TabsTrigger value="bookmarks"><Bookmark className="size-3.5 mr-1.5" />Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <EditorTab letter={letter} />
          </TabsContent>

          <TabsContent value="suggestions">
            <SuggestionsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="rewrites">
            <RewritesTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="optimizations">
            <OptimizationsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="versions">
            <VersionsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="approvals">
            <ApprovalsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="sharing">
            <SharingTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab letterId={letterId} />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarksTab letter={letter} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
