import { useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToastStore, type Toast } from "@/stores/toast.store";

const variantConfig: Record<
  Toast["variant"],
  { icon: typeof Info; styles: string; iconStyle: string }
> = {
  info: {
    icon: Info,
    styles: "border-brand-200 bg-white",
    iconStyle: "text-brand-500",
  },
  success: {
    icon: CheckCircle2,
    styles: "border-success-200 bg-white",
    iconStyle: "text-success-500",
  },
  warning: {
    icon: AlertTriangle,
    styles: "border-warning-200 bg-white",
    iconStyle: "text-warning-500",
  },
  danger: {
    icon: AlertCircle,
    styles: "border-danger-200 bg-white",
    iconStyle: "text-danger-500",
  },
};

function ToastItem({ toast: t }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const config = variantConfig[t.variant];
  const Icon = config.icon;
  const duration = t.duration ?? 5000;

  const dismiss = useCallback(() => {
    removeToast(t.id);
    t.onDismiss?.();
  }, [removeToast, t]);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "animate-slide-in-bottom pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
        config.styles,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className={cn("mt-0.5 shrink-0", config.iconStyle)} aria-hidden="true">
          <Icon className="size-4" />
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900">{t.title}</p>
          {t.description && (
            <p className="mt-1 text-xs text-neutral-500">{t.description}</p>
          )}
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action?.onClick();
                dismiss();
              }}
              className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              {t.action.label}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-(--z-toast) flex flex-col-reverse gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

export { ToastContainer };
