import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerSide = "left" | "right" | "top" | "bottom";

const sideStyles: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0 h-full w-full max-w-md animate-slide-in-left border-r",
  right: "inset-y-0 right-0 h-full w-full max-w-md animate-slide-in-right border-l",
  top: "inset-x-0 top-0 w-full max-h-[80vh] animate-slide-in-top border-b",
  bottom: "inset-x-0 bottom-0 w-full max-h-[80vh] animate-slide-in-bottom border-t",
};

const sizeStyles: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    previousActiveElement.current = document.activeElement;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-(--z-modal)">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby={description ? "drawer-description" : undefined}
        className={cn(
          "relative z-10 flex flex-col bg-surface shadow-xl",
          sideStyles[side],
          sizeStyles[size],
          className,
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b px-6 py-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h2 className="text-base font-semibold text-fg">{title}</h2>
              )}
              {description && (
                <p
                  id="drawer-description"
                  className="mt-1 text-sm text-fg-secondary"
                >
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={close}
              className="ml-4 shrink-0 rounded-md p-1.5 text-fg-muted transition-colors hover:text-fg hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export { Drawer };
