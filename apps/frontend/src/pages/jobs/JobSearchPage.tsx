import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  LayoutGrid,
  LayoutList,
  MapPin,
  DollarSign,
  Building2,
  Globe,
  Clock,
  SlidersHorizontal,
  Bookmark,
  Heart,
  Download,
  Save,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";

interface SearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string;
  remoteStatus: string;
  source: string;
  postedAt: string;
  isSaved: boolean;
  isFavorite: boolean;
  relevanceScore: number;
}

interface SearchFilters {
  query: string;
  company: string;
  location: string;
  skills: string;
  salaryMin: string;
  salaryMax: string;
  remoteStatus: string;
  employmentType: string;
  experienceLevel: string;
  industry: string;
  source: string;
  dateRange: string;
}

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Date Posted" },
  { value: "salary", label: "Salary" },
  { value: "company", label: "Company" },
];

const remoteOptions = [
  { value: "all", label: "All" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

const employmentTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

const dateRangeOptions = [
  { value: "all", label: "Any Time" },
  { value: "24h", label: "Past 24 Hours" },
  { value: "7d", label: "Past Week" },
  { value: "30d", label: "Past Month" },
  { value: "90d", label: "Past 3 Months" },
];

const sourceOptions = [
  { value: "all", label: "All Sources" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "custom", label: "Custom" },
];

const employmentTypeVariant: Record<string, "default" | "success" | "info" | "warning" | "brand"> = {
  "full-time": "success",
  "part-time": "info",
  contract: "warning",
  internship: "brand",
  temporary: "default",
};

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not specified";
  if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  if (min) return `From $${(min / 1000).toFixed(0)}k`;
  return `Up to $${(max! / 1000).toFixed(0)}k`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
}

export const JobSearchPage: FC = () => {
  const toast = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    company: "",
    location: "",
    skills: "",
    salaryMin: "",
    salaryMax: "",
    remoteStatus: "all",
    employmentType: "all",
    experienceLevel: "all",
    industry: "all",
    source: "all",
    dateRange: "all",
  });

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "query") return false;
    return value !== "all" && value !== "";
  });

  const { data: results = [], isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ["jobs", "search", filters, sortBy],
    queryFn: async () => {
      const params: Record<string, string> = { sort: sortBy };
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params[key] = value;
      });
      const response = await apiClient.get("/jobs/search", { params });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!filters.query,
  });

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      company: "",
      location: "",
      skills: "",
      salaryMin: "",
      salaryMax: "",
      remoteStatus: "all",
      employmentType: "all",
      experienceLevel: "all",
      industry: "all",
      source: "all",
      dateRange: "all",
    });
  };

  const handleExport = async () => {
    try {
      const params: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params[key] = value;
      });
      const response = await apiClient.get("/jobs/search/export", { params, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "job-search-results.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to export results");
    }
  };

  const handleSaveSearch = () => {
    toast.success("Search saved");
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Job Search"
          description="Search and filter job listings"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<SlidersHorizontal className="size-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {hasActiveFilters && "(Active)"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Save className="size-4" />}
                onClick={handleSaveSearch}
              >
                Save Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="size-4" />}
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          }
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <SearchInput
                value={filters.query}
                onChange={(e) => updateFilter("query", e.target.value)}
                placeholder="Search by title, keyword, or skill..."
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {showFilters && (
          <Card>
            <CardContent className="py-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Company" htmlFor="company">
                  <Input
                    id="company"
                    value={filters.company}
                    onChange={(e) => updateFilter("company", e.target.value)}
                    placeholder="Company name"
                  />
                </Field>
                <Field label="Location" htmlFor="location">
                  <Input
                    id="location"
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    placeholder="City, state, or remote"
                  />
                </Field>
                <Field label="Skills" htmlFor="skills">
                  <Input
                    id="skills"
                    value={filters.skills}
                    onChange={(e) => updateFilter("skills", e.target.value)}
                    placeholder="Comma-separated skills"
                  />
                </Field>
                <Field label="Salary Range" htmlFor="salaryMin">
                  <div className="flex items-center gap-2">
                    <Input
                      id="salaryMin"
                      type="number"
                      value={filters.salaryMin}
                      onChange={(e) => updateFilter("salaryMin", e.target.value)}
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      value={filters.salaryMax}
                      onChange={(e) => updateFilter("salaryMax", e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                </Field>
                <Field label="Remote Status" htmlFor="remoteStatus">
                  <Select
                    id="remoteStatus"
                    value={filters.remoteStatus}
                    onChange={(e) => updateFilter("remoteStatus", e.target.value)}
                  >
                    {remoteOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Employment Type" htmlFor="employmentType">
                  <Select
                    id="employmentType"
                    value={filters.employmentType}
                    onChange={(e) => updateFilter("employmentType", e.target.value)}
                  >
                    {employmentTypeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Source" htmlFor="source">
                  <Select
                    id="source"
                    value={filters.source}
                    onChange={(e) => updateFilter("source", e.target.value)}
                  >
                    {sourceOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Date Range" htmlFor="dateRange">
                  <Select
                    id="dateRange"
                    value={filters.dateRange}
                    onChange={(e) => updateFilter("dateRange", e.target.value)}
                  >
                    {dateRangeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>Sort by {o.label}</option>
              ))}
            </Select>
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

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
            ))}
          </div>
        ) : error ? (
          <Alert variant="danger" title="Search failed" description="Please try again later." />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<Search className="size-7" />}
            title="No jobs found"
            description={filters.query ? "Try adjusting your search criteria" : "Enter a search query to find jobs"}
          />
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{job.title}</CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Building2 className="size-3" />
                          {job.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {job.isSaved && <Bookmark className="size-3 fill-brand-500 text-brand-500" />}
                        {job.isFavorite && <Heart className="size-3 fill-danger-500 text-danger-500" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={employmentTypeVariant[job.employmentType] ?? "default"} size="sm">
                        {job.employmentType}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        <Globe className="mr-1 size-3" />
                        {job.remoteStatus}
                      </Badge>
                      <Badge variant="secondary" size="sm">{job.source}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDate(job.postedAt)}
                      </span>
                      {job.relevanceScore > 0 && (
                        <span className="font-medium text-brand-600">{job.relevanceScore}% match</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {results.map((job) => (
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
                    <span>{formatDate(job.postedAt)}</span>
                    {job.relevanceScore > 0 && (
                      <span className="font-medium text-brand-600">{job.relevanceScore}%</span>
                    )}
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
