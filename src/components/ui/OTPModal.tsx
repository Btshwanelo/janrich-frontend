import React, { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function EmailVerificationModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");
    console.log("Verifying code:", verificationCode);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleResend = () => {
    console.log("Resending code...");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Open Verification Modal
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center items-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Please check your email.
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              We've sent a code to{" "}
              <span className="font-medium text-gray-900">
                olivia@untitledui.com
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="flex gap-3 justify-center">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-3xl font-semibold border-2 border-blue-500 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>

            <p className="text-center text-sm text-gray-600">
              Didn't get a code?{" "}
              <button
                onClick={handleResend}
                className="text-gray-900 hover:text-gray-700 font-medium underline"
              >
                Click to resend.
              </button>
            </p>

            <div className="flex gap-3 w-full">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11"
              >
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
