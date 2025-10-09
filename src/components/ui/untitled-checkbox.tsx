"use client";

import { Checkbox as AriaCheckbox } from "react-aria-components";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps extends ComponentProps<typeof AriaCheckbox> {
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function Checkbox({ 
  size = "md", 
  className, 
  children,
  ...props 
}: CheckboxProps) {
  return (
    <AriaCheckbox
      className={cn(
        "inline-flex items-center justify-center rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          // Sizes
          "h-4 w-4": size === "sm",
          "h-5 w-5": size === "md",
          "h-6 w-6": size === "lg",
        },
        "border-border-inactive bg-white text-white hover:border-primary-500 focus:ring-primary-500 data-[selected]:bg-primary-600 data-[selected]:border-primary-600",
        className
      )}
      {...props}
    >
      {({ isSelected }) => (
        <>
          {isSelected && <Check className="h-3 w-3" />}
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}

