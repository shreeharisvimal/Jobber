import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-muted-foreground" aria-hidden="true">
                  {separator ?? <ChevronRight className="size-3.5" />}
                </span>
              )}

              {isLast || !item.href ? (
                <span
                  className="text-sm font-medium text-foreground"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
