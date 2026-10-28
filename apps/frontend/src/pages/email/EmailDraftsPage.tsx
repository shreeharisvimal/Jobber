import { useState } from "react";
import { Plus, FileText, Send, Trash2, Edit } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailDrafts,
  useCreateEmailDraft,
  useDeleteEmailDraft,
  useSendDraft,
} from "@/hooks/useEmail";

export default function EmailDraftsPage() {
  const { data, isLoading } = useEmailDrafts();
  const createMutation = useCreateEmailDraft();
  const deleteMutation = useDeleteEmailDraft();
  const sendMutation = useSendDraft();

  const [showCreate, setShowCreate] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const drafts = data?.data ?? [];

  const handleCreate = () => {
    if (!newSubject.trim()) return;
    createMutation.mutate(
      { subject: newSubject },
      { onSuccess: () => { setShowCreate(false); setNewSubject(""); } },
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Drafts"
          description="Manage your email drafts"
          icon={<FileText className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} onClick={() => setShowCreate(true)}>
              New Draft
            </Button>
          }
        />

        {showCreate && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
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
        ) : drafts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No drafts. Start composing a new email.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">To</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Modified</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((d) => (
                    <tr key={d.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{d.subject || "(No subject)"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.to_addresses?.join(", ") || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(d.updated_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="size-3" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Send" onClick={() => sendMutation.mutate(d.id)}>
                            <Send className="size-3" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Delete" onClick={() => deleteMutation.mutate(d.id)}>
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
      </div>
    </PageContainer>
  );
}
