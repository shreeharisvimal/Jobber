import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-3xl",
} as const;

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
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

      if (e.key === "Tab" && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    previousActiveElement.current = document.activeElement;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
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
    <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby={description ? "modal-description" : undefined}
        className={cn(
          "relative z-10 w-full animate-fade-in-scale rounded-xl border bg-surface shadow-xl",
          sizeStyles[size],
          className,
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-0">
            {title && (
              <h2 className="text-base font-semibold text-fg">{title}</h2>
            )}
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-fg-secondary">
                {description}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 rounded-md p-1.5 text-fg-muted transition-colors hover:text-fg hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="px-6 py-5">{children}</div>

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

export { Modal };
