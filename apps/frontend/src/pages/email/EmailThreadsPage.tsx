import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useEmailThreads } from "@/hooks/useEmail";
import { useEmailStore } from "@/stores/email.store";

export default function EmailThreadsPage() {
  const filters = useEmailStore((s) => s.threadFilters);
  const setFilters = useEmailStore((s) => s.setThreadFilters);
  const { data, isLoading } = useEmailThreads();

  const threads = data?.data ?? [];
  const meta = data?.meta;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Threads"
          description="View and manage email conversation threads"
          icon={<MessageSquare className="size-5" />}
        />

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search threads..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="max-w-sm"
          />
          <select
            value={filters.folder}
            onChange={(e) => setFilters({ folder: e.target.value })}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">All Folders</option>
            <option value="inbox">Inbox</option>
            <option value="sent">Sent</option>
            <option value="archive">Archive</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={72} />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No threads found.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Participants</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Messages</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Message</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Folder</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {threads.map((t) => (
                    <tr key={t.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{t.subject}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.participants?.length ?? 0}</td>
                      <td className="px-4 py-3">{t.message_count}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {t.last_message_at ? new Date(t.last_message_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{t.folder || "inbox"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm"><ChevronRight className="size-3" /></Button>
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
