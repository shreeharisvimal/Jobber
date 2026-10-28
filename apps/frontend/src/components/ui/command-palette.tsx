import { useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Command {
  id: string;
  label: string;
  icon?: ReactNode;
  group?: string;
  shortcut?: string;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  commands: Command[];
  onSelect?: (command: Command) => void;
}

function CommandPalette({
  open,
  onOpenChange,
  placeholder = "Search commands...",
  commands,
  onSelect,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const lower = query.toLowerCase();
    return commands.filter((cmd) => cmd.label.toLowerCase().includes(lower));
  }, [commands, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const cmd of filtered) {
      const group = cmd.group ?? "";
      const arr = map.get(group) ?? [];
      arr.push(cmd);
      map.set(group, arr);
    }
    return map;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
      return;
    }

    previousActiveElement.current = document.activeElement;
    const timer = setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      clearTimeout(timer);
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % flatList.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + flatList.length) % flatList.length);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = flatList[selectedIndex];
        if (cmd) {
          onSelect?.(cmd);
          close();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close, flatList, selectedIndex, onSelect]);

  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  let globalIndex = -1;

  return createPortal(
    <div className="fixed inset-0 z-(--z-modal) flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg animate-fade-in-scale overflow-hidden rounded-xl border bg-surface shadow-xl"
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 shrink-0 text-fg-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="h-12 w-full bg-transparent text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none"
          />
        </div>

        <div
          ref={listRef}
          className="max-h-72 overflow-y-auto p-1.5 scrollbar-thin"
          role="listbox"
        >
          {flatList.length === 0 && (
            <div className="py-8 text-center text-sm text-fg-muted">
              No results found.
            </div>
          )}

          {Array.from(grouped.entries()).map(([group, cmds]) => (
            <div key={group || "__ungrouped__"}>
              {group && (
                <div className="px-2 py-1.5 text-xs font-medium text-fg-muted">
                  {group}
                </div>
              )}
              {cmds.map((cmd) => {
                globalIndex += 1;
                const idx = globalIndex;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={idx}
                    onClick={() => {
                      onSelect?.(cmd);
                      close();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-neutral-100 text-fg"
                        : "text-fg-secondary hover:bg-neutral-50",
                    )}
                  >
                    {cmd.icon && (
                      <span className="size-4 shrink-0 text-fg-muted" aria-hidden="true">
                        {cmd.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="ml-auto shrink-0 rounded border bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-fg-muted">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { CommandPalette };
