import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  SlidersHorizontal,
  MapPin,
  Users,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { useCompanySearch } from "@/hooks/useCompanyIntel";
import { useCompanyIntelStore } from "@/stores/company-intel.store";
import type { CompanySize } from "@/types/company-intel";

const sizeLabels: Record<CompanySize, string> = {
  startup: "Startup",
  small: "Small",
  medium: "Medium",
  large: "Large",
  enterprise: "Enterprise",
};

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Skeleton variant="rectangular" className="size-12 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-32" />
            <Skeleton variant="text" className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-5 w-16 rounded-full" />
              <Skeleton variant="rectangular" className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton variant="text" className="h-6 w-10 ml-auto" />
            <Skeleton variant="text" className="h-3 w-12 ml-auto mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const CompanyIntelSearchPage: FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { data: results, isLoading } = useCompanySearch();
  const filters = useCompanyIntelStore((s) => s.filters);
  const setFilters = useCompanyIntelStore((s) => s.setFilters);
  const totalPages = results?.total_pages ?? 0;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Search Companies"
          description="Find companies by name, industry, location, and more"
          icon={<Search className="size-5" />}
        />

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search companies..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                  leftIcon={<Search className="size-4" />}
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
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.industry ?? ""}
                      onChange={(e) => setFilters({ industry: e.target.value || null, page: 1 })}
                    >
                      <option value="">All Industries</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="consulting">Consulting</option>
                    </select>
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.company_size ?? ""}
                      onChange={(e) =>
                        setFilters({
                          company_size: (e.target.value || null) as CompanySize | null,
                          page: 1,
                        })
                      }
                    >
                      <option value="">All Sizes</option>
                      {Object.entries(sizeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Min score"
                      type="number"
                      className="w-24"
                      value={filters.min_score ?? ""}
                      onChange={(e) =>
                        setFilters({
                          min_score: e.target.value ? Number(e.target.value) : null,
                          page: 1,
                        })
                      }
                    />
                    <select
                      className="rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm"
                      value={filters.sort_by}
                      onChange={(e) => setFilters({ sort_by: e.target.value })}
                    >
                      <option value="overall_score">Sort by Score</option>
                      <option value="total_reviews">Sort by Reviews</option>
                      <option value="name">Sort by Name</option>
                      <option value="employee_count">Sort by Size</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : results?.data && results.data.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {results.total} companies found
                </p>
                <div className="space-y-4">
                  {results.data.map((company) => (
                    <Card key={company.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <Link
                          to={`/company-intel/company/${company.slug}`}
                          className="flex gap-4"
                        >
                          <Avatar
                            src={company.logo_url ?? undefined}
                            fallback={company.name}
                            size="lg"
                            variant="square"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold leading-tight">
                                  {company.name}
                                </h3>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {company.industry}
                                  {company.employee_count &&
                                    ` · ${company.employee_count.toLocaleString()} employees`}
                                </p>
                              </div>
                              <div className="text-right">
                                {company.overall_score !== null ? (
                                  <span className="text-lg font-bold">{company.overall_score}</span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">N/A</span>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {company.total_reviews} reviews
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {company.headquarters_city && company.headquarters_country && (
                                <Badge variant="outline" size="sm">
                                  <MapPin className="size-3" />
                                  {company.headquarters_city}, {company.headquarters_country}
                                </Badge>
                              )}
                              <Badge variant="secondary" size="sm">
                                {sizeLabels[company.company_size]}
                              </Badge>
                              {company.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="default" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<ChevronLeft className="size-4" />}
                      disabled={filters.page <= 1}
                      onClick={() => setFilters({ page: filters.page - 1 })}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ChevronRight className="size-4" />}
                      disabled={filters.page >= totalPages}
                      onClick={() => setFilters({ page: filters.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No companies found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
