"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/untitled-button";
import { Calendar } from "@/components/application/date-picker/calendar";
import { Label } from "@/components/base/input/label";
import { Popover } from "@/components/base/select/popover";
import { formatDateDDMMYYYY } from "@/lib/utils";

export function Calendar22() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <div className="w-48 h-10 border border-gray-300 rounded-md flex items-center justify-between px-3 bg-gray-50">
        <span className="text-sm text-gray-500">
          {date ? formatDateDDMMYYYY(date) : "Select date"}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
