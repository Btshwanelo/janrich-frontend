"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

interface PublicRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRouteGuard({
  children,
  fallback,
  redirectTo = "/dashboard",
}: PublicRouteGuardProps) {
  const { isAuthenticated, isVerificationComplete, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Reset redirect flag when authentication state changes
    if (isLoading) {
      hasRedirectedRef.current = false;
      return;
    }

    // Don't redirect if we're on register page - let the registration hook handle the redirect
    // This prevents the login screen from flashing before redirecting to verification
    if (pathname === "/register") {
      return;
    }

    if (!isLoading && isAuthenticated && !hasRedirectedRef.current) {
      // If not verified, redirect to verification page
      if (!isVerificationComplete) {
        // Only redirect if not already on verification page
        if (pathname !== "/verification" && !pathname.startsWith("/verification/")) {
          hasRedirectedRef.current = true;
          // Use window.location for full page reload to ensure state is properly read
          window.location.href = "/verification";
        }
      } else {
        // If verified, redirect to the specified redirectTo (default: dashboard)
        // Only redirect if not already on the target route
        if (pathname !== redirectTo) {
          hasRedirectedRef.current = true;
          router.push(redirectTo);
        }
      }
    }
  }, [isAuthenticated, isVerificationComplete, isLoading, router, redirectTo, pathname]);

  // // Show loading state while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // // Show fallback or redirect if authenticated
  // if (isAuthenticated) {
  //   return fallback || (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Redirecting to dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // User is not authenticated, render children
  return <>{children}</>;
}
