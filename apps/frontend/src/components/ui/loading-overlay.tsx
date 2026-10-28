import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export interface LoadingOverlayProps {
  loading: boolean;
  children?: ReactNode;
  text?: string;
  fullScreen?: boolean;
}

function LoadingOverlay({
  loading,
  children,
  text,
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!loading && children) {
    return <>{children}</>;
  }

  if (!loading) return null;

  return (
    <div className={cn("relative", fullScreen && "min-h-screen")}>
      {children && <div className="opacity-50 pointer-events-none">{children}</div>}

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          fullScreen
            ? "fixed inset-0 z-(--z-overlay) bg-surface/80 backdrop-blur-sm"
            : "absolute inset-0 z-10 bg-surface/60 backdrop-blur-[1px]",
        )}
        role="status"
        aria-live="polite"
      >
        <Spinner size="lg" color="primary" />
        {text && (
          <p className="text-sm font-medium text-fg-secondary animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export { LoadingOverlay };
