import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const separatorVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px h-full",
    },
    variant: {
      solid: "",
      dashed: "",
      dotted: "",
    },
    size: {
      thin: "",
      medium: "",
      thick: "",
    },
    color: {
      default: "bg-border",
      muted: "bg-border-muted",
      strong: "bg-border-strong",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid",
    size: "thin",
    color: "default",
  },
});

export interface SeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof separatorVariants> {
  label?: ReactNode;
}

function Separator({
  className,
  orientation,
  variant,
  size,
  color,
  label,
  ...props
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  if (label && isHorizontal) {
    return (
      <div
        className={cn("flex items-center gap-3", className)}
        role="separator"
        {...props}
      >
        <div
          className={cn(
            "h-px flex-1",
            color === "muted"
              ? "bg-border-muted"
              : color === "strong"
                ? "bg-border-strong"
                : "bg-border",
            variant === "dashed" && "border-b border-dashed bg-transparent",
            variant === "dotted" && "border-b border-dotted bg-transparent",
            variant !== "dashed" &&
              variant !== "dotted" &&
              size === "thick" && "border-b-[4px] border-solid border-transparent bg-border",
            variant !== "dashed" &&
              variant !== "dotted" &&
              size === "medium" && "border-b-[2px] border-solid border-transparent bg-border",
          )}
          aria-hidden="true"
        />
        <span className="text-xs font-medium text-neutral-400">{label}</span>
        <div
          className={cn(
            "h-px flex-1",
            color === "muted"
              ? "bg-border-muted"
              : color === "strong"
                ? "bg-border-strong"
                : "bg-border",
            variant === "dashed" && "border-b border-dashed bg-transparent",
            variant === "dotted" && "border-b border-dotted bg-transparent",
            variant !== "dashed" &&
              variant !== "dotted" &&
              size === "thick" && "border-b-[4px] border-solid border-transparent bg-border",
            variant !== "dashed" &&
              variant !== "dotted" &&
              size === "medium" && "border-b-[2px] border-solid border-transparent bg-border",
          )}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        separatorVariants({ orientation, color, className }),
        variant === "dashed" &&
          isHorizontal &&
          "border-b border-dashed border-border bg-transparent",
        variant === "dashed" &&
          !isHorizontal &&
          "border-l border-dashed border-border bg-transparent",
        variant === "dotted" &&
          isHorizontal &&
          "border-b border-dotted border-border bg-transparent",
        variant === "dotted" &&
          !isHorizontal &&
          "border-l border-dotted border-border bg-transparent",
        variant === "solid" &&
          isHorizontal &&
          size === "thick" &&
          "border-b-[4px] border-t-0 border-solid border-border bg-transparent",
        variant === "solid" &&
          isHorizontal &&
          size === "medium" &&
          "border-b-[2px] border-t-0 border-solid border-border bg-transparent",
        variant === "solid" &&
          !isHorizontal &&
          size === "thick" &&
          "border-l-[4px] border-r-0 border-solid border-border bg-transparent",
        variant === "solid" &&
          !isHorizontal &&
          size === "medium" &&
          "border-l-[2px] border-r-0 border-solid border-border bg-transparent",
      )}
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      {...props}
    />
  );
}

export { Separator, separatorVariants };
