"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import CircularProgressStep from "@/components/CircularProgressStep";
import AuthGuard from "@/components/AuthGuard";
import { InputGroup } from "@/components/base/input/input-group";
import { InputBase } from "@/components/base/input/input";
import { HelpCircle } from "@untitledui/icons";
import { amountConversion } from "@/utils/amountConversion";
import { X } from "lucide-react";
import { useOnboardingFlow } from "@/utils/onboardingState";
import { useUpdateSavingsGoalMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { useAppSelector } from "@/lib/hooks";
import { NativeSelect } from "@/components/base/select/select-native";

export default function GoalPage() {
  const router = useRouter();
  const { customer } = useAppSelector((state) => state.auth);
  const { markGoalCompleted } = useOnboardingFlow();
  const [amount, setAmount] = useState("15 000");
  const [isSaving, setIsSaving] = useState(false);
  const minAmount = 500;
  const maxAmount = 5000000;

  const [updateSavingsGoal, { isLoading: isUpdatingGoal }] =
    useUpdateSavingsGoalMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const handleAmountChange = (value: string) => {
    // Ensure value is a string, convert if needed
    const stringValue = typeof value === "string" ? value : String(value || "");

    // Remove all non-numeric characters except spaces
    let cleanedValue = stringValue.replace(/[^\d\s]/g, "");

    // Remove spaces for calculation
    const numericValue = cleanedValue.replace(/\s/g, "");

    // Format with spaces every 3 digits
    if (numericValue) {
      const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      setAmount(formatted);
    } else {
      setAmount("");
    }
  };

  const handleSubmit = async () => {
    // Remove spaces to get numeric value
    const numericValue = parseInt(amount.replace(/\s/g, ""), 10);

    // Validate amount
    if (numericValue < minAmount || numericValue > maxAmount) {
      return;
    }

    if (!customer) {
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
        customer_id: customer,
        annual_savings_goal: numericValue,
      }).unwrap();

      // Mark goal as completed in onboarding state
      markGoalCompleted();

      // Show success toast
      showSuccessToast(
        "Savings Goal Set!",
        `Your annual savings goal of ${amountConversion(
          numericValue
        )} has been saved successfully.`,
        {
          duration: 4000,
        }
      );

      // Navigate to financial page
      router.push("/onboarding/financial");
    } catch (error: any) {
      // Show error toast
      showErrorToast(
        "Save Failed",
        error?.data?.message ||
          "Unable to save your savings goal. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const numericValue = parseInt(amount.replace(/\s/g, ""), 10) || 0;
  const displayAmount =
    numericValue > 0 ? amountConversion(numericValue, "R") : "R 0";

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex justify-center"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        <div className="w-full">
          <div className="mb-6">
            <div className="border-b border-[#E9EAEB] px-8 py-2 flex bg-white justify-between">
              <img
                src="/jr-logo-black.svg"
                alt="JanRich Logo"
                className=" w-[37px] h-auto"
              />
              <Button color="link-gray">
                <X />
              </Button>
            </div>
          </div>
          {/* Header */}
          <div className="text-center relative mb-6">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-[#414651] font-medium">
                  Step 2 of 4
                </span>
                <CircularProgressStep status="isCompleted" />
                {/* <div className="flex-1 h-[3px] bg-[#1F235B] max-w-[60px]" /> */}
                <CircularProgressStep status="isActive" />
                {/* <div className="flex-1 h-[3px] bg-gray-300 max-w-[60px]" /> */}
                <CircularProgressStep status="inactive" />
                {/* <div className="flex-1 h-[3px] bg-gray-300 max-w-[60px]" /> */}
                <CircularProgressStep status="inactive" />
              </div>
            </div>
          </div>

          {/* Goal Card */}
          <div className="bg-white  max-w-md mx-auto rounded-2xl p-6 shadow-lg">
            {/* Title */}
            <div className="flex  items-center justify-center mb-6">
              <h2 className="text-xl font-semibold text-center text-[#181D27]">
                Set your savings goal for the year!
              </h2>
            </div>

            {/* Current Goal Display */}
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-[#1F235B] mb-6">
                {displayAmount}
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-4">
              <InputGroup
                prefix="ZAR"
                size="md"
                value={amount}
                onChange={handleAmountChange}
              >
                <InputBase
                  type="text"
                  placeholder="500"
                  inputMode="numeric"
                  inputClassName="text-left"
                />
              </InputGroup>
            </div>

            {/* Guidance Text */}
            <p className="text-sm text-[#535862] mb-6 text-center">
              minimum amount is R500 but don't let that limit you, max is R 5
              000 000
            </p>

            {/* Action Button */}
            <Button
              onClick={handleSubmit}
              color="primary"
              size="md"
              className="w-full bg-[#1F235B] hover:bg-[#1F235B]/90"
              isDisabled={
                numericValue < minAmount ||
                numericValue > maxAmount ||
                !numericValue ||
                isSaving ||
                isUpdatingGoal
              }
              isLoading={isSaving || isUpdatingGoal}
            >
              {isSaving || isUpdatingGoal
                ? "Saving..."
                : "Start Paying yourself first"}
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
