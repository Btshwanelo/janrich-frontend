import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { useVerifyRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: string; // Can be phone number, email, etc.
  verificationMethod: "email" | "sms" | "whatsapp";
  onSuccess?: () => void;
  otpLength?: number; // Default to 6, but can be customized
  validOtp?: string; // For testing purposes
  email?: string; // Required for email verification
}

// OTP Verification Modal Component
const OTPVerificationModal = ({
  isOpen,
  onClose,
  contactInfo,
  verificationMethod,
  onSuccess,
  otpLength = 6,
  email,
}: OTPVerificationModalProps) => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  console.log("error:", error);

  // API hooks
  const [verifyOTP, { isLoading: isVerifyingOTP }] =
    useVerifyRegistrationOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  // Helper functions for different verification methods
  const getVerificationIcon = () => {
    switch (verificationMethod) {
      case "email":
        return "/gmail.svg"; // You can add an email icon
      case "sms":
        return "/messages.svg"; // You can add an SMS icon
      case "whatsapp":
        return "/whatsapp.svg";
      default:
        return "/whatsapp.svg";
    }
  };

  useEffect(() => {
    setError("")
  }, [])
  

  const getVerificationTitle = () => {
    switch (verificationMethod) {
      case "email":
        return "Please check your email.";
      case "sms":
        return "Please check your SMS.";
      case "whatsapp":
        return "Please check your WhatsApp.";
      default:
        return "Please check your WhatsApp.";
    }
  };

  const getVerificationDescription = () => {
    const methodText =
      verificationMethod === "email"
        ? "email"
        : verificationMethod === "sms"
        ? "SMS"
        : "WhatsApp";
    return `We've sent a verification code to ${
      contactInfo || `your ${methodText}`
    }`;
  };

  const handleOTPChange = (value: string) => {
    setOTP(value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleVerify = async () => {
    console.log("OTP entered:", otp);

    // Clear previous error
    setError("");
    setIsVerifying(true);

    try {
      if (verificationMethod === "email" && email) {
        // Use real API for email verification
        const result = await verifyOTP({
          email: email,
          otp_input: otp,
        }).unwrap();

        console.log("OTP verification successful:", result);

        if (result.message.status === "registered") {
          showSuccessToast(
            "Email Verified!",
            "Your email has been successfully verified and you are now registered.",
            {
              duration: 5000,
            }
          );

          if (onSuccess) {
            onSuccess();
          } else {
            onClose();
          }
        } else {
          setError("Verification failed. Please try again.");
          setOTP("");
        }
      } else {
        // Fallback to hardcoded verification for other methods
        if (verificationMethod === "whatsapp" && email) {
          // Use real API for email verification
          const result = await verifyOTP({
            email: email,
            otp_input: otp,
          }).unwrap();

          console.log("OTP verification successful:", result);

          if (result.message.status === "registered") {
            showSuccessToast(
              "Email Verified!",
              "Your email has been successfully verified and you are now registered.",
              {
                duration: 5000,
              }
            );

            if (onSuccess) {
              onSuccess();
            } else {
              onClose();
            }
          } else {
            setError("Verification failed. Please try again.");
            setOTP("");
          }
        } else {
          setError("Invalid OTP code. Please try again.");
          setOTP("");
        }
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);

      setError(error || "Verification failed. Please try again.");
      setOTP("");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
      <Modal>
        <Dialog className="bg-white rounded-2xl p-6 w-full mx-auto max-w-md flex-col relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {/* Verification Method Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={getVerificationIcon()}
                  alt={`${verificationMethod} Icon`}
                  className="w-8 h-8"
                />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-left mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {getVerificationTitle()}
              </h2>
              <p className="text-text text-sm">
                {getVerificationDescription()}
              </p>
            </div>
          </div>

          {/* OTP Input using Untitled UI PinInput */}
          <div className="flex justify-center mb-6">
            <PinInput size="sm">
              <PinInput.Group
                value={otp}
                onChange={handleOTPChange}
                maxLength={otpLength}
                containerClassName="gap-2 items-center justify-center align-middle "
              >
                {/* {Array.from({ length: 3 }, (_, index) => (
                  <PinInput.Slot
                    key={index}
                    index={index}
                    className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                    style={{ color: "#155EEF !important" }}
                  />
                ))} */}
                <PinInput.Slot
                  index={0}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px] !w-14"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={1}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px] !w-14"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={2}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px] !w-14"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Separator className="text-[60px] text-[#D5D7DA] font-semibold" />
                {/* {Array.from({ length: 2 }, (_, index) => (
                  <PinInput.Slot
                    key={index}
                    index={index}
                    className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                    style={{ color: "#155EEF !important" }}
                  />
                ))} */}
                <PinInput.Slot
                  index={3}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px] !w-14"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={4}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px] !w-14"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={4}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px] !w-14"
                  style={{ color: "#155EEF !important" }}
                />
              </PinInput.Group>
            </PinInput>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-md p-3 mb-4">
              <p className="text-error-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Resend Code */}
          <div className="text-start mb-6">
            <p className="text-sm text-text">
              Didn't get a code?{" "}
              <button className="text-primary-500 underline hover:text-primary-600">
                Click to resend.
              </button>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full px-6">
            <Button
              onClick={onClose}
              color="secondary"
              className="w-full flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={
                isVerifying || isVerifyingOTP || otp.length !== otpLength
              }
              color="primary"
              isLoading={isVerifying || isVerifyingOTP}
              className="flex-1 w-full"
            >
              {isVerifying || isVerifyingOTP ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default OTPVerificationModal;
