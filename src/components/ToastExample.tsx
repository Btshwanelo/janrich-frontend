"use client";

import React from "react";
import { Button } from "@/components/base/buttons/button";
import { useSuccessToast, useErrorToast, useWarningToast, useInfoToast } from "@/components/base/toast";

export const ToastExample: React.FC = () => {
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const showWarningToast = useWarningToast();
  const showInfoToast = useInfoToast();

  const handleSuccess = () => {
    showSuccessToast(
      "Success!",
      "Your action was completed successfully.",
      {
        action: {
          label: "View Details",
          onClick: () => console.log("View details clicked"),
        },
      }
    );
  };

  const handleError = () => {
    showErrorToast(
      "Error occurred",
      "Something went wrong. Please try again.",
      {
        duration: 0, // Don't auto-dismiss
      }
    );
  };

  const handleWarning = () => {
    showWarningToast(
      "Warning",
      "Please review your information before proceeding.",
    );
  };

  const handleInfo = () => {
    showInfoToast(
      "Information",
      "Here's some helpful information for you.",
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Toast Examples</h2>
      <div className="flex space-x-4">
        <Button color="primary" onClick={handleSuccess}>
          Show Success Toast
        </Button>
        <Button color="secondary" onClick={handleError}>
          Show Error Toast
        </Button>
        <Button color="tertiary" onClick={handleWarning}>
          Show Warning Toast
        </Button>
        <Button color="primary" onClick={handleInfo}>
          Show Info Toast
        </Button>
      </div>
    </div>
  );
};
