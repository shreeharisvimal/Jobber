import {
  Palette,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioThemes } from "@/hooks/usePortfolio";

export default function PortfolioThemesPage() {
  const { data: themes, isLoading } = usePortfolioThemes();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Themes"
          description="Customize the look and feel of your portfolio"
          icon={<Palette className="size-5" />}
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
            ))}
          </div>
        ) : (themes ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No themes available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(themes ?? []).map((theme: Record<string, unknown>) => (
              <Card key={theme.id} className="overflow-hidden">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{theme.name}</CardTitle>
                    {theme.is_default && <Badge>Default</Badge>}
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply Theme
                    <ArrowRight className="ml-2 size-4" />
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
