"use client";

import { Input as AriaInput } from "react-aria-components";
import { type ComponentProps, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentProps<typeof AriaInput> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    variant = "default", 
    size = "md", 
    className, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = variant === "error" || !!error;
    const hasSuccess = variant === "success";

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <AriaInput
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed",
              {
                // Variants
                "border-border-inactive focus:border-primary-500 focus:ring-primary-500": 
                  !hasError && !hasSuccess,
                "border-error-300 focus:border-error-500 focus:ring-error-500": 
                  hasError,
                "border-success-300 focus:border-success-500 focus:ring-success-500": 
                  hasSuccess,
                
                // Sizes
                "px-3 py-1.5 text-sm": size === "sm",
                "px-4 py-2.5 text-sm": size === "md", 
                "px-4 py-3 text-base": size === "lg",
                
                // Padding adjustments for icons
                "pl-10": leftIcon,
                "pr-10": rightIcon,
              },
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-1.5">
            {error && (
              <p className="text-sm text-error-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
