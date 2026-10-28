import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex w-full appearance-none rounded-md border bg-transparent text-sm text-neutral-900 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-8 pl-3 pr-8 text-xs",
        md: "h-9 pl-3 pr-8 text-sm",
        lg: "h-10 pl-4 pr-9 text-sm",
      },
      variant: {
        default:
          "border-neutral-200 focus-visible:ring-brand-500",
        error:
          "border-danger-300 text-danger-900 focus-visible:ring-danger-500",
        success:
          "border-success-300 text-success-900 focus-visible:ring-success-500",
      },
    },
    defaultVariants: {
      inputSize: "md",
      variant: "default",
    },
  },
);

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  rightIcon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      inputSize,
      variant,
      rightIcon,
      children,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const hasError = variant === "error" || ariaInvalid === true;

    return (
      <div className="relative w-full">
        <select
          className={cn(
            selectVariants({
              inputSize,
              variant: hasError ? "error" : variant,
              className,
            }),
          )}
          ref={ref}
          aria-invalid={hasError || undefined}
          {...props}
        >
          {children}
        </select>
        {rightIcon ?? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <ChevronDown className="size-4" />
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select, selectVariants };
