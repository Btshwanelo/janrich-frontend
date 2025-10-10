"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseDate } from "@internationalized/date";
import { Button } from "@/components/base/buttons/button";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Select } from "@/components/base/select/select";
import { Label } from "@/components/base/input/label";
import { cn, formatDateDDMMYYYY } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";
import CircularProgressStep from "@/components/CircularProgressStep";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import { useDispatch, useSelector } from "react-redux";
import { useCompleteOnboardingMutation } from "@/lib/slices/onboardingSlice";
import { useSendRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { RootState } from "@/lib/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import OTPVerificationModal from "@/components/OTPVerificationModal";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";

// Validation schema
const validationSchema = Yup.object({
  whatToCallYou: Yup.string().required("Please select a title"),
  birthdate: Yup.date().required("Please select your birthdate"),
  gender: Yup.string().required("Please select your gender"),
  nationality: Yup.string().required("Please select your nationality"),
  countryOfResidence: Yup.string().required(
    "Please select your country of residence"
  ),
  race: Yup.string().required("Please select your race"),
  communicationPreference: Yup.string().required(
    "Please select a communication preference"
  ),
});

const Onboarding = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, customer } = useSelector((state: RootState) => state.auth);
  const [completeOnboarding, { isLoading, error }] =
    useCompleteOnboardingMutation();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendRegistrationOTPMutation();

  const [open, setOpen] = React.useState(false);
  const [showOTPModal, setShowOTPModal] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  
  // Toast hooks
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  // Initial values for Formik
  const initialValues = {
    whatToCallYou: "",
    birthdate: null as any,
    gender: "",
    nationality: "",
    countryOfResidence: "",
    race: "",
    communicationPreference: "Whatsapp",
  };

  // Handle form submission
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (!customer) {
      console.error("No user found");
      setSubmitting(false);
      return;
    }

    try {
      const onboardingData = {
        customer_id: customer,
        title: values.whatToCallYou,
        birth_date: values.birthdate
          ? formatDateDDMMYYYY(values.birthdate)
          : "",
        gender: values.gender,
        nationality: values.nationality,
        country_of_residence: values.countryOfResidence,
        race: values.race,
        communication_preference: values.communicationPreference,
      };

      const response = await completeOnboarding(onboardingData).unwrap();

      if (response.message.ok) {
        // Show success toast
        showSuccessToast(
          "Profile Updated!",
          "Your profile has been saved successfully. Now let's verify your email.",
          {
            duration: 4000,
          }
        );
        
        // Get user email from the response or user data
        const email = user || "user@example.com"; // You might need to get this from the response
        setUserEmail(email);
        
        // Send OTP for email verification
        try {
          await sendOTP({ email }).unwrap();
          setShowOTPModal(true);
        } catch (otpError) {
          console.error("Failed to send OTP:", otpError);
          showErrorToast(
            "OTP Send Failed",
            "Unable to send verification email. Please try again.",
            {
              duration: 0,
              action: {
                label: "Retry",
                onClick: () => {
                  sendOTP({ email }).unwrap().then(() => setShowOTPModal(true));
                },
              },
            }
          );
        }
      } else {
        console.error("Onboarding failed:", response.message.message);
        showErrorToast(
          "Update Failed",
          response.message.message || "Unable to save your profile. Please try again.",
          {
            duration: 0,
            action: {
              label: "Retry",
              onClick: () => handleSubmit(values, { setSubmitting }),
            },
          }
        );
      }
    } catch (err) {
      console.error("Error completing onboarding:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle OTP verification success
  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    showSuccessToast(
      "Email Verified!",
      "Your email has been verified successfully. You can now proceed to payment.",
      {
        duration: 5000,
      }
    );
    // Redirect to payment page
    router.push("/payment");
  };

  return (
    <PublicRouteGuard>
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
                src="/logo-svg.svg"
                alt="JanRich Logo"
                className="mx-auto w-12 h-auto"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">About you</h1>
            <p className="text-gray-600">
              Tell us about you just a little bit more
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            {/* Progress Steps */}
            <div className="mb-8 mx-10">
              <div className="flex items-center justify-center">
                <CircularProgressStep status={"isCompleted"} />
                <div className="flex-1 h-[3px] bg-[#E31B54]" />
                <CircularProgressStep status={"isActive"} />
                <div className="flex-1 h-[3px] bg-[#E31B54]" />
                <CircularProgressStep status={"inactive"} />
              </div>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* What do we call you */}
                  <div>
                    <Select
                      label="What do we call you?"
                      placeholder="Select an option"
                      size="md"
                      selectedKey={values.whatToCallYou}
                      onSelectionChange={(key) =>
                        setFieldValue("whatToCallYou", key)
                      }
                      isInvalid={!!(errors.whatToCallYou && touched.whatToCallYou)}
                    >
                      <Select.Item id="mr">Mr</Select.Item>
                      <Select.Item id="mrs">Mrs</Select.Item>
                      <Select.Item id="ms">Ms</Select.Item>
                      <Select.Item id="dr">Dr</Select.Item>
                      <Select.Item id="prof">Prof</Select.Item>
                    </Select>
                    {errors.whatToCallYou && touched.whatToCallYou && (
                      <p className="text-error-500 text-sm mt-1">{String(errors.whatToCallYou)}</p>
                    )}
                  </div>

                  {/* Birthdate and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Birthdate <span className="text-error-500">*</span>
                      </label>
                      <DatePicker
                        value={values.birthdate}
                        onChange={(date) => setFieldValue("birthdate", date)}
                        onApply={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        className={'py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 ' + (errors.birthdate && touched.birthdate ? 'border-error-500' : 'border-gray-300')    }
                      />
                      {errors.birthdate && touched.birthdate && (
                        <p className="text-error-500 text-sm mt-1">{String(errors.birthdate)}</p>
                      )}
                    </div>
                    <div>
                      <Select
                        label="Gender"
                        placeholder="Select gender"
                        size="md"
                        selectedKey={values.gender}
                        onSelectionChange={(key) => setFieldValue("gender", key)}
                        isInvalid={!!(errors.gender && touched.gender)}
                      >
                        <Select.Item id="male">Male</Select.Item>
                        <Select.Item id="female">Female</Select.Item>
                        <Select.Item id="non-binary">Non-binary</Select.Item>
                        <Select.Item id="prefer-not-to-say">Prefer not to say</Select.Item>
                      </Select>
                      {errors.gender && touched.gender && (
                        <p className="text-error-500 text-sm mt-1">{String(errors.gender)}</p>
                      )}
                    </div>
                  </div>

                  {/* Nationality */}
                  <div>
                    <Select
                      label="Nationality"
                      placeholder="Select nationality"
                      size="md"
                      selectedKey={values.nationality}
                      onSelectionChange={(key) => setFieldValue("nationality", key)}
                      isInvalid={!!(errors.nationality && touched.nationality)}
                    >
                      <Select.Item id="South Africa">South African</Select.Item>
                      <Select.Item id="american">American</Select.Item>
                      <Select.Item id="british">British</Select.Item>
                      <Select.Item id="canadian">Canadian</Select.Item>
                      <Select.Item id="australian">Australian</Select.Item>
                      <Select.Item id="other">Other</Select.Item>
                    </Select>
                    {errors.nationality && touched.nationality && (
                      <p className="text-error-500 text-sm mt-1">{String(errors.nationality)}</p>
                    )}
                  </div>

                  {/* Country of Residence */}
                  <div>
                    <Select
                      label="Country of Residence"
                      placeholder="Select country"
                      size="md"
                      selectedKey={values.countryOfResidence}
                      onSelectionChange={(key) => setFieldValue("countryOfResidence", key)}
                      isInvalid={!!(errors.countryOfResidence && touched.countryOfResidence)}
                    >
                      <Select.Item id="South Africa">South Africa</Select.Item>
                      <Select.Item id="united-states">United States</Select.Item>
                      <Select.Item id="united-kingdom">United Kingdom</Select.Item>
                      <Select.Item id="canada">Canada</Select.Item>
                      <Select.Item id="australia">Australia</Select.Item>
                      <Select.Item id="other">Other</Select.Item>
                    </Select>
                    {errors.countryOfResidence && touched.countryOfResidence && (
                      <p className="text-error-500 text-sm mt-1">{String(errors.countryOfResidence)}</p>
                    )}
                  </div>

                  {/* Race */}
                  <div>
                    <Select
                      label="Race"
                      placeholder="Select race"
                      size="md"
                      selectedKey={values.race}
                      onSelectionChange={(key) => setFieldValue("race", key)}
                      isInvalid={!!(errors.race && touched.race)}
                    >
                      <Select.Item id="Black African">African</Select.Item>
                      <Select.Item id="Asian">Asian</Select.Item>
                      <Select.Item id="Caucasian">Caucasian</Select.Item>
                      <Select.Item id="Coloured">Coloured</Select.Item>
                      <Select.Item id="Indian">Indian</Select.Item>
                      <Select.Item id="Other">Other</Select.Item>
                    </Select>
                    {errors.race && touched.race && (
                      <p className="text-error-500 text-sm mt-1">{String(errors.race)}</p>
                    )}
                  </div>

                  {/* Communication Preference */}
                  <div>
                    <Label className="text-sm font-medium text-[#414651] mb-3 block">
                      Communication Preference{" "}
                      <span className="text-error-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      <div
                        className={`border-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                          values.communicationPreference === "Whatsapp"
                            ? "border-primary-500 "
                            : errors.communicationPreference &&
                              touched.communicationPreference
                            ? "border-error-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setFieldValue("communicationPreference", "Whatsapp")
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              values.communicationPreference === "Whatsapp"
                                ? "border-primary-500 bg-primary-500"
                                : "border-gray-300"
                            }`}
                          >
                            {values.communicationPreference === "Whatsapp" && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-[#414651]">
                              WhatsApp
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                          values.communicationPreference === "Email"
                            ? "border-primary-500"
                            : errors.communicationPreference &&
                              touched.communicationPreference
                            ? "border-error-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setFieldValue("communicationPreference", "Email")
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              values.communicationPreference === "Email"
                                ? "border-primary-500 bg-primary-500"
                                : "border-gray-300"
                            }`}
                          >
                            {values.communicationPreference === "Email" && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-[#414651]">
                            Email
                          </span>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage
                      name="communicationPreference"
                      component="p"
                      className="text-error-500 text-sm mt-1"
                    />
                  </div>

                  {/* Get Started Button */}
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full mt-6"
                    isDisabled={isSubmitting || isLoading}
                    isLoading={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? "Processing..."
                      : "Get started"}
                  </Button>

                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                      <p className="text-error-600 text-sm">
                        {"data" in error &&
                        error.data &&
                        typeof error.data === "object" &&
                        "message" in error.data
                          ? (error.data as any).message
                          : "An error occurred. Please try again."}
                      </p>
                    </div>
                  )}
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
                className="text-primary-500 hover:text-primary-600 font-medium"
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
        contactInfo={userEmail}
        verificationMethod="email"
        email={userEmail}
        onSuccess={handleOTPSuccess}
        otpLength={6}
      />
    </PublicRouteGuard>
  );
};

export default Onboarding;
