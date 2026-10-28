import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, XCircle, Trash2, Users, Eye, MousePointerClick } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailCampaign,
  useDeleteEmailCampaign,
  useStartCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useCancelCampaign,
} from "@/hooks/useEmail";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  running: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function EmailCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useEmailCampaign(id!);
  const deleteMutation = useDeleteEmailCampaign();
  const startMutation = useStartCampaign();
  const pauseMutation = usePauseCampaign();
  const resumeMutation = useResumeCampaign();
  const cancelMutation = useCancelCampaign();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={60} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!campaign) {
    return (
      <PageContainer>
        <div className="py-12 text-center text-sm text-muted-foreground">Campaign not found.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/email/campaigns"><ArrowLeft className="size-4" /> Back</Link>
          </Button>
        </div>

        <PageHeader
          title={campaign.name}
          description={`Campaign • ${campaign.status}`}
          icon={<Users className="size-5" />}
          actions={
            <div className="flex gap-2">
              {campaign.status === "draft" && (
                <Button variant="default" size="sm" leftIcon={<Play className="size-3" />} onClick={() => startMutation.mutate(id!)}>Start</Button>
              )}
              {campaign.status === "running" && (
                <Button variant="outline" size="sm" leftIcon={<Pause className="size-3" />} onClick={() => pauseMutation.mutate(id!)}>Pause</Button>
              )}
              {campaign.status === "paused" && (
                <Button variant="outline" size="sm" leftIcon={<RotateCcw className="size-3" />} onClick={() => resumeMutation.mutate(id!)}>Resume</Button>
              )}
              {campaign.status !== "completed" && campaign.status !== "cancelled" && (
                <Button variant="outline" size="sm" leftIcon={<XCircle className="size-3" />} onClick={() => cancelMutation.mutate(id!)}>Cancel</Button>
              )}
              <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-3" />} onClick={() => { deleteMutation.mutate(id!); }}>Delete</Button>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[campaign.status] ?? ""}>{campaign.status}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Recipients</p>
              <p className="text-2xl font-bold">{campaign.total_recipients}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground"><Eye className="size-3" /> Opened</div>
              <p className="text-2xl font-bold">{campaign.total_opened}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground"><MousePointerClick className="size-3" /> Clicked</div>
              <p className="text-2xl font-bold">{campaign.total_clicked}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 text-sm font-medium">Campaign Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><span>{campaign.subject || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Sent</span><span>{campaign.total_sent}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Bounced</span><span>{campaign.total_bounced}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(campaign.created_at).toLocaleDateString()}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
