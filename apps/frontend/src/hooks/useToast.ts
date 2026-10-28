import { useCallback } from "react";
import { useToastStore, type Toast } from "@/stores/toast.store";

interface ToastOptions {
  description?: string;
  duration?: number;
}

type ToastFn = (
  title: string,
  options?: ToastOptions,
) => void;

export function useToast(): {
  info: ToastFn;
  success: ToastFn;
  warning: ToastFn;
  error: ToastFn;
  dismiss: (id: string) => void;
  clearAll: () => void;
  toasts: Toast[];
} {
  const addToast = useToastStore((s) => s.addToast);
  const removeToast = useToastStore((s) => s.removeToast);
  const clearAll = useToastStore((s) => s.clearAll);
  const toasts = useToastStore((s) => s.toasts);

  const info: ToastFn = useCallback(
    (title, options) => {
      addToast({ title, variant: "info", ...options });
    },
    [addToast],
  );

  const success: ToastFn = useCallback(
    (title, options) => {
      addToast({ title, variant: "success", ...options });
    },
    [addToast],
  );

  const warning: ToastFn = useCallback(
    (title, options) => {
      addToast({ title, variant: "warning", ...options });
    },
    [addToast],
  );

  const error: ToastFn = useCallback(
    (title, options) => {
      addToast({ title, variant: "danger", ...options });
    },
    [addToast],
  );

  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast],
  );

  return { info, success, warning, error, dismiss, clearAll, toasts };
}
