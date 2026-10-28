import { type FC, useState } from "react";
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useQuestionBank,
  useCreateQuestionBankQuestion,
  useUpdateQuestionBankQuestion,
  useDeleteQuestionBankQuestion,
} from "@/hooks/useInterview";
import type { InterviewQuestionBank, InterviewQuestionType } from "@/types/interview";

const questionTypeLabels: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  coding: "Coding",
  system_design: "System Design",
  leadership: "Leadership",
  hr: "HR",
  company_specific: "Company Specific",
  role_specific: "Role Specific",
  industry_specific: "Industry Specific",
  follow_up: "Follow-up",
  case_study: "Case Study",
};

const difficultyLabels: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

const difficultyVariants: Record<string, string> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
  expert: "danger",
};

function QuestionDialog({
  open,
  onClose,
  question,
}: {
  open: boolean;
  onClose: () => void;
  question?: InterviewQuestionBank;
}) {
  const [questionText, setQuestionText] = useState(question?.question_text ?? "");
  const [questionType, setQuestionType] = useState<InterviewQuestionType>(question?.question_type ?? "behavioral");
  const [category, setCategory] = useState(question?.category ?? "");
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? "medium");
  const [expectedAnswer, setExpectedAnswer] = useState(question?.expected_answer ?? "");
  const [tagsInput, setTagsInput] = useState(question?.tags?.join(", ") ?? "");

  const createMutation = useCreateQuestionBankQuestion();
  const updateMutation = useUpdateQuestionBankQuestion();

  if (!open) return null;

  const handleSubmit = () => {
    if (!questionText.trim()) return;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const data: Partial<InterviewQuestionBank> = {
      question_text: questionText,
      question_type: questionType,
      category: category || undefined,
      difficulty,
      expected_answer: expectedAnswer || undefined,
      tags,
    };
    if (question) {
      updateMutation.mutate(
        { id: question.id, data },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">
            {question ? "Edit Question" : "Add Question"}
          </CardTitle>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Question</label>
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              placeholder="Enter the interview question..."
              className="mt-1"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={questionType} onChange={(e) => setQuestionType(e.target.value as InterviewQuestionType)}>
                {Object.entries(questionTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {Object.entries(difficultyLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. System Design, Algorithms" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Expected Answer (optional)</label>
            <Textarea value={expectedAnswer} onChange={(e) => setExpectedAnswer(e.target.value)} rows={4} placeholder="Sample answer or key points..." className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. arrays, recursion, senior" className="mt-1" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!questionText.trim()}>
              {question ? "Save Changes" : "Add Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionDetailDialog({
  open,
  onClose,
  question,
}: {
  open: boolean;
  onClose: () => void;
  question: InterviewQuestionBank | null;
}) {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">Question Detail</CardTitle>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" size="sm">{questionTypeLabels[question.question_type] ?? question.question_type}</Badge>
            <Badge variant={(difficultyVariants[question.difficulty ?? "medium"] as "success" | "warning" | "danger") ?? "secondary"} size="sm">
              {difficultyLabels[question.difficulty ?? "medium"] ?? question.difficulty}
            </Badge>
            {question.category && <Badge variant="outline" size="sm">{question.category}</Badge>}
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Question</p>
            <p className="text-sm text-muted-foreground rounded-md bg-muted p-3">{question.question_text}</p>
          </div>
          {question.expected_answer && (
            <div>
              <p className="text-sm font-medium mb-2">Expected Answer</p>
              <p className="text-sm text-muted-foreground rounded-md bg-success-50 p-3">{question.expected_answer}</p>
            </div>
          )}
          {question.tags && question.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-muted-foreground">Usage Count</p>
              <p className="font-medium">{question.usage_count}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(question.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const InterviewQuestionBankPage: FC = () => {
  const { data: questions = [], isLoading } = useQuestionBank();
  const deleteMutation = useDeleteQuestionBankQuestion();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestionBank | undefined>();
  const [detailQuestion, setDetailQuestion] = useState<InterviewQuestionBank | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  const filteredQuestions = questions.filter((q) => {
    if (search && !q.question_text.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && q.question_type !== filterType) return false;
    if (filterCategory && q.category !== filterCategory) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  const categories = [...new Set(questions.map((q) => q.category).filter(Boolean))];

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Question Bank"
          description="Manage and organize your interview questions"
          icon={<HelpCircle className="size-5" />}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Upload className="size-4" />}>
                Bulk Import
              </Button>
              <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => { setEditingQuestion(undefined); setDialogOpen(true); }}>
                Add Question
              </Button>
            </div>
          }
        />

        <QuestionDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setEditingQuestion(undefined); }}
          question={editingQuestion}
        />

        <QuestionDetailDialog
          open={detailOpen}
          onClose={() => { setDetailOpen(false); setDetailQuestion(null); }}
          question={detailQuestion}
        />

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="size-4" />}
            />
          </div>
          <select className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {Object.entries(questionTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c!}>{c}</option>)}
          </select>
          <select className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
            <option value="">All Difficulties</option>
            {Object.entries(difficultyLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        ) : filteredQuestions.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">{filteredQuestions.length} questions found</p>
            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="group transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium line-clamp-2">{question.question_text}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" size="sm">{questionTypeLabels[question.question_type] ?? question.question_type}</Badge>
                          <Badge variant={(difficultyVariants[question.difficulty ?? "medium"] as "success" | "warning" | "danger") ?? "secondary"} size="sm">
                            {difficultyLabels[question.difficulty ?? "medium"] ?? question.difficulty}
                          </Badge>
                          {question.category && <Badge variant="outline" size="sm">{question.category}</Badge>}
                          <span className="text-xs text-muted-foreground">{question.usage_count} uses</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setDetailQuestion(question); setDetailOpen(true); }}>
                          <HelpCircle className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditingQuestion(question); setDialogOpen(true); }}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => deleteMutation.mutate(question.id)}>
                          <Trash2 className="size-3.5 text-danger-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">No questions found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search ? "Try adjusting your search or filters" : "Add your first question to get started"}
              </p>
              {!search && (
                <Button size="sm" leftIcon={<Plus className="size-4" />} className="mt-4" onClick={() => setDialogOpen(true)}>
                  Add Question
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
