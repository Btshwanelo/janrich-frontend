"use client";
import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Toggle } from "@/components/base/toggle/toggle";
import { Label } from "@/components/base/input/label";
import CircularProgressStep from "@/components/CircularProgressStep";
import OTPVerificationModal from "@/components/OTPVerificationModal";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ErrorAlert } from "@/components/base/error-alert";
import { registrationSchema } from "@/utils/schema";
import { REGISTRATION_INITIAL_VALUES } from "@/constants/registration";
import { useRegistration } from "@/hooks/useRegistration";
import { useFieldNavigation } from "@/hooks/useFieldNavigation";
import {
  FormField,
  PasswordField,
  PhoneField,
  PasswordValidation,
} from "@/components/registration";

const RegistrationScreen = () => {
  const { handleSubmit, isLoading } = useRegistration();

  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [showPasswordChecks, setShowPasswordChecks] = useState(false);

  const { focusNextField } = useFieldNavigation([
    nameRef,
    surnameRef,
    emailRef,
    phoneRef,
    passwordRef,
    confirmPasswordRef,
  ]);

  return (
    <PublicRouteGuard>
      <AuthLayout
        title="Let's get you started"
        subtitle="on the journey to paying yourself first!"
        showTestimonial={true}
      >
        {/* Progress Steps */}
        <div className="mb-4 mx-auto">
          <div className="flex items-center justify-center">
            <CircularProgressStep status="isActive" />
            <div className="flex-1 h-[3px] bg-[#1F235B]" />
            <CircularProgressStep status="" />
            <div className="flex-1 h-[3px] bg-[#1F235B]" />
            <CircularProgressStep status="" />
          </div>
        </div>

        <Formik
          initialValues={REGISTRATION_INITIAL_VALUES}
          validationSchema={registrationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <>
              {/* <OTPVerificationModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                contactInfo={values.whatsappNumber || values.phoneNumber}
                email={values.email}
                onSuccess={handleOTPSuccess}
                handleResentOTP={()=>console.log("qw")}
                otpLength={6}
                verificationMethod="whatsapp"
              /> */}

              <Form className="space-y-4">
                {/* Name and Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    required
                    inputRef={nameRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        focusNextField(nameRef);
                      }
                    }}
                  />
                  <FormField
                    name="surname"
                    label="Surname"
                    placeholder="Enter your surname"
                    required
                    inputRef={surnameRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        focusNextField(surnameRef);
                      }
                    }}
                  />
                </div>

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

                {/* Phone Number */}
                <PhoneField
                  name="phoneNumber"
                  label="Cell Number"
                  placeholder="Enter phone number"
                  inputRef={phoneRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      focusNextField(phoneRef);
                    }
                  }}
                />

                {/* WhatsApp Toggle */}
                <div className="flex items-center space-x-3">
                  <Field name="whatsappSame">
                    {({ field }: any) => (
                      <Toggle
                        isSelected={field.value}
                        onChange={(isSelected) =>
                          setFieldValue("whatsappSame", isSelected)
                        }
                        label="WhatsApp Number is the same as above."
                        size="sm"
                      />
                    )}
                  </Field>
                </div>

                {/* WhatsApp Number Field - Show when toggle is false */}
                {!values.whatsappSame && (
                  <PhoneField
                    name="whatsappNumber"
                    label="WhatsApp Number"
                    placeholder="Enter WhatsApp number"
                    inputRef={whatsappRef}
                  />
                )}

                {/* Password */}
                <PasswordField
                  name="password"
                  label="Password"
                  required
                  placeholder="Create a password"
                  inputRef={passwordRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      focusNextField(passwordRef);
                    }
                  }}
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
                  label="Confirm Password"
                  required
                  placeholder="Confirm your password"
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

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Field name="agreeTerms">
                    {({ field }: any) => (
                      <Checkbox
                        id="agreeTerms"
                        isSelected={field.value}
                        onChange={(isSelected) =>
                          setFieldValue("agreeTerms", isSelected)
                        }
                      />
                    )}
                  </Field>
                  <Label htmlFor="agreeTerms" className="text-sm text-gray-700">
                    Count me in! I agree to JanRiches Terms and Conditions and
                    Privacy Policy
                  </Label>
                </div>
                <ErrorMessage
                  name="agreeTerms"
                  component="div"
                  className="text-error-500 text-xs mt-0"
                />

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
                  {isLoading ? "Processing..." : "Get started"}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-[#E31B54] hover:text-primary-600 font-medium"
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
