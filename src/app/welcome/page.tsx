"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import AuthGuard from "@/components/AuthGuard";
import { useOnboardingFlow } from "@/utils/onboardingState";
import { useAppSelector } from "@/lib/hooks";
import { Avatar } from "@/components/base/avatar/avatar";

export default function WelcomePage() {
  const router = useRouter();
  const { fullName } = useAppSelector((state) => state.auth);
  const { flow, markWelcomeShown } = useOnboardingFlow();

  const handleGoToDashboard = () => {
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
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              WELCOME TO JANRICHES
            </h1>
          </div>

          {/* Introduction Section */}
          <div className="mb-12 space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Janriches, a vibrant social savings club that
              transforms financial wellness through commitment, perseverance,
              and collective saving. We believe in the power of community to
              build wealth and create lasting financial freedom.
            </p>

            {/* Testimonial 1 */}
            <div className="">
              <p className="text-gray-700 italic mb-2">
                "Through Janriches, I've achieved things I never thought
                possible. I've paid my varsity fees, built houses, and even
                traveled internationally. The discipline and support from this
                community changed my life."
              </p>
              <p className="text-sm font-semibold text-gray-900">
                - Muimeleli M.
              </p>
            </div>
          </div>

          {/* First Image */}
          <div className="mb-12">
            <img
              src="/welcome-img-1.jpg"
              alt="Community members celebrating"
              className="w-full h-[480px] rounded-lg object-cover"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Image courtesy of Fauxels via Pexels
            </p>
          </div>

          {/* The Importance of Saving Culture Section */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              The Importance of Saving Culture in the Black SA Community
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Financial instability and debt have long been challenges in the
              Black South African community, especially during the festive
              season. At Janriches, we're changing this narrative by encouraging
              disciplined saving and financial planning. Our members learn to
              prioritize their financial goals and build a culture of saving
              that benefits not just themselves, but their entire families and
              communities.
            </p>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="">
                <p className="text-gray-700 italic mb-2">
                  "Janriches helped me pay my son's fees without stress. The
                  structured saving approach made it possible."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  - Boitumelo Gaetsewe
                </p>
              </div>

              <div className="">
                <p className="text-gray-700 italic mb-2">
                  "I feel rich! Not just in money, but in knowledge. I'm
                  building a legacy of financial literacy for my children."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  - Molly Matlotlo
                </p>
              </div>
            </div>
          </div>

          {/* A Community of Financial Savvy Section */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              A COMMUNITY OF FINANCIAL SAVVY
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Janriches, we're committed to fostering financial discipline
              and transparency. Our platform provides the tools and support you
              need to achieve your savings goals while being part of a community
              that understands and supports your journey.
            </p>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="">
                <p className="text-gray-700 italic mb-2">
                  "The club helped me exceed my savings goals. The
                  accountability and community support made all the difference."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  - Nyiko C.
                </p>
              </div>

              <div className="">
                <p className="text-gray-700 italic mb-2">
                  "I have peace of mind knowing my savings are secure. Janriches
                  has helped me make sound financial decisions."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  - Noluthando Z.
                </p>
              </div>
            </div>
          </div>

          {/* In Conclusion Section */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              IN CONCLUSION
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              As you embark on this journey with Janriches, remember that every
              rand saved is a step toward financial freedom. Embrace the culture
              of saving, share your experiences with the community, and watch as
              you build a prosperous future for yourself, your family, and your
              community. Together, we're not just saving money—we're building a
              stronger, more financially empowered community.
            </p>
          </div>

          {/* Second Image */}
          <div className="mb-12">
            <img
              src="welcome-img-2.jpg"
              alt="Community members celebrating together"
              className="w-full h-[980px] rounded-lg object-cover"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Image courtesy of Michael Burrows via Pexels
            </p>
          </div>

          {/* Footer Section */}
          <div className="bg-[#FAFAFA] rounded-lg p-8 text-center mb-8">
            <h2 className="text-2xl sm:text-3xl  text-gray-900 mb-4">
              HERE'S TO ABUNDANCE
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Thank you for joining the Janriches community. We're excited to be
              part of your financial journey and look forward to celebrating
              your successes with you.
            </p>
            <p className="text-xl font-semibold  mb-8">
              Here's to abundance, growth, and financial freedom!
            </p>

          </div>
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-6">
              <div className="flex items-center gap-3 mr-2">
                <Avatar
                  size="md"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Jan Riches Executive"
                  className="w-10 h-10"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    Jan Riches Executive
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGoToDashboard}
                color="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
            </div>
        </div>
      </div>
    </AuthGuard>
  );
}
