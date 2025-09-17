"use client";
import React, { useState, useRef } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for field highlighting
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setIsSubmitting(true);
    console.log("Login submitted:", values);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitting(false);
      // Handle successful login here
      // window.location.href = "/dashboard";
    }, 2000);
  };

  const focusNextField = (
    currentField: React.RefObject<HTMLInputElement | null>
  ) => {
    const fieldOrder = [emailRef, passwordRef];
    const currentIndex = fieldOrder.findIndex((ref) => ref === currentField);
    if (currentIndex < fieldOrder.length - 1) {
      fieldOrder[currentIndex + 1].current?.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)" }}
    >
      {/* Left Panel - Form (Scrollable) */}
      <div className="flex-1 p-6 sm:p-0">
        <div className="w-full max-w-md mx-auto flex flex-col bg-white/50 rounded-lg">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pt-8 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in to your account to continue
            </p>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, isValid }) => (
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
                              focusNextField(emailRef);
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

                  {/* Password */}
                  <div>
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Field name="password">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            ref={passwordRef}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className={`pr-10 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                              errors.password && touched.password
                                ? "border-red-500"
                                : ""
                            }`}
                            onKeyDown={(e: any) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                // Submit form on Enter in password field
                                const form = e.target.form;
                                if (
                                  form &&
                                  isValid &&
                                  values.email &&
                                  values.password
                                ) {
                                  form.requestSubmit();
                                }
                              }
                            }}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Field name="rememberMe">
                        {({ field }: any) => (
                          <Checkbox
                            id="rememberMe"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              setFieldValue("rememberMe", checked)
                            }
                            className="data-[state=checked]:bg-[#E31B54] data-[state=checked]:border-[#E31B54]"
                          />
                        )}
                      </Field>
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm text-gray-700"
                      >
                        Remember me
                      </Label>
                    </div>

                    <a
                      href="/forgot-password"
                      className="text-sm text-[#E31B54] hover:text-[#E31B54] font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !isValid ||
                      isSubmitting ||
                      !values.email ||
                      !values.password
                    }
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <a
                        href="/register"
                        className="text-[#E31B54] hover:text-[#E31B54] font-medium"
                      >
                        Sign up
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

export default LoginScreen;
