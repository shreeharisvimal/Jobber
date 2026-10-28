import { useParams, Link } from "react-router-dom";
import {
  Share2,
  Plus,
  ArrowLeft,
  Copy,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioShares } from "@/hooks/usePortfolio";

export default function PortfolioSharesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: shares, isLoading } = usePortfolioShares(id!);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Share Management"
          description="Manage shared links for your portfolio"
          icon={<Share2 className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />}>
                Create Share Link
              </Button>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
                <Link to={`/portfolio/${id}`}>Back</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </div>
        ) : (shares ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No shared links yet. Create one to share your portfolio.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="divide-y">
                {(shares ?? []).map((share: Record<string, unknown>) => (
                  <div key={share.id} className="flex items-center gap-4 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Share2 className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {share.url}
                        </p>
                        <Badge variant={share.is_active ? "default" : "secondary"}>
                          {share.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Created {share.created_at} · {share.views ?? 0} views
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
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
