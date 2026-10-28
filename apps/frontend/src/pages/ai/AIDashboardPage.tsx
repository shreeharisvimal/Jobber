import { type FC } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Brain,
  Zap,
  Coins,
  Activity,
  MessageSquare,
  BarChart3,
  Clock,
  ChevronRight,
  Settings,
  FileText,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Layers,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface AIDashboardStats {
  totalRequests: number;
  tokensUsed: number;
  totalCost: number;
  successRate: number;
  activeConversations: number;
  avgLatency: number;
}

interface AIRequest {
  id: string;
  module: string;
  action: string;
  status: "success" | "error" | "pending" | "timeout";
  tokens: number;
  cost: number;
  latency: number;
  model: string;
  createdAt: string;
}

interface ProviderHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
  lastChecked: string;
}

interface ModuleUsage {
  module: string;
  requests: number;
  tokens: number;
  cost: number;
}

const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  success: "success",
  error: "default",
  pending: "warning",
  timeout: "default",
};

const healthVariant: Record<string, "success" | "warning" | "default"> = {
  healthy: "success",
  degraded: "warning",
  down: "default",
};

const healthIcon: Record<string, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  degraded: AlertTriangle,
  down: XCircle,
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatCost(cost: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
  }).format(cost);
}

export const AIDashboardPage: FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery<AIDashboardStats>({
    queryKey: ["ai", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/ai/stats");
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentRequests = [], isLoading: requestsLoading } = useQuery<AIRequest[]>({
    queryKey: ["ai", "recent-requests"],
    queryFn: async () => {
      const response = await apiClient.get("/ai/executions", {
        params: { limit: 10, sort: "createdAt", order: "desc" },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const { data: providers = [], isLoading: providersLoading } = useQuery<ProviderHealth[]>({
    queryKey: ["ai", "providers-health"],
    queryFn: async () => {
      const response = await apiClient.get("/ai/providers/health");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const { data: moduleBreakdown = [] } = useQuery<ModuleUsage[]>({
    queryKey: ["ai", "module-breakdown"],
    queryFn: async () => {
      const response = await apiClient.get("/ai/usage/modules");
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = statsLoading || requestsLoading || providersLoading;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton variant="rectangular" height={300} />
            <Skeleton variant="rectangular" height={300} />
          </div>
          <Skeleton variant="rectangular" height={300} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="AI Platform"
          description="Monitor AI usage, manage providers, and track performance"
          icon={<Brain className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<History className="size-4" />} asChild>
                <Link to="/ai/history">Execution History</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Settings className="size-4" />} asChild>
                <Link to="/ai/settings">Settings</Link>
              </Button>
              <Button size="sm" leftIcon={<Zap className="size-4" />} asChild>
                <Link to="/ai/prompts">Prompt Library</Link>
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic
            label="Total Requests"
            value={stats?.totalRequests ?? 0}
            icon={<Layers className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Tokens Used"
            value={stats?.tokensUsed ?? 0}
            icon={<BarChart3 className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Total Cost"
            value={formatCost(stats?.totalCost ?? 0)}
            icon={<Coins className="size-5" />}
            variant="success"
          />
          <Statistic
            label="Success Rate"
            value={`${stats?.successRate ?? 0}%`}
            icon={<Activity className="size-5" />}
            variant="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Provider Health</CardTitle>
                  <CardDescription>Current status of AI providers</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/ai/providers">
                    View All
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {providers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No providers configured
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {providers.map((provider) => {
                    const HealthIcon = healthIcon[provider.status] ?? CheckCircle2;
                    return (
                      <div
                        key={provider.name}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <HealthIcon
                          className={cn(
                            "size-5 shrink-0",
                            provider.status === "healthy" && "text-success-600",
                            provider.status === "degraded" && "text-warning-600",
                            provider.status === "down" && "text-danger-600"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{provider.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {provider.latency}ms latency
                          </p>
                        </div>
                        <Badge variant={healthVariant[provider.status] ?? "default"} size="sm">
                          {provider.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common AI tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/ai/prompts">
                  <FileText className="mr-2 size-4" />
                  Prompt Library
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/ai/history">
                  <History className="mr-2 size-4" />
                  Execution History
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/ai/usage">
                  <TrendingUp className="mr-2 size-4" />
                  Usage Analytics
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/ai/conversations">
                  <MessageSquare className="mr-2 size-4" />
                  Conversations
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/ai/providers">
                  <Settings className="mr-2 size-4" />
                  Provider Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trend</CardTitle>
              <CardDescription>Requests over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-end gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex flex-1 items-end justify-center">
                    <div
                      className="w-full rounded-t bg-brand-400 transition-all"
                      style={{ height: `${20 + Math.random() * 80}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>14 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Module Breakdown</CardTitle>
                  <CardDescription>Requests by module</CardDescription>
                </div>
                <Badge variant="secondary" size="sm">
                  {stats?.activeConversations ?? 0} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {moduleBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No module data yet
                </p>
              ) : (
                <div className="space-y-3">
                  {moduleBreakdown.map((mod) => {
                    const totalTokens = moduleBreakdown.reduce((sum, m) => sum + m.tokens, 0);
                    const percentage = totalTokens > 0 ? Math.round((mod.tokens / totalTokens) * 100) : 0;
                    return (
                      <div key={mod.module} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{mod.module}</span>
                          <span className="text-muted-foreground">
                            {mod.requests} requests · {percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Latest AI execution requests</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/ai/history">
                  View All
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No requests yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {formatDate(request.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" size="sm">{request.module}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{request.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{request.model}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[request.status] ?? "default"} size="sm">
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">{request.tokens.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">{formatCost(request.cost)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {request.latency}ms
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
