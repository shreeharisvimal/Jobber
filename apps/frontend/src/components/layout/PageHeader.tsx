import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "./Breadcrumb";
import type { BreadcrumbItem } from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  backHref?: string;
  icon?: ReactNode;
  className?: string;
}

function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  backHref,
  icon,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border pb-6", className)}>
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumb} />
        </div>
      )}

      {/* Back link */}
      {backHref && (
        <Link
          to={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      )}

      {/* Title row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 [&>svg]:size-5">
              {icon}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
