import { useState, useRef, useEffect, useCallback, type ReactNode, type KeyboardEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
  className?: string;
}

function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled,
  emptyMessage = "No results found.",
  className,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(undefined);
  const selected = value ?? internalValue;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOption = options.find((opt) => opt.value === selected);

  const updateValue = useCallback(
    (val: string) => {
      if (value === undefined) {
        setInternalValue(val);
      }
      onChange?.(val);
      setOpen(false);
      setSearch("");
      setActiveIndex(-1);
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

  useEffect(() => {
    if (open && activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement | undefined;
      activeEl?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (open && activeIndex >= 0 && activeIndex < filtered.length) {
          updateValue(filtered[activeIndex]!.value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSearch("");
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "combobox-listbox" : undefined}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((o) => !o);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-brand-500 ring-offset-2",
        )}
      >
        <span className={cn(selectedOption ? "text-neutral-900" : "text-neutral-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("size-4 text-neutral-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id="combobox-listbox"
          role="listbox"
          ref={listRef}
          className={cn(
            "absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm",
            "max-h-60 overflow-y-auto",
          )}
        >
          <div className="p-1">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className={cn(
                "h-8 w-full rounded border-0 bg-transparent px-2 text-sm text-neutral-900 placeholder:text-neutral-400",
                "focus:outline-none",
              )}
            />
          </div>
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-neutral-500">{emptyMessage}</div>
          ) : (
            filtered.map((option, index) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={false}
                onClick={() => updateValue(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                  "transition-colors",
                  option.value === selected
                    ? "bg-brand-50 text-brand-700"
                    : "text-neutral-900 hover:bg-neutral-50",
                  activeIndex === index && option.value !== selected && "bg-neutral-100",
                )}
              >
                {option.icon && <span className="shrink-0">{option.icon}</span>}
                <span className="flex-1 truncate">{option.label}</span>
                {option.value === selected && (
                  <Check className="size-4 shrink-0 text-brand-600" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export { Combobox };
