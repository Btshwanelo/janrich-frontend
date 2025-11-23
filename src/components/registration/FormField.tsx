import React, { Ref } from "react";
import { Field, FieldProps } from "formik";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  inputRef,
  onKeyDown,
}) => {
  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      <Field name={name}>
        {({ field, meta, form }: FieldProps) => (
          <Input
            ref={inputRef}
            id={name}
            name={field.name}
            value={field.value}
            onChange={(value: string) => {
              form.setFieldValue(name, value);
            }}
            onBlur={field.onBlur}
            type={type}
            size="md"
            placeholder={placeholder}
            isInvalid={!!(meta.error && meta.touched)}
            hint={meta.error && meta.touched ? meta.error : undefined}
            onKeyDown={onKeyDown}
          />
        )}
      </Field>
    </div>
  );
};

