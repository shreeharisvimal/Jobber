import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "danger" | "neutral";

const variantStyles: Record<AlertVariant, string> = {
  info: "border-l-brand-500 bg-brand-50 text-brand-800",
  success: "border-l-success-500 bg-success-50 text-success-800",
  warning: "border-l-warning-500 bg-warning-50 text-warning-800",
  danger: "border-l-danger-500 bg-danger-50 text-danger-800",
  neutral: "border-l-neutral-400 bg-neutral-50 text-neutral-800",
};

const iconStyles: Record<AlertVariant, string> = {
  info: "text-brand-500",
  success: "text-success-500",
  warning: "text-warning-500",
  danger: "text-danger-500",
  neutral: "text-neutral-500",
};

const defaultIcons: Record<AlertVariant, typeof AlertCircle> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  neutral: Info,
};

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  children?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

function Alert({
  variant = "info",
  title,
  description,
  children,
  icon,
  action,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const DefaultIcon = defaultIcons[variant];
  const resolvedIcon = icon ?? <DefaultIcon className="size-4" />;

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border border-l-[3px] p-4",
        variantStyles[variant],
        className,
      )}
    >
      {resolvedIcon && (
        <span className={cn("mt-0.5 shrink-0", iconStyles[variant])} aria-hidden="true">
          {resolvedIcon}
        </span>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold leading-tight">{title}</h4>
        )}
        {description && (
          <p className={cn("text-sm leading-relaxed", title ? "mt-1 opacity-80" : "")}>
            {description}
          </p>
        )}
        {children && (
          <div className={cn("text-sm", title || description ? "mt-2" : "")}>
            {children}
          </div>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1 transition-colors",
            "hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
          )}
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export { Alert };
export type { AlertVariant };
