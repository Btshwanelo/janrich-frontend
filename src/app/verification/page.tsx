"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { Circle } from "@/components/shared-assets/background-patterns/circle";
import { useVerifyRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const Verification = () => {
  const router = useRouter();
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // For demo purposes - in production, get this from context/state/query params
  const phoneNumber = "0791234590"; // This should come from registration flow
  const lastTwoDigits = phoneNumber.slice(-2);
  const otpLength = 7; // 7-digit code as shown in design

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

  const handleVerify = async () => {
    setError("");
    setIsVerifying(true);

    try {
      // TODO: Get email from context/state/query params
      const email = ""; // This should come from registration flow

      if (!email) {
        setError("Email is required for verification.");
        setIsVerifying(false);
        return;
      }

      const result = await verifyOTP({
        email: email,
        otp_input: otp,
      }).unwrap();

      if (result.message.result === "success") {
        showSuccessToast(
          "Verification Successful!",
          "Your WhatsApp number has been successfully verified.",
          { duration: 5000 }
        );
        router.push("/onboarding");
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

  const handleResendCode = () => {
    // TODO: Implement resend OTP logic
    showSuccessToast(
      "Code Resent",
      "A new verification code has been sent to your WhatsApp."
    );
  };

  const handleChangeNumber = () => {
    // TODO: Navigate back to registration to change number
    router.push("/register");
  };

  const handleBackToSignUp = () => {
    router.push("/register");
  };

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex  justify-center py-24"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        {" "}
        {/* Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Circle size="lg" className="text-white" />
        </div>
        <div className="relative z-10 max-w-md w-full flex flex-col items-center">
          {/* Envelope Icon */}
          <div className="mb-8">
            <img
              src="/email-icon.svg"
              alt="Envelope Icon"
              className="w-16 h-16"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-cinzel  text-[#181D27] uppercase mb-6 text-center">
            LET'S GET YOU STARTED
          </h1>

          {/* Description */}
          <p className="text-[#535862] text-base mb-8 text-center">
            We sent a verification code to your WhatsApp number ending in{" "}
            <strong>**{lastTwoDigits}</strong>
          </p>

          {/* OTP Input - 5 fields, dash, 2 fields (7 digits total) */}
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
            disabled={isVerifying || isVerifyingOTP || otp.length !== otpLength}
            color="primary"
            size="lg"
            isLoading={isVerifying || isVerifyingOTP}
            className="w-full mb-6"
          >
            {isVerifying || isVerifyingOTP ? "Verifying..." : "Verify email"}
          </Button>

          {/* Resend Code */}
          <p className="text-[#535862] text-sm mb-2 text-center">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendCode}
              className="text-red-500 underline hover:text-red-600 font-medium"
            >
              Resend code
            </button>
          </p>

          {/* Change Number */}
          <p className="text-[#535862] text-sm mb-8 text-center">
            Used the wrong number?{" "}
            <button
              onClick={handleChangeNumber}
              className="text-red-500 underline hover:text-red-600 font-medium"
            >
              Change Number
            </button>
          </p>

          {/* Back to Sign Up */}
          <button
            onClick={handleBackToSignUp}
            className="text-[#535862] text-sm flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign up
          </button>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Verification;
