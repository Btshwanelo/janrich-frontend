"use client";
import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/base/buttons/button";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ErrorAlert } from "@/components/base/error-alert";
import { newPasswordSchema } from "@/utils/schema";
import { NEW_PASSWORD_INITIAL_VALUES } from "@/constants/newPassword";
import { useNewPassword } from "@/hooks/useNewPassword";
import {
  PasswordField,
  PasswordValidation,
  OTPField,
} from "@/components/registration";

const ResetPasswordScreen = () => {
  const params = useParams();
  const email = decodeURIComponent(params?.email as string);

  const { handleSubmit, isLoading, otp, setOtp } = useNewPassword(email);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Reset your password"
        subtitle="Enter the OTP sent to your whatsapp and create a new password."
      >
        <Formik
          initialValues={NEW_PASSWORD_INITIAL_VALUES}
          validationSchema={newPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isValid }) => (
            <Form className="space-y-4">
              {/* OTP Input */}
              <OTPField
                name="otp"
                label="OTP Code"
                value={otp}
                onChange={setOtp}
                error={errors.otp}
                touched={touched.otp}
              />

              {/* New Password */}
              <PasswordField
                name="password"
                label="New Password"
                required
                placeholder="Enter new password"
                inputRef={passwordRef}
                onFocus={() => setShowPasswordChecks(true)}
                onBlur={(e) => {
                  if (!values.password) {
                    setShowPasswordChecks(false);
                  }
                }}
              />

              {/* Confirm Password */}
              <PasswordField
                name="confirmPassword"
                label="Confirm New Password"
                required
                placeholder="Confirm new password"
                inputRef={confirmPasswordRef}
                onFocus={() => setShowPasswordChecks(true)}
                onBlur={(e) => {
                  if (!values.password && !values.confirmPassword) {
                    setShowPasswordChecks(false);
                  }
                }}
              />

              {/* Password Validation Checks */}
              {showPasswordChecks && (
                <PasswordValidation
                  password={values.password}
                  confirmPassword={values.confirmPassword}
                />
              )}

              {/* Error Message */}
              <div className="mb-6">

              <ErrorAlert autoClearOnUnmount={false} />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="md"
                className="w-full"
                isDisabled={
                  !isValid ||
                  isLoading ||
                  !values.password ||
                  !values.confirmPassword ||
                  otp.length !== 6
                }
                isLoading={isLoading}
              >
                {isLoading ? "Resetting password..." : "Reset password"}
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
