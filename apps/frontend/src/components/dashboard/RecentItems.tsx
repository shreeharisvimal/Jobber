import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RecentItem {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  badge?: {
    label: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  };
  timestamp?: string;
}

export interface RecentItemsProps {
  title?: string;
  items: RecentItem[];
  maxItems?: number;
  viewAllHref?: string;
  className?: string;
}

function ItemRow({
  item,
  isLast,
}: {
  item: RecentItem;
  isLast: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3 py-3 px-1 rounded-lg transition-colors hover:bg-accent/50 group">
      {item.icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {item.icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-foreground">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {item.badge && (
          <Badge variant={item.badge.variant} size="sm">
            {item.badge.label}
          </Badge>
        )}
        {item.timestamp && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {item.timestamp}
          </span>
        )}
        {item.href && (
          <ArrowRight
            className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );

  return (
    <div>
      {item.href ? (
        <a href={item.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg">
          {content}
        </a>
      ) : (
        content
      )}
      {!isLast && <Separator className="ml-12" />}
    </div>
  );
}

function RecentItems({
  title = "Recent Items",
  items,
  maxItems = 5,
  viewAllHref,
  className,
}: RecentItemsProps) {
  const visibleItems = items.slice(0, maxItems);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View All
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-4">
        {visibleItems.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No items yet
          </p>
        ) : (
          <div className="space-y-0">
            {visibleItems.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                isLast={index === visibleItems.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { RecentItems };
