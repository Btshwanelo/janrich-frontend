import React, { useState, Ref, useRef, useEffect, useCallback } from "react";
import { Field, FieldProps } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent) => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  placeholder,
  required = false,
  inputRef,
  onKeyDown,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      <Field name={name}>
        {({ field, meta, form }: FieldProps) => {
          const containerRef = useRef<HTMLDivElement>(null);
          const inputGroupRef = useRef<HTMLDivElement>(null);
          const buttonRef = useRef<HTMLButtonElement>(null);

          const updateButtonPosition = useCallback(() => {
            if (inputGroupRef.current && buttonRef.current && containerRef.current) {
              const groupRect = inputGroupRef.current.getBoundingClientRect();
              const containerRect = containerRef.current.getBoundingClientRect();
              const relativeTop = groupRect.top - containerRect.top;
              const groupHeight = groupRect.height;
              buttonRef.current.style.top = `${relativeTop + groupHeight / 2}px`;
            }
          }, []);

          useEffect(() => {
            updateButtonPosition();
            // Recalculate after a short delay to ensure DOM is updated
            const timeout = setTimeout(updateButtonPosition, 10);
            return () => clearTimeout(timeout);
          }, [meta.error, meta.touched, updateButtonPosition]);

          return (
            <div ref={containerRef} className="relative">
              <Input
                ref={inputRef}
                id={name}
                name={field.name}
                value={field.value}
                onChange={(value: string) => {
                  form.setFieldValue(name, value);
                }}
                onBlur={(e) => {
                  field.onBlur(e);
                  onBlur?.(e);
                }}
                onFocus={onFocus}
                type={showPassword ? "text" : "password"}
                size="md"
                placeholder={placeholder}
                isInvalid={!!(meta.error && meta.touched)}
                hint={meta.error && meta.touched ? meta.error : undefined}
                inputClassName="pr-10"
                onKeyDown={onKeyDown}
                groupRef={(groupEl) => {
                  if (groupEl) {
                    inputGroupRef.current = groupEl as HTMLDivElement;
                    updateButtonPosition();
                  }
                }}
              />
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 hover:text-gray-600 focus:outline-none transition-[right] duration-200 ease-in-out z-10"
                style={{
                  transform: "translateY(-50%)",
                  right: meta.error && meta.touched ? "0.75rem" : "0.75rem", // right-10 (40px) when error, right-3 (12px) when no error
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        }}
      </Field>
    </div>
  );
};

