import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="size-7" aria-hidden="true" />}
      </div>

      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "mt-6 inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            action.variant === "secondary"
              ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-300"
              : "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900",
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export { EmptyState };
