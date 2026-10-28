import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-neutral-100",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const barColorMap: Record<string, string> = {
  default: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  indeterminate?: boolean;
  showLabel?: boolean;
  striped?: boolean;
}

function Progress({
  className,
  size,
  variant = "default",
  value = 0,
  max = 100,
  indeterminate = false,
  showLabel = false,
  striped = false,
  ...props
}: ProgressProps) {
  const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {showLabel && !indeterminate && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-600">Progress</span>
          <span className="text-xs font-medium text-neutral-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(progressVariants({ size, className }))}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={props["aria-label"] || "Progress"}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-in-out",
            barColorMap[variant ?? "default"],
            indeterminate && "animate-progress-indeterminate w-1/4",
            striped && "bg-stripes",
          )}
          style={
            indeterminate
              ? undefined
              : { width: `${percentage}%` }
          }
        />
      </div>
    </div>
  );
}

export { Progress, progressVariants };
