import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  Trash2,
  MapPin,
  DollarSign,
  Building2,
  Globe,
  LayoutGrid,
  LayoutList,
  Clock,
  ExternalLink,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";

interface FavoriteJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string;
  remoteStatus: string;
  source: string;
  sourceUrl: string | null;
  favoritedAt: string;
}

const sortOptions = [
  { value: "favoritedAt", label: "Date Favorited" },
  { value: "company", label: "Company" },
  { value: "title", label: "Title" },
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

export const FavoritesPage: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("favoritedAt");

  const { data: favorites = [], isLoading, error } = useQuery<FavoriteJob[]>({
    queryKey: ["jobs", "favorites", sortBy],
    queryFn: async () => {
      const response = await apiClient.get("/jobs/favorites", { params: { sort: sortBy } });
      return response.data?.data ?? response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/jobs/favorites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "favorites"] });
      toast.success("Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to remove from favorites");
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={60} />
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
            title="Favorites"
            description="Your favorited job opportunities"
          />
          <Alert variant="danger" title="Failed to load favorites" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Favorites"
          description="Your favorited job opportunities"
        />

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
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
          </CardContent>
        </Card>

        {favorites.length === 0 ? (
          <EmptyState
            icon={<Heart className="size-7" />}
            title="No favorites yet"
            description="Favorite jobs you're interested in to see them here."
            action={{
              label: "Browse Jobs",
              onClick: () => window.location.href = "/jobs",
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((job) => (
              <Card key={job.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Link to={`/jobs/${job.jobId}`} className="flex-1">
                      <CardTitle className="text-base hover:underline">{job.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1.5">
                        <Building2 className="size-3" />
                        {job.company}
                      </CardDescription>
                    </Link>
                    <Heart className="size-4 fill-danger-500 text-danger-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <Badge variant={employmentTypeVariant[job.employmentType] ?? "default"} size="sm">
                        {job.employmentType}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        <Globe className="mr-1 size-3" />
                        {job.remoteStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    Favorited {formatDate(job.favoritedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    {job.sourceUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 size-3" />
                          View Original
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMutation.mutate(job.id)}
                      className="border-danger-200 text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="mr-1 size-3" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {favorites.map((job) => (
                <div key={job.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/50">
                  <Heart className="size-4 fill-danger-500 text-danger-500 shrink-0" />
                  <Link to={`/jobs/${job.jobId}`} className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3" />
                      {job.company}
                    </p>
                  </Link>
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
                    <span>{formatDate(job.favoritedAt)}</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => removeMutation.mutate(job.id)}
                      className="border-danger-200 text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
