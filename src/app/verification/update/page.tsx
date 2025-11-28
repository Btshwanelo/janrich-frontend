"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { Circle } from "@/components/shared-assets/background-patterns/circle";
import {
  useVerifyRegistrationOTPMutation,
  useSendWhatsappOTPMutation,
  setRegistrationData,
} from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Label } from "@/components/base/input/label";
import { DEFAULT_COUNTRY } from "@/constants/registration";

const UpdateNumberVerification = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, contact, customer, address, registrationMessage } =
    useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const otpLength = 6; // Standard 6-digit OTP

  const [sendOTP, { isLoading: isSendingOTPLoading }] =
    useSendWhatsappOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] =
    useVerifyRegistrationOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const handleOTPChange = (value: string) => {
    setOTP(value);
    if (error) {
      setError("");
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setError("Please enter a phone number.");
      return;
    }

    if (!user) {
      setError("Email is required. Please go back to registration.");
      return;
    }

    setError("");
    setIsSendingOTP(true);

    try {
      await sendOTP({
        whatsapp: phoneNumber,
        username: user,
      }).unwrap();

      showSuccessToast(
        "OTP Sent!",
        "A verification code has been sent to your new WhatsApp number.",
        { duration: 5000 }
      );

      // Update registration data with new phone number
      dispatch(
        setRegistrationData({
          customer: customer || "",
          user: user,
          contact: phoneNumber,
          address: address,
          message: registrationMessage || "",
        })
      );

      setShowOTPInput(true);
    } catch (error: any) {
      console.error("OTP send failed:", error);
      const errorMessage =
        error?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      showErrorToast("OTP Send Failed", errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerify = async () => {
    if (!user) {
      setError("Email is required. Please go back to registration.");
      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      const result = await verifyOTP({
        email: user,
        otp_input: otp,
      }).unwrap();

      if (result.message.result === "success") {
        showSuccessToast(
          "Number Updated!",
          "Your phone number has been successfully updated and verified.",
          { duration: 5000 }
        );
        // Navigate back to verification page with updated number
        router.push("/verification");
      } else {
        setError("Verification failed. Please try again.");
        setOTP("");
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      const errorMessage =
        error?.data?.message || "Verification failed. Please try again.";
      setError(errorMessage);
      setOTP("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    await handleSendOTP();
  };

  const handleBackToVerification = () => {
    router.push("/verification");
  };

  const lastTwoDigits = phoneNumber
    ? phoneNumber.slice(-2)
    : contact
    ? contact.slice(-2)
    : "90";

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

          {!showOTPInput ? (
            <>
              {/* Description */}
              <p className="text-[#535862] text-base mb-6 text-center">
                Enter your new WhatsApp number to receive a verification code.
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
                    onChange={(value) => setPhoneNumber(value || "")}
                    defaultCountry={DEFAULT_COUNTRY as any}
                    className="phone-input"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full mb-4">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Send OTP Button */}
              <Button
                onClick={handleSendOTP}
                disabled={!phoneNumber || isSendingOTP || isSendingOTPLoading}
                color="primary"
                size="lg"
                isLoading={isSendingOTP || isSendingOTPLoading}
                className="w-full mb-6"
              >
                {isSendingOTP || isSendingOTPLoading
                  ? "Sending..."
                  : "Change Number"}
              </Button>
            </>
          ) : (
            <>
              {/* Description */}
              <p className="text-[#535862] text-base mb-8 text-center">
                We sent a verification code to your WhatsApp number ending in{" "}
                <strong>**{lastTwoDigits}</strong>
              </p>

              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <PinInput size="md">
                  <PinInput.Group
                    value={otp}
                    onChange={handleOTPChange}
                    maxLength={otpLength}
                    containerClassName="gap-2 items-center justify-center"
                  >
                    <PinInput.Slot
                      index={0}
                      className="!text-[#1F235B] !ring-[#1F235B] text-[48px] !w-20"
                      style={{ color: "#1F235B !important" }}
                    />
                    <PinInput.Slot
                      index={1}
                      className="!text-[#1F235B] !ring-[#1F235B] text-[48px] !w-20"
                      style={{ color: "#1F235B !important" }}
                    />
                    <PinInput.Slot
                      index={2}
                      className="!text-[#1F235B] !ring-[#1F235B] text-[48px] !w-20"
                      style={{ color: "#1F235B !important" }}
                    />
                    <PinInput.Separator className="text-[60px] text-[#D5D7DA] font-semibold" />
                    <PinInput.Slot
                      index={3}
                      className="!text-[#1F235B] !ring-[#1F235B] text-[48px] !w-20"
                      style={{ color: "#1F235B !important" }}
                    />
                    <PinInput.Slot
                      index={4}
                      className="!text-[#1F235B] !ring-[#1F235B] text-[48px] !w-20"
                      style={{ color: "#1F235B !important" }}
                    />
                    <PinInput.Slot
                      index={5}
                      className="!text-[#1F235B] !ring-[#1F235B] text-[48px] !w-20"
                      style={{ color: "#1F235B !important" }}
                    />
                  </PinInput.Group>
                </PinInput>
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full mb-4">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={
                  isVerifying || isVerifyingOTP || otp.length !== otpLength
                }
                color="primary"
                size="lg"
                isLoading={isVerifying || isVerifyingOTP}
                className="w-full mb-4"
              >
                {isVerifying || isVerifyingOTP
                  ? "Verifying..."
                  : "Verify Number"}
              </Button>

              {/* Resend Code */}
              <p className="text-[#535862] text-sm mb-6 text-center">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendCode}
                  className="text-red-500 underline hover:text-red-600 font-medium"
                >
                  Resend code
                </button>
              </p>
            </>
          )}

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
