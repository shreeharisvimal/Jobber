import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Globe,
  Eye,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function PortfolioPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: portfolio, isLoading } = usePortfolio(id!);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Preview"
          description="See how your portfolio looks to visitors"
          icon={<Eye className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Share2 className="size-4" />}>
                Share
              </Button>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
                <Link to={`/portfolio/${id}`}>Back to Editor</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="rectangular" height={200} />
          </div>
        ) : !portfolio ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Portfolio not found.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="min-h-[500px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Globe className="size-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{portfolio.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.description ?? "Portfolio preview will render here"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
