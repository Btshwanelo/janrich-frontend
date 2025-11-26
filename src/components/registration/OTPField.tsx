import React from "react";
import { Field, FieldProps } from "formik";
import { Label } from "@/components/base/input/label";
import { PinInput } from "@/components/base/pin-input/pin-input";

interface OTPFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
}

export const OTPField: React.FC<OTPFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  touched,
}) => {
  return (
    <div>
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 mb-2 block"
      >
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="flex justify-center max-w-full">
        <Field name={name}>
          {({ form }: FieldProps) => (
            <PinInput size="sm" className="max-w-[300px] sm:max-w-full">
              <PinInput.Group
                value={value}
                onChange={(newValue: string) => {
                  onChange(newValue);
                  form.setFieldValue(name, newValue);
                }}
                maxLength={6}
                containerClassName="gap-2 justify-center"
              >
                <PinInput.Slot
                  index={0}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={1}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={2}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Separator
                  className="!text-[#D5D7DA] !ring-[#D5D7DA] text-[38px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={3}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={4}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={5}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
              </PinInput.Group>
            </PinInput>
          )}
        </Field>
      </div>
      {error && touched && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};




