import { useParams, Link } from "react-router-dom";
import {
  Rocket,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioDeployments, useDeployPortfolio } from "@/hooks/usePortfolio";

export default function PortfolioDeployPage() {
  const { id } = useParams<{ id: string }>();
  const { data: deployments, isLoading } = usePortfolioDeployments(id!);
  const deployPortfolio = useDeployPortfolio();

  const handleDeploy = async () => {
    await deployPortfolio.mutateAsync(id!);
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Deployment"
          description="Deploy your portfolio to the web"
          icon={<Rocket className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Rocket className="size-4" />} onClick={handleDeploy}>
                Deploy Now
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
        ) : (deployments ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No deployments yet. Deploy your portfolio to make it live.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployment History</CardTitle>
              <CardDescription>Previous deployments for this portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {(deployments ?? []).map((deployment: Record<string, unknown>) => (
                  <div key={deployment.id} className="flex items-center gap-4 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {deployment.status === "success" ? (
                        <CheckCircle className="size-4 text-green-500" />
                      ) : deployment.status === "failed" ? (
                        <XCircle className="size-4 text-red-500" />
                      ) : (
                        <Clock className="size-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          Deployment #{deployment.version}
                        </p>
                        <Badge variant={
                          deployment.status === "success" ? "default" :
                          deployment.status === "failed" ? "destructive" : "secondary"
                        }>
                          {deployment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {deployment.deployed_at} · {deployment.duration ?? "—"}
                      </p>
                    </div>
                    {deployment.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
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
