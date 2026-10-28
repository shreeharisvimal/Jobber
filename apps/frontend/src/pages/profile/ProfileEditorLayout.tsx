import { type FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
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
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ProfileEditorLayoutProps {
  children: React.ReactNode;
}

const sections = [
  { label: "Overview", href: "/profile", icon: User },
  { label: "Work Experience", href: "/profile/experience", icon: Briefcase },
  { label: "Education", href: "/profile/education", icon: GraduationCap },
  { label: "Skills", href: "/profile/skills", icon: Wrench },
  { label: "Certifications", href: "/profile/certifications", icon: Award },
  { label: "Projects", href: "/profile/projects", icon: FolderGit2 },
  { label: "Languages", href: "/profile/languages", icon: Languages },
  { label: "Volunteer", href: "/profile/volunteer", icon: Heart },
  { label: "Publications", href: "/profile/publications", icon: BookOpen },
  { label: "Patents", href: "/profile/patents", icon: FileBadge },
  { label: "Awards", href: "/profile/awards", icon: Trophy },
  { label: "Recommendations", href: "/profile/recommendations", icon: Quote },
  { label: "Career Goals", href: "/profile/goals", icon: Target },
  { label: "Custom Sections", href: "/profile/custom", icon: FileText },
  { label: "Import / Export", href: "/profile/import-export", icon: ArrowDownUp },
];

export const ProfileEditorLayout: FC<ProfileEditorLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/profile") {
      return location.pathname === "/profile";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height,64px))] overflow-hidden">
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-background transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h2 className="text-sm font-semibold text-foreground">Profile Sections</h2>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-0.5 px-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = isActive(section.href);
              return (
                <Link
                  key={section.href}
                  to={section.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  title={collapsed ? section.label : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{section.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
