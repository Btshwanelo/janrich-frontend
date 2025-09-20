import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSuccess?: () => void;
}

// OTP Verification Modal Component
const OTPVerificationModal = ({ isOpen, onClose, phoneNumber, onSuccess }: OTPVerificationModalProps) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    console.log("OTP entered:", otpCode);
    
    // Clear previous error
    setError("");
    setIsVerifying(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hardcoded verification - check if OTP is "213508"
      if (otpCode === "213508") {
        console.log("OTP verification successful");
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        setError("Invalid OTP code. Please try again.");
        // Clear the OTP inputs
        setOTP(["", "", "", "", "", ""]);
        // Focus on first input
        const firstInput = document.getElementById("otp-0");
        firstInput?.focus();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {/* Email Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/whatsapp.svg" alt="WhatsApp Icon" className="w-8 h-8" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-left mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Please check your whatsapp.
            </h2>
            <p className="text-gray-600 text-sm">
              We've sent a verification code to{" "}
              {phoneNumber || "your email"}
            </p>
          </div>
        </div>
        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 mb-2">
          {otp.slice(0, 3).map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              placeholder="0"
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-16 text-center py-[2px] px-[8px] placeholder:text-[#D5D7DA] text-[#F04438] text-5xl font-semibold border-2 border-[#F04438] rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          ))}

          <span className="flex items-center text-[#D5D7DA] font-extrabold text-lg mx-2">
            –
          </span>

          {otp.slice(3, 6).map((digit, index) => (
            <input
              key={index + 3}
              id={`otp-${index + 3}`}
              type="text"
              maxLength={1}
              value={digit}
              placeholder="0"
              onChange={(e) => handleOTPChange(index + 3, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index + 3, e)}
              className="w-12 h-16 text-center text-5xl font-semibold placeholder:text-[#D5D7DA] py-[2px] px-[2px] text-[#F04438] border-2 border-[#F04438] rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Resend Code */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Didn't get a code?{" "}
            <button className="text-gray-600 underline hover:text-gray-800">
              Click to resend.
            </button>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 py-3">
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || otp.some(digit => digit === "")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
