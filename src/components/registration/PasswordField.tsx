import React, { useState, Ref } from "react";
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
        {({ field, meta, form }: FieldProps) => (
          <div className="relative">
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${
                meta.error
                  ? "right-3 top-[33%] -translate-y-1/2"
                  : "right-3 top-1/2 -translate-y-1/2"
              } text-gray-400 hover:text-gray-600 focus:outline-none`}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </Field>
    </div>
  );
};

