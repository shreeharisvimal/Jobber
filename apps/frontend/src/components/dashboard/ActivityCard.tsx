import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ActivityUser {
  name: string;
  avatarUrl?: string;
  initials?: string;
}

interface Activity {
  id: string;
  user?: ActivityUser;
  action: string;
  target?: string;
  timestamp: string;
  type?: "default" | "success" | "warning" | "danger" | "info";
}

export interface ActivityCardProps {
  title?: string;
  activities: Activity[];
  maxItems?: number;
  viewAllHref?: string;
  className?: string;
}

const typeColorMap: Record<string, string> = {
  default: "bg-neutral-100 text-neutral-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
  info: "bg-info-50 text-info-600",
};

function ActivityItem({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  return (
    <div className="group">
      <div className="flex items-start gap-3 py-3">
        {activity.user ? (
          <Avatar
            size="sm"
            src={activity.user.avatarUrl}
            fallback={activity.user.initials ?? activity.user.name}
            alt={activity.user.name}
          />
        ) : (
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              typeColorMap[activity.type ?? "default"],
            )}
          >
            <span className="text-xs font-medium">•</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {activity.user && (
              <span className="font-medium">{activity.user.name} </span>
            )}
            {activity.action}
            {activity.target && (
              <span className="font-medium"> {activity.target}</span>
            )}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <time className="text-xs text-muted-foreground">{activity.timestamp}</time>
            {activity.type && activity.type !== "default" && (
              <Badge variant={activity.type} size="sm">
                {activity.type}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  );
}

function ActivityCard({
  title = "Recent Activity",
  activities,
  maxItems = 5,
  viewAllHref,
  className,
}: ActivityCardProps) {
  const visibleActivities = activities.slice(0, maxItems);

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
        {visibleActivities.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No recent activity
          </p>
        ) : (
          <div>
            {visibleActivities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={index === visibleActivities.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ActivityCard };
