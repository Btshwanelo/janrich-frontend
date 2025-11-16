"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/base/input/label";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/base/buttons/button";
import { useSendRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Validation schema
const validationSchema = Yup.object({
  whatsapp: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (e.g., +923332184595)")
    .required("Phone number is required"),
});

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [sendOTP, { isLoading: isSendingOTP }] =
    useSendRegistrationOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const [error, setError] = useState<string | null>(null);

  // Refs for field highlighting
  const whatsappRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    whatsapp: "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null); // Clear any previous errors
      const response = await sendOTP({ whatsapp: values.whatsapp }).unwrap();
      showSuccessToast("OTP sent successfully. Please check your WhatsApp.");
      router.push(`/forgot-password/new/${encodeURIComponent(values.whatsapp)}`);
    } catch (error: any) {
      // Handle network errors or API errors
      let errorMessage = "Failed to send OTP. Please try again.";

      if (error) {
        // RTK Query error structure: {status, data, error, message}
        // The apiSlice now adds a 'message' field to all errors
        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        } else if (error.data) {
          // Check if error.data is a string or has a message property
          if (typeof error.data === "string") {
            errorMessage = error.data;
          } else if (error.data.message) {
            errorMessage = error.data.message;
          } else if (error.data.error) {
            errorMessage = error.data.error;
          }
        } else if (error.error) {
          errorMessage = error.error;
        }
      }

      setError(errorMessage);
      showErrorToast(errorMessage);
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
              {/* Phone Number */}
              <div>
                <Label
                  htmlFor="whatsapp"
                  className="text-sm font-medium text-gray-700"
                >
                  Cell Number <span className="text-error-500">*</span>
                </Label>
                <div className="mt-1">
                  <Field name="whatsapp">
                    {({ field }: any) => (
                      <PhoneInput
                        {...field}
                        ref={whatsappRef}
                        placeholder="Enter phone number"
                        defaultCountry="ZA"
                        className="phone-input"
                        onChange={(value) => {
                          setFieldValue("whatsapp", value);
                          setError(null); // Clear error when user types
                        }}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            // Submit form on Enter
                            const form = e.target.form;
                            if (form && isValid && values.whatsapp) {
                              form.requestSubmit();
                            }
                          }
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="whatsapp"
                    component="div"
                    className="text-error-500 text-xs mt-1"
                  />
                </div>
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
                disabled={!isValid || isSendingOTP || !values.whatsapp}
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
