"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { Circle } from "@/components/shared-assets/background-patterns/circle";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import {
  useSendWhatsappOTPMutation,
  useVerifyRegistrationOTPMutation,
} from "@/lib/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ErrorAlert } from "@/components/base/error-alert";
import { addPageError, clearAllPageErrors } from "@/lib/slices/errorSlice";
import { extractErrorMessage } from "@/utils/errorHelpers";

const Verification = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, fullName, customer, contact } = useAppSelector(
    (state) => state.auth
  );

  const [otp, setOTP] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasSentInitialOTP = useRef(false);

  const otpLength = 6; // Standard 6-digit OTP

  const [verifyOTP, { isLoading: isVerifyingOTP }] =
    useVerifyRegistrationOTPMutation();
  const [sendOTP, { isLoading: isSendingOTPLoading }] =
    useSendWhatsappOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Send OTP on mount if contact and user are available (only once)
  useEffect(() => {
    if (contact && user && !hasSentInitialOTP.current) {
      hasSentInitialOTP.current = true;
      sendOTP({
        whatsapp: contact,
        username: user,
      });
      // Set initial cooldown
      setResendCooldown(60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact, user]);

  const handleOTPChange = (value: string) => {
    setOTP(value);
    // Clear errors when user starts typing
    dispatch(clearAllPageErrors());
  };

  const handleVerify = async () => {
    // Clear previous errors
    dispatch(clearAllPageErrors());

    // Validation
    if (!user) {
      dispatch(
        addPageError({
          message: "Email is required. Please go back to registration.",
        })
      );
      return;
    }

    if (otp.length !== otpLength) {
      dispatch(
        addPageError({
          message: `Please enter a ${otpLength}-digit verification code.`,
        })
      );
      return;
    }

    if (!otp || otp.trim().length === 0) {
      dispatch(
        addPageError({
          message: "Please enter the verification code.",
        })
      );
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyOTP({
        email: user,
        otp_input: otp,
      }).unwrap();

      if (result.message?.result === "success") {
        showSuccessToast(
          "Verification Successful!",
          "Your WhatsApp number has been successfully verified.",
          { duration: 5000 }
        );
        router.push("/onboarding");
      } else {
        const errorMessage =
          result.message?.message || "Verification failed. Please try again.";
        dispatch(addPageError({ message: errorMessage }));
        setOTP("");
      }
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      const errorMessage = extractErrorMessage(
        error,
        "Verification failed. Please try again."
      );
      dispatch(addPageError({ message: errorMessage }));
      setOTP("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    // Prevent resend if cooldown is active
    if (resendCooldown > 0) {
      dispatch(
        addPageError({
          message: `Please wait ${resendCooldown} seconds before requesting a new code.`,
        })
      );
      return;
    }

    // Clear previous errors
    dispatch(clearAllPageErrors());

    // Validation
    if (!contact) {
      dispatch(
        addPageError({
          message: "Phone number is required to resend OTP.",
        })
      );
      return;
    }

    if (!user) {
      dispatch(
        addPageError({
          message: "Email is required. Please go back to registration.",
        })
      );
      return;
    }

    try {
      const result = await sendOTP({
        whatsapp: contact,
        username: user,
      }).unwrap();

      // Check if OTP was sent successfully
      showSuccessToast(
        "Code Resent!",
        "A new verification code has been sent to your WhatsApp number.",
        { duration: 5000 }
      );

      // Set resend cooldown to 60 seconds
      setResendCooldown(60);
      // Clear OTP input to allow user to enter new code
      setOTP("");
    } catch (error: unknown) {
      console.error("OTP resend failed:", error);
      const errorMessage = extractErrorMessage(
        error,
        "Failed to resend OTP. Please try again."
      );
      dispatch(addPageError({ message: errorMessage }));
      showErrorToast("Resend Failed", errorMessage);
    }
  };

  const handleChangeNumber = () => {
    router.push("/verification/update");
  };

  const handleBackToSignUp = () => {
    router.push("/register");
  };

  // Get last two digits from contact
  const lastTwoDigits = contact ? contact.slice(-2) : "90";

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

          {/* OTP Input - 6 digits with separator */}
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

          {/* Error Alert */}
          <div className="w-full mb-4">
            <ErrorAlert autoClearOnUnmount={false} />
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={
              isVerifying ||
              isVerifyingOTP ||
              otp.length !== otpLength ||
              !otp ||
              otp.trim().length === 0
            }
            color="primary"
            size="lg"
            isLoading={isVerifying || isVerifyingOTP}
            className="w-full mb-4"
          >
            {isVerifying || isVerifyingOTP ? "Verifying..." : "Verify email"}
          </Button>

          {/* Resend Code */}
          <p className="text-[#535862] text-sm mb-2 text-center">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendCode}
              disabled={isSendingOTPLoading || resendCooldown > 0}
              className={`${
                isSendingOTPLoading || resendCooldown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-600"
              } underline font-medium transition-colors`}
            >
              {isSendingOTPLoading
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend code (${resendCooldown}s)`
                : "Resend code"}
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
