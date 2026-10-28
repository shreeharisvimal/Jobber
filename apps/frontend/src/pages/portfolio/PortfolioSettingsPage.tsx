import { useParams, Link } from "react-router-dom";
import {
  Settings,
  ArrowLeft,
  Save,
  Globe,
  Lock,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio, useUpdatePortfolio } from "@/hooks/usePortfolio";
import { useState } from "react";

export default function PortfolioSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoading } = usePortfolio(id!);
  const updatePortfolio = useUpdatePortfolio();

  const [visibility, setVisibility] = useState("public");
  const [domain, setDomain] = useState("");

  const handleSave = async () => {
    await updatePortfolio.mutateAsync({
      id: id!,
      data: { visibility, custom_domain: domain },
    });
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Portfolio Settings"
          description="Configure your portfolio visibility and domain"
          icon={<Settings className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Save className="size-4" />} onClick={handleSave}>
                Save Changes
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
                <CardTitle className="text-base">Visibility</CardTitle>
                <CardDescription>Control who can see your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { value: "public", label: "Public", description: "Anyone can view", icon: Globe },
                    { value: "private", label: "Private", description: "Only you can view", icon: Lock },
                    { value: "unlisted", label: "Unlisted", description: "Only people with the link", icon: Eye },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted ${
                        visibility === option.value ? "bg-muted" : ""
                      }`}
                      onClick={() => setVisibility(option.value)}
                    >
                      <option.icon className="size-4" />
                      <div>
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Domain</CardTitle>
                <CardDescription>Set a custom domain for your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium">Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="portfolio.example.com"
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
