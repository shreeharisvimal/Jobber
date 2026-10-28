import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-shimmer rounded-md", {
  variants: {
    variant: {
      text: "h-4 w-full",
      circular: "rounded-full",
      rectangular: "rounded-md",
      rounded: "rounded-xl",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, className }))}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

function SkeletonLines({
  lines = 3,
  className,
  lastLineWidth = "60%",
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? "" : ""}
          style={{ width: i === lines - 1 ? lastLineWidth : "100%" }}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonLines, skeletonVariants };
