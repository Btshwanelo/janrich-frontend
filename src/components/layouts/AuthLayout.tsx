"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  memberSince: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showTestimonial?: boolean;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "JanRiches showed me the importance of saving and paying myself first. With my savings, I was able to fund my youngest brother's university fees, build our family house, and even a home for my uncle. JanRiches has transformed how I view money, enabling me to travel abroad annually.",
    author: "Muimeleli M",
    memberSince: "2016",
  },
  {
    quote:
      "I've been using JanRiches for over 5 years now, and it's completely changed my financial habits. The automated savings feature helped me build an emergency fund that saved me during a difficult time. I'm now saving for my dream home!",
    author: "Sarah K",
    memberSince: "2019",
  },
  {
    quote:
      "JanRiches made saving effortless. I never thought I could save as much as I have. The platform's insights helped me understand my spending patterns and make better financial decisions. Highly recommend!",
    author: "David T",
    memberSince: "2020",
  },
  {
    quote:
      "As a young professional, JanRiches taught me financial discipline early. I've achieved goals I never thought possible - from paying off student loans to starting my own business. The community support is incredible!",
    author: "Amanda L",
    memberSince: "2021",
  },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showTestimonial = true,
}) => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <div
      className="fixed inset-0 w-full h-full flex"
      style={{
        background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
      }}
    >
      {/* Left Panel - Form (Scrollable) */}
      <div className="flex-1 flex flex-col">
        <div
          data-auth-scroll-container
          className="w-full h-full overflow-y-auto overflow-x-hidden"
          style={{
            background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
            scrollBehavior: "auto",
            scrollPadding: 0,
          }}
          onScroll={(e) => {
            // Prevent programmatic scroll resets
            e.stopPropagation();
          }}
        >
          <div className="max-w-md mx-1 sm:mx-auto py-6 sm:py-8 sm:px-0">
            <div className="text-center relative mb-4">
              <div className="mb-4">
                <img
                  src="/jr-logo-black.svg"
                  alt="JanRich Logo"
                  className="mx-auto w-[99px] h-auto"
                />
              </div>

              <h1 className="text-3xl font-cinzel font-normal text-[#181D27] mb-2">
                {title}
              </h1>
              <p className="text-[#535862]">{subtitle}</p>
            </div>
            <div className="bg-white/50 rounded-lg">
              {/* Form Content */}
              <div className="px-6 py-8">{children}</div>
            </div>
            {/* Extra padding at bottom to prevent white space when scrolling */}
            <div className="h-8 sm:h-12" />
          </div>
        </div>
      </div>

      {/* Right Panel - Full Height Image with Testimonial */}
      {showTestimonial && (
        <div className="hidden lg:flex flex-1 relative h-screen overflow-hidden">
          <div className="w-full relative">
            {/* Background Image with Gradient Overlay */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background:
                  "linear-gradient(139deg, rgba(70, 134, 255, 0.80) 29.03%, rgba(39, 39, 162, 0.80) 60.49%, rgba(43, 73, 134, 0.80) 86.89%), url(/banner.jpg) lightgray 50% / cover no-repeat",
              }}
            />

            {/* Testimonial Card - Fixed Position */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-white">
                <blockquote className="text-2xl font-medium mb-6">
                  "{currentTestimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="font-semibold text-lg">
                        {currentTestimonial.author}
                      </div>
                      <div className="flex items-center mb-4">
                        {/* {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))} */}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm opacity-90">
                          Member since {currentTestimonial.memberSince}
                        </div>
                        <div className="flex gap-2">
                          {testimonials.map((_, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setCurrentTestimonialIndex(index)
                              }
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentTestimonialIndex
                                  ? "bg-white w-6"
                                  : "bg-white/50 hover:bg-white/70"
                              }`}
                              aria-label={`Go to testimonial ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-6 ml-auto">
                        <button
                          onClick={prevTestimonial}
                          className="w-10 h-10 border rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                          aria-label="Previous testimonial"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextTestimonial}
                          className="w-10 h-10 border rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                          aria-label="Next testimonial"
                        >
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
