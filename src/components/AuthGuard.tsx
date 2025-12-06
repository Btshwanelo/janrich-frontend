"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { clearAuthCookie } from "@/lib/slices/authSlice";
import { getNextOnboardingStep } from "@/utils/onboardingState";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isVerificationComplete, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const flow = useAppSelector((state) => state.onboarding.flow);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Clear the auth cookie to prevent middleware redirect loop
      clearAuthCookie();
      // Use window.location for more reliable redirect
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Redirect to verification if authenticated but not verified
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      !isVerificationComplete &&
      pathname !== "/verification" &&
      !pathname.startsWith("/verification/")
    ) {
      router.push("/verification");
    }
  }, [isLoading, isAuthenticated, isVerificationComplete, router, pathname]);

  // Handle onboarding flow redirection
  useEffect(() => {
    // Only check onboarding if user is authenticated, verified, and not loading
    if (
      !isLoading &&
      isAuthenticated &&
      isVerificationComplete &&
      !flow.isOnboardingComplete
    ) {
      console.log("flow.isOnboardingComplete", {
        isLoading,
        isAuthenticated,
        isVerificationComplete,
        flow,
      });
      const nextStep = getNextOnboardingStep(flow);

      // Define the routes for each onboarding step
      const onboardingRoutes: Record<string, string> = {
        welcome: "/welcome",
        goal: "/onboarding/goal",
        financial: "/onboarding/financial",
        beneficiary: "/onboarding/benefitiary",
      };

      const targetRoute = onboardingRoutes[nextStep];

      // Only redirect if we're not already on the target route
      // This prevents redirect loops
      if (targetRoute && pathname !== targetRoute) {
        // Check if current path is an onboarding-related route
        const isOnboardingRoute =
          pathname === "/onboarding" ||
          pathname.startsWith("/welcome") ||
          pathname.startsWith("/onboarding/");

        // Don't redirect from payment routes or /onboarding - they're part of the flow
        const allowedRoutes = [
          "/onboarding",
          "/payment",
          "/payment-success",
          "/payment-cancelled",
        ];

        if (
          allowedRoutes.includes(pathname) ||
          pathname.startsWith("/payment")
        ) {
          // Allow these routes to render, don't redirect
          return;
        }

        // If we're on an onboarding route but not the correct one, redirect
        // If we're on a protected route (like /dashboard), redirect to onboarding
        if (
          isOnboardingRoute ||
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/profile")
        ) {
          router.push(targetRoute);
        }
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    isVerificationComplete,
    flow,
    router,
    pathname,
  ]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex w-screen h-screen items-center justify-center  mt-16 lg:mt-0">
        <div className="text-center flex flex-col justify-cente align-middle items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show fallback while redirecting
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex w-screen h-screen items-center justify-center  mt-16 lg:mt-0">
          <div className="text-center flex flex-col justify-cente align-middle items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            {/* <p className="text-gray-600">Redirecting...</p> */}
          </div>
        </div>
      )
    );
  }

  // If authenticated but not verified, show loading while redirecting
  // But only if we're not already on the verification page
  if (
    !isVerificationComplete &&
    pathname !== "/verification" &&
    !pathname.startsWith("/verification/")
  ) {
    return (
      fallback || (
        <div className="flex w-screen h-screen items-center justify-center  mt-16 lg:mt-0">
          <div className="text-center flex flex-col justify-cente align-middle items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            {/* <p className="text-gray-600">Redirecting to verification...</p> */}
          </div>
        </div>
      )
    );
  }

  // If authenticated but onboarding not complete, show loading while redirecting
  // But only if verification is complete (don't show onboarding message on verification page)
  if (!flow.isOnboardingComplete && isVerificationComplete) {
    const nextStep = getNextOnboardingStep(flow);
    const onboardingRoutes: Record<string, string> = {
      welcome: "/welcome",
      goal: "/onboarding/goal",
      financial: "/onboarding/financial",
      beneficiary: "/onboarding/benefitiary",
    };
    const targetRoute = onboardingRoutes[nextStep];

    // Allow certain routes to render even if onboarding is not complete
    // These routes are part of the onboarding/payment flow
    const allowedRoutes = [
      "/onboarding",
      "/payment",
      "/payment-success",
      "/payment-cancelled",
    ];

    // Check if we're on an allowed route or the target onboarding route
    if (
      allowedRoutes.includes(pathname) ||
      pathname.startsWith("/payment") ||
      (targetRoute && pathname === targetRoute)
    ) {
      return <>{children}</>;
    }

    // Otherwise show loading while redirecting
    return (
      fallback || (
        <div className="flex w-screen h-screen items-center justify-center  mt-16 lg:mt-0">
          <div className="text-center flex flex-col justify-cente align-middle items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            {/* <p className="text-gray-600">Redirecting to onboarding...</p> */}
          </div>
        </div>
      )
    );
  }

  // User is authenticated and onboarding is complete, render children
  return <>{children}</>;
}
