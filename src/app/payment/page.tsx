"use client";
import React, { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import CircularProgressStep from "@/components/CircularProgressStep";
import PublicRouteGuard from "@/components/PublicRouteGuard";

const PlanSelectionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState("subscription");
  const [isProcessing, setIsProcessing] = useState(false);

  // PayFast configuration - sandbox credentials for testing
  const PAYFAST_CONFIG = {
    merchant_id: "10038198",
    merchant_key: "8yshtxb2mu1oa",
    return_url: `${window.location.origin}/payment-success`,
    cancel_url: `${window.location.origin}/payment-cancelled`,
    notify_url: `${window.location.origin}/api/payfast-notify`,
    sandbox: true, // Sandbox mode for testing
  };

  // Plan pricing
  const planPricing = {
    subscription: {
      amount: "200",
      item_name: "subscription",
      item_description:
        "Join the community, save and start paying yourself first.",
    },
    "once-off": {
      amount: "349.99",
      item_name: "JanRiches Once-off Payment",
      item_description: "Be a part of the community on your own terms.",
    },
  };

  // Test signature generation with known values
  const testSignatureGeneration = () => {
    const crypto = require("crypto");
    const testData: Record<string, string> = {
      merchant_id: "10038198",
      merchant_key: "8yshtxb2mu1oa",
      amount: "200",
      item_name: "subscription",
    };

    const queryString = Object.keys(testData)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(testData[key])}`)
      .join("&");

    // Test without passphrase
    const signatureWithoutPassphrase = crypto
      .createHash("md5")
      .update(queryString)
      .digest("hex");
    console.log("Test query string (no passphrase):", queryString);
    console.log("Test signature (no passphrase):", signatureWithoutPassphrase);

    // Test with passphrase
    const passphrase = "your_passphrase_here"; // Replace with your actual passphrase
    const queryStringWithPassphrase = `${queryString}&passphrase=${passphrase}`;
    const signatureWithPassphrase = crypto
      .createHash("md5")
      .update(queryStringWithPassphrase)
      .digest("hex");
    console.log(
      "Test query string (with passphrase):",
      queryStringWithPassphrase
    );
    console.log("Test signature (with passphrase):", signatureWithPassphrase);

    console.log("Expected signature:", "35773c2456df895197ee211c354933f2");
    console.log(
      "Match (no passphrase):",
      signatureWithoutPassphrase === "35773c2456df895197ee211c354933f2"
    );
    console.log(
      "Match (with passphrase):",
      signatureWithPassphrase === "35773c2456df895197ee211c354933f2"
    );
  };

  // Generate signature for PayFast
  const generateSignature = (data: Record<string, any>) => {
    const crypto = require("crypto");

    // PayFast signature generation requires specific order and format
    // Remove empty values and signature field
    const filteredData = Object.keys(data)
      .filter(
        (key) =>
          data[key] !== "" &&
          data[key] !== null &&
          data[key] !== undefined &&
          key !== "signature"
      )
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {} as Record<string, any>);

    // Create query string in alphabetical order
    const queryString = Object.keys(filteredData)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(filteredData[key])}`)
      .join("&");

    // Add passphrase if you have one (check your PayFast account settings)
    const passphrase = "your_passphrase_here"; // Replace with your actual PayFast passphrase
    const finalString = passphrase
      ? `${queryString}&passphrase=${passphrase}`
      : queryString;

    console.log("Query string for signature:", finalString);

    return crypto.createHash("md5").update(finalString).digest("hex");
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const selectedPlanData =
        planPricing[selectedPlan as keyof typeof planPricing];

      // PayFast payment data
      const paymentData: Record<string, any> = {
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

      // Test signature generation first
      testSignatureGeneration();

      // Generate signature for PayFast
      // paymentData.signature = generateSignature(paymentData);

      // Create form and submit to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payfast.co.za/eng/process";

      console.log("Payment Data:", paymentData);
      console.log("PayFast Sandbox URL:", form.action);
      console.log("Generated Signature:", paymentData.signature);
      console.log(
        "Expected Signature from your details:",
        "35773c2456df895197ee211c354933f2"
      );

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
    <PublicRouteGuard>
      <div
        className="min-h-screen flex items-center justify-center px-10 py-8"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
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
                <div className="flex-1 h-[3px] bg-primary-500" />
                <CircularProgressStep status={"isCompleted"} />
                <div className="flex-1 h-[3px] bg-primary-500" />
                <CircularProgressStep status={"isActive"} />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-error-600 mb-2">
                Plan Selection
              </h2>
              <p className="text-text text-sm">
                We've got two payment options for you, Subscriptions and
                Once-off
              </p>
            </div>

            {/* Subscription Plan */}
            <div
              className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition-all ${
                selectedPlan === "subscription"
                  ? "border-primary-500"
                  : "border-border-inactive hover:border-gray-300"
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
                      <span className="text-gray-600">R200.00/year</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Join the community, save and start paying yourself first.
                  </p>
                </div>
                <Checkbox
                  id="subscription"
                  isSelected={selectedPlan === "subscription"}
                  onChange={(isSelected) => {
                    if (isSelected) {
                      setSelectedPlan("subscription");
                    }
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Once-off Plan */}
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === "once-off"
                  ? "border-primary-500"
                  : "border-border-inactive hover:border-gray-300"
              }`}
              onClick={() => setSelectedPlan("once-off")}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <span className="font-medium text-gray-900">
                        Once Off{" "}
                      </span>
                      <span className="text-gray-600">R349.99 once-off</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Be a part of the community on your own terms.
                  </p>
                </div>
                <Checkbox
                  id="once-off"
                  isSelected={selectedPlan === "once-off"}
                  onChange={(isSelected) => {
                    if (isSelected) {
                      setSelectedPlan("once-off");
                    }
                  }}
                  className="mt-1"
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
              color="primary"
              size="md"
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Pay R${
                    selectedPlan === "subscription" ? "200.00" : "349.99"
                  } Now`}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicRouteGuard>
  );
};

export default PlanSelectionScreen;
