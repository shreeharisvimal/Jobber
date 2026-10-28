import {
  useCallback,
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SegmentedOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

type SegmentedSize = "sm" | "md" | "lg";

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: SegmentedSize;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sizing helpers                                                     */
/* ------------------------------------------------------------------ */

const sizeClasses: Record<SegmentedSize, { wrapper: string; item: string; icon: string }> = {
  sm: {
    wrapper: "h-8 text-xs",
    item: "h-6 px-2.5",
    icon: "[&>svg]:size-3",
  },
  md: {
    wrapper: "h-9 text-sm",
    item: "h-7 px-3",
    icon: "[&>svg]:size-3.5",
  },
  lg: {
    wrapper: "h-10 text-sm",
    item: "h-8 px-4",
    icon: "[&>svg]:size-4",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
  className,
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  const sizing = sizeClasses[size];
  const activeIndex = options.findIndex((o) => o.value === value);

  /* Measure the active button and slide the indicator */
  useEffect(() => {
    const activeButton = itemRefs.current.get(value);
    const container = containerRef.current;
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [value]);

  const focusOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) {
        onChange(option.value);
        itemRefs.current.get(option.value)?.focus();
      }
    },
    [options, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const count = options.length;
      if (count === 0) return;

      let nextIndex = activeIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown": {
          e.preventDefault();
          nextIndex = (activeIndex + 1) % count;
          break;
        }
        case "ArrowLeft":
        case "ArrowUp": {
          e.preventDefault();
          nextIndex = (activeIndex - 1 + count) % count;
          break;
        }
        case "Home": {
          e.preventDefault();
          nextIndex = 0;
          break;
        }
        case "End": {
          e.preventDefault();
          nextIndex = count - 1;
          break;
        }
        default:
          return;
      }

      focusOption(nextIndex);
    },
    [activeIndex, options, focusOption],
  );

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex items-center rounded-lg border border-border bg-muted/40 p-1",
        sizing.wrapper,
        className,
      )}
    >
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 z-0 rounded-md bg-background shadow-sm transition-all duration-200 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(option.value, el);
              } else {
                itemRefs.current.delete(option.value);
              }
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium transition-colors duration-150",
              sizing.item,
              sizing.icon,
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
            )}
          >
            {option.icon && (
              <span className="shrink-0" aria-hidden="true">
                {option.icon}
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
export type { SegmentedControlProps, SegmentedOption };
