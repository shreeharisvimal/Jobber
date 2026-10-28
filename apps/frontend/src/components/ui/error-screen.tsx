import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ReactNode;
  className?: string;
}

function ErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try again",
  icon,
  className,
}: ErrorScreenProps) {
  const resolvedIcon = icon ?? <AlertTriangle className="size-10 text-danger-400" />;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <span className="mb-4 shrink-0" aria-hidden="true">
        {resolvedIcon}
      </span>

      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-secondary">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-6"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export { ErrorScreen };
