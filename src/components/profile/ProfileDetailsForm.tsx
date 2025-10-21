import React, { memo } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Label } from '@/components/base/input/label';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import { Toggle } from '@/components/base/toggle/toggle';
import { Avatar } from '@/components/base/avatar/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/untitled-card';
import { FileUpload, getReadableFileSize } from '@/components/application/file-upload/file-upload-base';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ProfileFormProps } from '@/types/profile';
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  COUNTRY_OPTIONS,
  RACE_OPTIONS,
  COMMUNICATION_OPTIONS,
} from '@/constants/profile';

export const ProfileDetailsForm: React.FC<ProfileFormProps> = memo(({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading,
}) => {
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      console.log("File uploaded:", file.name, getReadableFileSize(file.size));
    }
  };

  return (
    <Tabs.Panel id="details">
      <Card className="p-8 border-none rounded-none shadow-none">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <CardHeader className="p-0">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                My details
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Update your photo and personal details.
              </CardDescription>
            </CardHeader>
          </div>

          <div className="col-span-12 lg:col-span-9 max-w-[720px] space-y-6">
            {/* First Section - Basic Info */}
            <CardContent className="space-y-6 border border-gra-50 shadow p-4 sm:p-6 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    isRequired
                  />
                </div>
                <div>
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    isRequired
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="detailsPhoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1">
                  <PhoneInput
                    id="detailsPhoneNumber"
                    placeholder="Enter phone number"
                    value={formData.detailsPhoneNumber}
                    onChange={(value) => handleInputChange('detailsPhoneNumber', value || "")}
                    className="phone-input"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Toggle
                  isSelected={formData.whatsappSame}
                  onChange={(value) => onFormDataChange({ whatsappSame: value })}
                  label="Use WhatsApp for notifications"
                  hint="Receive verification codes via WhatsApp"
                  size="sm"
                />
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <Avatar
                    size="2xl"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt="Profile"
                    contrastBorder={true}
                    className="shadow-lg border-4 border-white w-28 h-28"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Profile photo
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a new photo. Recommended size is at least 256x256px.
                  </p>
                  <FileUpload
                    onFilesSelected={handleFileUpload}
                    accept="image/*"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} // 5MB
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>

            {/* Second Section - Personal Details */}
            <CardContent className="space-y-6 border border-gra-50 shadow p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Title"
                    placeholder="Select title"
                    items={TITLE_OPTIONS}
                    defaultSelectedKey={formData.title}
                    onSelectionChange={(key) => handleInputChange('title', key as string)}
                    isRequired
                  />
                </div>
                <div>
                  <Input
                    label="Date of Birth"
                    placeholder="DD/MM/YYYY"
                    value={formData.birthdate}
                    onChange={(value) => handleInputChange('birthdate', value)}
                    isRequired
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    items={GENDER_OPTIONS}
                    defaultSelectedKey={formData.gender}
                    onSelectionChange={(key) => handleInputChange('gender', key as string)}
                    isRequired
                  />
                </div>
                <div>
                  <Select
                    label="Nationality"
                    placeholder="Select nationality"
                    items={NATIONALITY_OPTIONS}
                    defaultSelectedKey={formData.nationality}
                    onSelectionChange={(key) => handleInputChange('nationality', key as string)}
                    isRequired
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Country of Residence"
                    placeholder="Select country"
                    items={COUNTRY_OPTIONS}
                    defaultSelectedKey={formData.countryOfResidence}
                    onSelectionChange={(key) => handleInputChange('countryOfResidence', key as string)}
                    isRequired
                  />
                </div>
                <div>
                  <Select
                    label="Race"
                    placeholder="Select race"
                    items={RACE_OPTIONS}
                    defaultSelectedKey={formData.race}
                    onSelectionChange={(key) => handleInputChange('race', key as string)}
                    isRequired
                  />
                </div>
              </div>

              <div>
                <Select
                  label="Communication Preference"
                  placeholder="Select preference"
                  items={COMMUNICATION_OPTIONS}
                  defaultSelectedKey={formData.communicationPreference}
                  onSelectionChange={(key) => handleInputChange('communicationPreference', key as string)}
                  isRequired
                />
              </div>
            </CardContent>

            <div className="flex justify-end gap-3 pt-4">
              <Button color="secondary">Cancel</Button>
              <Button
                color="primary"
                onClick={onSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Tabs.Panel>
  );
});
