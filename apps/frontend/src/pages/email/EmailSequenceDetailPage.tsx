import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Pause, Play } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailSequence,
  useDeleteEmailSequence,
} from "@/hooks/useEmail";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function EmailSequenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: sequence, isLoading } = useEmailSequence(id!);
  const deleteMutation = useDeleteEmailSequence();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={300} />
        </div>
      </PageContainer>
    );
  }

  if (!sequence) {
    return (
      <PageContainer>
        <div className="py-12 text-center text-sm text-muted-foreground">Sequence not found.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/email/sequences"><ArrowLeft className="size-4" /> Back</Link>
          </Button>
        </div>

        <PageHeader
          title={sequence.name}
          description={`Sequence • ${sequence.status}`}
          icon={<Play className="size-5" />}
          actions={
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-3" />} onClick={() => { deleteMutation.mutate(id!); }}>Delete</Button>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[sequence.status] ?? ""}>{sequence.status}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Steps</p>
              <p className="text-2xl font-bold">{sequence.total_steps}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Enrolled</p>
              <p className="text-2xl font-bold">{sequence.total_enrolled}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{sequence.completed_count}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 text-sm font-medium">Sequence Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span>{sequence.description || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(sequence.created_at).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delay Between Steps</span><span>{sequence.delay_days ?? 1} day(s)</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
