"use client";
import React, { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CircularProgressStep from "@/components/CircularProgressStep";

const PlanSelectionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState("subscription");
  const [isProcessing, setIsProcessing] = useState(false);

  // PayFast configuration - replace with your actual credentials
  const PAYFAST_CONFIG = {
    merchant_id: "12062869",
    merchant_key: "4dtl43a4c0nhi",
    return_url: `${window.location.origin}/payment-success`,
    cancel_url: `${window.location.origin}/payment-cancelled`,
    notify_url: `${window.location.origin}/api/payfast-notify`,
    sandbox: true, // Use sandbox for testing
  };

  // Plan pricing
  const planPricing = {
    subscription: {
      amount: "249.99",
      item_name: "JanRiches Annual Subscription",
      item_description:
        "Join the community, save and start paying yourself first.",
    },
    "once-off": {
      amount: "349.99",
      item_name: "JanRiches Once-off Payment",
      item_description: "Be a part of the community on your own terms.",
    },
  };

  // Generate signature for PayFast (you'll need to implement this server-side for production)
  const generateSignature = (data) => {
    // In production, this should be done server-side for security
    // This is a simplified version for demonstration
    const crypto = require("crypto");
    const queryString = Object.keys(data)
      .filter((key) => data[key] !== "" && key !== "signature")
      .sort()
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");

    return crypto.createHash("md5").update(queryString).digest("hex");
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const selectedPlanData = planPricing[selectedPlan];

      // PayFast payment data
      const paymentData = {
        merchant_id: PAYFAST_CONFIG.merchant_id,
        merchant_key: PAYFAST_CONFIG.merchant_key,
        return_url: PAYFAST_CONFIG.return_url,
        cancel_url: PAYFAST_CONFIG.cancel_url,
        notify_url: PAYFAST_CONFIG.notify_url,

        // Payment details
        m_payment_id: `JR_${Date.now()}`, // Unique payment ID
        amount: selectedPlanData.amount,
        item_name: selectedPlanData.item_name,
        item_description: selectedPlanData.item_description,

        // Additional fields
        email_address: "user@example.com", // Replace with actual user email
        name_first: "User", // Replace with actual user name
        name_last: "Name", // Replace with actual user surname

        // Subscription details (if applicable)
        ...(selectedPlan === "subscription" && {
          subscription_type: "1", // Monthly
          billing_date: new Date().toISOString().split("T")[0],
          recurring_amount: selectedPlanData.amount,
          frequency: "3", // Annual
          cycles: "0", // Indefinite
        }),
      };

      // In production, you should generate the signature server-side
      // paymentData.signature = generateSignature(paymentData);

      // Create form and submit to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = PAYFAST_CONFIG.sandbox
        ? "https://sandbox.payfast.co.za/eng/process"
        : "https://www.payfast.co.za/eng/process";

      console.log("Payment Data:", paymentData);
      // Add form fields
      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });
      console.log("Submitting form to PayFast:", form);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setIsProcessing(false);
      // Handle error - show user-friendly message
      alert("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-10 py-8"
      style={{ background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)" }}
    >
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
                id="subscription"
                checked={selectedPlan === "subscription"}
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
                id="once-off"
                checked={selectedPlan === "once-off"}
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
            className="w-full bg-[#155EEF] hover:bg-[#155EEF] text-white py-6 text-base font-medium rounded-lg disabled:opacity-50"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : `Pay R${
                  selectedPlan === "subscription" ? "249.99" : "349.99"
                } Now`}
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
