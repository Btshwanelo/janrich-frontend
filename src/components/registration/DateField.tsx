import React from "react";
import { Field, FieldProps } from "formik";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Label } from "@/components/base/input/label";

interface DateFieldProps {
  name: string;
  label: string;
  required?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  required = false,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 block">
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      <Field name={name}>
        {({ field, meta, form }: FieldProps) => (
          <>
            <DatePicker
              value={field.value}
              onChange={(date) => form.setFieldValue(name, date)}
              onApply={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              className={
                "py-[0.4rem] w-full focus:outline-none focus:ring-2 focus:ring-primary-500 " +
                (meta.error && meta.touched
                  ? "border-error-500"
                  : "border-gray-300")
              }
            />
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

