import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingToolbarProps {
  children: ReactNode;
  className?: string;
}

function FloatingToolbar({ children, className }: FloatingToolbarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-[var(--z-overlay)] -translate-x-1/2",
        "inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1.5 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { FloatingToolbar };
export type { FloatingToolbarProps };
