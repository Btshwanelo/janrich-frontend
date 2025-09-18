"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
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
import { cn } from "@/lib/utils";
import CircularProgressStep from "@/components/CircularProgressStep";

const Onboarding = () => {
  const [formData, setFormData] = useState({
    whatToCallYou: "",
    birthdate: null,
    gender: "",
    nationality: "",
    countryOfResidence: "",
    race: "",
    communicationPreference: "whatsapp",
  });
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, birthdate: date }));
  };

  const handleCommunicationChange = (value) => {
    setFormData((prev) => ({ ...prev, communicationPreference: value }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-8"
      style={{ background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)" }}
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

          <div className="space-y-6">
            {/* What do we call you */}
            <div>
              <Label
                htmlFor="whatToCallYou"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                What do we call you? <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("whatToCallYou", value)
                }
              >
                <SelectTrigger className="w-full">
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
                      className="w-full justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
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
                onValueChange={(value) =>
                  handleSelectChange("nationality", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="south-african">South African</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="british">British</SelectItem>
                  <SelectItem value="canadian">Canadian</SelectItem>
                  <SelectItem value="australian">Australian</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country of Residence */}
            <div>
              <Label
                htmlFor="countryOfResidence"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Country of Residence <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("countryOfResidence", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="south-africa">South Africa</SelectItem>
                  <SelectItem value="united-states">United States</SelectItem>
                  <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                onValueChange={(value) => handleSelectChange("race", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="african">African</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="caucasian">Caucasian</SelectItem>
                  <SelectItem value="coloured">Coloured</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Communication Preference */}
            <div>
              <Label className="text-sm font-medium text-[#414651] mb-3 block">
                Communication Preference <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <div
                  className={`border-2 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                    formData.communicationPreference === "whatsapp"
                      ? "border-blue-500 "
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCommunicationChange("whatsapp")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.communicationPreference === "whatsapp"
                          ? "border-[#E31B54] bg-[#E31B54]"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.communicationPreference === "whatsapp" && (
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
                    formData.communicationPreference === "email"
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCommunicationChange("email")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.communicationPreference === "email"
                          ? "border-[#E31B54] bg-[#E31B54]"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.communicationPreference === "email" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#414651]">Email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Started Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium rounded-lg mt-6"
              onClick={() => console.log("Form data:", formData)}
            >
              Get started
            </Button>
          </div>
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
  );
};

export default Onboarding;
