import { Link } from "react-router-dom";
import {
  Layout,
  Plus,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioTemplates } from "@/hooks/usePortfolio";

export default function PortfolioTemplatesPage() {
  const { data: templates, isLoading } = usePortfolioTemplates();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Templates"
          description="Choose from professionally designed templates"
          icon={<Layout className="size-5" />}
          actions={
            <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/portfolio/templates/custom">Custom Template</Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={240} />
            ))}
          </div>
        ) : (templates ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No templates available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(templates ?? []).map((template: Record<string, unknown>) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/portfolio/new?template=${template.id}`}>
                      Use Template
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
