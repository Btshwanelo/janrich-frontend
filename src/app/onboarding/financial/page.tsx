"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import CircularProgressStep from "@/components/CircularProgressStep";
import AuthGuard from "@/components/AuthGuard";
import { Select } from "@/components/base/select/select";
import { Input } from "@/components/base/input/input";
import { Slider } from "@/components/base/slider/slider";
import { amountConversion } from "@/utils/amountConversion";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import {
  EMPLOYMENT_STATUS_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  SAVING_FOR_OPTIONS,
  FUND_SOURCE_OPTIONS,
  BANK_OPTIONS,
} from "@/constants/profile";
import { useOnboardingFlow } from "@/utils/onboardingState";
import { useUpdateFinancialDetailsMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { useAppSelector } from "@/lib/hooks";

export default function FinancialPage() {
  const router = useRouter();
  const { customer, fullName } = useAppSelector((state) => state.auth);
  const { savingGoal } = useAppSelector((state) => state.onboarding);
  const { markFinancialCompleted } = useOnboardingFlow();
  const [amount, setAmount] = useState([350000]);
  const [savingFor, setSavingFor] = useState<string | null>(null);
  const [employmentStatus, setEmploymentStatus] = useState<string | null>(null);
  const [depositFrequency, setDepositFrequency] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [fundSource, setFundSource] = useState<string | null>(null);
  const [payDay, setPayDay] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [updateFinancialDetails, { isLoading: isUpdatingFinancials }] =
    useUpdateFinancialDetailsMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  // Helper function to map select key to API value
  const mapSelectKeyToApiValue = (
    selectKey: string,
    options: { id: string; label: string }[]
  ) => {
    const option = options.find((opt) => opt.id === selectKey);
    return option ? option.label : selectKey;
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !savingFor ||
      !employmentStatus ||
      !depositFrequency ||
      !bankName ||
      !accountNumber ||
      !fundSource ||
      !payDay
    ) {
      showErrorToast(
        "Validation Error",
        "Please fill in all required fields.",
        { duration: 4000 }
      );
      return;
    }

    if (!customer) {
      showErrorToast(
        "Error",
        "Customer ID is required to save financial information.",
        { duration: 4000 }
      );
      return;
    }

    setIsSaving(true);

    try {
      const financialData = {
        customer_id: customer,
        custom_employment_status: mapSelectKeyToApiValue(
          employmentStatus,
          EMPLOYMENT_STATUS_OPTIONS
        ),
        custom_employee_status_other: "", // Optional field
        custom_deposit_frequency: mapSelectKeyToApiValue(
          depositFrequency,
          DEPOSIT_FREQUENCY_OPTIONS
        ),
        custom_deposit_frequency_other: "", // Optional field
        custom_customer_bank: mapSelectKeyToApiValue(bankName, BANK_OPTIONS),
        custom_bank_other: "", // Optional field
        custom_fund_source: mapSelectKeyToApiValue(
          fundSource,
          FUND_SOURCE_OPTIONS
        ),
        custom_fund_source_other: "", // Optional field
        custom_saving_for: mapSelectKeyToApiValue(
          savingFor,
          SAVING_FOR_OPTIONS
        ),
        custom_saving_for_other: "", // Optional field
        custom_account_holder: fullName || accountNumber || "", // Use customer name or account number as fallback
        custom_branch_code: "", // Default empty, can be added later if needed
        custom_iban_account: accountNumber,
        // custom_annual_savings_goal: amount[0] || 0,
        custom_household_size: 1, // Default to 1, can be added later if needed
        custom_pay_day: parseInt(payDay) || 1,
      };

      const result = await updateFinancialDetails(financialData).unwrap();

      // Mark financial as completed
      markFinancialCompleted();

      // Show success toast
      showSuccessToast(
        "Financial Details Updated!",
        "Your financial information has been saved successfully.",
        {
          duration: 4000,
        }
      );

      // Navigate to beneficiary page
      router.push("/onboarding/benefitiary");
    } catch (error: any) {
      console.error("Failed to update financial details:", error);

      // Show error toast
      showErrorToast(
        "Update Failed",
        error?.data?.message ||
          "Unable to save your financial information. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const minAmount = 5000;
  const maxAmount = 1000000;

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex pb-4 justify-center"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        <div className="w-full ">
          {/* Header with Logo and Close */}
          <OnboardingHeader />

          {/* Progress Steps */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-[#414651] font-medium">
                Step 3 of 4
              </span>
              <CircularProgressStep status="isCompleted" />
              <CircularProgressStep status="isCompleted" />
              <CircularProgressStep status="isActive" />
              <CircularProgressStep status="inactive" />
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white max-w-3xl mx-4 sm:mx-auto rounded-2xl p-6  shadow-lg">
            {/* Savings Goal Section with Blue Gradient */}
            <div className="relative h-32 sm:h-48 w-full p-6 mb-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="/profile-bg.png"
                  alt="Savings goal background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col gap-6 sm:gap-10">
                <span className="text-base text-white">I want to save</span>
                <div className="text-center">
                  <p className="text-3xl sm:text-6xl font-bold font-cinzel text-white mb-2">
                    {amountConversion(savingGoal || 0)}
                  </p>
                  {/* <div className="mb-2 [&_.bg-brand-solid]:bg-[#E31B54] [&_.ring-\\[\\#1F235B\\]]:ring-[#E31B54] [&_.text-\\[\\#E31B54\\]]:text-[#E31B54] [&_.bg-slider-handle-bg]:bg-white">
                    <Slider
                      value={amount}
                      isDisabled
                      onChange={(value) =>
                        setAmount(Array.isArray(value) ? value : [value])
                      }
                      minValue={minAmount}
                      maxValue={maxAmount}
                      step={500}
                      labelFormatter={(value) => amountConversion(value)}
                    />
                  </div> */}
                  {/* <div className="flex justify-between text-xs text-white/80 px-1">
                    <span>{amountConversion(minAmount)}</span>
                    <span>{amountConversion(maxAmount)}</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* What are you saving for - Full width */}
              <div>
                <Select
                  label="What are you saving for"
                  placeholder="Select an option"
                  items={SAVING_FOR_OPTIONS}
                  className="w-full"
                  selectedKey={savingFor}
                  onSelectionChange={(key) => setSavingFor(key as string)}
                  isRequired
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              </div>

              {/* Employment status and Deposit Frequency - Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Employment status"
                    placeholder="Select an option"
                    items={EMPLOYMENT_STATUS_OPTIONS}
                    className="w-full"
                    selectedKey={employmentStatus}
                    onSelectionChange={(key) =>
                      setEmploymentStatus(key as string)
                    }
                    isRequired
                  >
                    {(item) => (
                      <Select.Item key={item.id} id={item.id}>
                        {item.label}
                      </Select.Item>
                    )}
                  </Select>
                </div>

                <div>
                  <Select
                    label="Deposit frequency"
                    placeholder="Select an option"
                    items={DEPOSIT_FREQUENCY_OPTIONS}
                    className="w-full"
                    selectedKey={depositFrequency}
                    onSelectionChange={(key) =>
                      setDepositFrequency(key as string)
                    }
                    isRequired
                  >
                    {(item) => (
                      <Select.Item key={item.id} id={item.id}>
                        {item.label}
                      </Select.Item>
                    )}
                  </Select>
                </div>
              </div>

              {/* Bank Name and Account Number - Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Bank name"
                    placeholder="Select an option"
                    items={BANK_OPTIONS}
                    className="w-full"
                    selectedKey={bankName}
                    onSelectionChange={(key) => setBankName(key as string)}
                    isRequired
                  >
                    {(item) => (
                      <Select.Item key={item.id} id={item.id}>
                        {item.label}
                      </Select.Item>
                    )}
                  </Select>
                </div>

                <div>
                  <Input
                    label="Account number"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(value) => setAccountNumber(value)}
                    isRequired
                  />
                </div>
              </div>

              {/* Source of funds and Pay day - Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Source of funds"
                    placeholder="Select an option"
                    items={FUND_SOURCE_OPTIONS}
                    className="w-full"
                    selectedKey={fundSource}
                    onSelectionChange={(key) => setFundSource(key as string)}
                    isRequired
                  >
                    {(item) => (
                      <Select.Item key={item.id} id={item.id}>
                        {item.label}
                      </Select.Item>
                    )}
                  </Select>
                </div>

                <div>
                  <Input
                    label="Pay day"
                    type="number"
                    placeholder="Enter day of month (1-31)"
                    value={payDay}
                    onChange={(value) => setPayDay(value)}
                    isRequired
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button
                  color="secondary"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-[#1F235B] hover:bg-[#1F235B]/90"
                  isDisabled={
                    !savingFor ||
                    !employmentStatus ||
                    !depositFrequency ||
                    !bankName ||
                    !accountNumber ||
                    !fundSource ||
                    !payDay ||
                    isSaving ||
                    isUpdatingFinancials
                  }
                  isLoading={isSaving || isUpdatingFinancials}
                >
                  {isSaving || isUpdatingFinancials
                    ? "Saving..."
                    : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
