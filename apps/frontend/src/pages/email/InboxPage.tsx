import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  MailOpen,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyTable,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useEmailMessages,
  useMarkAsRead,
  useToggleStar,
  useDeleteEmailMessage,
} from "@/hooks/useEmail";
import { useEmailStore } from "@/stores/email.store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { EmailMessage } from "@/types/email";

const statusConfig: Record<string, { label: string; variant: string }> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
  bounced: { label: "Bounced", variant: "danger" },
  failed: { label: "Failed", variant: "danger" },
  queued: { label: "Queued", variant: "warning" },
  scheduled: { label: "Scheduled", variant: "warning" },
};

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="w-10"><Skeleton variant="rectangular" className="h-4 w-4" /></TableCell>
      <TableCell className="w-10"><Skeleton variant="rectangular" className="h-4 w-4" /></TableCell>
      <TableCell><Skeleton variant="text" className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton variant="text" className="h-4 w-64" /></TableCell>
      <TableCell><Skeleton variant="rectangular" className="h-5 w-16 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton variant="text" className="h-4 w-20 ml-auto" /></TableCell>
    </TableRow>
  );
}

export default function InboxPage() {
  const [showFilters, setShowFilters] = useState(false);

  const setMessageFilters = useEmailStore((s) => s.setMessageFilters);
  const messageFilters = useEmailStore((s) => s.messageFilters);

  const search = messageFilters.search;
  const status = messageFilters.status;
  const direction = messageFilters.direction;
  const folder = messageFilters.folder;
  const page = messageFilters.page;

  const { data: results, isLoading } = useEmailMessages();
  const markAsReadMutation = useMarkAsRead();
  const toggleStarMutation = useToggleStar();
  const deleteMutation = useDeleteEmailMessage();

  const messages = results?.items ?? [];
  const totalPages = results?.total_pages ?? 1;

  const handleSearch = (value: string) => {
    setMessageFilters({ search: value, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    setMessageFilters({ [key]: value, page: 1 });
  };

  const handleToggleStar = (id: string) => {
    toggleStarMutation.mutate(id);
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    setMessageFilters({ page: newPage });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Inbox"
          description="View and manage your email messages"
          icon={<Mail className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/email/compose">Compose</Link>
            </Button>
          }
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="size-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      inputSize="sm"
                      value={status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="delivered">Delivered</option>
                      <option value="bounced">Bounced</option>
                      <option value="failed">Failed</option>
                      <option value="queued">Queued</option>
                      <option value="scheduled">Scheduled</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Direction</label>
                    <Select
                      inputSize="sm"
                      value={direction}
                      onChange={(e) => handleFilterChange("direction", e.target.value)}
                    >
                      <option value="">All Directions</option>
                      <option value="inbound">Inbound</option>
                      <option value="outbound">Outbound</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Folder</label>
                    <Select
                      inputSize="sm"
                      value={folder}
                      onChange={(e) => handleFilterChange("folder", e.target.value)}
                    >
                      <option value="">All Folders</option>
                      <option value="inbox">Inbox</option>
                      <option value="sent">Sent</option>
                      <option value="drafts">Drafts</option>
                      <option value="trash">Trash</option>
                      <option value="spam">Spam</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead className="w-10" />
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={<Mail className="size-7" />}
            title="No messages found"
            description={search ? "Try adjusting your search or filters." : "Your inbox is empty."}
            action={
              !search
                ? { label: "Compose", onClick: () => (window.location.href = "/email/compose") }
                : undefined
            }
          />
        ) : (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    <TableHead className="w-10" />
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg: EmailMessage) => (
                    <TableRow
                      key={msg.id}
                      className={cn(!msg.is_read && "bg-muted/30 font-medium")}
                    >
                      <TableCell>
                        <button
                          onClick={() => handleToggleStar(msg.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Star
                            className={cn(
                              "size-4",
                              msg.is_starred
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground",
                            )}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        {!msg.is_read && (
                          <span className="block size-2 rounded-full bg-blue-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {msg.direction === "inbound" ? (
                            <ArrowDownLeft className="size-3 text-green-500 shrink-0" />
                          ) : (
                            <ArrowUpRight className="size-3 text-blue-500 shrink-0" />
                          )}
                          <span className="truncate max-w-[160px]">
                            {msg.from_name || msg.from_address || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/email/messages/${msg.id}`}
                          className="hover:underline line-clamp-1"
                        >
                          {msg.subject || "(No subject)"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {statusConfig[msg.status] ? (
                          <Badge variant={statusConfig[msg.status].variant as any}>
                            {statusConfig[msg.status].label}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{msg.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(
                            new Date(msg.sent_at || msg.received_at || msg.created_at),
                            "MMM d, yyyy",
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft className="size-4" />}
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight className="size-4" />}
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
