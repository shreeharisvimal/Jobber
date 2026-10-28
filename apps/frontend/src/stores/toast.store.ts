import { create } from "zustand";

export interface Toast {
  id: string;
  variant: "info" | "success" | "warning" | "danger";
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
  onDismiss?: () => void;
}

export interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

let counter = 0;

function generateId(): string {
  counter += 1;
  return `toast-${counter}-${Date.now()}`;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

export const toast = {
  info(title: string, opts?: Omit<Toast, "id" | "title" | "variant">): string {
    return useToastStore.getState().addToast({ ...opts, title, variant: "info" });
  },
  success(title: string, opts?: Omit<Toast, "id" | "title" | "variant">): string {
    return useToastStore.getState().addToast({ ...opts, title, variant: "success" });
  },
  warning(title: string, opts?: Omit<Toast, "id" | "title" | "variant">): string {
    return useToastStore.getState().addToast({ ...opts, title, variant: "warning" });
  },
  error(title: string, opts?: Omit<Toast, "id" | "title" | "variant">): string {
    return useToastStore.getState().addToast({ ...opts, title, variant: "danger" });
  },
  dismiss(id: string): void {
    useToastStore.getState().removeToast(id);
  },
};

export function useToast() {
  return { toast, ...useToastStore() };
}
