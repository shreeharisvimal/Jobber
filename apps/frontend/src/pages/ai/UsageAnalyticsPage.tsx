import { type FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Download,
  Coins,
  Layers,
  Clock,
  BarChart3,
  Cpu,
  Globe,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
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
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface UsageOverview {
  totalTokens: number;
  totalCost: number;
  totalRequests: number;
  avgLatency: number;
}

interface TokenUsageByDay {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

interface CostByDay {
  date: string;
  cost: number;
}

interface ModuleUsageBreakdown {
  module: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatency: number;
}

interface ProviderUsageBreakdown {
  provider: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatency: number;
  successRate: number;
}

interface ModelUsageBreakdown {
  model: string;
  provider: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatency: number;
}

interface UsageAnalyticsResponse {
  overview: UsageOverview;
  tokenUsageByDay: TokenUsageByDay[];
  costByDay: CostByDay[];
  moduleBreakdown: ModuleUsageBreakdown[];
  providerBreakdown: ProviderUsageBreakdown[];
  modelBreakdown: ModelUsageBreakdown[];
}

const dateRangeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

function formatCost(cost: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
  }).format(cost);
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export const UsageAnalyticsPage: FC = () => {
  const [dateRange, setDateRange] = useState("30d");

  const { data: analytics, isLoading, error } = useQuery<UsageAnalyticsResponse>({
    queryKey: ["ai", "usage-analytics", dateRange],
    queryFn: async () => {
      const response = await apiClient.get("/ai/usage", {
        params: { dateRange },
      });
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleExport = async () => {
    try {
      const response = await apiClient.get("/ai/usage/export", {
        params: { dateRange },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ai-usage-analytics.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Export failed silently
    }
  };

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
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Usage Analytics"
            description="Track AI usage, costs, and performance"
            icon={<TrendingUp className="size-5" />}
          />
          <Alert variant="danger" title="Failed to load analytics" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  if (!analytics) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Usage Analytics"
            description="Track AI usage, costs, and performance"
            icon={<TrendingUp className="size-5" />}
          />
          <Alert variant="info" title="No data available" description="Usage analytics will appear once you start using AI features." />
        </div>
      </PageContainer>
    );
  }

  const maxTokens = Math.max(...analytics.tokenUsageByDay.map((d) => d.totalTokens), 1);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Usage Analytics"
          description="Track AI usage, costs, and performance metrics"
          icon={<TrendingUp className="size-5" />}
          actions={
            <>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRangeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="size-4" />}
                onClick={handleExport}
              >
                Export Data
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic
            label="Total Tokens"
            value={formatNumber(analytics.overview.totalTokens)}
            icon={<Layers className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Total Cost"
            value={formatCost(analytics.overview.totalCost)}
            icon={<Coins className="size-5" />}
            variant="success"
          />
          <Statistic
            label="Total Requests"
            value={analytics.overview.totalRequests.toLocaleString()}
            icon={<BarChart3 className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Avg Latency"
            value={`${analytics.overview.avgLatency}ms`}
            icon={<Clock className="size-5" />}
            variant="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Token Usage Over Time</CardTitle>
              <CardDescription>Daily token consumption</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.tokenUsageByDay.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No data available</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-end gap-1 h-40">
                    {analytics.tokenUsageByDay.map((day, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                        <div className="flex w-full flex-col-reverse">
                          <div
                            className="w-full rounded-t bg-brand-400"
                            style={{ height: `${(day.inputTokens / maxTokens) * 100}%` }}
                          />
                          <div
                            className="w-full bg-brand-600"
                            style={{ height: `${(day.outputTokens / maxTokens) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{day.date.split("-")[2]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="size-2 rounded-full bg-brand-400" /> Input Tokens
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="size-2 rounded-full bg-brand-600" /> Output Tokens
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Over Time</CardTitle>
              <CardDescription>Daily cost trend</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.costByDay.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No data available</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-end gap-1 h-40">
                    {analytics.costByDay.map((day, i) => {
                      const maxCost = Math.max(...analytics.costByDay.map((d) => d.cost), 0.01);
                      return (
                        <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                          <div
                            className="w-full rounded-t bg-success-400"
                            style={{ height: `${(day.cost / maxCost) * 100}%` }}
                          />
                          <span className="text-[9px] text-muted-foreground">{day.date.split("-")[2]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage by Module</CardTitle>
            <CardDescription>Token and cost breakdown by module</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.moduleBreakdown.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No module data</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Avg Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.moduleBreakdown.map((mod) => (
                    <TableRow key={mod.module}>
                      <TableCell>
                        <Badge variant="secondary" size="sm">{mod.module}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">{mod.requests.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">{mod.tokens.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">{formatCost(mod.cost)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{mod.avgLatency}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Provider</CardTitle>
              <CardDescription>Performance across AI providers</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.providerBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No provider data</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Requests</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Success</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.providerBreakdown.map((provider) => (
                      <TableRow key={provider.provider}>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <Globe className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{provider.provider}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm">{provider.requests.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{provider.tokens.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{formatCost(provider.cost)}</TableCell>
                        <TableCell className="text-right text-sm">{provider.successRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Model</CardTitle>
              <CardDescription>Performance across AI models</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.modelBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No model data</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead className="text-right">Requests</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Latency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.modelBreakdown.map((model) => (
                      <TableRow key={model.model}>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <Cpu className="size-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{model.model}</p>
                              <p className="text-xs text-muted-foreground">{model.provider}</p>
                            </div>
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm">{model.requests.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{model.tokens.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{formatCost(model.cost)}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{model.avgLatency}ms</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
