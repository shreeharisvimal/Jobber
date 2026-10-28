import type { HTMLAttributes } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Scale,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AIWarningType = "limitation" | "accuracy" | "bias" | "general";

const typeConfig: Record<AIWarningType, { icon: typeof AlertTriangle; title: string; styles: string }> = {
  limitation: {
    icon: AlertCircle,
    title: "Limitation",
    styles: "border-l-warning-400 bg-warning-50/60 text-warning-800",
  },
  accuracy: {
    icon: AlertTriangle,
    title: "Accuracy Notice",
    styles: "border-l-warning-500 bg-warning-50/60 text-warning-800",
  },
  bias: {
    icon: Scale,
    title: "Bias Notice",
    styles: "border-l-warning-500 bg-warning-50/60 text-warning-800",
  },
  general: {
    icon: Info,
    title: "AI Notice",
    styles: "border-l-info-400 bg-info-50/60 text-info-800",
  },
};

const iconStyles: Record<AIWarningType, string> = {
  limitation: "text-warning-500",
  accuracy: "text-warning-600",
  bias: "text-warning-600",
  general: "text-info-500",
};

export interface AIWarningProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  type?: AIWarningType;
  dismissible?: boolean;
  onDismiss?: () => void;
}

function AIWarning({
  className,
  title,
  message,
  type = "general",
  dismissible = false,
  onDismiss,
  ...props
}: AIWarningProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const displayTitle = title ?? config.title;

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border border-l-[3px] p-3.5",
        config.styles,
        className,
      )}
      {...props}
    >
      <span className={cn("mt-0.5 shrink-0", iconStyles[type])} aria-hidden="true">
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-semibold leading-tight">{displayTitle}</h4>
        <p className="mt-0.5 text-xs leading-relaxed opacity-80">{message}</p>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-0.5 text-current opacity-50 transition-opacity duration-normal hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Dismiss warning"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export { AIWarning };
