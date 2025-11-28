"use client";
import React from "react";
import { Button } from "@/components/base/buttons/button";
import CircularProgressStep from "@/components/CircularProgressStep";
import { usePayment } from "@/hooks/usePayment";
import { PAYMENT_PLANS } from "@/constants/payment";
import { PlanCard, PaymentMethods } from "@/components/payment";
import { ErrorAlert } from "@/components/base/error-alert";
import AuthGuard from "@/components/AuthGuard";

const PlanSelectionScreen = () => {
  const { selectedPlan, setSelectedPlan, handlePayment, isProcessing } =
    usePayment();

  const selectedPlanData = PAYMENT_PLANS[selectedPlan];

  return (
    <AuthGuard>
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
                src="/jr-logo-black.svg"
                alt="JanRich Logo"
                className="mx-auto w-[99px] h-auto"
              />
            </div>

            <h1 className="text-3xl font-cinzel font-normal text-[#181D27] mb-2">
              Complete your sign up
            </h1>
            <p className="text-[#535862]">We're nearly done,</p>
          </div>

          {/* Plan Selection Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            {/* Progress Steps */}
            <div className="mb-8 mx-10">
              <div className="flex items-center justify-center">
                <CircularProgressStep status="isCompleted" />
                <div className="flex-1 h-[3px] bg-[#1F235B]" />
                <CircularProgressStep status="isCompleted" />
                <div className="flex-1 h-[3px] bg-[#1F235B]" />
                <CircularProgressStep status="isActive" />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-semibold  mb-2">Plan Selection</h2>
              <p className="text-text text-sm">
                We've got two payment options for you, Subscriptions and
                Once-off
              </p>
            </div>

            {/* Subscription Plan */}
            <PlanCard
              planId="subscription"
              label="Subscription"
              amount={PAYMENT_PLANS.subscription.displayAmount}
              description={PAYMENT_PLANS.subscription.item_description}
              isSelected={selectedPlan === "subscription"}
              onSelect={() => setSelectedPlan("subscription")}
            />

            {/* Once-off Plan */}
            <PlanCard
              planId="once-off"
              label="Once Off"
              amount={PAYMENT_PLANS["once-off"].displayAmount}
              description={PAYMENT_PLANS["once-off"].item_description}
              isSelected={selectedPlan === "once-off"}
              onSelect={() => setSelectedPlan("once-off")}
            />

            {/* Payment Methods */}
            <PaymentMethods />

            {/* Error Message */}
            <ErrorAlert autoClearOnUnmount={false} />

            {/* Pay Button */}
            <Button
              color="primary"
              size="md"
              className="w-full"
              onClick={handlePayment}
              isDisabled={isProcessing}
              isLoading={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Pay ${selectedPlanData.displayAmount} Now`}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default PlanSelectionScreen;
