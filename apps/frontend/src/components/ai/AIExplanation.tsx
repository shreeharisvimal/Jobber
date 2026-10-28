import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type ExplanationVariant = "default" | "compact" | "detailed";

const variantStyles: Record<ExplanationVariant, string> = {
  default: "rounded-lg border border-brand-100 bg-brand-50/40",
  compact: "rounded-md bg-brand-50/30",
  detailed: "rounded-xl border border-brand-100 bg-brand-50/50",
};

const contentPadding: Record<ExplanationVariant, string> = {
  default: "px-4 py-3",
  compact: "px-3 py-2",
  detailed: "px-5 py-4",
};

export interface AIExplanationProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  children: ReactNode;
  variant?: ExplanationVariant;
  defaultExpanded?: boolean;
}

function AIExplanation({
  className,
  title,
  children,
  variant = "default",
  defaultExpanded = false,
  ...props
}: AIExplanationProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-2.5 text-left transition-colors duration-normal",
          contentPadding[variant],
          "hover:bg-brand-100/30 rounded-[inherit]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset",
        )}
        aria-expanded={expanded}
      >
        <Lightbulb className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
        <span className="flex-1 text-sm font-medium text-brand-800">{title}</span>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-brand-400 transition-transform duration-normal",
            expanded && "rotate-90",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        role="region"
        className={cn(
          "overflow-hidden transition-all duration-slow",
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className={cn("text-sm text-brand-700 leading-relaxed", "border-t border-brand-100 mt-1")}>
          <div className={contentPadding[variant]}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AIExplanation };
