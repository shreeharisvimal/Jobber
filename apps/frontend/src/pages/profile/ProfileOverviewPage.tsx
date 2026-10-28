import { type FC } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FolderGit2,
  Languages,
  Heart,
  BookOpen,
  FileBadge,
  Trophy,
  Quote,
  Target,
  FileText,
  Download,
  Upload,
  Plus,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Statistic } from "@/components/ui/statistic";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";

interface ProfileOverview {
  headline: string;
  summary: string;
  location: string | null;
  stats: {
    experience: number;
    education: number;
    skills: number;
    certifications: number;
    projects: number;
    languages: number;
    volunteer: number;
    publications: number;
    patents: number;
    awards: number;
    recommendations: number;
    goals: number;
    customSections: number;
  };
  completionPercentage: number;
}

const sectionLinks = [
  { label: "Work Experience", href: "/profile/experience", icon: Briefcase, key: "experience" as const },
  { label: "Education", href: "/profile/education", icon: GraduationCap, key: "education" as const },
  { label: "Skills", href: "/profile/skills", icon: Wrench, key: "skills" as const },
  { label: "Certifications", href: "/profile/certifications", icon: Award, key: "certifications" as const },
  { label: "Projects", href: "/profile/projects", icon: FolderGit2, key: "projects" as const },
  { label: "Languages", href: "/profile/languages", icon: Languages, key: "languages" as const },
  { label: "Volunteer", href: "/profile/volunteer", icon: Heart, key: "volunteer" as const },
  { label: "Publications", href: "/profile/publications", icon: BookOpen, key: "publications" as const },
  { label: "Patents", href: "/profile/patents", icon: FileBadge, key: "patents" as const },
  { label: "Awards", href: "/profile/awards", icon: Trophy, key: "awards" as const },
  { label: "Recommendations", href: "/profile/recommendations", icon: Quote, key: "recommendations" as const },
  { label: "Career Goals", href: "/profile/goals", icon: Target, key: "goals" as const },
  { label: "Custom Sections", href: "/profile/custom", icon: FileText, key: "customSections" as const },
];

export const ProfileOverviewPage: FC = () => {
  const { data: overview, isLoading, error } = useQuery<ProfileOverview>({
    queryKey: ["career-profile", "overview"],
    queryFn: async () => {
      const response = await apiClient.get("/career-profile/overview");
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton variant="rectangular" height={80} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <PageHeader
            title="Career Profile"
            description="Manage your master career profile"
          />
          <Alert variant="danger" title="Failed to load profile" description="Please try again later." />
        </div>
      </PageContainer>
    );
  }

  const stats = overview?.stats;
  const completion = overview?.completionPercentage ?? 0;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Career Profile"
          description="Your master career profile at a glance"
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Upload className="size-4" />} asChild>
                <Link to="/profile/import-export">Import</Link>
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Download className="size-4" />} asChild>
                <Link to="/profile/import-export">Export</Link>
              </Button>
            </>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>
              {overview?.headline ?? "Add a headline to your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {overview?.summary ?? "Add a summary to tell your professional story."}
            </p>
            {overview?.location && (
              <p className="mt-2 text-sm text-muted-foreground">{overview.location}</p>
            )}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Completion</span>
                <span className="text-xs font-medium text-foreground">{completion}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Section Stats</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Statistic
              label="Work Experiences"
              value={stats?.experience ?? 0}
              icon={<Briefcase className="size-5" />}
              variant="brand"
            />
            <Statistic
              label="Education"
              value={stats?.education ?? 0}
              icon={<GraduationCap className="size-5" />}
              variant="brand"
            />
            <Statistic
              label="Skills"
              value={stats?.skills ?? 0}
              icon={<Wrench className="size-5" />}
              variant="success"
            />
            <Statistic
              label="Certifications"
              value={stats?.certifications ?? 0}
              icon={<Award className="size-5" />}
              variant="warning"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/profile/experience">Add Experience</Link>
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/profile/education">Add Education</Link>
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/profile/skills">Add Skills</Link>
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/profile/certifications">Add Certification</Link>
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />} asChild>
              <Link to="/profile/projects">Add Project</Link>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Profile Sections</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectionLinks.map((section) => {
              const Icon = section.icon;
              const count = stats?.[section.key] ?? 0;
              return (
                <Link key={section.href} to={section.href}>
                  <Card className="transition-colors hover:bg-accent/50">
                    <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Icon className="size-4" />
                      </span>
                      <div className="flex-1">
                        <CardTitle className="text-sm">{section.label}</CardTitle>
                        <CardDescription>
                          {count} {count === 1 ? "item" : "items"}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" size="sm">{count}</Badge>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {!overview && (
          <EmptyState
            title="Get started with your career profile"
            description="Build your professional profile to generate tailored resumes and career documents."
            action={{
              label: "Add Work Experience",
              onClick: () => window.location.href = "/profile/experience",
            }}
          />
        )}
      </div>
    </PageContainer>
  );
};
