import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Globe, Save, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio, useCreatePortfolio, useUpdatePortfolio } from "@/hooks/usePortfolio";

export default function PortfolioEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { isLoading: portfolioLoading } = usePortfolio(id!);
  const createPortfolio = useCreatePortfolio();
  const updatePortfolio = useUpdatePortfolio();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updatePortfolio.mutateAsync({ id: id!, data: { name, description } });
    } else {
      await createPortfolio.mutateAsync({ name, description });
    }
    navigate("/portfolio");
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title={isEditing ? "Edit Portfolio" : "New Portfolio"}
          description={isEditing ? "Update your portfolio details" : "Create a new portfolio"}
          icon={<Globe className="size-5" />}
          actions={
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="size-4" />} asChild>
              <Link to="/portfolio">Back</Link>
            </Button>
          }
        />

        {portfolioLoading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="My Portfolio"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={4}
                    placeholder="A brief description of your portfolio"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/portfolio")}>
                    Cancel
                  </Button>
                  <Button type="submit" leftIcon={<Save className="size-4" />}>
                    {isEditing ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
