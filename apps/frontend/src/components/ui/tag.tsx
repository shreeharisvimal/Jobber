import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-fast cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-100",
        outline:
          "border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100",
        brand:
          "bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-50",
        success:
          "bg-success-50 text-success-700 hover:bg-success-100 active:bg-success-50",
        warning:
          "bg-warning-50 text-warning-700 hover:bg-warning-100 active:bg-warning-50",
        danger:
          "bg-danger-50 text-danger-700 hover:bg-danger-100 active:bg-danger-50",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TagProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tagVariants> {
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
}

function Tag({
  className,
  variant,
  size,
  removable = false,
  onRemove,
  icon,
  children,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      className={cn(tagVariants({ variant, size, className }))}
      {...props}
    >
      {icon && (
        <span className="shrink-0 [&>svg]:size-3" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }
          }}
          className="-mr-0.5 ml-0.5 rounded p-0.5 hover:bg-neutral-300/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          aria-label="Remove"
        >
          <X className="size-3" />
        </span>
      )}
    </button>
  );
}

export { Tag, tagVariants };
