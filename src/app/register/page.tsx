'use client'
import React, { useState } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Alternative: If you prefer react-phone-input-2, install it and use this import instead:
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'

// For this example, I'll show you how to structure it with react-phone-number-input
// Install: npm install react-phone-number-input
// import PhoneInput from 'react-phone-number-input'
// import 'react-phone-number-input/style.css'

// Since we can't actually install the library in this environment,
// I'll create a placeholder component that shows the expected structure
const PhoneNumberInput = ({ value, onChange, placeholder, className }) => {
  // This is a placeholder - replace with actual PhoneInput component
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
          className="flex-1 px-3 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 px-3">
        Replace this with: &lt;PhoneInput value={"{value}"} onChange=
        {"{onChange}"} /&gt;
      </div>
    </div>
  );
};

const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's get you started
            </h1>
            <p className="text-gray-600">
              on the journey to paying yourself first!
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep >= 2 ? "bg-red-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep >= 3 ? "bg-red-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
            </div>
          </div>

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
                  className="mt-1"
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
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Phone Number with Library */}
            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                Cell Number <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <PhoneNumberInput
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center space-x-3">
              <Switch
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, rememberMe: checked }))
                }
                className="data-[state=checked]:bg-red-500"
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
                  className="pr-10"
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
                  className="pr-10"
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-base font-medium"
            >
              Get started
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Testimonial */}
      <div className="hidden lg:flex flex-1 relative">
        <div
          className="w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
              <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFA726;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#66BB6A;stop-opacity:0.8" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg)"/>
              </svg>
            `)}')`,
          }}
        >
          {/* Testimonial Card */}
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
                "We've been using JanRiches to kick start every new project and
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
