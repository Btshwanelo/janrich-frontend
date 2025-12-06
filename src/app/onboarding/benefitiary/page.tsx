"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import CircularProgressStep from "@/components/CircularProgressStep";
import AuthGuard from "@/components/AuthGuard";
import { Select } from "@/components/base/select/select";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { OnboardingHeader } from "@/components/onboarding";
import {
  BENEFICIARY_TYPE_OPTIONS,
  RELATION_OPTIONS,
  TITLE_OPTIONS,
} from "@/constants/profile";
import { useOnboardingFlow } from "@/utils/onboardingState";
import { useUpdateBeneficiaryMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { useAppSelector } from "@/lib/hooks";

export default function BeneficiaryPage() {
  const router = useRouter();
  const { customer } = useAppSelector((state) => state.auth);
  const { markBeneficiaryCompleted } = useOnboardingFlow();
  const [beneficiaryType, setBeneficiaryType] = useState<string | null>(null);
  const [beneficiaryTitle, setBeneficiaryTitle] = useState<string | null>(null);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiarySurname, setBeneficiarySurname] = useState("");
  const [beneficiaryCell, setBeneficiaryCell] = useState("");
  const [beneficiaryRelation, setBeneficiaryRelation] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] =
    useUpdateBeneficiaryMutation();
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
      !beneficiaryType ||
      !beneficiaryTitle ||
      !beneficiaryName ||
      !beneficiarySurname ||
      !beneficiaryCell ||
      !beneficiaryRelation
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
        "Customer ID is required to save beneficiary information.",
        { duration: 4000 }
      );
      return;
    }

    setIsSaving(true);

    try {
      const beneficiaryData = {
        customer_id: customer,
        beneficiary_type: mapSelectKeyToApiValue(
          beneficiaryType,
          BENEFICIARY_TYPE_OPTIONS
        ),
        beneficiary_name: beneficiaryName,
        beneficiary_title: mapSelectKeyToApiValue(
          beneficiaryTitle,
          TITLE_OPTIONS
        ),
        beneficiary_cell: beneficiaryCell,
        beneficiary_relation: mapSelectKeyToApiValue(
          beneficiaryRelation,
          RELATION_OPTIONS
        ),
        beneficiary_surname: beneficiarySurname,
      };

      const result = await updateBeneficiary(beneficiaryData).unwrap();

      // Mark beneficiary as completed (this will also mark onboarding as complete)
      markBeneficiaryCompleted();

      // Show success toast
      showSuccessToast(
        "Beneficiary Updated!",
        "Your beneficiary information has been saved successfully.",
        {
          duration: 4000,
        }
      );

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      // Show error toast
      showErrorToast(
        "Update Failed",
        error?.data?.message ||
          "Unable to save your beneficiary information. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex pb-4 justify-center"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        <div className="w-full">
          {/* Header with Logo and Close */}
          <OnboardingHeader />

          {/* Progress Steps */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-[#414651] font-medium">
                Step 4 of 4
              </span>
              <CircularProgressStep status="isCompleted" />
              <CircularProgressStep status="isCompleted" />
              <CircularProgressStep status="isCompleted" />
              <CircularProgressStep status="isActive" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-6 max-w-3xl mx-4 sm:mx-auto ">
            <div className="max-w-[280px] px-2">
              <h2 className="text-base font-semibold text-[#414651] mb-2">
                Beneficiary Details
              </h2>
              <p className="text-sm text-[#535862]">
                In the event of your passing (touch wood), where would you like
                us to direct your funds?
              </p>
            </div>
          </div>
          {/* Main Card */}
          <div className="bg-white max-w-3xl mx-4 sm:mx-auto rounded-2xl p-6 shadow-lg">
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Beneficiary Title - Full width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Beneficiary Type - Full width */}
                <div>
                  <Select
                    label="Beneficiary Type"
                    placeholder="Select an option"
                    items={BENEFICIARY_TYPE_OPTIONS}
                    className="w-full"
                    selectedKey={beneficiaryType}
                    onSelectionChange={(key) =>
                      setBeneficiaryType(key as string)
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
                <Select
                  label="Title"
                  placeholder="Select an option"
                  items={TITLE_OPTIONS}
                  className="w-full"
                  selectedKey={beneficiaryTitle}
                  onSelectionChange={(key) =>
                    setBeneficiaryTitle(key as string)
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

              {/* Beneficiary name and Surname - Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Beneficiary name"
                    placeholder="Enter beneficiary name"
                    value={beneficiaryName}
                    onChange={(value) => setBeneficiaryName(value)}
                    isRequired
                  />
                </div>

                <div>
                  <Input
                    label="Beneficiary Surname"
                    placeholder="Enter beneficiary surname"
                    value={beneficiarySurname}
                    onChange={(value) => setBeneficiarySurname(value)}
                    isRequired
                  />
                </div>
              </div>

              {/* Cell Number - Full width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Cell Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <PhoneInput
                      placeholder="Enter phone number"
                      defaultCountry="ZA"
                      className="phone-input"
                      value={beneficiaryCell}
                      onChange={(value) => setBeneficiaryCell(value || "")}
                    />
                  </div>
                </div>

                {/* Relation - Full width */}
                <div>
                  <Select
                    label="Relation"
                    placeholder="Select an option"
                    items={RELATION_OPTIONS}
                    className="w-full"
                    selectedKey={beneficiaryRelation}
                    onSelectionChange={(key) =>
                      setBeneficiaryRelation(key as string)
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
                    !beneficiaryType ||
                    !beneficiaryTitle ||
                    !beneficiaryName ||
                    !beneficiarySurname ||
                    !beneficiaryCell ||
                    !beneficiaryRelation ||
                    isSaving ||
                    isUpdatingBeneficiary
                  }
                  isLoading={isSaving || isUpdatingBeneficiary}
                >
                  {isSaving || isUpdatingBeneficiary
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
