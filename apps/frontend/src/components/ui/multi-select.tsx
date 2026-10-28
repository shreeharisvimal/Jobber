import { useState, useRef, useEffect, useCallback } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDisplay?: number;
  className?: string;
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled,
  maxDisplay = 3,
  className,
}: MultiSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const selected = value ?? internalValue;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const updateValue = useCallback(
    (newValues: string[]) => {
      if (value === undefined) {
        setInternalValue(newValues);
      }
      onChange?.(newValues);
    },
    [value, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValues = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];
    updateValue(newValues);
  };

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateValue(selected.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));
  const displayTags = selectedOptions.slice(0, maxDisplay);
  const remainingCount = selectedOptions.length - maxDisplay;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
        className={cn(
          "flex min-h-9 w-full items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-left text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-brand-500 ring-offset-2",
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {displayTags.length > 0 ? (
            displayTags.map((opt) => (
              <span
                key={opt.value}
                className={cn(
                  "inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700",
                )}
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => removeValue(opt.value, e)}
                  className="rounded hover:bg-neutral-200"
                  aria-label={`Remove ${opt.label}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-neutral-400">{placeholder}</span>
          )}
          {remainingCount > 0 && (
            <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
              and {remainingCount} more
            </span>
          )}
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-neutral-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className={cn(
            "absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm",
            "max-h-60 overflow-y-auto",
          )}
        >
          <div className="p-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={cn(
                "h-8 w-full rounded border-0 bg-transparent px-2 text-sm text-neutral-900 placeholder:text-neutral-400",
                "focus:outline-none",
              )}
            />
          </div>
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-neutral-500">No results found.</div>
          ) : (
            filtered.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm transition-colors",
                    isSelected ? "bg-brand-50 text-brand-700" : "text-neutral-900 hover:bg-neutral-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-neutral-300 bg-white",
                    )}
                  >
                    {isSelected && (
                      <svg className="size-3" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 truncate">{option.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export { MultiSelect };
