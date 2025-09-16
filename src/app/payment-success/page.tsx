'use client'
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccessPage = () => {
  const handleAccessAccount = () => {
    // Handle navigation to account
    console.log("Accessing account...");
  };

  return (
    <div
      className="min-h-screen flex  justify-center p-6"
      style={{
        background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
      }}
    >
      <div className="text-center max-w-md mt-[48px] w-full">
        {/* Success Icon */}
        <div className="mb-8 flex relative justify-center">
          <img
            src="/Content.png"
            alt="Background"
            className="absolute z-0 h-full object-cover"
            style={{
              maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 60%, transparent 100%)",
            }}
          />
          <div className="relative">
            <img
              src="/Illustration.png"
              alt="Envelope Icon"
              className="w-full z-10"
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful
          </h1>
          <p className="text-gray-700 text-base leading-relaxed">
            Congratulations your Jan riches account has been successfully
            created.
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAccessAccount}
          className=" bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium"
        >
          Access your account
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
