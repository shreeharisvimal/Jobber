import { type FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  History,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Timer,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
interface ExecutionRecord {
  id: string;
  module: string;
  action: string;
  provider: string;
  model: string;
  status: "success" | "error" | "pending" | "timeout";
  tokens: number;
  cost: number;
  latency: number;
  createdAt: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  error?: string;
}

interface ExecutionHistoryResponse {
  data: ExecutionRecord[];
  total: number;
  page: number;
  pageSize: number;
}

const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  success: "success",
  error: "default",
  pending: "warning",
  timeout: "default",
};

const statusIcon: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  pending: Timer,
  timeout: AlertTriangle,
};

const moduleOptions = [
  { value: "all", label: "All Modules" },
  { value: "resume", label: "Resume" },
  { value: "cover-letter", label: "Cover Letter" },
  { value: "interview", label: "Interview" },
  { value: "career", label: "Career" },
  { value: "skills", label: "Skills" },
  { value: "general", label: "General" },
];

const providerOptions = [
  { value: "all", label: "All Providers" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "azure", label: "Azure" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
  { value: "pending", label: "Pending" },
  { value: "timeout", label: "Timeout" },
];

const sortOptions = [
  { value: "createdAt", label: "Date" },
  { value: "tokens", label: "Tokens" },
  { value: "cost", label: "Cost" },
  { value: "latency", label: "Latency" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatCost(cost: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
  }).format(cost);
}

export const ExecutionHistoryPage: FC = () => {
  const [moduleFilter, setModuleFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pageSize = 20;

  const { data, isLoading, error } = useQuery<ExecutionHistoryResponse>({
    queryKey: [
      "ai",
      "executions",
      moduleFilter,
      providerFilter,
      statusFilter,
      sortBy,
      sortOrder,
      page,
    ],
    queryFn: async () => {
      const response = await apiClient.get("/ai/executions", {
        params: {
          module: moduleFilter,
          provider: providerFilter,
          status: statusFilter,
          sort: sortBy,
          order: sortOrder,
          page,
          pageSize,
        },
      });
      return response.data?.data ?? response.data ?? { data: [], total: 0, page: 1, pageSize: 20 };
    },
    staleTime: 60 * 1000,
  });

  const executions = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleExport = async () => {
    try {
      const response = await apiClient.get("/ai/executions/export", {
        params: {
          module: moduleFilter,
          provider: providerFilter,
          status: statusFilter,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "execution-history.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Export failed silently
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={400} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Execution History"
            description="View all AI execution records"
            icon={<History className="size-5" />}
          />
          <Alert variant="danger" title="Failed to load history" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Execution History"
          description="Track and analyze all AI execution records"
          icon={<History className="size-5" />}
          actions={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="size-4" />}
              onClick={handleExport}
            >
              Export
            </Button>
          }
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Select
                value={moduleFilter}
                onChange={(e) => {
                  setModuleFilter(e.target.value);
                  setPage(1);
                }}
              >
                {moduleOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Select>
              <Select
                value={providerFilter}
                onChange={(e) => {
                  setProviderFilter(e.target.value);
                  setPage(1);
                }}
              >
                {providerOptions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>Sort by {s.label}</option>
                ))}
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {executions.length === 0 ? (
          <EmptyState
            icon={<History className="size-7" />}
            title="No execution records"
            description="AI execution history will appear here once you start using AI features."
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Time</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.map((execution) => {
                    const StatusIcon = statusIcon[execution.status] ?? CheckCircle2;
                    const isExpanded = expandedId === execution.id;
                    return (
                      <>
                        <TableRow
                          key={execution.id}
                          className="cursor-pointer"
                          onClick={() => toggleExpand(execution.id)}
                        >
                          <TableCell className="w-8">
                            {isExpanded ? (
                              <ChevronUp className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3" />
                              {formatDate(execution.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" size="sm">{execution.module}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{execution.action}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{execution.provider}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{execution.model}</TableCell>
                          <TableCell>
                            <Badge variant={statusVariant[execution.status] ?? "default"} size="sm">
                              <StatusIcon className="mr-1 size-3" />
                              {execution.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {execution.tokens.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCost(execution.cost)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {execution.latency}ms
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${execution.id}-expanded`}>
                            <td colSpan={10} className="bg-muted/30 text-sm">
                              <div className="space-y-4 p-4">
                                {execution.error && (
                                  <div>
                                    <p className="text-sm font-semibold text-danger-600 mb-1">Error</p>
                                    <p className="text-sm text-muted-foreground">{execution.error}</p>
                                  </div>
                                )}
                                <div className="grid gap-4 lg:grid-cols-2">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground mb-2">Request</p>
                                    <pre className="rounded-md border border-border bg-background p-4 text-xs overflow-auto max-h-60">
                                      {JSON.stringify(execution.request, null, 2)}
                                    </pre>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground mb-2">Response</p>
                                    <pre className="rounded-md border border-border bg-background p-4 text-xs overflow-auto max-h-60">
                                      {JSON.stringify(execution.response, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
