import React from "react";
import { Field, FieldProps } from "formik";
import { Select } from "@/components/base/select/select";

interface SelectOption {
  readonly id: string;
  readonly label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder: string;
  options: readonly SelectOption[] | ReadonlyArray<SelectOption>;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  required = false,
}) => {
  return (
    <div>
      <Field name={name}>
        {({ field, meta, form }: FieldProps) => (
          <>
            <Select
              label={label}
              placeholder={placeholder}
              size="md"
              isRequired={required}
              selectedKey={field.value}
              onSelectionChange={(key) => form.setFieldValue(name, key)}
              isInvalid={!!(meta.error && meta.touched)}
            >
              {options.map((option) => (
                <Select.Item key={option.id} id={option.label}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>
            {meta.error && meta.touched && (
              <p className="text-error-500 text-sm mt-1">
                {String(meta.error)}
              </p>
            )}
          </>
        )}
      </Field>
    </div>
  );
};
