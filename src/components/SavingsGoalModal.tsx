"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Slider } from "@/components/base/slider/slider";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { useUpdateSavingsGoalMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
  onSave?: (amount: number) => void;
}

export default function SavingsGoalModal({
  isOpen,
  onClose,
  customerId,
  onSave,
}: SavingsGoalModalProps) {
  const [amount, setAmount] = useState([15000]);
  const [isSaving, setIsSaving] = useState(false);

  const minAmount = 5000;
  const maxAmount = 100000;
  const step = 1000;

  const [updateSavingsGoal, { isLoading: isUpdatingGoal }] =
    useUpdateSavingsGoalMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const formatCurrency = (value: number): string => {
    const currency = "R";
    return `${currency} ${value.toLocaleString()}`;
  };

  const cardTitle = "Great Start! You don't need a million to change your life";
  const cardImage =
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=300&fit=crop";
  const cardImageAlt = "Professional woman";
  const buttonText = "Start Paying yourself first";

  const handleSubmit = async () => {
    if (!customerId) {
      showErrorToast(
        "Error",
        "Customer ID is required to save your savings goal.",
        { duration: 4000 }
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await updateSavingsGoal({
        customer_id: customerId,
        annual_savings_goal: amount[0],
      }).unwrap();

      // Show success toast
      showSuccessToast(
        "Savings Goal Set!",
        `Your annual savings goal of ${formatCurrency(
          amount[0]
        )} has been saved successfully.`,
        {
          duration: 4000,
        }
      );

      // Call the onSave callback if provided
      if (onSave) {
        onSave(amount[0]);
      }

      // Close the modal
      onClose();
    } catch (error: any) {

      // Show error toast
      showErrorToast(
        "Save Failed",
        error || "Unable to save your savings goal. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
      <Modal>
        <Dialog className="bg-white rounded-2xl p-6 w-full mx-auto max-w-[400px] flex flex-col relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-md font-semibold text-gray-900">
              How much do you want to save?
            </h2>
          </div>

          <div className="space-y-6 mx-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-6">
                {formatCurrency(amount[0])}
              </div>

              <div className="flex justify-between text-sm text-text mb-4 px-1">
                <span>{formatCurrency(minAmount)}</span>
                <span>{formatCurrency(maxAmount)}</span>
              </div>

              <div className="w-full px-1 mb-6 overflow-hidden max-w-full">
                <div className="mb-6 left-0 [&_.bg-brand-solid]:bg-[#E31B54] [&_.ring-\\[\\#155EEF\\]]:ring-[#E31B54] [&_.text-\\[\\#E31B54\\]]:text-[#E31B54] [&_.bg-slider-handle-bg]:bg-white">
                  <Slider
                    value={amount}
                    onChange={(value) =>
                      setAmount(Array.isArray(value) ? value : [value])
                    }
                    minValue={5000}
                    maxValue={1000000}
                    step={500}
                    labelFormatter={(value) => formatCurrency(value)}
                    // labelPosition="bottom"
                    // className="w-full max-w-full"
                  />
                </div>
              </div>
            </div>

            <div className=" border border-border-inactive rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {cardTitle}
              </h3>

              <div className="w-full">
                <img
                  src={cardImage}
                  alt={cardImageAlt}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              color="primary"
              size="md"
              className="w-full"
              disabled={isSaving || isUpdatingGoal}
              isLoading={isSaving || isUpdatingGoal}
            >
              {isSaving || isUpdatingGoal ? "Saving..." : buttonText}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
