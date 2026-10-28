import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";

interface TopNavProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

function TopNav({ children, left, right, className }: TopNavProps) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] flex h-[var(--height-topnav)] shrink-0 items-center border-b border-border bg-background px-4 sm:px-6",
        className,
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-2">
        {left ?? (
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center rounded-md p-2 text-fg-secondary transition-colors hover:bg-accent hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </button>
        )}
      </div>

      {/* Center section */}
      <div className="flex flex-1 items-center justify-center px-4">
        {children}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

export { TopNav };
export type { TopNavProps };
