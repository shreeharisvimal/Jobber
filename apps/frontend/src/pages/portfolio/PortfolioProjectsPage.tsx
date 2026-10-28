import { useParams, Link } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  ArrowLeft,
  Trash2,
  Edit,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioProjects } from "@/hooks/usePortfolio";

export default function PortfolioProjectsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: projects, isLoading } = usePortfolioProjects(id!);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Projects"
          description="Manage projects in your portfolio"
          icon={<FolderOpen className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Plus className="size-4" />}>
                Add Project
              </Button>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
                <Link to={`/portfolio/${id}`}>Back</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
            ))}
          </div>
        ) : (projects ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No projects yet. Add your first project.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(projects ?? []).map((project: Record<string, unknown>) => (
              <Card key={project.id}>
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <Badge variant={project.is_featured ? "default" : "secondary"}>
                      {project.is_featured ? "Featured" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
