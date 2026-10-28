import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Action {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "brand" | "success";
}

export interface QuickActionsProps {
  title?: string;
  actions: Action[];
  className?: string;
}

const actionBgMap: Record<string, string> = {
  default: "bg-neutral-50 text-neutral-700 group-hover:bg-neutral-100 group-hover:text-neutral-900",
  brand: "bg-brand-50 text-brand-600 group-hover:bg-brand-100 group-hover:text-brand-700",
  success: "bg-success-50 text-success-600 group-hover:bg-success-100 group-hover:text-success-700",
};

function ActionButton({ action }: { action: Action }) {
  const classes = cn(
    "group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all",
    "hover:shadow-xs hover:border-border/80",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "cursor-pointer",
  );

  const content = (
    <>
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg transition-colors",
          actionBgMap[action.variant ?? "default"],
        )}
        aria-hidden="true"
      >
        {action.icon}
      </div>
      <span className="text-sm font-medium text-foreground">{action.label}</span>
    </>
  );

  if (action.href) {
    return (
      <a href={action.href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={action.onClick}
      className={classes}
    >
      {content}
    </button>
  );
}

function QuickActions({
  title = "Quick Actions",
  actions,
  className,
}: QuickActionsProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="flex-1 px-6 pb-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {actions.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { QuickActions };
