import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Bookmark,
  Heart,
  Search,
  LayoutGrid,
  LayoutList,
  Clock,
  MapPin,
  DollarSign,
  Globe,
  Upload,
  Building2,
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

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "temporary";
  remoteStatus: "remote" | "hybrid" | "on-site";
  source: string;
  isSaved: boolean;
  isFavorite: boolean;
  isActive: boolean;
  tags: string[];
  postedAt: string;
  createdAt: string;
}

interface JobDashboardStats {
  totalJobs: number;
  savedJobs: number;
  favoriteJobs: number;
  activeSearches: number;
}

const employmentTypeVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  "full-time": "success",
  "part-time": "info",
  "contract": "warning",
  "internship": "brand",
  "temporary": "default",
};

const remoteStatusVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  remote: "success",
  hybrid: "info",
  "on-site": "default",
};

const sortOptions = [
  { value: "createdAt", label: "Date Added" },
  { value: "postedAt", label: "Date Posted" },
  { value: "title", label: "Title" },
  { value: "company", label: "Company" },
  { value: "salaryMax", label: "Salary" },
];

const filterOptions = [
  { value: "all", label: "All Jobs" },
  { value: "saved", label: "Saved" },
  { value: "favorites", label: "Favorites" },
  { value: "active", label: "Active" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
];

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not specified";
  if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  if (min) return `From $${(min / 1000).toFixed(0)}k`;
  return `Up to $${(max! / 1000).toFixed(0)}k`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export const JobDashboardPage: FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  const { data: stats, isLoading: statsLoading } = useQuery<JobDashboardStats>({
    queryKey: ["jobs", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/jobs/stats");
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: jobs = [], isLoading, error } = useQuery<Job[]>({
    queryKey: ["jobs", searchQuery, filterBy, sortBy],
    queryFn: async () => {
      const response = await apiClient.get("/jobs", {
        params: { search: searchQuery, filter: filterBy, sort: sortBy },
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
            title="Jobs"
            description="Discover and manage job opportunities"
          />
          <Alert variant="danger" title="Failed to load jobs" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Jobs"
          description="Discover, save, and manage job opportunities"
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Upload className="size-4" />} asChild>
                <Link to="/jobs/import">Import</Link>
              </Button>
              <Button size="sm" leftIcon={<Plus className="size-4" />} asChild>
                <Link to="/jobs/new">Add Job</Link>
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic
            label="Total Jobs"
            value={stats?.totalJobs ?? 0}
            icon={<Briefcase className="size-5" />}
            variant="brand"
          />
          <Statistic
            label="Saved Jobs"
            value={stats?.savedJobs ?? 0}
            icon={<Bookmark className="size-5" />}
            variant="success"
          />
          <Statistic
            label="Favorites"
            value={stats?.favoriteJobs ?? 0}
            icon={<Heart className="size-5" />}
            variant="warning"
          />
          <Statistic
            label="Active Searches"
            value={stats?.activeSearches ?? 0}
            icon={<Search className="size-5" />}
            variant="default"
          />
        </div>

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, company, or keyword..."
                  className="max-w-xs"
                />
                <Select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  {filterOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
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

        {jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="size-7" />}
            title="No jobs found"
            description="Import or add jobs to start building your job intelligence engine."
            action={{
              label: "Add Job",
              onClick: () => window.location.href = "/jobs/new",
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{job.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1.5">
                          <Building2 className="size-3" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {job.isSaved && (
                          <Bookmark className="size-4 fill-brand-500 text-brand-500" />
                        )}
                        {job.isFavorite && (
                          <Heart className="size-4 fill-danger-500 text-danger-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={employmentTypeVariant[job.employmentType] ?? "default"} size="sm">
                        {job.employmentType}
                      </Badge>
                      <Badge variant={remoteStatusVariant[job.remoteStatus] ?? "default"} size="sm">
                        <Globe className="mr-1 size-3" />
                        {job.remoteStatus}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {job.source}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      Posted {formatDate(job.postedAt)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3" />
                      {job.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="size-3" />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                    <Badge variant={employmentTypeVariant[job.employmentType] ?? "default"} size="sm">
                      {job.employmentType}
                    </Badge>
                    <Badge variant="secondary" size="sm">{job.source}</Badge>
                    <span className="text-xs">{formatDate(job.postedAt)}</span>
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
