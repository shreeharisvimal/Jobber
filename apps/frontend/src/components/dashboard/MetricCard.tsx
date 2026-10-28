import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Change {
  value: number;
  type: "increase" | "decrease" | "neutral";
  label?: string;
  period?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: Change;
  icon?: ReactNode;
  iconVariant?: "default" | "brand" | "success" | "warning" | "danger";
  loading?: boolean;
  className?: string;
}

const iconBgMap: Record<string, string> = {
  default: "bg-neutral-100 text-neutral-600",
  brand: "bg-brand-50 text-brand-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

const changeColorMap: Record<string, string> = {
  increase: "text-success-600",
  decrease: "text-danger-600",
  neutral: "text-neutral-500",
};

const ChangeIcon = ({ type }: { type: Change["type"] }) => {
  if (type === "increase") return <TrendingUp className="size-3.5" aria-hidden="true" />;
  if (type === "decrease") return <TrendingDown className="size-3.5" aria-hidden="true" />;
  return <Minus className="size-3.5" aria-hidden="true" />;
};

function MetricCard({
  title,
  value,
  change,
  icon,
  iconVariant = "default",
  loading = false,
  className,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-8 w-32" />
            <Skeleton variant="text" className="h-3 w-40" />
          </div>
          <Skeleton variant="rectangular" className="size-10 shrink-0 rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {change && (
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold",
                    changeColorMap[change.type],
                  )}
                >
                  <ChangeIcon type={change.type} />
                  {change.type === "increase" && "+"}
                  {change.value}%
                </span>
                {change.period && (
                  <span className="text-xs text-muted-foreground">
                    {change.label ?? `from ${change.period}`}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                iconBgMap[iconVariant],
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { MetricCard };
