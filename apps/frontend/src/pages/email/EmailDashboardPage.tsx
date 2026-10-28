import { Link } from "react-router-dom";
import {
  Mail,
  Send,
  Users,
  FileText,
  Zap,
  ArrowRight,
  Inbox,
  Clock,
  Settings,
  Plus,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailStats, useEmailAccounts, useEmailMessages } from "@/hooks/useEmail";
import type { EmailMessage } from "@/types/email";

function SkeletonGrid() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={100} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton variant="rectangular" height={320} />
        <Skeleton variant="rectangular" height={320} />
      </div>
    </>
  );
}

function MessageItem({ message }: { message: EmailMessage }) {
  const isOutbound = message.direction === "outbound";

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        {isOutbound ? <Send className="size-4" /> : <Inbox className="size-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {message.subject ?? "(No subject)"}
          </p>
          {!message.is_read && (
            <Badge variant="default" className="shrink-0 text-[10px] px-1.5 py-0">
              New
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {isOutbound
            ? `To: ${Array.isArray(message.to_addresses) ? message.to_addresses.join(", ") : (message.to_addresses as unknown as string) ?? "—" }`
            : `From: ${message.from_name ?? message.from_address ?? "—"}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {message.sent_at ?? message.received_at ?? message.created_at}
        </p>
      </div>
      <Badge variant="outline" className="shrink-0">
        {isOutbound ? "Sent" : "Received"}
      </Badge>
    </div>
  );
}

export default function EmailDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useEmailStats();
  const { data: accountsData, isLoading: accountsLoading } = useEmailAccounts();
  const { data: messagesData, isLoading: messagesLoading } = useEmailMessages();

  const recentMessages = messagesData?.items ?? [];
  const totalAccounts = accountsData?.total ?? stats?.total_accounts ?? 0;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Email Intelligence"
          description="Manage your email accounts, campaigns, and communications"
          icon={<Mail className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/email/compose">Compose</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<FileText className="size-4" />} asChild>
                <Link to="/email/templates">Templates</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/email/settings">Settings</Link>
              </Button>
            </>
          }
        />

        {statsLoading ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Total Accounts"
                    value={totalAccounts}
                    icon={<Users className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Messages Sent"
                    value={stats?.sent_messages ?? 0}
                    icon={<Send className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Active Campaigns"
                    value={stats?.active_campaigns ?? 0}
                    icon={<BarChart3 className="size-4" />}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Statistic
                    label="Active Sequences"
                    value={stats?.active_sequences ?? 0}
                    icon={<Zap className="size-4" />}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Messages</CardTitle>
                  <CardDescription>Your latest email activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={64} />
                      ))}
                    </div>
                  ) : recentMessages.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No messages yet. Compose an email to get started.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {recentMessages.slice(0, 8).map((message) => (
                        <MessageItem key={message.id} message={message} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Email Accounts</CardTitle>
                  <CardDescription>Connected email accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  {accountsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={56} />
                      ))}
                    </div>
                  ) : (accountsData?.items ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No email accounts connected. Add an account to start sending.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {(accountsData?.items ?? []).slice(0, 5).map((account) => (
                        <div key={account.id} className="flex items-center gap-3 py-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Mail className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {account.display_name ?? account.email_address}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {account.email_address}
                            </p>
                          </div>
                          <Badge variant={account.is_active ? "default" : "secondary"}>
                            {account.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Common tasks for your email communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/email/compose">
                      <Send className="mr-2 size-4" />
                      Compose Email
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/email/templates">
                      <FileText className="mr-2 size-4" />
                      Email Templates
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/email/campaigns">
                      <BarChart3 className="mr-2 size-4" />
                      Campaigns
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/email/sequences">
                      <Zap className="mr-2 size-4" />
                      Sequences
                      <ArrowRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
