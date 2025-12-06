"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import AuthGuard from "@/components/AuthGuard";
import { useOnboardingFlow } from "@/utils/onboardingState";
import { useAppSelector } from "@/lib/hooks";
import { useGetProfileQuery } from "@/lib/slices/authSlice";
import { Avatar } from "@/components/base/avatar/avatar";
import {
  Zap,
  Trophy,
  BarChart3,
  RefreshCw,
  Coins,
  ArrowRight,
} from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { fullName, customer } = useAppSelector((state) => state.auth);
  const { markWelcomeShown } = useOnboardingFlow();
  const { data: profileData } = useGetProfileQuery(customer || "", {
    skip: !customer,
  });

  const handleGoToDashboard = () => {
    markWelcomeShown();
    // Redirect to goal page (next step in onboarding)
    router.push("/onboarding/goal");
  };

  // Extract first name from fullName
  const firstName = fullName?.split(" ")[0] || "Saver";

  // Get customer ID and format member number
  const customerId =
    profileData?.message?.data?.basic_info?.customer_id || customer || "";
  const memberNumber = customerId ? `JROO${customerId}` : "JROO###";

  // Bank details (from the design)
  const bankDetails = {
    accountName: "Absa Investment Club",
    bank: "ABSA",
    accountNumber: "9391836719",
    reference: `Use your Member Number (${memberNumber})`,
  };

  // Sample avatars for the community section
  const communityAvatars = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  ];

  return (
    <AuthGuard>
      <div
        className="min-h-screen "
        style={{
          background: "linear-gradient(65deg, #9bbaf9 0%, #f7f7f7 65%)",
        }}
      >
        {/* Header/Hero Section with Gradient Background */}
        <div className=" pt-8 sm:pt-12 max-w-[616px] mx-auto mb-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
            {/* Three Profile Pictures */}
            <div className="flex justify-center relative items-center gap-10 ">
              <Avatar
                size="xl"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt="Community member"
                className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200"
              />
              <Avatar
                size="xl"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Community member"
                className="w-16 h-16 sm:w-24 mb-5 sm:h-24 absolute z-10 border-2 border-gray-200"
              />
              <Avatar
                size="xl"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                alt="Community member"
                className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl text-[#252B37] font-bold font-cinzel text-center">
              WELCOME TO JANRICHES
            </h1>

            {/* Subtitle */}
            <p className="text-3xl text-[#252B37] text-center font-cinzel">
              WHERE YOU PAY YOURSELF FIRST!
            </p>

            {/* Welcome Message */}
            <p className="  text-black text-center text-lg max-w-3xl mx-auto leading-relaxed">
              Welcome, {firstName}! The savings squad just got stronger! You've
              officially joined the JanRiches crew, the savers who beat
              Januworry and walk into the new year with vibes AND money!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-4 sm:mx-auto  mt-2">
          {/* JanRiches Member Details Section */}
          <div className="bg-[#1F235B] max-w-[616px] mx-auto rounded-lg p-6 sm:p-8 mb-3 justify-center align-middle text-center text-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Your JanRiches Member Number:
            </h2>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold font-cinzel mb-4">
              {customerId}
            </p>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#B2CCFF] mb-4">
                JanRiches Bank Details:
              </h3>
              <div className="space-y-2 text-base text-[#B2CCFF]">
                <p>{bankDetails.accountName}</p>
                <p>
                  <span className="font-bold">Bank:</span> {bankDetails.bank}
                </p>
                <p>
                  <span className="font-bold">Account Number:</span>{" "}
                  {bankDetails.accountNumber}
                </p>
                <p>
                  <span className="font-bold">Reference:</span>{" "}
                  {bankDetails.reference}
                </p>
              </div>
            </div>
          </div>
          {/* Community Avatars Row */}
          <div className="flex items-center max-w-[616px] mx-auto relative justify-center mb-3 gap-2">
            {communityAvatars.map((src, index) => (
              <Avatar
                key={index}
                size="sm"
                src={src}
                alt="Community member"
                className="w-8 h-8 sm:w-10 sm:h-10 -ml-4 first:ml-0 border-2 border-white"
              />
            ))}
            <span className="text-sm sm:text-base ml-2">+5</span>
          </div>

          {/* "Here's What You Can Do Now" Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 py-10 px-5 gap-8 mb-12 bg-white">
            {/* Left Column */}
            <div className="flex flex-col items-start col-span-1">
              <div className="mb-2">
                <img src="/blaze-icon.svg" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-cinzel text-[#181D27] mb-2">
                HERE'S WHAT YOU CAN DO NOW
              </h2>
              <p className="text-base sm:text-lg text-[#535862] leading-relaxed">
                Powerful, self-serve product and growth analytics to help you
                convert, engage, and retain more users.
              </p>
            </div>

            {/* Right Column - Action Items */}
            <div className=" grid grid-cols-2 col-span-2">
              {/* Pay yourself first */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="">
                    <img src="/bank-note-icon.svg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#181D27] mb-1">
                    Pay yourself first!
                  </h3>
                  <p className="text-sm sm:text-base text-[#535862]">
                    Use the bank details above to make your first deposit
                  </p>
                </div>
              </div>

              {/* Track Progress */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="">
                    <img src="/track.svg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#181D27] mb-1">
                    Track Progress
                  </h3>
                  <p className="text-sm sm:text-base text-[#535862]">
                    Track your progress and watch your pot grow
                  </p>
                </div>
              </div>

              {/* Celebrate Wins */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="">
                    <img src="/cup-icon.svg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#181D27] mb-1">
                    Celebrate Wins
                  </h3>
                  <p className="text-sm sm:text-base text-[#535862]">
                    Celebrate your wins (and brag a little)
                  </p>
                </div>
              </div>

              {/* Repeat */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="">
                    <img src="/recycle-icon.svg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#181D27] mb-1">
                    Repeat!
                  </h3>
                  <p className="text-sm sm:text-base text-[#535862]">
                    Repeat! Because consistency = stress-free Januarys
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* "We've Been Mentioned in the Press" Section */}
          <div className="mb-12 max-w-[616px] px-6 mx-auto">
            <h2 className="text-base text-[#535862] mb-6 text-center">
              We've been mentioned in the press
            </h2>
            <div className="flex flex-col gap-8">
              {/* Placeholder for media logos - these would typically be actual logo images */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center">
                <img src="/washinton-post.svg" alt="one" />
                <img src="/tech-crunch.svg" alt="one" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center">
                <img src="/bloomberg.svg" alt="one" />
                <img src="/gizmodo.svg" alt="one" />
                <img src="/forbes.svg" alt="one" />
              </div>
            </div>
          </div>

          {/* Call to Action/Closing Section */}
          <div className="text-center space-y-4 pb-8 max-w-[616px] mx-auto">
            <p className="text-base sm:text-lg text-black">
              Check your inbox or WhatsApp, we've sent your Welcome Pack with
              everything you need to start strong
            </p>
            <p className="text-base sm:text-lg text-black">
              Asijiki, saver! You've just joined hundreds of disciplined savers
              changing the way we do money, one deposit at a time.
            </p>
            <h2 className="text-3xl sm:text-4xl font-cinzel text-black">
              THE JOURNEY TO A STRESS-FREE JANUARY STARTS TODAY.
            </h2>
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleGoToDashboard}
                color="primary"
                size="lg"
                iconTrailing={<ArrowRight className="w-5 h-5" />}
                className=""
              >
                Let's do this
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
