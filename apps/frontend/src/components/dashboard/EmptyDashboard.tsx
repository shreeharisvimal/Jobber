import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export interface EmptyDashboardProps {
  title?: string;
  description?: string;
  actions?: EmptyAction[];
  className?: string;
}

function EmptyDashboard({
  title = "Your dashboard is empty",
  description = "Get started by creating your first job, client, or invoice. Everything you need will appear here.",
  actions,
  className,
}: EmptyDashboardProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <LayoutDashboard className="size-8 text-muted-foreground" aria-hidden="true" />
          </div>

          <h3 className="text-base font-semibold text-foreground">
            {title}
          </h3>

          {description && (
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {actions && actions.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === "secondary" ? "secondary" : "primary"}
                  size="md"
                  onClick={action.onClick}
                  leftIcon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { EmptyDashboard };
