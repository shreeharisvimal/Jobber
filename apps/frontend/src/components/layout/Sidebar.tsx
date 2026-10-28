import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";

/* ------------------------------------------------------------------ */
/*  Context — sub-components read sidebar state from here              */
/* ------------------------------------------------------------------ */

interface SidebarCtx {
  collapsed: boolean;
}

const SidebarContext = createContext<SidebarCtx>({ collapsed: false });

function useSidebarContext() {
  return useContext(SidebarContext);
}

/* ------------------------------------------------------------------ */
/*  SidebarMenu                                                        */
/* ------------------------------------------------------------------ */

function SidebarMenu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul role="menu" className={cn("space-y-0.5", className)}>
      {children}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarMenuItem                                                     */
/* ------------------------------------------------------------------ */

function SidebarMenuItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li role="none" className={cn("list-none", className)}>
      {children}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarMenuButton                                                  */
/* ------------------------------------------------------------------ */

interface SidebarMenuButtonProps {
  icon: ReactNode;
  label: string;
  href?: string;
  badge?: number | string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarMenuButton({
  icon,
  label,
  href,
  badge,
  active,
  onClick,
}: SidebarMenuButtonProps) {
  const { collapsed } = useSidebarContext();

  const content = (
    <>
      <span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-4">
        {icon}
      </span>

      {!collapsed && (
        <>
          <span className="flex-1 truncate text-sm font-medium">{label}</span>

          {badge != null && badge !== 0 && (
            <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 px-1.5 text-[10px] font-semibold text-brand-700">
              {badge}
            </span>
          )}
        </>
      )}

      {collapsed && badge != null && badge !== 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-brand-500 text-[8px] font-bold text-white">
          {typeof badge === "number" && badge > 9 ? "9+" : ""}
        </span>
      )}
    </>
  );

  const sharedClasses = cn(
    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
    "text-fg-secondary hover:bg-accent hover:text-fg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
    active &&
      "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800",
    collapsed && "justify-center px-0 py-2",
  );

  if (href) {
    return (
      <NavLink
        to={href}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          cn(
            sharedClasses,
            isActive &&
              "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800",
            active &&
              "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800",
          )
        }
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      title={collapsed ? label : undefined}
      onClick={onClick}
      className={sharedClasses}
    >
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar — root component                                           */
/* ------------------------------------------------------------------ */

interface SidebarProps {
  children?: ReactNode;
  className?: string;
  logo?: ReactNode;
  footer?: ReactNode;
}

function Sidebar({ children, className, logo, footer }: SidebarProps) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const collapsed = !sidebarOpen;

  const ctxValue = useMemo<SidebarCtx>(
    () => ({ collapsed }),
    [collapsed],
  );

  const handleToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider value={ctxValue}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[var(--z-sticky)] flex flex-col border-r border-border bg-surface-sunken transition-[width] duration-200 ease-in-out",
          collapsed ? "w-[var(--width-sidebar-collapsed)]" : "w-[var(--width-sidebar)]",
          className,
        )}
      >
        {/* ---- Logo ---- */}
        <div
          className={cn(
            "flex h-[var(--height-topnav)] shrink-0 items-center border-b border-border px-4",
            collapsed && "justify-center px-0",
          )}
        >
          {logo ?? (
            <>
              <span className="text-lg font-bold tracking-tight text-fg">
                Jobber
              </span>
              {!collapsed && (
                <span className="ml-2 text-xs font-medium text-fg-muted">
                  AI Career OS
                </span>
              )}
            </>
          )}
        </div>

        {/* ---- Scrollable nav ---- */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
          {children}
        </nav>

        {/* ---- Footer / collapse toggle ---- */}
        <div className="shrink-0 border-t border-border p-2">
          {footer}
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-fg-secondary transition-colors hover:bg-accent hover:text-fg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" />
            ) : (
              <PanelLeftClose className="size-4 shrink-0" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}

export {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
export type { SidebarMenuButtonProps, SidebarProps };
