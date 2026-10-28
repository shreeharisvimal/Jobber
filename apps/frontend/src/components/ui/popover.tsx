import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Positioning                                                        */
/* ------------------------------------------------------------------ */

const sidePositionMap: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
  right: "left-full top-1/2 -translate-y-1/2 ml-3",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
  left: "right-full top-1/2 -translate-y-1/2 mr-3",
};

const alignPositionMap: Record<string, string> = {
  start: "",
  center: "",
  end: "",
};

const arrowSideMap: Record<string, string> = {
  top: "left-1/2 -translate-x-1/2 top-full border-t-border border-x-transparent border-b-transparent",
  right: "top-1/2 -translate-y-1/2 right-full border-r-border border-y-transparent border-l-transparent",
  bottom: "left-1/2 -translate-x-1/2 bottom-full border-b-border border-x-transparent border-t-transparent",
  left: "top-1/2 -translate-y-1/2 left-full border-l-border border-y-transparent border-r-transparent",
};

/* ------------------------------------------------------------------ */
/*  Popover                                                            */
/* ------------------------------------------------------------------ */

function Popover({
  trigger,
  content,
  side = "bottom",
  align = "center",
  open: controlledOpen,
  onOpenChange,
  className,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(!controlledOpen);
    } else {
      setInternalOpen((prev) => {
        const next = !prev;
        onOpenChange?.(next);
        return next;
      });
    }
  }, [isControlled, controlledOpen, onOpenChange]);

  const close = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
      onOpenChange?.(false);
    }
  }, [isControlled, onOpenChange]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          className={cn(
            "absolute z-popover min-w-[200px] rounded-lg border bg-surface p-4 shadow-md animate-fade-in-scale",
            sidePositionMap[side],
            align === "start" && alignPositionMap.start,
            align === "end" && alignPositionMap.end,
            className,
          )}
        >
          {content}

          {/* Arrow */}
          <span
            className={cn(
              "absolute size-0 border-[5px]",
              arrowSideMap[side],
            )}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

export { Popover };
