"use client";
import { Button } from "@/components/base/buttons/button";
import React from "react";

const PageNotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div
      className="min-h-screen flex justify-center p-6"
      style={{
        background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
      }}
    >
      <div className="text-center max-w-md mt-[48px] w-full">
        {/* 404 Icon */}
        <div className="mb-8 flex relative justify-center">
          <img
            src="/Content.png"
            alt="Background"
            className="absolute z-0 h-full object-cover"
            style={{
              maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 60%, transparent 100%)",
            }}
          />
          <div className="relative">
            <img
              src="/illustrator.svg"
              alt="404 Icon"
              className="w-full z-10"
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-700 text-base leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <Button
          color="primary"
          onClick={handleGoHome}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
