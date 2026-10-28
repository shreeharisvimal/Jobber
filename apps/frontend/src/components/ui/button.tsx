import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-neutral-900 text-white shadow-xs hover:bg-neutral-800 active:bg-neutral-900 focus-visible:ring-neutral-900",
        secondary:
          "bg-neutral-100 text-neutral-900 shadow-xs hover:bg-neutral-200 active:bg-neutral-100 focus-visible:ring-neutral-300",
        outline:
          "border border-neutral-200 bg-transparent text-neutral-900 shadow-xs hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-neutral-300",
        ghost:
          "text-neutral-900 hover:bg-neutral-100 active:bg-neutral-50 focus-visible:ring-neutral-300",
        link: "text-neutral-900 underline-offset-4 hover:underline focus-visible:ring-neutral-300",
        success:
          "bg-success-600 text-white shadow-xs hover:bg-success-700 active:bg-success-600 focus-visible:ring-success-500",
        danger:
          "bg-danger-600 text-white shadow-xs hover:bg-danger-700 active:bg-danger-600 focus-visible:ring-danger-500",
        warning:
          "bg-warning-500 text-white shadow-xs hover:bg-warning-600 active:bg-warning-500 focus-visible:ring-warning-400",
        destructive:
          "bg-danger-600 text-white shadow-xs hover:bg-danger-700 active:bg-danger-600 focus-visible:ring-danger-500",
      },
      size: {
        xs: "h-7 rounded-md px-2.5 text-xs gap-1.5",
        sm: "h-8 rounded-md px-3 text-xs gap-1.5",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm gap-2.5",
        xl: "h-11 px-6 text-base gap-2.5",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  const spinnerSize =
    size === "xs" || size === "sm"
      ? "xs"
      : size === "xl"
        ? "md"
        : "sm";
  const spinnerColor =
    variant === "primary" ||
    variant === "success" ||
    variant === "danger" ||
    variant === "warning" ||
    variant === "destructive"
      ? "white"
      : "current";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={!asChild ? isDisabled : undefined}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Spinner size={spinnerSize} color={spinnerColor} />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </Comp>
  );
}

export { Button, buttonVariants };
