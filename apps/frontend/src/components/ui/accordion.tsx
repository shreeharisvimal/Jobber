import { useState, useCallback, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AccordionItemData {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  defaultValue?: string[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Accordion                                                          */
/* ------------------------------------------------------------------ */

function Accordion({
  items,
  type = "single",
  defaultValue = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    () => new Set(defaultValue),
  );

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (type === "single") {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [type],
  );

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const contentId = `accordion-content-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;

        return (
          <div key={item.id}>
            <button
              id={triggerId}
              type="button"
              onClick={() => !item.disabled && toggle(item.id)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={contentId}
              className={cn(
                "flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors",
                "hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500",
                item.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <span className="text-foreground">{item.title}</span>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn(
                "overflow-hidden text-sm text-muted-foreground transition-all duration-200",
                isOpen ? "pb-4" : "h-0 pb-0",
              )}
            >
              <div className="animate-fade-in">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Accordion };
