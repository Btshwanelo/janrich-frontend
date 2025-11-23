import React from "react";
import { Field, FieldProps, ErrorMessage } from "formik";
import { Label } from "@/components/base/input/label";

interface CommunicationOption {
  readonly id: string;
  readonly label: string;
}

interface CommunicationPreferenceFieldProps {
  name: string;
  label: string;
  options: readonly CommunicationOption[] | ReadonlyArray<CommunicationOption>;
  required?: boolean;
}

export const CommunicationPreferenceField: React.FC<
  CommunicationPreferenceFieldProps
> = ({ name, label, options, required = false }) => {
  return (
    <div>
      <Field name={name}>
        {({ field, meta, form }: FieldProps) => (
          <>
            <Label className="text-sm font-medium text-[#414651] mb-3 block">
              {label} {required && <span className="text-error-500">*</span>}
            </Label>
            <div className="space-y-3">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`border-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                    field.value === option.id
                      ? "border-primary-500"
                      : meta.error && meta.touched
                      ? "border-error-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => form.setFieldValue(name, option.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        field.value === option.id
                          ? "border-primary-500 bg-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      {field.value === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#414651]">
                      {option.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <ErrorMessage
              name={name}
              component="p"
              className="text-error-500 text-sm mt-1"
            />
          </>
        )}
      </Field>
    </div>
  );
};

