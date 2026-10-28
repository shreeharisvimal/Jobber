import { useCallback, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sidebar } from "./Sidebar";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./Sidebar";
import { TopNav } from "./TopNav";
import {
  LayoutDashboard,
  User,
  FileText,
  Zap,
  Briefcase,
  Settings,
  ScanSearch,
  Target,
  MessageSquare,
  Contact,
  Mail,
  Globe,
  Brain,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

function MainLayout() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isMobileSidebarOpen = isMobile && sidebarOpen;

  const overlayRef = useRef<HTMLDivElement>(null);

  /* Body scroll lock when mobile sidebar is open */
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  const handleOverlayClick = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const handleSidebarNavClick = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ---- Mobile backdrop ---- */}
      {isMobileSidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[calc(var(--z-sticky)-1)] bg-black/40 backdrop-blur-sm transition-opacity duration-200"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* ---- Sidebar ---- */}
      {isMobile ? (
        <div
          className={cn(
            "transition-transform duration-200 ease-in-out",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full pointer-events-none",
          )}
        >
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<LayoutDashboard />}
                  label="Dashboard"
                  href={ROUTES.HOME}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<User />}
                  label="Profile"
                  href={ROUTES.PROFILE}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<FileText />}
                  label="Resumes"
                  href={ROUTES.RESUMES}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Zap />}
                  label="AI Platform"
                  href={ROUTES.AI_PLATFORM}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Briefcase />}
                  label="Jobs"
                  href={ROUTES.JOBS}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<ScanSearch />}
                  label="ATS Analysis"
                  href={ROUTES.ATS}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Target />}
                  label="Optimization"
                  href={ROUTES.OPTIMIZATION}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<MessageSquare />}
                  label="Interviews"
                  href={ROUTES.INTERVIEWS}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Contact />}
                  label="CRM"
                  href={ROUTES.CRM}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Mail />}
                  label="Email"
                  href={ROUTES.EMAIL}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Globe />}
                  label="Portfolio"
                  href={ROUTES.PORTFOLIO}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Brain />}
                  label="Career Coach"
                  href={ROUTES.CAREER_COACH}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu className="mt-auto">
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Settings />}
                  label="Settings"
                  href={ROUTES.SETTINGS}
                  onClick={handleSidebarNavClick}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </div>
      ) : (
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<LayoutDashboard />}
                label="Dashboard"
                href={ROUTES.HOME}
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<User />}
                label="Profile"
                href={ROUTES.PROFILE}
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<FileText />}
                label="Resumes"
                href={ROUTES.RESUMES}
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<Zap />}
                label="AI Platform"
                href={ROUTES.AI_PLATFORM}
              />
            </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Briefcase />}
                  label="Jobs"
                  href={ROUTES.JOBS}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<ScanSearch />}
                  label="ATS Analysis"
                  href={ROUTES.ATS}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Target />}
                  label="Optimization"
                  href={ROUTES.OPTIMIZATION}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<MessageSquare />}
                  label="Interviews"
                  href={ROUTES.INTERVIEWS}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Contact />}
                  label="CRM"
                  href={ROUTES.CRM}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Mail />}
                  label="Email"
                  href={ROUTES.EMAIL}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Globe />}
                  label="Portfolio"
                  href={ROUTES.PORTFOLIO}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Brain />}
                  label="Career Coach"
                  href={ROUTES.CAREER_COACH}
                />
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu className="mt-auto">
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<Settings />}
                  label="Settings"
                  href={ROUTES.SETTINGS}
                />
              </SidebarMenuItem>
            </SidebarMenu>
        </Sidebar>
      )}

      {/* ---- Main content area ---- */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-[margin-left] duration-200 ease-in-out",
          isMobile
            ? "ml-0"
            : sidebarOpen
              ? "ml-[var(--width-sidebar)]"
              : "ml-[var(--width-sidebar-collapsed)]",
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { MainLayout };
