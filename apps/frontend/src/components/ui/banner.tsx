import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type BannerVariant = "info" | "success" | "warning" | "danger";

const variantStyles: Record<BannerVariant, string> = {
  info: "bg-brand-600 text-white",
  success: "bg-success-600 text-white",
  warning: "bg-warning-500 text-white",
  danger: "bg-danger-600 text-white",
};

const buttonStyles: Record<BannerVariant, string> = {
  info: "hover:bg-brand-700",
  success: "hover:bg-success-700",
  warning: "hover:bg-warning-600",
  danger: "hover:bg-danger-700",
};

export interface BannerProps {
  variant?: BannerVariant;
  message: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

function Banner({
  variant = "info",
  message,
  action,
  dismissible = false,
  onDismiss,
  className,
}: BannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "relative z-(--z-overlay) flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium",
        variantStyles[variant],
        className,
      )}
    >
      <span className="text-center">{message}</span>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            "bg-white/15 hover:bg-white/25",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
        >
          {action.label}
        </button>
      )}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "absolute right-2 rounded-md p-1 transition-colors",
            buttonStyles[variant],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
          aria-label="Dismiss banner"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export { Banner };
