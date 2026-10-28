import { useParams, Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioSEO, useUpdateSEO } from "@/hooks/usePortfolio";
import { useState } from "react";

export default function PortfolioSEOPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoading } = usePortfolioSEO(id!);
  const updateSEO = useUpdateSEO();

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSave = async () => {
    await updateSEO.mutateAsync({
      portfolioId: id!,
      data: { meta_title: metaTitle, meta_description: metaDescription, keywords },
    });
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="SEO Settings"
          description="Optimize your portfolio for search engines"
          icon={<Search className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Save className="size-4" />} onClick={handleSave}>
                Save SEO
              </Button>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
                <Link to={`/portfolio/${id}`}>Back</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={200} />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Tags</CardTitle>
                <CardDescription>Control how your portfolio appears in search results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="My Portfolio"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metaTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Meta Description</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    placeholder="A brief description for search engines"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metaDescription.length}/160 characters
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Keywords</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="portfolio, web design, developer"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
