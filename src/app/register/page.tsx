"use client";
import React, { useState } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CircularProgressStep from "@/components/CircularProgressStep";

const PhoneNumberInput = ({ value, onChange, placeholder, className }) => {
  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      <div className="flex">
        <div className="flex items-center px-3 py-2 border-r border-gray-300 bg-gray-50">
          <span className="text-lg mr-2">🇿🇦</span>
          <span className="text-sm text-gray-600">+27</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
        />
      </div>
    </div>
  );
};

const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    whatsappSame: true,
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({ ...prev, phoneNumber: e?.target.value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(45deg, #9bbaf9 0%, #f7f7f7 40%)" }}
    >
      {/* Left Panel - Form (Scrollable) */}
      <div className="flex-1 p-6 sm:p-0">
        <div className="w-full max-w-md mx-auto flex flex-col bg-white/50 rounded-lg">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pt-8 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's get you started
            </h1>
            <p className="text-gray-600 mb-8">
              on the journey to paying yourself first!
            </p>

            {/* Updated Progress Steps */}
            <div className="mb-8 mx-12">
              <div className="flex items-center justify-center">
                <CircularProgressStep status={"isActive"} />
                <div className="flex-1 h-[3px] bg-[#E31B54]" />
                <CircularProgressStep status={""} />
                <div className="flex-1 h-[3px] bg-[#E31B54]" />
                <CircularProgressStep status={""} />
              </div>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <div className="space-y-6">
              {/* Name and Surname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="surname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="surname"
                    name="surname"
                    type="text"
                    value={formData.surname}
                    onChange={handleInputChange}
                    placeholder="Enter your surname"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Cell Number <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1">
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    defaultCountry="ZA"
                    className="phone-input"
                  />
                </div>
              </div>

              {/* WhatsApp Toggle */}
              <div className="flex items-center space-x-3">
                <Switch
                  id="whatsappSame"
                  checked={formData.whatsappSame}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, whatsappSame: checked }))
                  }
                  className="data-[state=checked]:bg-[#E31B54]"
                />
                <Label
                  htmlFor="whatsappSame"
                  className="text-sm font-medium text-gray-700"
                >
                  WhatsApp Number is the same as above.
                </Label>
              </div>

              {/* Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="pr-10 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="pr-10 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
                  }
                  className="mt-1 data-[state=checked]:bg-[#E31B54] data-[state=checked]:border-[#E31B54]"
                />
                <Label
                  htmlFor="agreeTerms"
                  className="text-sm text-gray-700 leading-5"
                >
                  I agree to the Terms and Conditions by logging and using this
                  application
                </Label>
              </div>

              {/* Remember Me */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, rememberMe: checked }))
                  }
                  className="mt-1 data-[state=checked]:bg-[#E31B54] data-[state=checked]:border-[#E31B54]"
                />
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
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium"
                disabled={!formData.agreeTerms}
              >
                Get started
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="text-[#E31B54] hover:text-[#E31B54] font-medium"
                  >
                    Log in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Full Height Image with Testimonial */}
      <div className="hidden lg:flex flex-1 relative min-h-screen">
        <div className="w-full relative">
          {/* Background Image */}
          <img
            src="/banner.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/90 via-orange-400/70 to-green-300/60"></div> */}

          {/* Testimonial Card - Fixed Position */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-xl font-medium mb-6">
                "We've been using Untitled to kick start every new project and
                can't imagine working without it. It's incredible."
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">Caitlyn King</div>
                  <div className="text-sm opacity-90">
                    Lead Designer, Layers
                  </div>
                  <div className="text-xs opacity-75">
                    Web Development Agency
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;
