"use client";
import React from "react";
import { Button } from "@/components/base/buttons/button";
import { useRouter } from "next/navigation";
import PublicRouteGuard from "@/components/PublicRouteGuard";

const PasswordResetSuccessPage = () => {
  const router = useRouter();
  const handleLogin = () => {
    // Navigate to login page
    router.push("/login");
  };

  return (
    <PublicRouteGuard>
      <div
        className="min-h-screen flex justify-center p-6"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        <div className="text-center max-w-md mt-[48px] w-full">
          {/* Success Icon */}
          <div className="mb-8 flex relative justify-center">
            <img
              src="/Content.png"
              alt="Background"
              className="absolute z-0 h-full object-cover"
              style={{
                maskImage:
                  "radial-gradient(circle, black 30%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(circle, black 60%, transparent 100%)",
              }}
            />
            <div className="relative">
              <img
                src="/illustrator.svg"
                alt="Success Icon"
                className="w-full z-10"
              />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successful
            </h1>
            <p className="text-text text-base leading-relaxed">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>
          </div>

          {/* Action Button */}
          <Button
            color="primary"
            size="md"
            onClick={handleLogin}
            className=""
          >
            Log in
          </Button>
        </div>
      </div>
    </PublicRouteGuard>
  );
};

export default PasswordResetSuccessPage;
