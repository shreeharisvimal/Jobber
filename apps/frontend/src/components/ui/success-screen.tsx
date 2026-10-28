import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SuccessScreenProps {
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
  className?: string;
}

function SuccessScreen({
  title = "Success!",
  message = "Your action has been completed successfully.",
  action,
  icon,
  className,
}: SuccessScreenProps) {
  const resolvedIcon = icon ?? <CheckCircle2 className="size-10 text-success-500" />;

  return (
    <div
      role="status"
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

      {action && (
        <Button
          variant="primary"
          size="sm"
          onClick={action.onClick}
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { SuccessScreen };
