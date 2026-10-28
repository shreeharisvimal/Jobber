import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  maxWidth?: string | number;
  thin?: boolean;
  horizontal?: boolean;
}

function ScrollArea({
  className,
  children,
  maxHeight,
  maxWidth,
  thin = false,
  horizontal = false,
  style,
  ...props
}: ScrollAreaProps) {
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const resolvedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <div
      className={cn(
        "overflow-auto",
        thin && "scrollbar-thin",
        className,
      )}
      style={{
        maxHeight: resolvedMaxHeight,
        maxWidth: resolvedMaxWidth,
        ...(horizontal ? { overflowX: "auto", overflowY: "hidden" } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
