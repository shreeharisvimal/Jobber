import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SuggestionCardProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  description?: string;
  tags?: string[];
  onSelect?: () => void;
  selected?: boolean;
  icon?: ReactNode;
}

function SuggestionCard({
  className,
  title,
  description,
  tags,
  onSelect,
  selected = false,
  icon,
  ...props
}: SuggestionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-xl border p-3.5 transition-all duration-normal",
        "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        selected
          ? "border-brand-500 bg-brand-50/50 shadow-sm"
          : "border-border bg-card hover:border-border-strong",
        className,
      )}
      aria-pressed={selected}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span
            className={cn(
              "mt-0.5 shrink-0",
              selected ? "text-brand-600" : "text-fg-muted",
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-sm font-medium leading-snug",
              selected ? "text-brand-700" : "text-fg",
            )}
          >
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-fg-secondary leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                    selected
                      ? "bg-brand-100 text-brand-700"
                      : "bg-neutral-100 text-neutral-600",
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {selected && (
          <span className="shrink-0 mt-0.5">
            <svg className="size-4 text-brand-600" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
              <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}

export { SuggestionCard };
