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
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
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

  // Handle onboarding flow redirection
  useEffect(() => {
    // Only check onboarding if user is authenticated and not loading
    if (!isLoading && isAuthenticated && !flow.isOnboardingComplete) {
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
          pathname.startsWith("/welcome") ||
          pathname.startsWith("/onboarding/");

        // If we're on an onboarding route but not the correct one, redirect
        // If we're on a protected route (like /dashboard), redirect to onboarding
        if (isOnboardingRoute || pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
          router.push(targetRoute);
        }
      }
    }
  }, [isLoading, isAuthenticated, flow, router, pathname]);

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
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      )
    );
  }

  // If authenticated but onboarding not complete, show loading while redirecting
  if (!flow.isOnboardingComplete) {
    const nextStep = getNextOnboardingStep(flow);
    const onboardingRoutes: Record<string, string> = {
      welcome: "/welcome",
      goal: "/onboarding/goal",
      financial: "/onboarding/financial",
      beneficiary: "/onboarding/benefitiary",
    };
    const targetRoute = onboardingRoutes[nextStep];

    // If we're already on the target route, render children (allow the onboarding page to render)
    if (targetRoute && pathname === targetRoute) {
      return <>{children}</>;
    }

    // Otherwise show loading while redirecting
    return (
      fallback || (
        <div className="flex w-screen h-screen items-center justify-center  mt-16 lg:mt-0">
          <div className="text-center flex flex-col justify-cente align-middle items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <p className="text-gray-600">Redirecting to onboarding...</p>
          </div>
        </div>
      )
    );
  }

  // User is authenticated and onboarding is complete, render children
  return <>{children}</>;
}
