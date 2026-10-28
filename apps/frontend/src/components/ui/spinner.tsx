import { type VariantProps, cva } from "class-variance-authority";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin shrink-0", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
    color: {
      current: "text-current",
      primary: "text-brand-500",
      white: "text-white",
      success: "text-success-500",
      warning: "text-warning-500",
      danger: "text-danger-500",
    },
  },
  defaultVariants: {
    size: "md",
    color: "current",
  },
});

export interface SpinnerProps
  extends Omit<SVGProps<SVGSVGElement>, "color">,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, color, ...props }: SpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size, color, className }))}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { Spinner, spinnerVariants };
