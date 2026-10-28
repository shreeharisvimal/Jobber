import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export interface WidgetContainerProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  loading?: boolean;
  noPadding?: boolean;
  borderless?: boolean;
  className?: string;
  children: ReactNode;
}

function WidgetContainer({
  title,
  description,
  actions,
  loading = false,
  noPadding = false,
  borderless = false,
  className,
  children,
}: WidgetContainerProps) {
  const hasHeader = title || description || actions;

  return (
    <Card
      className={cn(
        "flex flex-col",
        borderless && "border-0 shadow-none",
        className,
      )}
    >
      {hasHeader && (
        <CardHeader
          className={cn(
            "flex-row items-start justify-between gap-4",
            noPadding && "px-6 pt-6",
            !noPadding && title && description && "pb-3",
          )}
        >
          <div className="min-w-0 flex-1">
            {title && (
              <CardTitle className="text-base">{title}</CardTitle>
            )}
            {description && (
              <CardDescription className="mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </CardHeader>
      )}

      <CardContent
        className={cn(
          "flex-1",
          noPadding && "p-0",
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="md" color="primary" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export { WidgetContainer };
