"use client";

import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastColors = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-500",
    title: "text-green-800",
    message: "text-green-700",
    button: "text-green-500 hover:text-green-600",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    title: "text-red-800",
    message: "text-red-700",
    button: "text-red-500 hover:text-red-600",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-500",
    title: "text-yellow-800",
    message: "text-yellow-700",
    button: "text-yellow-500 hover:text-yellow-600",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-800",
    message: "text-blue-700",
    button: "text-blue-500 hover:text-blue-600",
  },
};

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = toastIcons[type];
  const colors = toastColors[type];

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match transition duration
  }, [onClose, id]);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss after duration
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, handleClose]);

  return (
    <div
      className={`
        fixed z-50 mx-4 pointer-events-auto
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-0 sm:translate-x-full"
        }
        
        // Mobile: bottom of screen
        bottom-4 left-0 right-0
        // Desktop: bottom right corner  
        sm:bottom-4 sm:right-4 sm:left-auto sm:w-96
      `}
    >
      <div
        className={`
          ${colors.bg} ${colors.border}
          border rounded-lg shadow-lg p-4
          flex items-start space-x-3
        `}
      >
        {/* Icon */}
        <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-medium ${colors.title} mb-1`}>{title}</h4>
          )}
          <p className={`text-sm ${colors.message} break-words`}>{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`
            ${colors.button}
            hover:bg-white hover:bg-opacity-50
            rounded-full p-1 transition-colors duration-200
            flex-shrink-0
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
