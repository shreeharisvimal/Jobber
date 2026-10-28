import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  GitCompare,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useCompanyComparison } from "@/hooks/useCompanyIntel";
import type { Company } from "@/types/company-intel";

function ComparisonRow({
  label,
  valueA,
  valueB,
  higherIsBetter = true,
}: {
  label: string;
  valueA: number | null;
  valueB: number | null;
  higherIsBetter?: boolean;
}) {
  const aWins = valueA !== null && valueB !== null
    ? higherIsBetter ? valueA > valueB : valueA < valueB
    : null;
  const bWins = valueA !== null && valueB !== null
    ? higherIsBetter ? valueB > valueA : valueB < valueA
    : null;

  return (
    <div className="flex items-center gap-4 py-2">
      <span className="flex-1 text-right text-sm">
        {valueA !== null ? (
          <span className={aWins ? "font-bold text-success-600" : bWins ? "text-muted-foreground" : ""}>
            {valueA}
          </span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </span>
      <span className="w-32 text-center text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex-1 text-sm">
        {valueB !== null ? (
          <span className={bWins ? "font-bold text-success-600" : aWins ? "text-muted-foreground" : ""}>
            {valueB}
          </span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </span>
    </div>
  );
}

export const CompanyComparisonPage: FC = () => {
  const [companyAId, setCompanyAId] = useState("");
  const [companyBId, setCompanyBId] = useState("");
  const [compareActive, setCompareActive] = useState(false);

  const { data: comparison, isLoading } = useCompanyComparison(
    compareActive ? companyAId : "",
    compareActive ? companyBId : "",
  );

  const handleCompare = () => {
    if (companyAId && companyBId) {
      setCompareActive(true);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Compare Companies"
          description="Compare two companies side by side across key metrics"
          icon={<GitCompare className="size-5" />}
        />

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-medium">Company A</label>
                <Input
                  placeholder="Enter company ID or slug"
                  value={companyAId}
                  onChange={(e) => {
                    setCompanyAId(e.target.value);
                    setCompareActive(false);
                  }}
                  leftIcon={<Building2 className="size-4" />}
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-medium">Company B</label>
                <Input
                  placeholder="Enter company ID or slug"
                  value={companyBId}
                  onChange={(e) => {
                    setCompanyBId(e.target.value);
                    setCompareActive(false);
                  }}
                  leftIcon={<Building2 className="size-4" />}
                />
              </div>
              <Button
                onClick={handleCompare}
                disabled={!companyAId || !companyBId}
                leftIcon={<GitCompare className="size-4" />}
              >
                Compare
              </Button>
            </div>
          </CardContent>
        </Card>

        {!compareActive && (
          <Card>
            <CardContent className="py-12 text-center">
              <GitCompare className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">Select two companies to compare</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter company IDs or slugs above and click Compare
              </p>
            </CardContent>
          </Card>
        )}

        {compareActive && isLoading && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="h-64 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="h-64 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          </div>
        )}

        {compareActive && comparison && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {[comparison.company_a, comparison.company_b].map((company, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={company.logo_url ?? undefined}
                        fallback={company.name}
                        size="lg"
                        variant="square"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                        {company.headquarters_city && (
                          <p className="text-xs text-muted-foreground">
                            {company.headquarters_city}, {company.headquarters_country}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Score Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <ComparisonRow label="Overall" valueA={comparison.comparison.overall_score.a} valueB={comparison.comparison.overall_score.b} />
                  <ComparisonRow label="Culture" valueA={comparison.comparison.culture_score.a} valueB={comparison.comparison.culture_score.b} />
                  <ComparisonRow label="Compensation" valueA={comparison.comparison.compensation_score.a} valueB={comparison.comparison.compensation_score.b} />
                  <ComparisonRow label="Work-Life" valueA={comparison.comparison.work_life_balance.a} valueB={comparison.comparison.work_life_balance.b} />
                  <ComparisonRow label="Career Growth" valueA={comparison.comparison.career_growth.a} valueB={comparison.comparison.career_growth.b} />
                  <ComparisonRow label="Management" valueA={comparison.comparison.management.a} valueB={comparison.comparison.management.b} />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Reviews</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold">{comparison.comparison.total_reviews.a}</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-semibold">{comparison.comparison.total_reviews.b}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Employees</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold">{comparison.comparison.employee_count.a?.toLocaleString() ?? "N/A"}</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-semibold">{comparison.comparison.employee_count.b?.toLocaleString() ?? "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Founded</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold">{comparison.comparison.founded_year.a ?? "N/A"}</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-semibold">{comparison.comparison.founded_year.b ?? "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <DollarSign className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Salary Ranges</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold">{comparison.comparison.salary_ranges.a.length}</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-semibold">{comparison.comparison.salary_ranges.b.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
