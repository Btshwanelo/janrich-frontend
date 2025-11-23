import React, { Ref } from "react";
import { Field, FieldProps, ErrorMessage } from "formik";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Label } from "@/components/base/input/label";
import { DEFAULT_COUNTRY } from "@/constants/registration";

interface PhoneFieldProps {
  name: string;
  label: string;
  placeholder: string;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  name,
  label,
  placeholder,
  inputRef,
  onKeyDown,
}) => {
  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} <span className="text-error-500">*</span>
      </Label>
      <div className="mt-1">
        <Field name={name}>
          {({ field, form }: FieldProps) => (
            <PhoneInput
              {...field}
              ref={inputRef}
              placeholder={placeholder}
              defaultCountry={DEFAULT_COUNTRY as any}
              className="phone-input"
              onChange={(value) => form.setFieldValue(name, value)}
              onKeyDown={onKeyDown}
            />
          )}
        </Field>
        <ErrorMessage
          name={name}
          component="div"
          className="text-error-500 text-xs mt-1"
        />
      </div>
    </div>
  );
};

