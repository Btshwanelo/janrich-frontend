"use client";

import { Button as AriaButton } from "react-aria-components";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ComponentProps<typeof AriaButton> {
    variant?: "primary" | "secondary" | "tertiary" | "destructive";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export function Button({ 
    variant = "primary", 
    size = "md", 
    className, 
    children, 
    ...props 
}: ButtonProps) {
    return (
        <AriaButton
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                {
                    // Variants
                    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500": variant === "primary",
                    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500": variant === "secondary",
                    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500": variant === "tertiary",
                    "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500": variant === "destructive",
                    
                    // Sizes
                    "px-3 py-1.5 text-sm": size === "sm",
                    "px-4 py-2 text-sm": size === "md",
                    "px-6 py-3 text-base": size === "lg",
                },
                className
            )}
            {...props}
        >
            {children}
        </AriaButton>
    );
}
