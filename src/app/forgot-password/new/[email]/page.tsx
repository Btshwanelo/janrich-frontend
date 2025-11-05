"use client";
import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/base/input/label";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { useVerifyRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";

// Validation schema
const validationSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordScreen = () => {
  const params = useParams();
  const router = useRouter();
  const email = decodeURIComponent(params?.email as string);

  const [verifyOTP, { isLoading: isVerifying }] =
    useVerifyRegistrationOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);

  // Refs for field highlighting
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    otp: "",
    password: "",
    confirmPassword: "",
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await verifyOTP({
        email: email,
        otp_input: otp || values.otp,
        password: values.password,
      }).unwrap();

      // Check if the response indicates success or failure
      if (response?.message?.result === "failed") {
        const errorMessage =
          response?.message?.message ||
          "Failed to reset password. Please try again.";
        showErrorToast(errorMessage);
        setSubmitting(false);
        return;
      }

      // If result is "success" or response has status/user (legacy format), treat as success
      if (
        response?.message?.result === "success" ||
        response?.message?.status ||
        response?.message?.user ||
        !response?.message?.result
      ) {
        showSuccessToast(
          "Password reset successfully! Redirecting..."
        );
        setTimeout(() => {
          router.push("/new-password-success");
        }, 1500);
      } else {
        // Fallback for any other result
        const errorMessage =
          response?.message?.message ||
          "Failed to reset password. Please try again.";
        showErrorToast(errorMessage);
        setSubmitting(false);
      }
    } catch (error: any) {
      // Handle network errors or API errors
      const errorMessage =
        error?.data?.message?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to reset password. Please try again.";
      showErrorToast(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Reset your password"
        subtitle="Enter the OTP sent to your email and create a new password."
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isValid }) => (
            <Form className="space-y-6">
              {/* Email Display (Read-only) */}
              {/* <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  type="email"
                  size="md"
                  isDisabled
                  className="bg-gray-50"
                />
              </div> */}

              {/* OTP Input */}
              <div>
                <Label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  OTP Code <span className="text-red-500">*</span>
                </Label>
                <div className="flex justify-center max-w-full">
                  <PinInput size="sm" className="max-w-full">
                    <PinInput.Group
                      value={otp}
                      onChange={(value: string) => {
                        handleOTPChange(value);
                        setFieldValue("otp", value);
                      }}
                      maxLength={6}
                      containerClassName="gap-2 justify-center"
                    >
                      {/* {Array.from({ length: 6 }, (_, index) => (
                        <PinInput.Slot
                          key={index}
                          index={index}
                          className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                          style={{ color: "#155EEF !important" }}
                        />
                      ))} */}
                      <PinInput.Slot
                        index={0}
                        className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                        style={{ color: "#155EEF !important" }}
                      />
                      <PinInput.Slot
                        index={1}
                        className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                        style={{ color: "#155EEF !important" }}
                      />
                      <PinInput.Slot
                        index={2}
                        className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                        style={{ color: "#155EEF !important" }}
                      />
                      <PinInput.Separator
                        className="!text-[#155EEF] !ring-[#155EEF] text-[38px]"
                        style={{ color: "#155EEF !important" }}
                      />

                      <PinInput.Slot
                        index={3}
                        className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                        style={{ color: "#155EEF !important" }}
                      />
                      <PinInput.Slot
                        index={4}
                        className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                        style={{ color: "#155EEF !important" }}
                      />
                      <PinInput.Slot
                        index={5}
                        className="!text-[#155EEF] !ring-[#155EEF] text-[48px]"
                        style={{ color: "#155EEF !important" }}
                      />
                    </PinInput.Group>
                  </PinInput>
                </div>
                {errors.otp && touched.otp && (
                  <p className="text-sm text-red-600 mt-2">{errors.otp}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password <span className="text-error-500">*</span>
                </Label>
                <Field name="password">
                  {({ field }: any) => (
                    <div className="relative">
                      <Input
                        ref={passwordRef}
                        id="password"
                        name={field.name}
                        value={field.value}
                        onChange={(value: string) => {
                          setFieldValue("password", value);
                          if (value) {
                            setShowPasswordChecks(true);
                          }
                        }}
                        onBlur={(e: any) => {
                          field.onBlur(e);
                          if (!field.value) {
                            setShowPasswordChecks(false);
                          }
                        }}
                        onFocus={() => setShowPasswordChecks(true)}
                        type={showPassword ? "text" : "password"}
                        size="md"
                        placeholder="Enter new password"
                        isInvalid={!!(errors.password && touched.password)}
                        hint={
                          errors.password && touched.password
                            ? errors.password
                            : undefined
                        }
                        inputClassName="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute ${
                          errors.password
                            ? `right-3 top-[33%] -translate-y-1/2`
                            : `right-3 top-1/2 -translate-y-1/2`
                        } text-gray-400 hover:text-gray-600 focus:outline-none`}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </Field>
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm New Password <span className="text-error-500">*</span>
                </Label>
                <Field name="confirmPassword">
                  {({ field }: any) => (
                    <div className="relative">
                      <Input
                        ref={confirmPasswordRef}
                        id="confirmPassword"
                        name={field.name}
                        value={field.value}
                        onChange={(value: string) => {
                          setFieldValue("confirmPassword", value);
                          if (value || values.password) {
                            setShowPasswordChecks(true);
                          }
                        }}
                        onBlur={(e: any) => {
                          field.onBlur(e);
                          if (!field.value && !values.password) {
                            setShowPasswordChecks(false);
                          }
                        }}
                        onFocus={() => setShowPasswordChecks(true)}
                        type={showConfirmPassword ? "text" : "password"}
                        size="md"
                        placeholder="Confirm new password"
                        isInvalid={
                          !!(errors.confirmPassword && touched.confirmPassword)
                        }
                        hint={
                          errors.confirmPassword && touched.confirmPassword
                            ? errors.confirmPassword
                            : undefined
                        }
                        inputClassName="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`absolute ${
                          errors.confirmPassword
                            ? `right-3 top-[33%] -translate-y-1/2`
                            : `right-3 top-1/2 -translate-y-1/2`
                        } text-gray-400 hover:text-gray-600 focus:outline-none`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </Field>
              </div>
              {showPasswordChecks && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        values.password &&
                        /[!@#$%^&*(),.?":{}|<>]/.test(values.password)
                          ? "/checked.svg"
                          : "/check.svg"
                      }
                      alt="Info"
                      className="w-4 h-4"
                    />
                    <p className="text-xs text-[#535862]">
                      Password should include at least 1 special character
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        values.password && values.password.length >= 8
                          ? "/checked.svg"
                          : "/check.svg"
                      }
                      alt="Info"
                      className="w-4 h-4"
                    />
                    <p className="text-xs text-[#535862]">
                      Password should be at least 8 characters
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        values.password &&
                        values.confirmPassword &&
                        values.password === values.confirmPassword
                          ? "/checked.svg"
                          : "/check.svg"
                      }
                      alt="Info"
                      className="w-4 h-4"
                    />
                    <p className="text-xs text-[#535862]">
                      Password should match
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="md"
                className="w-full"
                disabled={
                  !isValid ||
                  isVerifying ||
                  !values.password ||
                  !values.confirmPassword ||
                  otp.length !== 6
                }
              >
                {isVerifying ? "Resetting password..." : "Reset password"}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
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

export default ResetPasswordScreen;
