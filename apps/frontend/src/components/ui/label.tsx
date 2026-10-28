import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

function Label({
  className,
  children,
  required,
  disabled,
  size = "md",
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "font-medium text-neutral-700",
        sizeClasses[size],
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-danger-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export { Label };
