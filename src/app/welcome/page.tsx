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
  const onBoardingFlow = useAppSelector((state) => state.onboarding.flow);
  const { flow, markWelcomeShown } = useOnboardingFlow();

  const handleGoToDashboard = () => {
    // Mark welcome as shown
    markWelcomeShown();
    // Redirect to profile page
    router.push("/profile");
  };

  // Prevent back navigation - if user hasn't completed savings goal, redirect
  useEffect(() => {
    if (onBoardingFlow.isOnboardingComplete) {
      router.push("/dashboard");
    }
    if (
      !onBoardingFlow.isOnboardingComplete &&
      !onBoardingFlow.savingsGoalCreated
    ) {
      router.push("/dashboard");
    }
    if (!onBoardingFlow.isOnboardingComplete && onBoardingFlow.welcomeShown) {
      router.push("/profile");
    }
  }, [router, flow.savingsGoalCreated]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="border-t pt-6 mb-2">
            <h1 className="text-4xl sm:text-5xl text-[#181D27] font-cinzel mb-4">
              WELCOME TO JANRICHES
            </h1>
          </div>

          {/* Introduction Section */}
          <div className="mb-4 space-y-6">
            <p className="text-lg text-[#535862]">
              We are thrilled to welcome you to the Janriches community, a
              vibrant social savings club that is transforming the way we
              approach financial wellness in our lives. As we reflect on our
              journey together, we celebrate the remarkable successes that our
              members have achieved through commitment, perseverance, and the
              power of collective saving.
            </p>

            {/* Testimonial 1 */}
            <p className="text-[#535862] mb-2">
              Janriches has become more than just a savings club; it is a
              movement that empowers individuals to take control of their
              financial futures. Our members have shared inspiring testimonials
              that highlight the profound impact Janriches has had on their
              lives. For instance, Muimeleli M., a member since 2016, shares,
              "JanRiches didn’t only teach me the importance of saving and
              paying myself first. With the savings, I was able to pay my
              youngest brother's varsity fees, build my family house, and also
              build a house for my uncle. Janriches savings continues to help me
              see and treat money differently, and I get to travel
              internationally every year with my savings."
            </p>
          </div>

          {/* First Image */}
          <div className="mb-4">
            <img
              src="/welcome-img-1.jpg"
              alt="Community members celebrating"
              className="w-full h-[480px] rounded-lg object-cover"
            />
            <p className="text-xs text-gray-500 mt-2">
              Image courtesy of Fauxels via Pexels
            </p>
          </div>

          {/* The Importance of Saving Culture Section */}
          <div className="mb-4 space-y-6">
            <p className="text-lg text-[#535862]">
              Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim
              mauris id. Non pellentesque congue eget consectetur turpis.
              Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt
              aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue
              felis elit erat nam nibh orci.
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#535862]">
              The Importance of Saving Culture in the Black SA Community
            </h2>
            <p className="text-lg text-[#535862]">
              Financial instability and debt have long been challenges in the
              Black South African community, especially during the festive
              season. At Janriches, we're changing this narrative by encouraging
              disciplined saving and financial planning. Our members learn to
              prioritize their financial goals and build a culture of saving
              that benefits not just themselves, but their entire families and
              communities.
            </p>
          </div>

          {/* A Community of Financial Savvy Section */}
          <div className="mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-cinzel text-[#535862]">
              A COMMUNITY OF FINANCIAL SAVVY
            </h2>
            <p className="text-lg text-[#535862] leading-relaxed">
              At Janriches, we are proud to foster a culture of financial
              discipline and transparency. Nyiko C, who joined us in January
              2024, expressed how the club helped him exceed his savings goals.
              "The great thing about JanRiches is that it gives me the
              transparency of seeing my savings and the discipline as I cannot
              access the money when I want to, but have to wait until the set
              time in January." This commitment to saving is what sets us apart
              and creates a sense of security among our members.
            </p>
            <p className="text-lg text-[#535862] leading-relaxed">
              At Janriches, we are proud to foster a culture of financial
              discipline and transparency. Nyiko C, who joined us in January
              2024, expressed how the club helped him exceed his savings goals.
              "The great thing about JanRiches is that it gives me the
              transparency of seeing my savings and the discipline as I cannot
              access the money when I want to, but have to wait until the set
              time in January." This commitment to saving is what sets us apart
              and creates a sense of security among our members.
            </p>
          </div>

          {/* In Conclusion Section */}
          <div className="mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-cinzel text-[#535862]">
              IN CONCLUSION
            </h2>
            <p className="text-lg text-[#535862] leading-relaxed">
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
              src="/welcome-img-2.jpg"
              alt="Community members celebrating together"
              className="w-full h-[980px] rounded-lg object-cover"
            />
            <p className="text-xs text-gray-500 mt-2">
              Image courtesy of Michael Burrows via Pexels
            </p>
          </div>

          {/* Footer Section */}
          <div className="bg-[#FAFAFA] rounded-lg p-8 mb-8">
            <h2 className="text-2xl sm:text-3xl font-cinzel text-[#535862] mb-4">
              HERE'S TO ABUNDANCE
            </h2>
            <p className="text-lg text-[#535862]">
              Thank you for being a part of Janriches. Here’s to a future filled
              with abundance, growth, and financial freedom!
            </p>
          </div>
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center border-t pt-4 justify-start gap-4 sm:gap-6">
            <div className="flex items-center flex-row mr-2">
              <div className="relative">
                <Avatar
                  size="md"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Jan Riches Executive"
                  className="w-10 h-10 z-10"
                />
                <Avatar
                  size="md"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Jan Riches Executive"
                  className="w-10 h-10 z-20  -left-4"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#535862]">
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
