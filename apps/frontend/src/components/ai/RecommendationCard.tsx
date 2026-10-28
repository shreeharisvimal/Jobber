import type { HTMLAttributes, ReactNode } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AIBadge } from "@/components/ai/AIBadge";
import { ConfidenceIndicator } from "@/components/ai/ConfidenceIndicator";

type RecommendationPriority = "high" | "medium" | "low";

const priorityStyles: Record<RecommendationPriority, string> = {
  high: "bg-danger-50 text-danger-700",
  medium: "bg-warning-50 text-warning-700",
  low: "bg-neutral-100 text-neutral-600",
};

const priorityLabels: Record<RecommendationPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export interface RecommendationCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  confidence?: number;
  category?: string;
  priority?: RecommendationPriority;
  onAccept?: () => void;
  onDismiss?: () => void;
  onDetails?: () => void;
  icon?: ReactNode;
}

function RecommendationCard({
  className,
  title,
  description,
  confidence,
  category,
  priority,
  onAccept,
  onDismiss,
  onDetails,
  icon,
  ...props
}: RecommendationCardProps) {
  return (
    <Card
      className={cn(
        "relative border-l-[3px] border-l-brand-500 transition-shadow duration-normal hover:shadow-md",
        className,
      )}
      {...props}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                {icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-fg leading-tight">{title}</h3>
                {priority && (
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", priorityStyles[priority])}>
                    {priorityLabels[priority]}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-fg-secondary leading-relaxed">{description}</p>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                {confidence !== undefined && (
                  <div className="w-24">
                    <ConfidenceIndicator value={confidence} size="sm" showLabel={false} />
                  </div>
                )}
                {category && (
                  <span className="text-xs text-fg-muted">{category}</span>
                )}
              </div>
            </div>
          </div>

          <AIBadge variant="recommended" size="sm" className="shrink-0" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          {onAccept && (
            <button
              type="button"
              onClick={onAccept}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-normal hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <Check className="size-3" aria-hidden="true" />
              Accept
            </button>
          )}
          {onDetails && (
            <button
              type="button"
              onClick={onDetails}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-fg-secondary transition-colors duration-normal hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <ExternalLink className="size-3" aria-hidden="true" />
              Details
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors duration-normal hover:bg-neutral-100 hover:text-fg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <X className="size-3" aria-hidden="true" />
              Dismiss
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { RecommendationCard };
