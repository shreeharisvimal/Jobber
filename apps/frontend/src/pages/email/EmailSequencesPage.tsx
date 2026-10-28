import { useState } from "react";
import { Plus, Workflow, Trash2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailSequences,
  useCreateEmailSequence,
  useDeleteEmailSequence,
} from "@/hooks/useEmail";
import { useEmailStore } from "@/stores/email.store";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function EmailSequencesPage() {
  const filters = useEmailStore((s) => s.sequenceFilters);
  const setFilters = useEmailStore((s) => s.setSequenceFilters);
  const { data, isLoading } = useEmailSequences();
  const createMutation = useCreateEmailSequence();
  const deleteMutation = useDeleteEmailSequence();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const sequences = data?.data ?? [];
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
          title="Email Sequences"
          description="Create automated email sequences"
          icon={<Workflow className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => setShowCreate(true)}>
              New Sequence
            </Button>
          }
        />

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search sequences..."
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
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {showCreate && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Sequence name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleCreate} disabled={createMutation.isPending}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
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
        ) : sequences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Workflow className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No sequences yet. Create your first sequence to automate outreach.</p>
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Steps</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Enrolled</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Completed</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sequences.map((s) => (
                    <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link to={`/email/sequences/${s.id}`} className="font-medium hover:underline">
                          {s.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[s.status] ?? ""}>{s.status}</Badge>
                      </td>
                      <td className="px-4 py-3">{s.total_steps}</td>
                      <td className="px-4 py-3">{s.total_enrolled}</td>
                      <td className="px-4 py-3">{s.completed_count}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/email/sequences/${s.id}`}><ChevronRight className="size-3" /></Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(s.id)}>
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
