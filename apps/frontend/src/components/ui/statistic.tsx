import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatisticChange {
  value: number;
  type: "increase" | "decrease";
  label?: string;
}

export interface StatisticProps {
  label: string;
  value: string | number;
  change?: StatisticChange;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "brand" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Variant → colour mapping                                          */
/* ------------------------------------------------------------------ */

const iconBgMap: Record<string, string> = {
  default: "bg-neutral-100 text-neutral-600",
  brand: "bg-brand-50 text-brand-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

const sizeMap: Record<string, { value: string; label: string; icon: string; change: string }> = {
  sm: {
    value: "text-xl font-bold",
    label: "text-xs",
    icon: "size-8",
    change: "text-xs",
  },
  md: {
    value: "text-2xl font-bold",
    label: "text-sm",
    icon: "size-10",
    change: "text-xs",
  },
  lg: {
    value: "text-3xl font-bold",
    label: "text-base",
    icon: "size-12",
    change: "text-sm",
  },
};

/* ------------------------------------------------------------------ */
/*  Statistic                                                          */
/* ------------------------------------------------------------------ */

function Statistic({
  label,
  value,
  change,
  changeLabel,
  icon,
  variant = "default",
  size = "md",
  className,
}: StatisticProps) {
  const sz = sizeMap[size]!;

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {icon && (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg",
            iconBgMap[variant],
            sz.icon,
          )}
        >
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className={cn("text-muted-foreground", sz.label)}>{label}</p>
        <p className={cn("mt-0.5 leading-tight text-foreground", sz.value)}>
          {value}
        </p>

        {(change || changeLabel) && (
          <div className={cn("mt-1 flex items-center gap-1.5", sz.change)}>
            {change && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  change.type === "increase"
                    ? "text-success-600"
                    : "text-danger-600",
                )}
              >
                {change.type === "increase" ? (
                  <TrendingUp className="size-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-3" aria-hidden="true" />
                )}
                {Math.abs(change.value)}%
              </span>
            )}
            {changeLabel && (
              <span className="text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { Statistic };
