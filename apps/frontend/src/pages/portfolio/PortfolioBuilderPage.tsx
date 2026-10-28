import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Layout,
  GripVertical,
  Plus,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioSections } from "@/hooks/usePortfolio";

export default function PortfolioBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: sections, isLoading } = usePortfolioSections(id!);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Builder"
          description="Drag and drop to build your portfolio sections"
          icon={<Layout className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />}>
                Add Section
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Eye className="size-4" />} asChild>
                <Link to={`/portfolio/${id}/preview`}>Preview</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
                <Link to={`/portfolio/${id}`}>Back</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sections</CardTitle>
                  <CardDescription>Drag to reorder</CardDescription>
                </CardHeader>
                <CardContent>
                  {(sections ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No sections yet. Add your first section.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(sections ?? []).map((section: Record<string, unknown>) => (
                        <div
                          key={section.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                            selectedSection === section.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedSection(section.id)}
                        >
                          <GripVertical className="size-4 text-muted-foreground" />
                          <span className="text-sm">{section.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {selectedSection
                        ? "Edit section content here"
                        : "Select a section to edit or add a new one"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
