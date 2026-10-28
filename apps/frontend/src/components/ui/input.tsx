import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-fast file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
      },
      variant: {
        default:
          "border-neutral-200 focus-visible:ring-brand-500",
        error:
          "border-danger-300 text-danger-900 placeholder:text-danger-400 focus-visible:ring-danger-500",
        success:
          "border-success-300 text-success-900 placeholder:text-success-400 focus-visible:ring-success-500",
      },
    },
    defaultVariants: {
      inputSize: "md",
      variant: "default",
    },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputSize,
      variant,
      leftIcon,
      rightIcon,
      type = "text",
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const hasError = variant === "error" || ariaInvalid === true;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 [&>svg]:size-4">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({
              inputSize,
              variant: hasError ? "error" : variant,
              className,
            }),
            leftIcon && "pl-9",
            rightIcon && "pr-9",
          )}
          ref={ref}
          aria-invalid={hasError || undefined}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 [&>svg]:size-4">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
