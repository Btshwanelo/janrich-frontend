"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import AuthGuard from "@/components/AuthGuard";
import { useOnboardingFlow } from "@/utils/onboardingState";
import { useAppSelector } from "@/lib/hooks";

export default function WelcomePage() {
  const router = useRouter();
  const { fullName } = useAppSelector((state) => state.auth);
  const { flow, markWelcomeShown } = useOnboardingFlow();

  const handleContinue = () => {
    // Mark welcome as shown
    markWelcomeShown();
    // Redirect to profile page
    router.push("/profile");
  };

  // Prevent back navigation - if user hasn't completed savings goal, redirect
  useEffect(() => {
    if (!flow.savingsGoalCreated) {
      router.push("/dashboard");
    }
  }, [router, flow.savingsGoalCreated]);

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex items-center justify-center px-6 py-8"
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
                className="mx-auto w-12 h-auto"
              />
            </div>

            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to JanRich{fullName ? `, ${fullName.split(" ")[0]}` : ""}!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              You're all set to start your savings journey
            </p>
            <p className="text-sm text-gray-500">
              Let's complete your profile to get the most out of your experience
            </p>
          </div>

          {/* Welcome Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Savings Goal Set
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your annual savings goal has been saved successfully
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add your personal details, beneficiary information, and financial details
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 mb-1">
                    Start Saving
                  </h3>
                  <p className="text-sm text-gray-500">
                    Begin your journey towards financial freedom
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            color="primary"
            size="lg"
            className="w-full"
            iconTrailing={<ArrowRight className="w-5 h-5" />}
          >
            Complete Your Profile
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
