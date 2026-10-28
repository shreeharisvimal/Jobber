import {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Positioning utility                                                */
/* ------------------------------------------------------------------ */

const positionMap: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
};

const arrowMap: Record<string, string> = {
  top: "left-1/2 -translate-x-1/2 top-full border-t-neutral-900 border-x-transparent border-b-transparent",
  right: "top-1/2 -translate-y-1/2 right-full border-r-neutral-900 border-y-transparent border-l-transparent",
  bottom: "left-1/2 -translate-x-1/2 bottom-full border-b-neutral-900 border-x-transparent border-t-transparent",
  left: "top-1/2 -translate-y-1/2 left-full border-l-neutral-900 border-y-transparent border-r-transparent",
};

/* ------------------------------------------------------------------ */
/*  Tooltip                                                            */
/* ------------------------------------------------------------------ */

function Tooltip({
  content,
  children,
  side = "top",
  delay = 300,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <div aria-describedby={visible ? tooltipId : undefined}>{children}</div>

      <div
        id={tooltipId}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-tooltip whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md transition-opacity transition-visibility",
          positionMap[side],
          visible
            ? "opacity-100 visible"
            : "opacity-0 invisible",
        )}
      >
        {content}

        {/* Arrow */}
        <span
          className={cn(
            "absolute size-0 border-4",
            arrowMap[side],
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export { Tooltip };
