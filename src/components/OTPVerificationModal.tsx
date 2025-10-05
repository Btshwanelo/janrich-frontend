import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { PinInput } from "@/components/base/pin-input/pin-input";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSuccess?: () => void;
}

// OTP Verification Modal Component
const OTPVerificationModal = ({
  isOpen,
  onClose,
  phoneNumber,
  onSuccess,
}: OTPVerificationModalProps) => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hardcoded verification - check if OTP is "2135"
      if (otp === "2135") {
        console.log("OTP verification successful");
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        setError("Invalid OTP code. Please try again.");
        // Clear the OTP input
        setOTP("");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError("Verification failed. Please try again.");
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
            {/* WhatsApp Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/whatsapp.svg"
                  alt="WhatsApp Icon"
                  className="w-8 h-8"
                />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-left mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Please check your whatsapp.
              </h2>
              <p className="text-text text-sm">
                We've sent a verification code to {phoneNumber || "your email"}
              </p>
            </div>
          </div>

          {/* OTP Input using Untitled UI PinInput */}
          <div className="flex justify-center mb-6">
            <PinInput size="md">
              <PinInput.Group
                value={otp}
                onChange={handleOTPChange}
                maxLength={4}
                containerClassName="gap-2 justify-center"
              >
                <PinInput.Slot
                  index={0}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={1}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={2}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                  style={{ color: "#155EEF !important" }}
                />
                <PinInput.Slot
                  index={3}
                  className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
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
            <Button onClick={onClose} color="secondary" className="w-full flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 4}
              color="primary"
              isLoading={isVerifying}
              className="flex-1 w-full"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default OTPVerificationModal;
