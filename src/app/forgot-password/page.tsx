"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/base/buttons/button";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ErrorAlert } from "@/components/base/error-alert";
import { forgotPasswordSchema } from "@/utils/schema";
import { FORGOT_PASSWORD_INITIAL_VALUES } from "@/constants/forgotPassword";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { FormField, PhoneField } from "@/components/registration";

const ForgotPasswordScreen = () => {
  const { handleSubmit, isLoading } = useForgotPassword();

  const usernameRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Forgot password?"
        subtitle="No worries, we'll send you reset instructions."
      >
        <Formik
          initialValues={FORGOT_PASSWORD_INITIAL_VALUES}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form className="space-y-4">
              {/* Email/Username */}
              <FormField 
                name="username"
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
                inputRef={usernameRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Submit form on Enter
                    const form = e.currentTarget.form;
                    if (form && isValid && values.username && values.whatsapp) {
                      form.requestSubmit();
                    }
                  }
                }}
              />

              {/* Phone Number */}
              <PhoneField
                name="whatsapp"
                label="Cell Number"
                placeholder="Enter phone number"
                inputRef={whatsappRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Submit form on Enter
                    const target = e.target as HTMLElement;
                    const form = target.closest("form");
                    if (form && isValid && values.username && values.whatsapp) {
                      form.requestSubmit();
                    }
                  }
                }}
              />

              {/* Error Message */}
              <ErrorAlert autoClearOnUnmount={false} />

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="md"
                className="w-full"
                isDisabled={!isValid || isLoading || !values.whatsapp || !values.username}
                isLoading={isLoading}
              >
                {isLoading ? "Sending..." : "Reset password"}
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
