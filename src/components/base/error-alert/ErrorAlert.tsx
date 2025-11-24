"use client";

import React from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removePageError, clearAllPageErrors } from "@/lib/slices/errorSlice";

interface ErrorAlertProps {
  /**
   * Optional error message to display directly (for backward compatibility)
   * If provided, this takes precedence over error slice
   */
  message?: string;
  /**
   * Whether to show a dismiss button
   * @default true
   */
  dismissible?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Whether to automatically clear errors when component unmounts
   * @default false
   */
  autoClearOnUnmount?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  dismissible = true,
  className = "",
  autoClearOnUnmount = false,
}) => {
  const dispatch = useAppDispatch();
  const pageErrors = useAppSelector((state) => state.error.pageErrors);

  // Use provided message or get from error slice
  const errorsToDisplay = message
    ? [{ message, id: "direct-message" }]
    : pageErrors;

  // Auto-clear on unmount if enabled
  React.useEffect(() => {
    if (autoClearOnUnmount) {
      return () => {
        dispatch(clearAllPageErrors());
      };
    }
  }, [autoClearOnUnmount, dispatch]);

  if (errorsToDisplay.length === 0) {
    return null;
  }

  const handleDismiss = (errorId: string) => {
    if (message) {
      // If using direct message, we can't remove it from slice
      return;
    }
    dispatch(removePageError(errorId));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {errorsToDisplay.map((error) => (
        <div
          key={error.id}
          className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-start justify-between gap-3"
        >
          <p className="text-error-600 text-sm flex-1">{error.message}</p>
          {dismissible && (
            <button
              type="button"
              onClick={() => handleDismiss(error.id)}
              className="text-error-400 hover:text-error-600 focus:outline-none transition-colors flex-shrink-0"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};


