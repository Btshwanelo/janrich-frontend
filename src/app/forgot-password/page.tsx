"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/base/input/label";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useSendRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [sendOTP, { isLoading: isSendingOTP }] =
    useSendRegistrationOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const [error, setError] = useState<string | null>(null);

  // Refs for field highlighting
  const emailRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null); // Clear any previous errors
      const response = await sendOTP({ email: values.email }).unwrap();

      showSuccessToast("OTP sent successfully. Please check your email.");
      router.push(`/forgot-password/new/${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      // Handle network errors or API errors
      const errorMessage = error || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      // showErrorToast(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Forgot password?"
        subtitle="No worries, we'll send you reset instructions."
      >
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
                      ref={emailRef}
                      id="email"
                      name={field.name}
                      value={field.value}
                      onChange={(value: string) => {
                        setFieldValue("email", value);
                        setError(null); // Clear error when user types
                      }}
                      onBlur={field.onBlur}
                      type="email"
                      size="md"
                      placeholder="Enter your email"
                      isInvalid={!!(errors.email && touched.email)}
                      hint={
                        errors.email && touched.email ? errors.email : undefined
                      }
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
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                  <p className="text-error-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="md"
                className="w-full"
                disabled={!isValid || isSendingOTP || !values.email}
              >
                {isSendingOTP ? "Sending..." : "Reset password"}
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
      </AuthLayout>
    </PublicRouteGuard>
  );
};

export default ForgotPasswordScreen;
