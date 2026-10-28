import { useParams, Link } from "react-router-dom";
import {
  Clock,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioVersions } from "@/hooks/usePortfolio";

export default function PortfolioVersionsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: versions, isLoading } = usePortfolioVersions(id!);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Version History"
          description="Track changes and restore previous versions"
          icon={<Clock className="size-5" />}
          actions={
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
              <Link to={`/portfolio/${id}`}>Back</Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </div>
        ) : (versions ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No versions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="divide-y">
                {(versions ?? []).map((version: Record<string, unknown>) => (
                  <div key={version.id} className="flex items-center gap-4 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Clock className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          Version {version.version_number}
                        </p>
                        {version.is_current && <Badge>Current</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {version.created_at} by {version.created_by ?? "System"}
                      </p>
                      {version.message && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {version.message}
                        </p>
                      )}
                    </div>
                    {!version.is_current && (
                      <Button variant="outline" size="sm" leftIcon={<RotateCcw className="size-4" />}>
                        Restore
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
