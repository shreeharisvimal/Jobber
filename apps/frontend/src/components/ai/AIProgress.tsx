import type { HTMLAttributes } from "react";
import { Brain, Sparkles, Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AIProgressStatus = "analyzing" | "generating" | "optimizing" | "reviewing";

const statusConfig: Record<AIProgressStatus, { icon: typeof Brain; label: string }> = {
  analyzing: { icon: Search, label: "Analyzing" },
  generating: { icon: Sparkles, label: "Generating" },
  optimizing: { icon: Zap, label: "Optimizing" },
  reviewing: { icon: Brain, label: "Reviewing" },
};

export interface AIProgressProps extends HTMLAttributes<HTMLDivElement> {
  progress?: number;
  status?: AIProgressStatus;
  label?: string;
  showPercentage?: boolean;
}

function AIProgress({
  className,
  progress,
  status = "analyzing",
  label,
  showPercentage = false,
  ...props
}: AIProgressProps) {
  const isIndeterminate = progress === undefined;
  const percentage = isIndeterminate ? 0 : Math.min(Math.max(progress, 0), 100);
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const displayLabel = label ?? config.label;

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <StatusIcon className="size-4 text-brand-500 shrink-0" aria-hidden="true" />
          <span>{displayLabel}</span>
        </div>
        {showPercentage && !isIndeterminate && (
          <span className="text-xs font-medium text-fg-secondary tabular-nums">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      <div
        className="relative w-full h-2 overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={displayLabel}
      >
        {isIndeterminate ? (
          <div className="absolute inset-0 animate-shimmer" />
        ) : (
          <div
            className="h-full rounded-full transition-[width] duration-slow ease-in-out"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, var(--color-brand-500), var(--color-brand-600))",
            }}
          />
        )}
      </div>
    </div>
  );
}

export { AIProgress };
