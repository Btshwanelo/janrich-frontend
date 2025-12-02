"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../base/buttons/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cx } from "@/utils/cx";
import { Label } from "../base/input/label";

interface DatePickerProps {
  /** Optional id for the trigger button */
  id?: string;
  /** Currently selected date (controlled from parent, e.g. Formik field value) */
  value?: Date | null;
  /** Called when the user selects a new date */
  onChange?: (date: Date | undefined) => void;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Extra classes applied to the trigger button */
  className?: string;
  /** Optional label to render above the field when used standalone */
  label?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id = "date",
  value,
  onChange,
  placeholder = "Select date",
  className,
  label,
  required = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const displayText = value ? value.toLocaleDateString() : placeholder;

  return (
    <div>
      {label && (
        <Label className="text-sm font-medium text-gray-700 block mb-[6px]">
          {label} {required && <span className="text-error-500">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            size="lg"
            color="secondary"
            iconTrailing={
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
            }
            className={cx(
              "w-full justify-between font-normal text-[#111322]",
              className
            )}
          >
            <span>{displayText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date ?? undefined);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
