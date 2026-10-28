import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  id: string;
  label: string;
  progress: number;
  total?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

export interface ProgressOverviewProps {
  title?: string;
  items: ProgressItem[];
  className?: string;
}

function ProgressRow({ item }: { item: ProgressItem }) {
  const percentage = Math.min(Math.max(item.progress, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground truncate">
          {item.label}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {item.total !== undefined && (
            <span className="text-xs text-muted-foreground">
              {item.progress}/{item.total}
            </span>
          )}
          <span className="text-xs font-semibold text-foreground">
            {percentage}%
          </span>
        </div>
      </div>
      <Progress
        value={percentage}
        variant={item.variant ?? "default"}
        size="sm"
        aria-label={`${item.label}: ${percentage}%`}
      />
    </div>
  );
}

function ProgressOverview({
  title = "Progress",
  items,
  className,
}: ProgressOverviewProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-5">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No progress data
          </p>
        ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <ProgressRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ProgressOverview };
