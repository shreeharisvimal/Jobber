import { useState } from "react";
import { Settings, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailAccounts,
  useCreateEmailAccount,
  useDeleteEmailAccount,
} from "@/hooks/useEmail";

export default function EmailSettingsPage() {
  const { data, isLoading } = useEmailAccounts();
  const createMutation = useCreateEmailAccount();
  const deleteMutation = useDeleteEmailAccount();

  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const accounts = data?.data ?? [];

  const handleAdd = () => {
    if (!newEmail.trim()) return;
    createMutation.mutate(
      { email_address: newEmail },
      { onSuccess: () => { setShowAdd(false); setNewEmail(""); } },
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Email Settings"
          description="Manage your email accounts and preferences"
          icon={<Settings className="size-5" />}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium">Email Accounts</h3>
              <Button size="sm" leftIcon={<Plus className="size-3" />} onClick={() => setShowAdd(true)}>
                Add Account
              </Button>
            </div>

            {showAdd && (
              <div className="mb-4 flex items-center gap-3">
                <Input
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleAdd} disabled={createMutation.isPending}>Add</Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={48} />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No email accounts connected.</p>
            ) : (
              <div className="space-y-3">
                {accounts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{a.email_address}</span>
                      <Badge variant={a.is_active ? "default" : "secondary"}>
                        {a.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(a.id)}>
                      <Trash2 className="size-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-sm font-medium">Default Settings</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Signature</span>
                <span className="max-w-xs truncate">Not configured</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Open Tracking</span>
                <Badge>Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Click Tracking</span>
                <Badge>Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Daily Send Limit</span>
                <span>500</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
