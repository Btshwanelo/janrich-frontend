import React from "react";
import { CreditCard } from "lucide-react";
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
      className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition-all ${
        isSelected
          ? "border-primary-500"
          : "border-border-inactive hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <span className="font-medium text-gray-900">{label} </span>
              <span className="text-gray-600">{amount}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-8">{description}</p>
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

