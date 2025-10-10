"use client";
import React, { useState, useRef } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/ui/untitled-input";
import { Label } from "@/components/base/input/label";
import { Toggle } from "@/components/base/toggle/toggle";
import { Checkbox } from "@/components/ui/untitled-checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CircularProgressStep from "@/components/CircularProgressStep";
import OTPVerificationModal from "@/components/OTPVerificationModal";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRegisterMutation } from "@/lib/slices/authSlice";
import {
  setError,
  setLoading,
  setRegistrationData,
} from "@/lib/slices/authSlice";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  surname: Yup.string()
    .min(2, "Surname must be at least 2 characters")
    .required("Surname is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(10, "Please enter a valid phone number"),
  whatsappNumber: Yup.string().when("whatsappSame", {
    is: false,
    then: (schema) => schema
      .required("WhatsApp number is required when not using same as phone")
      .min(10, "Please enter a valid WhatsApp number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Please confirm your password"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

const RegistrationScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);
  const [registrationData, setLocalRegistrationData] = useState<any>(null);

  // Redux
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, isLoading } = useAppSelector((state) => state.auth);
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // Refs for field highlighting
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    whatsappSame: true,
    whatsappNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    rememberMe: false,
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      // dispatch(setLoading(true));
      dispatch(setError(null));
      setIsSubmitting(true);

      console.log("Form submitted:", values);

      // Prepare registration data
      const registrationPayload = {
        customer_name: `${values.name} ${values.surname}`,
        customer_type: "Individual",
        title: "Mr", // You might want to make this dynamic
        first_name: values.name,
        last_name: values.surname,
        last_nameemail: values.surname,
        email: values.email,
        phone: values.phoneNumber,
        whatsapp_number: values.whatsappSame ? values.phoneNumber : values.whatsappNumber,
        country_code: "+27", // You might want to make this dynamic
        new_password: values.password,
        agree_to_terms: values.agreeTerms ? 1 : 0,
      };

      // Call register API
      const result = await register(registrationPayload).unwrap();

      console.log("Registration successful:", result);

      // Store registration data in Redux store
      dispatch(
        setRegistrationData({
          customer: result.message.customer,
          user: result.message.user,
          contact: result.message.contact,
          address: result.message.address,
          message: result.message.message,
        })
      );

      // Store registration data for OTP verification
      setLocalRegistrationData(result);

      // Show OTP modal
      setShowOTPModal(true);
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      // Handle different error types
      let errorMessage = "Registration failed. Please try again.";

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
        error.status === 400
      ) {
        errorMessage =
          "Invalid registration data. Please check your information.";
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
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    // Redirect to onboarding
    router.push("/onboarding");
  };

  const focusNextField = (
    currentField: React.RefObject<HTMLInputElement | null>
  ) => {
    const fieldOrder = [
      nameRef,
      surnameRef,
      emailRef,
      phoneRef,
      passwordRef,
      confirmPasswordRef,
    ];
    const currentIndex = fieldOrder.findIndex((ref) => ref === currentField);
    if (currentIndex < fieldOrder.length - 1) {
      fieldOrder[currentIndex + 1].current?.focus();
    }
  };

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Let's get you started"
        subtitle="on the journey to paying yourself first!"
        showTestimonial={true}
      >
        {/* Progress Steps */}
        <div className="mb-8 mx-12">
          <div className="flex items-center justify-center">
            <CircularProgressStep status={"isActive"} />
            <div className="flex-1 h-[3px] bg-primary-500" />
            <CircularProgressStep status={""} />
            <div className="flex-1 h-[3px] bg-primary-500" />
            <CircularProgressStep status={""} />
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isValid }) => (
            <>
            {console.log({ values, errors, touched, isValid })}
              <OTPVerificationModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                contactInfo={values.phoneNumber}
                onSuccess={handleOTPSuccess}
                otpLength={4}
                validOtp="2135"
                verificationMethod="whatsapp"
              />

              {/* Error Message */}
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-3 mb-4">
                  <p className="text-error-600 text-sm">{error}</p>
                </div>
              )}

              <Form className="space-y-6">
                {/* Name and Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-error-500">*</span>
                    </Label>
                    <Field name="name">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          ref={nameRef}
                          id="name"
                          type="text"
                          size="md"
                          placeholder="Enter your name"
                          variant={
                            errors.name && touched.name ? "error" : "default"
                          }
                          error={
                            errors.name && touched.name
                              ? errors.name
                              : undefined
                          }
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              focusNextField(nameRef);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <Label
                      htmlFor="surname"
                      className="text-sm font-medium text-gray-700"
                    >
                      Surname <span className="text-error-500">*</span>
                    </Label>
                    <Field name="surname">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          ref={surnameRef}
                          id="surname"
                          type="text"
                          size="md"
                          placeholder="Enter your surname"
                          variant={
                            errors.surname && touched.surname
                              ? "error"
                              : "default"
                          }
                          error={
                            errors.surname && touched.surname
                              ? errors.surname
                              : undefined
                          }
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              focusNextField(surnameRef);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Field name="email">
                    {({ field }: any) => (
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
                          errors.email && touched.email
                            ? errors.email
                            : undefined
                        }
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            focusNextField(emailRef);
                          }
                        }}
                      />
                    )}
                  </Field>
                </div>

                {/* Phone Number */}
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Cell Number <span className="text-error-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <Field name="phoneNumber">
                      {({ field }: any) => (
                        <PhoneInput
                          {...field}
                          ref={phoneRef}
                          placeholder="Enter phone number"
                          defaultCountry="ZA"
                          className="phone-input"
                          onChange={(value) =>
                            setFieldValue("phoneNumber", value)
                          }
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              focusNextField(phoneRef);
                            }
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-error-500 text-xs mt-1"
                    />
                  </div>
                </div>

                {/* WhatsApp Toggle */}
                <div className="flex items-center space-x-3">
                  <Field name="whatsappSame">
                    {({ field }: any) => (
                      // <Switch
                      //   id="whatsappSame"

                      //   className="data-[state=checked]:bg-primary-500 border-primary-500"
                      // />
                      <Toggle
                        isSelected={field.value}
                        onChange={(isSelected) =>
                          setFieldValue("whatsappSame", isSelected)
                        }
                        label="Use WhatsApp for notifications"
                        hint="Receive verification codes via WhatsApp"
                        size="sm"
                      />
                    )}
                  </Field>
                </div>

                {/* WhatsApp Number Field - Show when toggle is false */}
                <Field name="whatsappSame">
                  {({ field }: any) => (
                    !field.value && (
                      <div>
                        <Label
                          htmlFor="whatsappNumber"
                          className="text-sm font-medium text-gray-700"
                        >
                          WhatsApp Number
                          <span className="text-error-500">*</span>
                        </Label>
                        <div className="mt-1">
                          <Field name="whatsappNumber">
                            {({ field }: any) => (
                              <PhoneInput
                                {...field}
                                ref={whatsappRef}
                                placeholder="Enter WhatsApp number"
                                defaultCountry="ZA"
                                className="phone-input"
                                onChange={(value) => setFieldValue("whatsappNumber", value)}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="whatsappNumber"
                            component="div"
                            className="text-error-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                    )
                  )}
                </Field>

                {/* Password */}
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <Field name="password">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        ref={passwordRef}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        size="md"
                        placeholder="Create a password"
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
                        onFocus={() => setShowPasswordChecks(true)}
                        onBlur={() => {
                          if (!field.value) {
                            setShowPasswordChecks(false);
                          }
                        }}
                        onChange={(e: any) => {
                          field.onChange(e);
                          if (e.target.value) {
                            setShowPasswordChecks(true);
                          }
                        }}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            focusNextField(passwordRef);
                          }
                        }}
                      />
                    )}
                  </Field>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <Field name="confirmPassword">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        ref={confirmPasswordRef}
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        size="md"
                        placeholder="Confirm your password"
                        variant={
                          errors.confirmPassword && touched.confirmPassword
                            ? "error"
                            : "default"
                        }
                        error={
                          errors.confirmPassword && touched.confirmPassword
                            ? errors.confirmPassword
                            : undefined
                        }
                        rightIcon={
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                        onFocus={() => setShowPasswordChecks(true)}
                        onBlur={() => {
                          if (!field.value && !values.password) {
                            setShowPasswordChecks(false);
                          }
                        }}
                        onChange={(e: any) => {
                          field.onChange(e);
                          if (e.target.value || values.password) {
                            setShowPasswordChecks(true);
                          }
                        }}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            focusNextField(confirmPasswordRef);
                          }
                        }}
                      />
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

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <Field name="agreeTerms">
                    {({ field }: any) => (
                      <Checkbox
                        id="agreeTerms"
                        isSelected={field.value}
                        onChange={(isSelected) =>
                          setFieldValue("agreeTerms", isSelected)
                        }
                        className="mt-1"
                      />
                    )}
                  </Field>
                  <Label
                    htmlFor="agreeTerms"
                    className="text-sm text-gray-700 leading-5"
                  >
                    I agree to the Terms and Conditions by logging and using
                    this application
                  </Label>
                </div>
                <ErrorMessage
                  name="agreeTerms"
                  component="div"
                  className="text-error-500 text-xs mt-1"
                />

                {/* Remember Me */}
                {/* <div className="flex items-start space-x-3">
                      <Field name="rememberMe">
                        {({ field }: any) => (
                          <Checkbox
                            id="rememberMe"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              setFieldValue("rememberMe", checked)
                            }
                            className="mt-1 data-[state=checked]:bg-[#E31B54] data-[state=checked]:border-[#E31B54]"
                          />
                        )}
                      </Field>
                      <div>
                        <Label
                          htmlFor="rememberMe"
                          className="text-sm font-medium text-gray-700"
                        >
                          Remember me
                        </Label>
                        <p className="text-xs text-gray-500">
                          Save my login details for next time.
                        </p>
                      </div>
                    </div> */}

                {/* Submit Button */}
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isDisabled={
                    !isValid ||
                    isSubmitting ||
                    isLoading ||
                    isRegisterLoading ||
                    !values.name ||
                    !values.surname ||
                    !values.email ||
                    !values.phoneNumber ||
                    !values.password ||
                    !values.confirmPassword ||
                    !values.agreeTerms
                  }
                  isLoading={isSubmitting || isLoading || isRegisterLoading}
                >
                  {isSubmitting || isLoading || isRegisterLoading
                    ? "Processing..."
                    : "Get started"}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      Log in
                    </a>
                  </p>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </AuthLayout>
    </PublicRouteGuard>
  );
};

export default RegistrationScreen;
