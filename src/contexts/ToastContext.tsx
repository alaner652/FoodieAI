"use client";

import ToastContainer from "@/components/ui/ToastContainer";
import { useToast } from "@/hooks/useToast";
import { createContext, ReactNode, useContext } from "react";

interface ToastContextType {
  showSuccess: (message: string, title?: string, duration?: number) => string;
  showError: (message: string, title?: string, duration?: number) => string;
  showWarning: (message: string, title?: string, duration?: number) => string;
  showInfo: (message: string, title?: string, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider
      value={{
        showSuccess: toast.showSuccess,
        showError: toast.showError,
        showWarning: toast.showWarning,
        showInfo: toast.showInfo,
        removeToast: toast.removeToast,
        clearAllToasts: toast.clearAllToasts,
      }}
    >
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
