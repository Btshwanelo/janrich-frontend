"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Button } from "@/components/base/buttons/button";
import { Circle } from "@/components/shared-assets/background-patterns/circle";
import {
  useUpdateCustomerMutation,
  useGetProfileQuery,
  setRegistrationData,
} from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Label } from "@/components/base/input/label";
import { DEFAULT_COUNTRY } from "@/constants/registration";
import { ErrorAlert } from "@/components/base/error-alert";
import {
  addPageError,
  clearAllPageErrors,
} from "@/lib/slices/errorSlice";
import { extractErrorMessage } from "@/utils/errorHelpers";

const UpdateNumberVerification = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, contact, customer, address, registrationMessage, fullName } =
    useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Get customer profile data to use existing values for update
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetProfileQuery(customer || "", {
      skip: !customer,
    });

  const [updateCustomer, { isLoading: isUpdatingCustomer }] =
    useUpdateCustomerMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  const handleUpdateNumber = async () => {
    // Clear previous errors
    dispatch(clearAllPageErrors());

    // Validation
    if (!phoneNumber) {
      dispatch(
        addPageError({ message: "Please enter a phone number." })
      );
      return;
    }

    if (!customer) {
      dispatch(
        addPageError({
          message: "Customer ID is required. Please go back to registration.",
        })
      );
      return;
    }

    try {
      // Extract country code from phone number (e.g., +27 from +27781234567)
      const countryCode = phoneNumber.startsWith("+")
        ? phoneNumber.substring(0, 3)
        : "+27"; // Default to South Africa

      // Use profile data if available, otherwise use registration data with defaults
      const basicInfo = profileData?.message?.data?.basic_info;
      const customerName = fullName || basicInfo?.customer_name || "Customer";
      const firstName = basicInfo?.first_name || customerName.split(" ")[0] || "Customer";
      const lastName = basicInfo?.last_name || customerName.split(" ").slice(1).join(" ") || "";
      const email = user || basicInfo?.email || "";
      const territory = basicInfo?.territory || "";
      const title = basicInfo?.salutation || "";
      const gender = profileData?.message?.data?.about_you?.profile_gender || basicInfo?.gender || "";
      const agreeToTerms = basicInfo?.agree_to_terms ?? 1;

      const result = await updateCustomer({
        customer_id: customer,
        customer_name: customerName,
        first_name: firstName,
        last_name: lastName,
        territory: territory,
        email: email,
        phone: phoneNumber,
        whatsapp_number: phoneNumber,
        country_code: countryCode,
        title: title,
        gender: gender,
        agree_to_terms: agreeToTerms,
      }).unwrap();

      if (result.message?.result === "success") {
        // Update registration data with new phone number
        dispatch(
          setRegistrationData({
            customer: customer,
            user: email,
            contact: phoneNumber,
            address: address,
            message: registrationMessage || "",
          })
        );

        showSuccessToast(
          "Number Updated!",
          "Your phone number has been successfully updated.",
          { duration: 5000 }
        );

        // Redirect to verification page
        router.push("/verification");
      } else {
        const errorMessage =
          result.message?.message || "Failed to update phone number. Please try again.";
        dispatch(addPageError({ message: errorMessage }));
        showErrorToast("Update Failed", errorMessage);
      }
    } catch (error: unknown) {
      console.error("Update customer failed:", error);
      const errorMessage = extractErrorMessage(
        error,
        "Failed to update phone number. Please try again."
      );
      dispatch(addPageError({ message: errorMessage }));
      showErrorToast("Update Failed", errorMessage);
    }
  };

  const handleBackToVerification = () => {
    router.push("/verification");
  };

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex justify-center py-24"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        {/* Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Circle size="lg" className="text-white" />
        </div>
        <div className="relative z-10 max-w-md w-full flex flex-col items-center">
          {/* Envelope Icon */}
          <div className="mb-8">
            <img
              src="/email-icon.svg"
              alt="Phone Icon"
              className="w-16 h-16"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-cinzel text-[#181D27] uppercase mb-6 text-center">
            Change phone number
          </h1>

          {/* Description */}
          <p className="text-[#535862] text-base mb-6 text-center">
            Enter your new WhatsApp number to update your contact information.
          </p>

          {/* Phone Number Input */}
          <div className="w-full mb-6">
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Cell Number <span className="text-error-500">*</span>
            </Label>
            <div className="mt-1">
              <PhoneInput
                id="phoneNumber"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(value) => {
                  setPhoneNumber(value || "");
                  dispatch(clearAllPageErrors());
                }}
                defaultCountry={DEFAULT_COUNTRY as any}
                className="phone-input"
              />
            </div>
          </div>

          {/* Error Alert */}
          <div className="w-full mb-4">
            <ErrorAlert autoClearOnUnmount={false} />
          </div>

          {/* Update Button */}
          <Button
            onClick={handleUpdateNumber}
            disabled={!phoneNumber || isUpdatingCustomer || isLoadingProfile}
            color="primary"
            size="lg"
            isLoading={isUpdatingCustomer || isLoadingProfile}
            className="w-full mb-6"
          >
            {isUpdatingCustomer || isLoadingProfile
              ? "Updating..."
              : "Change Number"}
          </Button>

          {/* Back to Verification */}
          <button
            onClick={handleBackToVerification}
            className="text-[#535862] text-sm flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verification
          </button>
        </div>
      </div>
    </AuthGuard>
  );
};

export default UpdateNumberVerification;
