"use client";
import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/ui/untitled-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useLoginMutation } from "@/lib/slices/authSlice";
import {
  setCredentials,
  setError,
  setLoading,
  setAuthCookie,
} from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";

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
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux state
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // Refs for field highlighting
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  // Note: Redirect logic is now handled by PublicRouteGuard

  // Clear error when component mounts
  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const handleSubmit = async (
    values: { email: string; password: string; rememberMe: boolean },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      console.log("Login submitted:", values);

      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      console.log("Login successful:", result);

      // Dispatch credentials to Redux store
      dispatch(
        setCredentials({
          user: result.message.user,
          sid: result.message.sid,
          fullName: result.full_name,
          homePage: result.home_page,
        })
      );

      // Set authentication cookie
      setAuthCookie(true);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: unknown) {
      console.log("Login failed:", error);

      // Handle different error types
      let errorMessage = "Login failed. Please try again.";

      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      } else if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        errorMessage = "Invalid email or password.";
      } else if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 500
      ) {
        errorMessage = "Server error. Please try again later.";
      }

      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
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
    <PublicRouteGuard>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
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
                  Email <span className="text-error-500">*</span>
                </Label>
                <Field name="email">
                  {({
                    field,
                  }: {
                    field: {
                      name: string;
                      value: string;
                      onChange: (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => void;
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
                    };
                  }) => (
                    <Input
                      {...field}
                      ref={emailRef}
                      id="email"
                      type="email"
                      size="md"
                      placeholder="Enter your email"
                      variant={
                        errors.email && touched.email ? "error" : "default"
                      }
                      error={
                        errors.email && touched.email ? errors.email : undefined
                      }
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          focusNextField(emailRef);
                        }
                      }}
                    />
                  )}
                </Field>
              </div>

              {/* Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password <span className="text-error-500">*</span>
                </Label>
                <Field name="password">
                  {({
                    field,
                  }: {
                    field: {
                      name: string;
                      value: string;
                      onChange: (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => void;
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
                    };
                  }) => (
                    <Input
                      {...field}
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      size="md"
                      placeholder="Enter your password"
                      variant={
                        errors.password && touched.password
                          ? "error"
                          : "default"
                      }
                      error={
                        errors.password && touched.password
                          ? errors.password
                          : undefined
                      }
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
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
                  )}
                </Field>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Field name="rememberMe">
                    {({
                      field,
                    }: {
                      field: {
                        name: string;
                        value: boolean;
                        onChange: (
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => void;
                        onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
                      };
                    }) => (
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          setFieldValue("rememberMe", checked)
                        }
                        className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
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
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                  <p className="text-error-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                isDisabled={
                  !isValid ||
                  isLoading ||
                  isLoginLoading ||
                  !values.email ||
                  !values.password
                }
                isLoading={isLoading || isLoginLoading}
              >
                {isLoading || isLoginLoading ? "Signing in..." : "Sign in"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-primary-500 hover:text-primary-600 font-medium"
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
