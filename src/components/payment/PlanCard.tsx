import React from "react";
import { CreditCard, Wallet } from "lucide-react";
import { Checkbox } from "@/components/base/checkbox/checkbox";

interface PlanCardProps {
  planId: string;
  label: string;
  amount: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  planId,
  label,
  amount,
  description,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl  cursor-pointer transition-all mb-2 ${
        isSelected
          ? "border-blue-600 border-2 "
          : "border-gray-200 border bg-white hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2 gap-2">
            <div className="w-10 h-10 rounded-lg border border-[#D5D7DA] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div className="">
              <span className="font-medium text-gray-900">{label} </span>
              <span className="text-gray-600">{amount}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-12">{description}</p>
        </div>
        <Checkbox
          id={planId}
          isSelected={isSelected}
          onChange={(isSelected) => {
            if (isSelected) {
              onSelect();
            }
          }}
          className="mt-1"
        />
      </div>
    </div>
  );
};


