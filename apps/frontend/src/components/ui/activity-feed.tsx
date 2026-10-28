import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ActivityFeedItemUser {
  name: string;
  avatar?: string;
}

export interface ActivityFeedItem {
  id: string;
  user?: ActivityFeedItemUser;
  action: string;
  target?: string;
  timestamp: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export interface ActivityFeedProps {
  items: ActivityFeedItem[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Variant → colour mapping                                          */
/* ------------------------------------------------------------------ */

const variantDotMap: Record<string, string> = {
  default: "bg-neutral-400",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  info: "bg-info-500",
};

/* ------------------------------------------------------------------ */
/*  ActivityFeed                                                       */
/* ------------------------------------------------------------------ */

function ActivityFeed({ items, className }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        No activity yet.
      </p>
    );
  }

  return (
    <div className={cn("relative", className)} role="feed" aria-label="Activity feed">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <div
            key={item.id}
            className={cn("relative flex gap-3 pb-6 last:pb-0")}
            aria-posinset={idx + 1}
            aria-setsize={items.length}
          >
            {/* Connector line */}
            {!isLast && (
              <div
                className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                aria-hidden="true"
              />
            )}

            {/* Avatar or icon */}
            <div className="relative z-10 shrink-0">
              {item.user ? (
                <Avatar
                  src={item.user.avatar}
                  fallback={item.user.name}
                  size="sm"
                  alt={item.user.name}
                />
              ) : item.icon ? (
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    variantDotMap[item.variant ?? "default"],
                    "text-white",
                  )}
                >
                  {item.icon}
                </div>
              ) : (
                <span
                  className={cn(
                    "mt-2 block size-2 rounded-full",
                    variantDotMap[item.variant ?? "default"],
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                {item.user && (
                  <span className="font-medium">{item.user.name} </span>
                )}
                <span className="text-muted-foreground">{item.action}</span>
                {item.target && (
                  <span className="font-medium text-foreground"> {item.target}</span>
                )}
              </p>
              <time className="mt-0.5 block text-xs text-muted-foreground">
                {item.timestamp}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ActivityFeed };
