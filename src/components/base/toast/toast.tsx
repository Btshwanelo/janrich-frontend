"use client";

import React, { useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ToastProvider is now a no-op wrapper for backward compatibility
// The actual toast rendering is handled by <Toaster /> in layout.tsx
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

// Helper function to get icon for toast type
const getToastIcon = (type: Toast["type"]) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "success":
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case "error":
      return <AlertCircle className={`${iconClass} text-red-500`} />;
    case "warning":
      return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
    case "info":
      return <Info className={`${iconClass} text-blue-500`} />;
    default:
      return <CheckCircle className={`${iconClass} text-green-500`} />;
  }
};

// Helper function to map toast type to Sonner's toast function
const showSonnerToast = (
  type: Toast["type"],
  title: string,
  description?: string,
  options?: Partial<Toast>
) => {
  const icon = getToastIcon(type);
  const duration = options?.duration ?? 5000;

  // Map toast type to Sonner's toast variant
  const toastOptions: Parameters<typeof sonnerToast>[1] = {
    description: description,
    duration: duration > 0 ? duration : Infinity, // Sonner uses Infinity for persistent toasts
    icon: icon,
    className: "my-classname",
    ...(options?.action && {
      action: {
        label: options.action.label,
        onClick: options.action.onClick,
      },
    }),
  };

  switch (type) {
    case "success":
      return sonnerToast.success(title, toastOptions);
    case "error":
      return sonnerToast.error(title, toastOptions);
    case "warning":
      return sonnerToast.warning(title, toastOptions);
    case "info":
      return sonnerToast.info(title, toastOptions);
    default:
      return sonnerToast(title, toastOptions);
  }
};

// Legacy useToast hook for backward compatibility (if needed)
export const useToast = () => {
  return {
    toasts: [],
    addToast: (toast: Omit<Toast, "id">) => {
      showSonnerToast(toast.type, toast.title, toast.description, toast);
    },
    removeToast: () => {
      // Sonner handles this automatically
    },
    clearAllToasts: () => {
      sonnerToast.dismiss();
    },
  };
};

// Convenience hook for success toasts
export const useSuccessToast = () => {
  return useCallback(
    (title: string, description?: string, options?: Partial<Toast>) => {
      showSonnerToast("success", title, description, options);
    },
    []
  );
};

// Convenience hook for error toasts
export const useErrorToast = () => {
  return useCallback(
    (title: string, description?: string, options?: Partial<Toast>) => {
      showSonnerToast("error", title, description, options);
    },
    []
  );
};

// Convenience hook for warning toasts
export const useWarningToast = () => {
  return useCallback(
    (title: string, description?: string, options?: Partial<Toast>) => {
      showSonnerToast("warning", title, description, options);
    },
    []
  );
};

// Convenience hook for info toasts
export const useInfoToast = () => {
  return useCallback(
    (title: string, description?: string, options?: Partial<Toast>) => {
      showSonnerToast("info", title, description, options);
    },
    []
  );
};
