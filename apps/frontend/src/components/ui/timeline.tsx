import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Variant → colour mapping                                          */
/* ------------------------------------------------------------------ */

const dotVariantMap: Record<string, string> = {
  default: "bg-neutral-400",
  brand: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

const iconVariantMap: Record<string, string> = {
  default: "bg-neutral-100 text-neutral-600",
  brand: "bg-brand-50 text-brand-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  alternating?: boolean;
}

function Timeline({
  className,
  alternating = false,
  children,
  ...props
}: TimelineProps) {
  return (
    <div
      className={cn("relative flex flex-col", className)}
      role="list"
      {...props}
    >
      {alternating
        ? (function renderAlternating() {
            const childArray = Array.isArray(children) ? children : [children];
            return childArray.map((child, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex w-full items-start",
                  idx % 2 === 0 ? "flex-row" : "flex-row-reverse",
                )}
              >
                <div className="w-1/2" />
                <div className="relative flex w-0 flex-col items-center">
                  {child}
                </div>
                <div className="w-1/2" />
              </div>
            ));
          })()
        : children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TimelineItem                                                       */
/* ------------------------------------------------------------------ */

export interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "brand" | "success" | "warning" | "danger";
  title: string;
  description?: string;
  timestamp?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

function TimelineItem({
  variant = "default",
  title,
  description,
  timestamp,
  icon,
  children,
  className,
  ...props
}: TimelineItemProps) {
  const isLast = className?.includes("last:");

  return (
    <div
      className={cn("relative flex gap-4 pb-8 last:pb-0", className)}
      role="listitem"
      {...props}
    >
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
      )}

      {/* Dot / Icon */}
      <div className="relative z-10 flex shrink-0 items-center justify-center">
        {icon ? (
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              iconVariantMap[variant],
            )}
          >
            {icon}
          </div>
        ) : (
          <span
            className={cn(
              "size-3 rounded-full ring-4 ring-background",
              dotVariantMap[variant],
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {timestamp && (
            <time className="whitespace-nowrap text-xs text-muted-foreground">
              {timestamp}
            </time>
          )}
        </div>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

export { Timeline, TimelineItem };
