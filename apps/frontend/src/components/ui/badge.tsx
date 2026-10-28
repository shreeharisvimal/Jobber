import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors duration-fast",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-700",
        secondary:
          "bg-neutral-200/60 text-neutral-600",
        outline:
          "border border-neutral-200 text-neutral-700",
        success:
          "bg-success-50 text-success-700",
        warning:
          "bg-warning-50 text-warning-700",
        danger:
          "bg-danger-50 text-danger-700",
        info:
          "bg-info-50 text-info-700",
        brand:
          "bg-brand-50 text-brand-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const dotColorMap: Record<string, string> = {
  default: "bg-neutral-500",
  secondary: "bg-neutral-400",
  outline: "bg-neutral-400",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  info: "bg-info-500",
  brand: "bg-brand-500",
};

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
}

function Badge({
  className,
  variant,
  size,
  dot = false,
  dismissible = false,
  onDismiss,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {dot && (
        <span
          className={cn("size-1.5 rounded-full shrink-0", dotColorMap[variant ?? "default"])}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span className="shrink-0 [&>svg]:size-3" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {dismissible && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="-mr-1 ml-0.5 rounded-full p-0.5 hover:bg-neutral-300/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          aria-label="Remove"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

export { Badge, badgeVariants };
