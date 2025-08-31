import { ToastProps } from "@/components/ui/Toast";
import { useCallback, useState } from "react";

export interface Toast extends Omit<ToastProps, "onClose"> {
  id: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ type: "success", message, title, duration });
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ type: "error", message, title, duration });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ type: "warning", message, title, duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      return addToast({ type: "info", message, title, duration });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
