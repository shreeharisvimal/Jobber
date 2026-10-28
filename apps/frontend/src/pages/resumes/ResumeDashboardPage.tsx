import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Eye,
  Download,
  Upload,
  LayoutGrid,
  LayoutList,
  Clock,
  BarChart3,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";

interface Resume {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  template: string;
  tags: string[];
  views: number;
  downloads: number;
  optimizationScore: number;
  updatedAt: string;
  createdAt: string;
}

interface ResumeDashboardStats {
  totalResumes: number;
  totalViews: number;
  totalDownloads: number;
  avgOptimizationScore: number;
}

const statusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  draft: "warning",
  published: "success",
  archived: "default",
};

const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "title", label: "Title" },
  { value: "views", label: "Views" },
  { value: "downloads", label: "Downloads" },
  { value: "status", label: "Status" },
];

const filterStatuses = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export const ResumeDashboardPage: FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");

  const { data: stats, isLoading: statsLoading } = useQuery<ResumeDashboardStats>({
    queryKey: ["resumes", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/resumes/stats");
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: resumes = [], isLoading, error } = useQuery<Resume[]>({
    queryKey: ["resumes", searchQuery, statusFilter, sortBy],
    queryFn: async () => {
      const response = await apiClient.get("/resumes", {
        params: { search: searchQuery, status: statusFilter, sort: sortBy },
      });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || statsLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
            ))}
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
            title="Resumes"
            description="Manage and optimize your resumes"
          />
          <Alert variant="danger" title="Failed to load resumes" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Resumes"
          description="Manage, optimize, and track your resumes"
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Upload className="size-4" />} asChild>
                <Link to="/profile/import-export">Import</Link>
              </Button>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/resumes/new">Create Resume</Link>
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic
            label="Total Resumes"
            value={stats?.totalResumes ?? 0}
            icon={<FileText className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Total Views"
            value={stats?.totalViews ?? 0}
            icon={<Eye className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Total Downloads"
            value={stats?.totalDownloads ?? 0}
            icon={<Download className="size-5" />}
            variant="success"
          />
          <Statistic
            label="Avg Optimization"
            value={`${stats?.avgOptimizationScore ?? 0}%`}
            icon={<BarChart3 className="size-5" />}
            variant="warning"
          />
        </div>

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resumes..."
                  className="max-w-xs"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {filterStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip content="Grid view">
                  <Button
                    variant={viewMode === "grid" ? "primary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="size-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="List view">
                  <Button
                    variant={viewMode === "list" ? "primary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="size-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {resumes.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-7" />}
            title="No resumes yet"
            description="Create your first resume to start tracking and optimizing it."
            action={{
              label: "Create Resume",
              onClick: () => window.location.href = "/resumes/new",
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Link key={resume.id} to={`/resumes/${resume.id}`}>
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{resume.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Template: {resume.template}
                        </CardDescription>
                      </div>
                      <Badge variant={statusVariant[resume.status] ?? "default"} size="sm">
                        {resume.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resume.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {resume.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {resume.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="size-3" />
                        {resume.downloads} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="size-3" />
                        {resume.optimizationScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      Updated {formatDate(resume.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {resumes.map((resume) => (
                <Link
                  key={resume.id}
                  to={`/resumes/${resume.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{resume.title}</p>
                    <p className="text-xs text-muted-foreground">{resume.template}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {resume.tags.length > 0 && (
                      <div className="flex gap-1">
                        {resume.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      {resume.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="size-3" />
                      {resume.downloads}
                    </span>
                    <Badge variant={statusVariant[resume.status] ?? "default"} size="sm">
                      {resume.status}
                    </Badge>
                    <span className="text-xs">{formatDate(resume.updatedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
