import React, { useState } from "react";
import { X, Edit, Check, ChevronDown } from "lucide-react";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Button } from "./base/buttons/button";
import { Input } from "./base/input/input";

const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: "Sienna",
    lastName: "Hewitt",
    email: "hi@siennahewitt.com",
    username: "siennahewitt",
    country: "australia",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = () => {
    console.log("Saving as draft:", formData);
    // Handle save draft logic
  };

  const handlePublishChanges = () => {
    console.log("Publishing changes:", formData);
    // Handle publish changes logic
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl relative overflow-hidden">
        {/* Header with gradient background */}
        <div className="h-32 bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Edit button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-12 text-white/80 hover:text-white"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="absolute top-16 left-6">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            <img
              src="/images.jpeg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          {/* Profile Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Sienna Hewitt
              </h2>
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">@siennahewitt</p>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-500">Followers</span>
                <div className="font-semibold">32,086</div>
              </div>
              <div>
                <span className="text-gray-500">Following</span>
                <div className="font-semibold">4,698</div>
              </div>
              <div>
                <span className="text-gray-500">Posts</span>
                <div className="font-semibold">128</div>
              </div>
              <div>
                <span className="text-gray-500">Collections</span>
                <div className="font-semibold">24</div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Name
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="bg-gray-50"
                />
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="pl-10 bg-gray-50"
                />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Check className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">
                  Verified 2 Jan, 2025
                </span>
              </div>
            </div>

            {/* Username */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Username
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-600">
                  untitledui.com/@
                </div>
                <div className="relative flex-1">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="username"
                    className="rounded-l-none bg-gray-50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Country */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Country
              </Label>
              <Select
                selectedKey={formData.country}
                onSelectionChange={(key) =>
                  setFormData((prev) => ({ ...prev, country: key as string }))
                }
                items={[
                  { id: "australia", label: "Australia UTC/GMT +10" },
                  { id: "usa", label: "United States UTC/GMT -5" },
                  { id: "uk", label: "United Kingdom UTC/GMT +0" }
                ]}
                className="w-full"
              >
                {(item) => (
                  <Select.Item key={item.id} id={item.id}>
                    {item.label}
                  </Select.Item>
                )}
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Estimates based on recent IP address.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              onClick={handleSaveDraft}
              color="secondary"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Save as draft
            </Button>
            <Button
              onClick={handlePublishChanges}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Publish changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show the modal
// const ProfileModalDemo = () => {

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold mb-4">Profile Modal Demo</h1>
//         <Button onClick={() => setIsModalOpen(true)}>Open Profile Modal</Button>
//       </div>

//       <ProfileModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// };

export default ProfileModal;
