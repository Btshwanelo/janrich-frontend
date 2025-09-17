"use client";
import React, { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CircularProgressStep from "@/components/CircularProgressStep";

const PlanSelectionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState("subscription");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-10 py-8"
      style={{ background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)" }}
    >
          {/* <img
            src="/logo-bg.svg"
            alt="Background"
            className="absolute top-0 z-0 h-full w-full max-w-md"
            style={{
              maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 60%, transparent 100%)",
            }}
          /> */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center relative mb-8">
          <div className="mb-6">
            <img
              src="/logo-svg.svg"
              alt="JanRich Logo"
              className="mx-auto w-12 h-auto"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete your sign up
          </h1>
          <p className="text-gray-600">We're nearly done,</p>
        </div>

        {/* Plan Selection Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          {/* Progress Steps */}
          <div className="mb-8 mx-10">
            <div className="flex items-center justify-center">
              <CircularProgressStep status={"isCompleted"} />
              <div className="flex-1 h-[3px] bg-[#E31B54]" />
              <CircularProgressStep status={"isCompleted"} />
              <div className="flex-1 h-[3px] bg-[#E31B54]" />
              <CircularProgressStep status={"isActive"} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#BC1B06] mb-2">
              Plan Selection
            </h2>
            <p className="text-[#535862] text-sm">
              We've got two payment options for you, Subscriptions and Once-off
            </p>
          </div>

          {/* Subscription Plan */}
          <div
            className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition-all ${
              selectedPlan === "subscription"
                ? "border-[#155EEF]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPlan("subscription")}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <span className="font-medium text-gray-900">
                      Subscription{" "}
                    </span>
                    <span className="text-gray-600">R249.99/year</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Join the community, save and start paying yourself first.
                </p>
              </div>
              <Checkbox
                id="rememberMe"
                checked={selectedPlan === "subscription"}
                // onCheckedChange={(checked) =>
                //   setFormData((prev) => ({ ...prev, rememberMe: checked }))
                // }
                className="mt-1 data-[state=checked]:bg-[#E31B54] data-[state=checked]:border-[#E31B54]"
              />
            </div>
          </div>

          {/* Once-off Plan */}
          <div
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              selectedPlan === "once-off"
                ? "border-[#155EEF]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPlan("once-off")}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <span className="font-medium text-gray-900">Once Off </span>
                    <span className="text-gray-600">R349.99 once-off</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Be a part of the community on your own terms.
                </p>
              </div>
              <Checkbox
                id="rememberMe"
                checked={selectedPlan === "once-off"}
                // onCheckedChange={(checked) =>
                //   setFormData((prev) => ({ ...prev, rememberMe: checked }))
                // }
                className="mt-1 data-[state=checked]:bg-[#E31B54] data-[state=checked]:border-[#E31B54]"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-4 my-6">
            <img
              src="/visa.svg"
              alt="Visa"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/mastercard.svg"
              alt="MasterCard"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/blue-mastercard.svg"
              alt="PayPal"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Pay Button */}
          <Button
            className="w-full bg-[#155EEF] hover:bg-[#155EEF] text-white py-6 text-base font-medium rounded-lg"
            onClick={() => console.log(`Selected plan: ${selectedPlan}`)}
          >
            Pay R{selectedPlan === "subscription" ? "249.99" : "349.99"} Now
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="#"
              className="text-[#E31B54] hover:text-[#E31B54] font-medium"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionScreen;
