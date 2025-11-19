"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/base/input/label";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useSendRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Validation schema
const validationSchema = Yup.object({
  whatsapp: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number (e.g., +923332184595)"
    )
    .required("Phone number is required"),
  username: Yup.string()
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
  const whatsappRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    whatsapp: "",
    username: "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null); // Clear any previous errors
      const response = await sendOTP({
        whatsapp: values.whatsapp,
        username: values.username,
      }).unwrap();
      showSuccessToast("OTP sent successfully. Please check your WhatsApp.");
      router.push(
        `/forgot-password/new/${encodeURIComponent(values.username)}`
      );
    } catch (error: any) {
      // Handle network errors or API errors
      let errorMessage =
        error?.data?.message?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to send OTP. Please try again.";

      showErrorToast(errorMessage);
      setError(errorMessage);
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
              {/* Email/Username */}
              <div>
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Email <span className="text-error-500">*</span>
                </Label>
                <div className="mt-1">
                  <Field name="username">
                    {({ field }: any) => (
                      <Input
                        ref={usernameRef}
                        id="username"
                        name={field.name}
                        value={field.value}
                        onChange={(value: string) => {
                          setFieldValue("username", value);
                          setError(null); // Clear error when user types
                        }}
                        onBlur={field.onBlur}
                        type="email"
                        placeholder="Enter your email"
                        isInvalid={!!(errors.username && touched.username)}
                        hint={
                          errors.username && touched.username
                            ? errors.username
                            : undefined
                        }
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            // Submit form on Enter
                            const form = e.target?.form ?? e.target?.closest("form");
                            if (form && isValid && values.username && values.whatsapp) {
                              form.requestSubmit();
                            }
                          }
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>

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
                      <div>
                        <PhoneInput
                          {...field}
                          ref={whatsappRef}
                          placeholder="Enter phone number"
                          defaultCountry="ZA"
                          className={`phone-input ${
                            errors.whatsapp && touched.whatsapp
                              ? "border-error-500 ring-error-500"
                              : ""
                          }`}
                          onChange={(value) => {
                            setFieldValue("whatsapp", value);
                            setError(null); // Clear error when user types
                          }}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              // Submit form on Enter
                              const form = e.target.form;
                              if (form && isValid && values.username && values.whatsapp) {
                                form.requestSubmit();
                              }
                            }
                          }}
                        />
                        {errors.whatsapp && touched.whatsapp && (
                          <div className="text-error-500 text-xs mt-1">
                            {errors.whatsapp}
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
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
                disabled={
                  !isValid || isSendingOTP || !values.whatsapp || !values.username
                }
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
