import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

function SectionContainer({
  title,
  description,
  actions,
  children,
  className,
  id,
}: SectionContainerProps) {
  const hasHeader = title || description || actions;

  return (
    <section id={id} className={cn("py-6", className)}>
      {hasHeader && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      )}

      {children}
    </section>
  );
}

export { SectionContainer };
export type { SectionContainerProps };
