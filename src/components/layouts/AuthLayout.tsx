"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showTestimonial?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showTestimonial = true,
}) => {
  return (
    <div
      className="h-screen flex"
      style={{
        background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
      }}
    >
      {/* Left Panel - Form (Scrollable) */}
      <div className="flex-1 flex flex-col justify-center sm:p-0 pr-0">
        <div className="w-full max-h-screen overflow-y-auto">
          <div className="max-w-md mx-auto py-6">
            <div className="text-center relative mb-8">
              <div className="mb-6">
                <img
                  src="/jr-logo-black.svg"
                  alt="JanRich Logo"
                  className="mx-auto w-12 h-auto"
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>
            <div className="bg-white/50 rounded-lg">
              {/* Form Content */}
              <div className="px-6 py-8">{children}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Full Height Image with Testimonial */}
      {showTestimonial && (
        <div className="hidden lg:flex flex-1 relative h-screen">
          <div className="w-full relative">
            {/* Background Image */}
            <img
              src="/banner.jpg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Testimonial Card - Fixed Position */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-white">
                <blockquote className="text-2xl font-medium mb-6">
                  "JanRiches showed me the importance of saving and paying
                  myself first. With my savings, I was able to fund my youngest
                  brother's university fees, build our family house, and even a
                  home for my uncle. JanRiches has transformed how I view money,
                  enabling me to travel abroad annually."
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="font-semibold text-lg">Muimeleli M</div>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="">
                        <div className="text-sm opacity-90">
                          Member since 2016{" "}
                        </div>
                      </div>
                      <div className="flex gap-6 ml-auto">
                        <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
