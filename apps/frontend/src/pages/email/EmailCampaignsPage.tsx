import { useState } from "react";
import {
  Plus,
  Mail,
  Play,
  Pause,
  RotateCcw,
  XCircle,
  Trash2,
  Users,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailCampaigns,
  useCreateEmailCampaign,
  useDeleteEmailCampaign,
  useStartCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useCancelCampaign,
} from "@/hooks/useEmail";
import { useEmailStore } from "@/stores/email.store";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  running: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function EmailCampaignsPage() {
  const filters = useEmailStore((s) => s.campaignFilters);
  const setFilters = useEmailStore((s) => s.setCampaignFilters);
  const { data, isLoading } = useEmailCampaigns();
  const createMutation = useCreateEmailCampaign();
  const deleteMutation = useDeleteEmailCampaign();
  const startMutation = useStartCampaign();
  const pauseMutation = usePauseCampaign();
  const resumeMutation = useResumeCampaign();
  const cancelMutation = useCancelCampaign();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const campaigns = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate(
      { name: newName },
      { onSuccess: () => { setShowCreate(false); setNewName(""); } },
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Email Campaigns"
          description="Create and manage bulk email campaigns"
          icon={<Mail className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => setShowCreate(true)}>
              New Campaign
            </Button>
          }
        />

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search campaigns..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="max-w-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {showCreate && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Campaign name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={60} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No campaigns yet. Create your first campaign to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Recipients</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sent</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Opened</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Clicked</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[c.status] ?? ""}>{c.status}</Badge>
                      </td>
                      <td className="px-4 py-3"><Users className="mr-1 inline size-3" />{c.total_recipients}</td>
                      <td className="px-4 py-3">{c.total_sent}</td>
                      <td className="px-4 py-3"><Eye className="mr-1 inline size-3" />{c.total_opened}</td>
                      <td className="px-4 py-3"><MousePointerClick className="mr-1 inline size-3" />{c.total_clicked}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {c.status === "draft" && (
                            <Button variant="ghost" size="sm" onClick={() => startMutation.mutate(c.id)}>
                              <Play className="size-3" />
                            </Button>
                          )}
                          {c.status === "running" && (
                            <Button variant="ghost" size="sm" onClick={() => pauseMutation.mutate(c.id)}>
                              <Pause className="size-3" />
                            </Button>
                          )}
                          {c.status === "paused" && (
                            <Button variant="ghost" size="sm" onClick={() => resumeMutation.mutate(c.id)}>
                              <RotateCcw className="size-3" />
                            </Button>
                          )}
                          {c.status !== "completed" && c.status !== "cancelled" && (
                            <Button variant="ghost" size="sm" onClick={() => cancelMutation.mutate(c.id)}>
                              <XCircle className="size-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(c.id)}>
                            <Trash2 className="size-3 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {(meta.page - 1) * meta.per_page + 1}-{Math.min(meta.page * meta.per_page, meta.total)} of {meta.total}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setFilters({ page: meta.page - 1 })}>Previous</Button>
              <Button variant="outline" size="sm" disabled={meta.page >= meta.total_pages} onClick={() => setFilters({ page: meta.page + 1 })}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
