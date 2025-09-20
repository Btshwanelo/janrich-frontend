"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDateDDMMYYYY } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";
import CircularProgressStep from "@/components/CircularProgressStep";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import { useDispatch, useSelector } from "react-redux";
import { useCompleteOnboardingMutation } from "@/lib/slices/onboardingSlice";
import { RootState } from "@/lib/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // Initial values for Formik
  const initialValues = {
    whatToCallYou: "",
    birthdate: null as Date | null,
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
        // Redirect to payment page on success
        router.push("/payment");
      } else {
        console.error("Onboarding failed:", response.message.message);
      }
    } catch (err) {
      console.error("Error completing onboarding:", err);
    } finally {
      setSubmitting(false);
    }
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
                    <Label
                      htmlFor="whatToCallYou"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      What do we call you?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.whatToCallYou}
                      onValueChange={(value) =>
                        setFieldValue("whatToCallYou", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors.whatToCallYou &&
                            touched.whatToCallYou &&
                            "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">Mr</SelectItem>
                        <SelectItem value="mrs">Mrs</SelectItem>
                        <SelectItem value="ms">Ms</SelectItem>
                        <SelectItem value="dr">Dr</SelectItem>
                        <SelectItem value="prof">Prof</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="whatToCallYou"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Birthdate and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="birthdate"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Birthdate <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date"
                            className={cn(
                              "w-full justify-between font-normal",
                              errors.birthdate &&
                                touched.birthdate &&
                                "border-red-500"
                            )}
                          >
                            {values.birthdate
                              ? formatDateDDMMYYYY(values.birthdate)
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={values.birthdate || undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              setFieldValue("birthdate", date);
                              setDate(date);
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <ErrorMessage
                        name="birthdate"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="gender"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.gender}
                        onValueChange={(value) =>
                          setFieldValue("gender", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.gender && touched.gender && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="gender"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div>
                    <Label
                      htmlFor="nationality"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Nationality <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.nationality}
                      onValueChange={(value) =>
                        setFieldValue("nationality", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors.nationality &&
                            touched.nationality &&
                            "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="South Africa">
                          South African
                        </SelectItem>
                        <SelectItem value="american">American</SelectItem>
                        <SelectItem value="british">British</SelectItem>
                        <SelectItem value="canadian">Canadian</SelectItem>
                        <SelectItem value="australian">Australian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="nationality"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Country of Residence */}
                  <div>
                    <Label
                      htmlFor="countryOfResidence"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Country of Residence{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.countryOfResidence}
                      onValueChange={(value) =>
                        setFieldValue("countryOfResidence", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors.countryOfResidence &&
                            touched.countryOfResidence &&
                            "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="South Africa">
                          South Africa
                        </SelectItem>
                        <SelectItem value="united-states">
                          United States
                        </SelectItem>
                        <SelectItem value="united-kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="countryOfResidence"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Race */}
                  <div>
                    <Label
                      htmlFor="race"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Race <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.race}
                      onValueChange={(value) => setFieldValue("race", value)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors.race && touched.race && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black African">African</SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="Caucasian">Caucasian</SelectItem>
                        <SelectItem value="Coloured">Coloured</SelectItem>
                        <SelectItem value="Indian">Indian</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="race"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Communication Preference */}
                  <div>
                    <Label className="text-sm font-medium text-[#414651] mb-3 block">
                      Communication Preference{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      <div
                        className={`border-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                          values.communicationPreference === "Whatsapp"
                            ? "border-blue-500 "
                            : errors.communicationPreference &&
                              touched.communicationPreference
                            ? "border-red-500"
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
                                ? "border-[#E31B54] bg-[#E31B54]"
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
                            ? "border-blue-500"
                            : errors.communicationPreference &&
                              touched.communicationPreference
                            ? "border-red-500"
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
                                ? "border-[#E31B54] bg-[#E31B54]"
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
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Get Started Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? "Processing..."
                      : "Get started"}
                  </Button>

                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">
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
                className="text-[#E31B54] hover:text-[#E31B54] font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicRouteGuard>
  );
};

export default Onboarding;
