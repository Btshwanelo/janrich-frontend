"use client";
import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/base/buttons/button";
import CircularProgressStep from "@/components/CircularProgressStep";
import OTPVerificationModal from "@/components/OTPVerificationModal";
import { onboardingSchema } from "@/utils/schema";
import { ONBOARDING_INITIAL_VALUES } from "@/constants/onboarding";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  SelectField,
  DateField,
  CommunicationPreferenceField,
} from "@/components/registration";
import { ErrorAlert } from "@/components/base/error-alert";
import {
  COMMUNICATION_OPTIONS,
  COUNTRY_OPTIONS,
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  TITLE_OPTIONS,
} from "@/constants/profile";
import AuthGuard from "@/components/AuthGuard";
import { SearchField } from "@/components/registration/SearchField";

const Onboarding = () => {
  const {
    handleSubmit,
    handleOTPSuccess,
    showOTPModal,
    setShowOTPModal,
    userEmail,
    userContact,
    isLoading,
  } = useOnboarding();

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex items-center justify-center px-6 py-8"
        style={{
          background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center relative mb-8">
            <div className="mb-6">
              <img
                src="/jr-logo-black.svg"
                alt="JanRich Logo"
                className="mx-auto w-[99px] h-auto"
              />
            </div>

            <h1 className="text-3xl font-cinzel font-normal text-[#181D27] mb-2">
              About you
            </h1>
            <p className="text-[#535862]">
              Tell us about you just a little bit more
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
            {/* Progress Steps */}
            <div className="mb-8 mx-10">
              <div className="flex items-center justify-center">
                <CircularProgressStep status="isCompleted" />
                <div className="flex-1 h-[3px] bg-[#1F235B]" />
                <CircularProgressStep status="isActive" />
                <div className="flex-1 h-[3px] bg-[#1F235B]" />
                <CircularProgressStep status="inactive" />
              </div>
            </div>

            <Formik
              initialValues={ONBOARDING_INITIAL_VALUES}
              validationSchema={onboardingSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* What do we call you */}
                  <SelectField
                    name="whatToCallYou"
                    label="What do we call you?"
                    placeholder="Select an option"
                    options={TITLE_OPTIONS}
                    required
                  />

                  {/* Birthdate and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DateField name="birthdate" label="Birthdate" required />
                    <SelectField
                      name="gender"
                      label="Gender"
                      placeholder="Select gender"
                      options={GENDER_OPTIONS}
                      required
                    />
                  </div>

                  {/* Nationality */}
                  {/* <SelectField
                    name="nationality"
                    label="Nationality"
                    placeholder="Select nationality"
                    options={NATIONALITY_OPTIONS}
                    required
                  /> */}
                  <SearchField
                    name="nationality"
                    label="Nationality"
                    placeholder="Select nationality"
                    options={NATIONALITY_OPTIONS}
                    required
                  />

                  {/* Country of Residence */}
                  {/* <SelectField
                    name="countryOfResidence"
                    label="Country of Residence"
                    placeholder="Select country"
                    options={COUNTRY_OPTIONS}
                    required
                  /> */}
                  <SearchField
                    name="countryOfResidence"
                    label="Country of Residence"
                    placeholder="Select country"
                    options={COUNTRY_OPTIONS}
                    required
                  />

                  {/* Race */}
                  <SelectField
                    name="race"
                    label="Race"
                    placeholder="Select race"
                    options={RACE_OPTIONS}
                    required
                  />

                  {/* Communication Preference */}
                  <CommunicationPreferenceField
                    name="communicationPreference"
                    label="Communication Preference"
                    options={COMMUNICATION_OPTIONS}
                    required
                  />

                  {/* Error Message */}
                  <ErrorAlert autoClearOnUnmount={false} />

                  {/* Get Started Button */}
                  <Button
                    type="submit"
                    color="primary"
                    size="md"
                    className="w-full mt-6"
                    isDisabled={isSubmitting || isLoading}
                    isLoading={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? "Processing..."
                      : "Let’s make it official"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>

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
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        contactInfo={userContact}
        verificationMethod="email"
        email={userEmail}
        onSuccess={handleOTPSuccess}
        otpLength={6}
      />
    </AuthGuard>
  );
};

export default Onboarding;
