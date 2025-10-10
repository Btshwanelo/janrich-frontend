"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

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

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast,
    };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      case "warning":
        return "border-l-yellow-500";
      case "info":
        return "border-l-blue-500";
      default:
        return "border-l-green-500";
    }
  };

  return (
    <div
      className={cx(
        "bg-white rounded-lg shadow-lg border border-gray-200 border-l-4 p-4 min-w-80 max-w-96 transform transition-all duration-300 ease-in-out",
        getBorderColor(),
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-600">
              {toast.description}
            </p>
          )}
          
          {toast.action && (
            <div className="mt-3">
              <Button
                color="secondary"
                size="sm"
                onClick={toast.action.onClick}
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={handleRemove}
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Convenience hook for success toasts
export const useSuccessToast = () => {
  const { addToast } = useToast();
  
  return useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({
      type: "success",
      title,
      description,
      ...options,
    });
  }, [addToast]);
};

// Convenience hook for error toasts
export const useErrorToast = () => {
  const { addToast } = useToast();
  
  return useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({
      type: "error",
      title,
      description,
      ...options,
    });
  }, [addToast]);
};

// Convenience hook for warning toasts
export const useWarningToast = () => {
  const { addToast } = useToast();
  
  return useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({
      type: "warning",
      title,
      description,
      ...options,
    });
  }, [addToast]);
};

// Convenience hook for info toasts
export const useInfoToast = () => {
  const { addToast } = useToast();
  
  return useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({
      type: "info",
      title,
      description,
      ...options,
    });
  }, [addToast]);
};
