import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
  useCloneEmailTemplate,
} from "@/hooks/useEmail";

export default function EmailTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: template, isLoading } = useEmailTemplate(id!);
  const updateMutation = useUpdateEmailTemplate();
  const deleteMutation = useDeleteEmailTemplate();
  const cloneMutation = useCloneEmailTemplate();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={300} />
        </div>
      </PageContainer>
    );
  }

  if (!template) {
    return (
      <PageContainer>
        <div className="py-12 text-center text-sm text-muted-foreground">Template not found.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/email/templates"><ArrowLeft className="size-4" /> Back</Link>
          </Button>
        </div>

        <PageHeader
          title={template.name}
          description={template.description || "Email template"}
          icon={<Edit className="size-5" />}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Copy className="size-3" />} onClick={() => cloneMutation.mutate(id!)}>Clone</Button>
              <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-3" />} onClick={() => { deleteMutation.mutate(id!); }}>Delete</Button>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{template.category || "General"}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subject</span>
                <span>{template.subject}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage Count</span>
                <span>{template.usage_count ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(template.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-medium">Preview</h3>
              <div className="rounded-md border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                {template.body || "(Empty template)"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
