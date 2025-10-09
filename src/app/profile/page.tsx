"use client";
import React, { useState } from "react";
import {
  Home,
  BarChart3,
  CreditCard,
  RefreshCw,
  Clock,
  Users,
  Settings,
  CheckCircle2,
  Info,
  Share,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/ui/untitled-input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Tabs } from "@/components/application/tabs/tabs";
import { Badge } from "@/components/base/badges/badges";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/untitled-card";
import { Avatar } from "@/components/base/avatar/avatar";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Slider } from "@/components/base/slider/slider";
import { Toggle } from "@/components/base/toggle/toggle";
import {
  FileUpload,
  getReadableFileSize,
} from "@/components/application/file-upload/file-upload-base";
import AuthGuard from "@/components/AuthGuard";
import SidebarWrapper from "@/components/SidebarWrapper";
import { useGetProfileQuery } from "@/lib/slices/authSlice";

export default function ProfileBeneficiaryScreen() {
  const [selectedTab, setSelectedTab] = useState("beneficiary");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState([100000]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch profile data
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery("JR0020");

  // Details tab state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [detailsPhoneNumber, setDetailsPhoneNumber] = useState("");
  const [whatsappSame, setWhatsappSame] = useState(true);
  const [title, setTitle] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [race, setRace] = useState("");
  const [communicationPreference, setCommunicationPreference] = useState("");

  // Populate form fields when profile data is loaded
  React.useEffect(() => {
    if (profileData?.message?.data) {
      const data = profileData.message.data;
      
      // Basic info
      const nameParts = data.basic_info.customer_name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setDetailsPhoneNumber(data.basic_info.phone || '');
      setTitle(data.basic_info.salutation || '');
      
      // About you
      setBirthdate(data.about_you.birth_date || '');
      setGender(data.about_you.profile_gender || '');
      setNationality(data.about_you.nationality || '');
      setCountryOfResidence(data.about_you.country_of_residence || '');
      setRace(data.about_you.race || '');
      setCommunicationPreference(data.about_you.communication_preference || '');
      
      // Financial details
      setAmount([data.financials.annual_savings_goal || 100000]);
      
      // Beneficiary details
      setPhoneNumber(data.beneficiary.beneficiary_cell || '');
    }
  }, [profileData]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      progress: number;
      failed?: boolean;
      fileObject?: File;
    }>
  >([]);

  // File upload functions
  const uploadFile = (file: File, onProgress: (progress: number) => void) => {
    // Add your upload logic here...
    // This is dummy upload logic
    let progress = 0;
    const interval = setInterval(() => {
      onProgress(++progress);
      if (progress === 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleDropFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    const newFilesWithIds = newFiles.map((file) => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      fileObject: file,
    }));

    setUploadedFiles([...newFilesWithIds, ...uploadedFiles]);

    newFilesWithIds.forEach(({ id, fileObject }) => {
      uploadFile(fileObject, (progress) => {
        setUploadedFiles((prev) =>
          prev.map((uploadedFile) =>
            uploadedFile.id === id
              ? { ...uploadedFile, progress }
              : uploadedFile
          )
        );
      });
    });
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleRetryFile = (id: string) => {
    const file = uploadedFiles.find((file) => file.id === id);
    if (!file) return;

    uploadFile(new File([], file.name, { type: file.type }), (progress) => {
      setUploadedFiles((prev) =>
        prev.map((uploadedFile) =>
          uploadedFile.id === id
            ? { ...uploadedFile, progress, failed: false }
            : uploadedFile
        )
      );
    });
  };

  const NavIcon = ({
    icon: Icon,
    active = false,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
  }) => (
    <button
      className={`p-3 rounded-lg transition-colors ${
        active
          ? "text-blue-600 bg-blue-50"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  const formatCurrency = (value: number) => {
    return `${"R"} ${value.toLocaleString()}`;
  };
  // Show loading state while fetching profile data
  if (isProfileLoading) {
    return (
      <AuthGuard>
        <div className="flex h-screen bg-white">
          <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
          <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Show error state if profile data failed to load
  if (profileError) {
    return (
      <AuthGuard>
        <div className="flex h-screen bg-white">
          <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
          <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-4">Failed to load profile</div>
                <p className="text-gray-600">Please try refreshing the page</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
     <AuthGuard>
       <div className="flex h-screen bg-white">
         {/* Left Sidebar */}
         <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />

         {/* Main Content */}
         <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Blue Header */}
          <div className="h-56 relative">
            <div className="absolute  inset-0">
              <img
                src="/image 5.png"
                alt="User"
                className="w-full h-full  object-cover"
              />
            </div>
          </div>

          {/* Profile Section */}
          <div className=" mx-auto relative">
            <div className=" px-8 py-4 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="relative -mt-12">
                    <Avatar
                      size="2xl"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                      alt="Profile"
                      verified={true}
                      contrastBorder={true}
                      className="shadow-lg border-4 border-white w-28 h-28"
                    />
                  </div>

                   <div>
                     <h1 className="text-2xl font-bold text-gray-900 mb-1">
                       {profileData?.message?.data?.basic_info?.customer_name || "Loading..."}
                     </h1>
                     <p className="text-gray-600">
                       {profileData?.message?.data?.basic_info?.email || "Loading..."}
                     </p>
                   </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    color="secondary"
                    iconLeading={<Share size={14} data-icon />}
                    size="md"
                  >
                    Share
                  </Button>
                  <Button color="primary" size="md">
                    View profile
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                className="w-full bg-[#FAFAFA]"
              >
                <Tabs.List
                  type="button-gray"
                  size="sm"
                  items={[
                    { id: "details", label: "My details" },
                    { id: "beneficiary", label: "Beneficiary Details" },
                    { id: "financial", label: "Financial details" },
                  ]}
                  className="w-full justify-start"
                >
                  {(tab) => <Tabs.Item {...tab} />}
                </Tabs.List>

                <Tabs.Panel id="beneficiary" className="mt-1">
                  <Card className="p-8 border-none rounded-none shadow-none">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Left column - Description */}
                      <div className="col-span-3">
                        <CardHeader className="p-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            Beneficiary Details
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            In the event of your passing (touch wood), where
                            would you like us to direct your funds?
                          </CardDescription>
                        </CardHeader>
                      </div>

                      {/* Right column - Form */}
                      <CardContent className="col-span-9 max-w-[720px] space-y-6 border border-gra-50 shadow p-6 rounded-lg">
                         <div>
                           <Select
                             label="Beneficiary Type"
                             placeholder="Select an option"
                             items={[
                               { id: "individual", label: "Individual" },
                               { id: "trust", label: "Trust" },
                               { id: "estate", label: "Estate" },
                             ]}
                             className="w-full"
                             defaultSelectedKey={profileData?.message?.data?.beneficiary?.beneficiary_type?.toLowerCase() || ""}
                           >
                             {(item) => (
                               <Select.Item key={item.id} id={item.id}>
                                 {item.label}
                               </Select.Item>
                             )}
                           </Select>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <Input
                               label="Beneficiary name"
                               placeholder="Enter beneficiary name"
                               value={profileData?.message?.data?.beneficiary?.beneficiary_name || ""}
                               onChange={() => {}} // Placeholder onChange to prevent read-only warning
                               required
                             />
                           </div>

                           <div>
                             <Input
                               label="Beneficiary Surname"
                               placeholder="Enter beneficiary surname"
                               value={profileData?.message?.data?.beneficiary?.beneficiary_surname || ""}
                               onChange={() => {}} // Placeholder onChange to prevent read-only warning
                               required
                             />
                           </div>
                         </div>

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
                              defaultCountry="ZA"
                              className="phone-input"
                              value={phoneNumber}
                              onChange={(value) => setPhoneNumber(value || "")}
                            />
                          </div>
                        </div>

                         <div>
                           <Select
                             label="Relation"
                             placeholder="Select an option"
                             items={[
                               { id: "spouse", label: "Spouse" },
                               { id: "child", label: "Child" },
                               { id: "parent", label: "Parent" },
                               { id: "sibling", label: "Sibling" },
                               { id: "other", label: "Other" },
                             ]}
                             className="w-full"
                             defaultSelectedKey={profileData?.message?.data?.beneficiary?.beneficiary_relation?.toLowerCase() || ""}
                             isRequired
                           >
                             {(item) => (
                               <Select.Item key={item.id} id={item.id}>
                                 {item.label}
                               </Select.Item>
                             )}
                           </Select>
                         </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button color="secondary">Cancel</Button>
                          <Button color="primary">Save changes</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Tabs.Panel>

                <Tabs.Panel id="details">
                  <Card className="p-8 border-none rounded-none shadow-none">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Left column - Description */}
                      <div className="col-span-3">
                        <CardHeader className="p-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            Personal info{" "}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            Update your photo and personal details.{" "}
                          </CardDescription>
                        </CardHeader>
                      </div>

                      <div className="col-span-9 max-w-[720px] space-y-6">
                        {/* First Section - Basic Info */}
                        <CardContent className="space-y-6 border border-gra-50 shadow p-6 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Input
                                label="First Name"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Input
                                label="Last Name"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor="detailsPhoneNumber"
                              className="text-sm font-medium text-gray-700"
                            >
                              Cell Number{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="mt-1">
                              <PhoneInput
                                placeholder="Enter phone number"
                                defaultCountry="ZA"
                                className="phone-input"
                                value={detailsPhoneNumber}
                                onChange={(value) =>
                                  setDetailsPhoneNumber(value || "")
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Toggle
                              isSelected={whatsappSame}
                              onChange={setWhatsappSame}
                              label="Use WhatsApp for notifications"
                              hint="Receive verification codes via WhatsApp"
                              size="sm"
                            />
                          </div>
                          <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0">
                              <Avatar
                                size="2xl"
                                src={
                                  uploadedFiles.length > 0 &&
                                  uploadedFiles[0].progress === 100 &&
                                  uploadedFiles[0].fileObject
                                    ? URL.createObjectURL(
                                        uploadedFiles[0].fileObject
                                      )
                                    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                                }
                                alt="Profile"
                                contrastBorder={true}
                                className="shadow-lg border-4 border-white w-28 h-28"
                              />
                            </div>
                            <div className="flex-1">
                              <FileUpload.Root>
                                <FileUpload.DropZone
                                  onDropFiles={handleDropFiles}
                                  className="w-full"
                                />
                                <FileUpload.List>
                                  {uploadedFiles.map((file) => (
                                    <FileUpload.ListItemProgressBar
                                      key={file.id}
                                      {...file}
                                      size={file.size}
                                      onDelete={() => handleDeleteFile(file.id)}
                                      onRetry={() => handleRetryFile(file.id)}
                                    />
                                  ))}
                                </FileUpload.List>
                              </FileUpload.Root>
                            </div>
                          </div>
                        </CardContent>

                        {/* Second Section - Personal Information */}
                        <CardContent className="space-y-6 border border-gra-50 shadow p-6 rounded-lg">
                          <div>
                            <Select
                              label="What do we call you"
                              placeholder="Select title"
                              items={[
                                { id: "mr", label: "Mr" },
                                { id: "mrs", label: "Mrs" },
                                { id: "ms", label: "Ms" },
                                { id: "dr", label: "Dr" },
                                { id: "prof", label: "Prof" },
                              ]}
                              className="w-full"
                              defaultSelectedKey={title}
                              onSelectionChange={(key) =>
                                setTitle(key as string)
                              }
                            >
                              {(item) => (
                                <Select.Item key={item.id} id={item.id}>
                                  {item.label}
                                </Select.Item>
                              )}
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Input
                                label="Birthdate"
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Select
                                label="Gender"
                                placeholder="Select gender"
                                items={[
                                  { id: "male", label: "Male" },
                                  { id: "female", label: "Female" },
                                  { id: "other", label: "Other" },
                                  {
                                    id: "prefer-not-to-say",
                                    label: "Prefer not to say",
                                  },
                                ]}
                                className="w-full"
                                defaultSelectedKey={gender}
                                onSelectionChange={(key) =>
                                  setGender(key as string)
                                }
                              >
                                {(item) => (
                                  <Select.Item key={item.id} id={item.id}>
                                    {item.label}
                                  </Select.Item>
                                )}
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Input
                                label="Nationality"
                                placeholder="Enter nationality"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Input
                                label="Country of Residence"
                                placeholder="Enter country of residence"
                                value={countryOfResidence}
                                onChange={(e) =>
                                  setCountryOfResidence(e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Select
                              label="Race"
                              placeholder="Select race"
                              items={[
                                { id: "african", label: "African" },
                                { id: "coloured", label: "Coloured" },
                                { id: "indian", label: "Indian/Asian" },
                                { id: "white", label: "White" },
                                { id: "other", label: "Other" },
                                {
                                  id: "prefer-not-to-say",
                                  label: "Prefer not to say",
                                },
                              ]}
                              className="w-full"
                              defaultSelectedKey={race}
                              onSelectionChange={(key) =>
                                setRace(key as string)
                              }
                            >
                              {(item) => (
                                <Select.Item key={item.id} id={item.id}>
                                  {item.label}
                                </Select.Item>
                              )}
                            </Select>
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
                                  communicationPreference === "Whatsapp"
                                    ? "border-primary-500"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  setCommunicationPreference("Whatsapp")
                                }
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                      communicationPreference === "Whatsapp"
                                        ? "border-primary-500 bg-primary-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {communicationPreference === "Whatsapp" && (
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
                                  communicationPreference === "Email"
                                    ? "border-primary-500"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  setCommunicationPreference("Email")
                                }
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                      communicationPreference === "Email"
                                        ? "border-primary-500 bg-primary-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {communicationPreference === "Email" && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="font-medium text-[#414651]">
                                    Email
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button color="secondary">Cancel</Button>
                            <Button color="primary">Save changes</Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Tabs.Panel>

                <Tabs.Panel id="financial">
                  <Card className="p-8 border-none rounded-none shadow-none">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Left column - Description */}
                      <div className="col-span-3">
                        <CardHeader className="p-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            Financial Information{" "}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            Update your financial details.
                          </CardDescription>
                        </CardHeader>
                      </div>

                      {/* Right column - Form */}
                      <CardContent className="col-span-9 max-w-[720px] space-y-6 border border-gra-50 shadow p-6 rounded-lg">
                        <div className="relative h-48 w-full p-8">
                          <div className="absolute inset-0">
                            <img
                              src="/image 5.png"
                              alt="User"
                              className="w-full h-full rounded-lg object-cover"
                            />
                          </div>
                          <div className="relative z-10">
                            <span className="text-base text-white">
                              I want to save
                            </span>
                          </div>
                          <div className="flex text-center font-bold z-10 text-7xl justify-center text-white mb-4 px-1 relative">
                            <span className="font-bold">
                              {formatCurrency(amount[0])}
                            </span>
                          </div>
                          <div className="relative z-10">
                            <div className="mb-6 [&_.bg-brand-solid]:bg-[#E31B54] [&_.ring-\\[\\#155EEF\\]]:ring-[#E31B54] [&_.text-\\[\\#E31B54\\]]:text-[#E31B54] [&_.bg-slider-handle-bg]:bg-white">
                              <Slider
                                value={amount}
                                onChange={(value) =>
                                  setAmount(
                                    Array.isArray(value) ? value : [value]
                                  )
                                }
                                minValue={5000}
                                maxValue={1000000}
                                step={500}
                                labelFormatter={(value) =>
                                  formatCurrency(value)
                                }
                              />
                            </div>
                          </div>
                        </div>

                         {/* What are you saving for - Full width */}
                         <div>
                           <Select
                             label="What are you saving for"
                             placeholder="Select an option"
                             items={[
                               { id: "house", label: "House" },
                               { id: "car", label: "Car" },
                               { id: "education", label: "Education" },
                               { id: "retirement", label: "Retirement" },
                               { id: "emergency", label: "Emergency Fund" },
                               { id: "vacation", label: "Vacation" },
                               { id: "other", label: "Other" },
                             ]}
                             className="w-full"
                             defaultSelectedKey={profileData?.message?.data?.financials?.saving_for?.toLowerCase().replace(/\s+/g, '_') || ""}
                           >
                             {(item) => (
                               <Select.Item key={item.id} id={item.id}>
                                 {item.label}
                               </Select.Item>
                             )}
                           </Select>
                         </div>

                        {/* Two column grid for remaining fields */}
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                             <Select
                               label="Employment status"
                               placeholder="Select an option"
                               items={[
                                 { id: "employed", label: "Employed" },
                                 { id: "self-employed", label: "Self-employed" },
                                 { id: "unemployed", label: "Unemployed" },
                                 { id: "student", label: "Student" },
                                 { id: "retired", label: "Retired" },
                                 { id: "other", label: "Other" },
                               ]}
                               className="w-full"
                               defaultSelectedKey={profileData?.message?.data?.financials?.employment_status?.toLowerCase().replace(/\s+/g, '_') || ""}
                             >
                               {(item) => (
                                 <Select.Item key={item.id} id={item.id}>
                                   {item.label}
                                 </Select.Item>
                               )}
                             </Select>
                           </div>

                           <div>
                             <Select
                               label="Deposit frequency"
                               placeholder="Select an option"
                               items={[
                                 { id: "weekly", label: "Weekly" },
                                 { id: "bi-weekly", label: "Bi-weekly" },
                                 { id: "monthly", label: "Monthly" },
                                 { id: "quarterly", label: "Quarterly" },
                                 { id: "annually", label: "Annually" },
                               ]}
                               className="w-full"
                               defaultSelectedKey={profileData?.message?.data?.financials?.deposit_frequency?.toLowerCase() || ""}
                             >
                               {(item) => (
                                 <Select.Item key={item.id} id={item.id}>
                                   {item.label}
                                 </Select.Item>
                               )}
                             </Select>
                           </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <Input
                               label="Bank name"
                               placeholder="Enter bank name"
                               value={profileData?.message?.data?.financials?.customer_bank || ""}
                               onChange={() => {}} // Placeholder onChange to prevent read-only warning
                               required
                             />
                           </div>

                           <div>
                             <Input
                               label="Account number"
                               placeholder="Enter account number"
                               value={profileData?.message?.data?.financials?.iban_account || ""}
                               onChange={() => {}} // Placeholder onChange to prevent read-only warning
                               required
                             />
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <Select
                               label="Source of funds"
                               placeholder="Select an option"
                               items={[
                                 { id: "salary", label: "Salary" },
                                 { id: "business", label: "Business Income" },
                                 {
                                   id: "investment",
                                   label: "Investment Returns",
                                 },
                                 { id: "inheritance", label: "Inheritance" },
                                 { id: "gift", label: "Gift" },
                                 { id: "other", label: "Other" },
                               ]}
                               className="w-full"
                               defaultSelectedKey={profileData?.message?.data?.financials?.fund_source?.toLowerCase().replace(/\s+/g, '_') || ""}
                             >
                               {(item) => (
                                 <Select.Item key={item.id} id={item.id}>
                                   {item.label}
                                 </Select.Item>
                               )}
                             </Select>
                           </div>

                           <div>
                             <Input
                               label="Pay day"
                               type="number"
                               placeholder="Enter day of month (1-31)"
                               min="1"
                               max="31"
                               value={profileData?.message?.data?.financials?.pay_day || ""}
                               onChange={() => {}} // Placeholder onChange to prevent read-only warning
                               required
                             />
                           </div>
                         </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button color="secondary">Cancel</Button>
                          <Button color="primary">Save changes</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Tabs.Panel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
