"use client";
import React, { useRef } from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Label } from "@/components/base/input/label";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ErrorAlert } from "@/components/base/error-alert";
import { loginSchema } from "@/utils/schema";
import { LOGIN_INITIAL_VALUES } from "@/constants/login";
import { useLogin } from "@/hooks/useLogin";
import { useFieldNavigation } from "@/hooks/useFieldNavigation";
import { FormField, PasswordField } from "@/components/registration";

const LoginScreen = () => {
  const { handleSubmit, isLoading } = useLogin();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { focusNextField } = useFieldNavigation([emailRef, passwordRef]);

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
      >
        <Formik
          initialValues={LOGIN_INITIAL_VALUES}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isValid }) => (
            <Form className="space-y-6">
              {/* Email */}
              <FormField
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
                inputRef={emailRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    focusNextField(emailRef);
                  }
                }}
              />

              {/* Password */}
              <PasswordField
                name="password"
                label="Password"
                placeholder="Enter your password"
                inputRef={passwordRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Submit form on Enter in password field
                    const form = e.currentTarget.form;
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Field name="rememberMe">
                    {({ field }: any) => (
                      <Checkbox
                        id="rememberMe"
                        isSelected={field.value}
                        onChange={(isSelected) =>
                          setFieldValue("rememberMe", isSelected)
                        }
                      />
                    )}
                  </Field>
                  <Label htmlFor="rememberMe" className="text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>

                <a
                  href="/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              <ErrorAlert autoClearOnUnmount={false} />

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="md"
                className="w-full"
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-[#E31B54] hover:text-primary-600 font-medium"
                  >
                    Sign up
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

export default LoginScreen;
