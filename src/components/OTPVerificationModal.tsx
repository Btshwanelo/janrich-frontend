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
  contactInfo: string; // Can be phone number, email, etc.
  verificationMethod: 'email' | 'sms' | 'whatsapp';
  onSuccess?: () => void;
  otpLength?: number; // Default to 4, but can be customized
  validOtp?: string; // For testing purposes
}

// OTP Verification Modal Component
const OTPVerificationModal = ({
  isOpen,
  onClose,
  contactInfo,
  verificationMethod,
  onSuccess,
  otpLength = 4,
  validOtp = "2135",
}: OTPVerificationModalProps) => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Helper functions for different verification methods
  const getVerificationIcon = () => {
    switch (verificationMethod) {
      case 'email':
        return '/gmail.svg'; // You can add an email icon
      case 'sms':
        return "/messages.svg"; // You can add an SMS icon
      case 'whatsapp':
        return '/whatsapp.svg';
      default:
        return '/whatsapp.svg';
    }
  };

  const getVerificationTitle = () => {
    switch (verificationMethod) {
      case 'email':
        return 'Please check your email.';
      case 'sms':
        return 'Please check your SMS.';
      case 'whatsapp':
        return 'Please check your WhatsApp.';
      default:
        return 'Please check your WhatsApp.';
    }
  };

  const getVerificationDescription = () => {
    const methodText = verificationMethod === 'email' ? 'email' : 
                      verificationMethod === 'sms' ? 'SMS' : 'WhatsApp';
    return `We've sent a verification code to ${contactInfo || `your ${methodText}`}`;
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hardcoded verification - check if OTP matches the valid OTP
      if (otp === validOtp) {
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
            <PinInput size="md">
              <PinInput.Group
                value={otp}
                onChange={handleOTPChange}
                maxLength={otpLength}
                containerClassName="gap-2 justify-center"
              >
                {Array.from({ length: otpLength }, (_, index) => (
                  <PinInput.Slot
                    key={index}
                    index={index}
                    className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                    style={{ color: "#155EEF !important" }}
                  />
                ))}
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
              disabled={isVerifying || otp.length !== otpLength}
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
