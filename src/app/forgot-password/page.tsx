"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPasswordScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Refs for field highlighting
  const emailRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setIsSubmitting(true);
    console.log("Forgot password submitted:", values);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitting(false);
      setIsEmailSent(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    // Handle navigation back to login
    console.log("Navigate back to login");
    // window.location.href = "/login";
  };

  const handleResendEmail = () => {
    console.log("Resend email");
    // Handle resend logic
  };

  if (isEmailSent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        {/* Left Panel - Success Message */}
        <div className="flex-1 p-6 sm:p-0">
          <div className="w-full max-w-md mx-auto flex flex-col bg-white/50 rounded-lg">
            {/* Header */}
            <div className="flex-shrink-0 pt-8 px-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToLogin}
                  className="mr-3 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Check your email
                </h1>
              </div>
              <p className="text-gray-600 mb-8">
                We've sent a password reset link to your email address.
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 pb-8">
              <div className="space-y-6">
                {/* Email Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-gray-700">
                    Please check your inbox and click on the link to reset your
                    password.
                  </p>
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={handleResendEmail}
                      className="text-[#E31B54] hover:text-[#E31B54] font-medium underline"
                    >
                      resend email
                    </button>
                  </p>
                </div>

                {/* Back to Login Button */}
                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full py-6 text-base font-medium"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Full Height Image with Testimonial */}
        <div className="hidden lg:flex flex-1 relative min-h-screen">
          <div className="w-full relative">
            {/* Background Image */}
            <img
              src="/banner.jpg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Testimonial Card - Fixed Position */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 text-white">
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

                <blockquote className="text-xl font-medium mb-6">
                  "We've been using Untitled to kick start every new project and
                  can't imagine working without it. It's incredible."
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">Caitlyn King</div>
                    <div className="text-sm opacity-90">
                      Lead Designer, Layers
                    </div>
                    <div className="text-xs opacity-75">
                      Web Development Agency
                    </div>
                  </div>

                  <div className="flex gap-2">
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
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)" }}
    >
      {/* Left Panel - Form */}
      <div className="flex-1 p-6 sm:p-0">
        <div className="w-full max-w-md mx-auto flex flex-col bg-white/50 rounded-lg">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pt-8 px-6">
            <div className="flex items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Forgot password?
              </h1>
            </div>
            <p className="text-gray-600 mb-8">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isValid }) => (
                <Form className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Field name="email">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          ref={emailRef}
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className={`mt-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : ""
                          }`}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              // Submit form on Enter
                              const form = e.target.form;
                              if (form && isValid && values.email) {
                                form.requestSubmit();
                              }
                            }
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isValid || isSubmitting || !values.email}
                  >
                    {isSubmitting ? "Sending..." : "Reset password"}
                  </Button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-[#E31B54] hover:text-[#E31B54] font-medium"
                      >
                        Log in
                      </a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Right Panel - Full Height Image with Testimonial */}
      <div className="hidden lg:flex flex-1 relative min-h-screen">
        <div className="w-full relative">
          {/* Background Image */}
          <img
            src="/banner.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Testimonial Card - Fixed Position */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 text-white">
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

              <blockquote className="text-xl font-medium mb-6">
                "We've been using Untitled to kick start every new project and
                can't imagine working without it. It's incredible."
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">Caitlyn King</div>
                  <div className="text-sm opacity-90">
                    Lead Designer, Layers
                  </div>
                  <div className="text-xs opacity-75">
                    Web Development Agency
                  </div>
                </div>

                <div className="flex gap-2">
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
  );
};

export default ForgotPasswordScreen;
