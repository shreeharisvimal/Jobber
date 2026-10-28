import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Globe,
  Layout,
  FolderOpen,
  Image,
  Clock,
  Share2,
  Search,
  BarChart3,
  Settings,
  ArrowRight,
  Edit,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hooks/usePortfolio";

const tabs = [
  { id: "sections", label: "Sections", icon: Layout },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "assets", label: "Assets", icon: Image },
  { id: "versions", label: "Versions", icon: Clock },
  { id: "shares", label: "Shares", icon: Share2 },
  { id: "seo", label: "SEO", icon: Search },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("sections");
  const { data: portfolio, isLoading } = usePortfolio(id!);

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title={portfolio?.name ?? "Portfolio Details"}
          description={portfolio?.description ?? "View and manage your portfolio"}
          icon={<Globe className="size-5" />}
          actions={
            <>
              <Button size="sm" leftIcon={<Edit className="size-4" />} asChild>
                <Link to={`/portfolio/${id}/edit`}>Edit</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Eye className="size-4" />} asChild>
                <Link to={`/portfolio/${id}/preview`}>Preview</Link>
              </Button>
            </>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={48} />
            <Skeleton variant="rectangular" height={200} />
          </div>
        ) : !portfolio ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Portfolio not found.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  leftIcon={<tab.icon className="size-4" />}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base capitalize">{activeTab}</CardTitle>
                <CardDescription>Manage your portfolio {activeTab}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {activeTab} management coming soon.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link to={`/portfolio/${id}/${activeTab}`}>
                      Go to {activeTab}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
