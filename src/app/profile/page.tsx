"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Tabs } from "@/components/application/tabs/tabs";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
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
import MobileTopNav from "@/components/MobileTopNav";
import { ProfileLoadingState, ProfileErrorState } from "@/components/profile";
import {
  useGetProfileQuery,
  useUpdateFinancialDetailsMutation,
  useUpdateBeneficiaryMutation,
  useUpdateCustomerMutation,
  useUpdateProfileMutation,
} from "@/lib/slices/authSlice";
import { useAppSelector } from "@/lib/hooks";
import { Input } from "@/components/base/input/input";
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  RACE_OPTIONS,
  NATIONALITY_OPTIONS,
  COUNTRY_OPTIONS,
  BENEFICIARY_TYPE_OPTIONS,
  RELATION_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  SAVING_FOR_OPTIONS,
  FUND_SOURCE_OPTIONS,
  PROFILE_TABS,
} from "@/constants/profile";
import { amountConversion } from "@/utils/amountConversion";
import {
  useOnboardingFlow,
  getNextOnboardingStep,
} from "@/utils/onboardingState";

export default function ProfileBeneficiaryScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("details");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState([100000]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { user, customer } = useAppSelector((state) => state.auth);
  const {
    flow,
    isProfileComplete,
    isOnboardingComplete,
    markProfileTabCompleted,
    completeOnboarding,
  } = useOnboardingFlow();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(customer);

  // Financial details update mutation
  const [updateFinancialDetails, { isLoading: isUpdatingFinancials }] =
    useUpdateFinancialDetailsMutation();

  // Beneficiary update mutation
  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] =
    useUpdateBeneficiaryMutation();

  // Customer and Profile update mutations
  const [updateCustomer, { isLoading: isUpdatingCustomer }] =
    useUpdateCustomerMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  // Toast hooks
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

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

  // Financial details state
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [employmentStatusOther, setEmploymentStatusOther] = useState("");
  const [depositFrequency, setDepositFrequency] = useState("");
  const [depositFrequencyOther, setDepositFrequencyOther] = useState("");
  const [customerBank, setCustomerBank] = useState("");
  const [bankOther, setBankOther] = useState("");
  const [fundSource, setFundSource] = useState("");
  const [fundSourceOther, setFundSourceOther] = useState("");
  const [savingFor, setSavingFor] = useState("");
  const [savingForOther, setSavingForOther] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [ibanAccount, setIbanAccount] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [payDay, setPayDay] = useState(1);

  // Beneficiary state
  const [beneficiaryType, setBeneficiaryType] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiarySurname, setBeneficiarySurname] = useState("");
  const [beneficiaryTitle, setBeneficiaryTitle] = useState("");
  const [beneficiaryCell, setBeneficiaryCell] = useState("");
  const [beneficiaryRelation, setBeneficiaryRelation] = useState("");

  // Additional state for My Details form
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [raceOther, setRaceOther] = useState("");
  // Check onboarding state and enforce tab completion
  useEffect(() => {
    // If user hasn't completed welcome, redirect
    if (!flow.welcomeShown && !flow.isOnboardingComplete) {
      router.push("/dashboard");
      return;
    }

    // If user hasn't created savings goal, redirect to dashboard
    if (!flow.savingsGoalCreated && !flow.isOnboardingComplete) {
      router.push("/dashboard");
      return;
    }
  }, [router, flow]);

  // Check if user tries to navigate away before completing all tabs
  useEffect(() => {
    if (!flow.welcomeShown) return; // Only enforce if in onboarding flow

    // If profile is complete, allow navigation
    if (flow.isOnboardingComplete) {
      return;
    }

    // Force user to stay on profile page until all tabs are completed
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!flow.isOnboardingComplete) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [flow]);

  // Track if we've already synced completion state to prevent infinite loops
  const hasSyncedCompletionRef = React.useRef<string | null>(null);

  // Populate form fields when profile data is loaded and sync completion state
  React.useEffect(() => {
    if (profileData?.message?.data) {
      const data = profileData.message.data;
      const customerId = data.basic_info?.customer_id;

      // Reset sync flag if this is a different customer or new data
      if (hasSyncedCompletionRef.current !== customerId) {
        hasSyncedCompletionRef.current = null;
      }
      // Basic info
      const customerName = data.basic_info?.customer_name || "";
      const nameParts = customerName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setDetailsPhoneNumber(data.basic_info.phone || "");
      setTitle(data.basic_info.salutation || "");
      setEmail(data.basic_info.email || "");
      setWhatsappNumber(data.basic_info.whatsapp_number || "");
      setCountryCode(data.basic_info.country_code || "");

      // About you
      setBirthdate(data.about_you.birth_date || "");
      setGender(data.about_you.profile_gender || "");
      setNationality(data.about_you.nationality || "");
      setCountryOfResidence(data.about_you.country_of_residence || "");
      setRace(data.about_you.race || "");
      setRaceOther(data.about_you.race_other || "");
      setCommunicationPreference(data.about_you.communication_preference || "");

      // Financial details
      setAmount([data.financials.annual_savings_goal || 100000]);
      setEmploymentStatus(data.financials.employment_status || "");
      setEmploymentStatusOther(data.financials.employee_status_other || "");
      setDepositFrequency(data.financials.deposit_frequency || "");
      setDepositFrequencyOther(data.financials.deposit_frequency_other || "");
      setCustomerBank(data.financials.customer_bank || "");
      setBankOther(data.financials.bank_other || "");
      setFundSource(data.financials.fund_source || "");
      setFundSourceOther(data.financials.fund_source_other || "");
      setSavingFor(data.financials.saving_for || "");
      setSavingForOther(data.financials.saving_for_other || "");
      setAccountHolder(data.financials.account_holder || "");
      setBranchCode(data.financials.branch_code || "");
      setIbanAccount(data.financials.iban_account || "");
      setHouseholdSize(data.financials.household_size || 1);
      setPayDay(data.financials.pay_day || 1);

      // Beneficiary details
      setPhoneNumber(data.beneficiary.beneficiary_cell || "");
      setBeneficiaryType(data.beneficiary.beneficiary_type || "");
      setBeneficiaryName(data.beneficiary.beneficiary_name || "");
      setBeneficiarySurname(data.beneficiary.beneficiary_surname || "");
      setBeneficiaryTitle(data.beneficiary.beneficiary_surname || ""); // Using surname as title for now
      setBeneficiaryCell(data.beneficiary.beneficiary_cell || "");
      setBeneficiaryRelation(data.beneficiary.beneficiary_relation || "");

      // Only sync profile completion state if user is NOT in onboarding flow
      // If they're in onboarding (welcomeShown is false), don't auto-complete based on data
      // This ensures first-time users go through the full onboarding process
      if (flow.welcomeShown && hasSyncedCompletionRef.current !== customerId) {
        // User has already been through onboarding, sync state with actual data
        // Check if details tab is complete (has required fields)
        const detailsComplete =
          customerName &&
          data.basic_info.phone &&
          data.about_you.birth_date &&
          data.about_you.profile_gender &&
          data.about_you.nationality &&
          data.about_you.country_of_residence &&
          data.about_you.race &&
          data.about_you.communication_preference;

        // Check if beneficiary tab is complete
        const beneficiaryComplete =
          data.beneficiary.beneficiary_type &&
          data.beneficiary.beneficiary_name &&
          data.beneficiary.beneficiary_surname &&
          data.beneficiary.beneficiary_cell &&
          data.beneficiary.beneficiary_relation;

        // Check if financial tab is complete
        const financialComplete =
          data.financials.employment_status &&
          data.financials.deposit_frequency &&
          data.financials.customer_bank &&
          data.financials.fund_source &&
          data.financials.saving_for &&
          data.financials.account_holder &&
          data.financials.iban_account;

        // Only update Redux state if it doesn't match actual data
        // Use a ref to prevent multiple syncs and infinite loops
        // Read current flow.profileCompleted inside the effect to get latest value
        // const currentProfileCompleted = flow.profileCompleted;
        // if (detailsComplete && !currentProfileCompleted.details) {
        //   markProfileTabCompleted("details");
        // }
        // if (beneficiaryComplete && !currentProfileCompleted.beneficiary) {
        //   markProfileTabCompleted("beneficiary");
        // }
        // if (financialComplete && !currentProfileCompleted.financial) {
        //   markProfileTabCompleted("financial");
        // }

        // Mark that we've synced for this customer to prevent re-syncing
        hasSyncedCompletionRef.current = customerId;
      }
    }
    // Only depend on profileData and flow.welcomeShown to prevent infinite loops
    // flow.profileCompleted changes when we call markProfileTabCompleted, which would cause a loop
    // We read flow.profileCompleted inside the effect to get the current value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, flow.welcomeShown]);
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

  // Helper functions to map API values to select options
  const mapApiValueToSelectKey = (
    apiValue: string,
    options: { id: string; label: string }[]
  ) => {
    if (!apiValue) return "";

    // Find the option that matches the API value (case-insensitive)
    const matchingOption = options.find(
      (option) =>
        option.label.toLowerCase() === apiValue.toLowerCase() ||
        option.id.toLowerCase() === apiValue.toLowerCase()
    );

    return matchingOption ? matchingOption.id : "";
  };

  const mapSelectKeyToApiValue = (
    selectKey: string,
    options: { id: string; label: string }[]
  ) => {
    const option = options.find((opt) => opt.id === selectKey);
    return option ? option.label : selectKey;
  };

  // Handle financial details form submission
  const handleFinancialDetailsSubmit = async () => {
    try {
      const financialData = {
        customer_id: customer,
        custom_employment_status: mapSelectKeyToApiValue(
          employmentStatus,
          EMPLOYMENT_STATUS_OPTIONS
        ),
        custom_employee_status_other: employmentStatusOther,
        custom_deposit_frequency: mapSelectKeyToApiValue(
          depositFrequency,
          DEPOSIT_FREQUENCY_OPTIONS
        ),
        custom_deposit_frequency_other: depositFrequencyOther,
        custom_customer_bank: customerBank,
        custom_bank_other: bankOther,
        custom_fund_source: mapSelectKeyToApiValue(
          fundSource,
          FUND_SOURCE_OPTIONS
        ),
        custom_fund_source_other: fundSourceOther,
        custom_saving_for: mapSelectKeyToApiValue(
          savingFor,
          SAVING_FOR_OPTIONS
        ),
        custom_saving_for_other: savingForOther,
        custom_account_holder: accountHolder,
        custom_branch_code: branchCode,
        custom_iban_account: ibanAccount,
        custom_annual_savings_goal: amount?.[0] || 0,
        custom_household_size: householdSize,
        custom_pay_day: payDay,
      };

      const result = await updateFinancialDetails(financialData).unwrap();

      // Mark financial tab as completed
      markProfileTabCompleted("financial");

      // Show success toast
      showSuccessToast(
        "Financial Details Updated!",
        "Your financial information has been saved successfully.",
        {
          duration: 4000,
        }
      );
    } catch (error: any) {
      console.error("Failed to update financial details:", error);

      // Show error toast
      showErrorToast("Update Failed", error, {
        duration: 4000,
      });
    }
  };

  // Handle beneficiary form submission
  const handleBeneficiarySubmit = async () => {
    try {
      const beneficiaryData = {
        customer_id: customer,
        beneficiary_type: mapSelectKeyToApiValue(
          beneficiaryType,
          BENEFICIARY_TYPE_OPTIONS
        ),
        beneficiary_name: beneficiaryName,
        beneficiary_title: beneficiaryTitle,
        beneficiary_cell: beneficiaryCell,
        beneficiary_relation: mapSelectKeyToApiValue(
          beneficiaryRelation,
          RELATION_OPTIONS
        ),
      };

      const result = await updateBeneficiary(beneficiaryData).unwrap();

      // Mark beneficiary tab as completed
      markProfileTabCompleted("beneficiary");

      // Show success toast
      showSuccessToast(
        "Beneficiary Updated!",
        "Your beneficiary information has been saved successfully.",
        {
          duration: 4000,
        }
      );
    } catch (error: any) {
      // Show error toast
      showErrorToast(
        "Update Failed",
        error ||
          "Unable to save your beneficiary information. Please try again.",
        {
          duration: 4000, // Don't auto-dismiss
        }
      );
    }
  };

  // Handle My Details form submission (Customer Update)
  const handleCustomerUpdate = async () => {
    try {
      const customerData = {
        customer_id: customer,
        customer_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: detailsPhoneNumber,
        whatsapp_number: whatsappNumber,
        country_code: countryCode,
      };

      const result = await updateCustomer(customerData).unwrap();

      showSuccessToast(
        "Customer Updated!",
        "Your basic information has been saved successfully.",
        {
          duration: 4000,
        }
      );
    } catch (error: any) {
      showErrorToast(
        "Update Failed",
        error || "Unable to save your customer information. Please try again.",
        {
          duration: 4000,
        }
      );
    }
  };

  // Handle My Details form submission (Profile Update)
  const handleProfileUpdate = async () => {
    try {
      // Format birth date from YYYY-MM-DD to DD/MM/YYYY
      const formatBirthDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const profileData = {
        customer_id: customer,
        birth_date: formatBirthDate(birthdate),
        gender: mapSelectKeyToApiValue(gender, GENDER_OPTIONS),
        nationality: nationality,
        country_of_residence: countryOfResidence,
        race: mapSelectKeyToApiValue(race, RACE_OPTIONS),
        race_other: raceOther,
        communication_preference: communicationPreference,
      };

      const result = await updateProfile(profileData).unwrap();

      handleCustomerUpdate();

      showSuccessToast(
        "Profile Updated!",
        "Your profile information has been saved successfully.",
        {
          duration: 4000,
        }
      );
    } catch (error: any) {
      showErrorToast(
        "Update Failed",
        error || "Unable to save your profile information. Please try again.",
        {
          duration: 4000,
        }
      );
    }
  };

  // Combined handler for My Details form
  const handleMyDetailsSubmit = async () => {
    try {
      // Update customer information first
      // await handleCustomerUpdate();

      // Then update profile information
      await handleProfileUpdate();

      // Mark details tab as completed
      markProfileTabCompleted("details");

      // If all tabs are complete, redirect to dashboard (which will show deposit modal)
      if (isProfileComplete) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to update My Details:", error);
    }
  };
  // Show loading state while fetching profile data
  if (isProfileLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white flex">
          {/* Mobile Top Navigation */}
          <MobileTopNav />

          <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            }`}
          >
            <ProfileLoadingState />
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Show error state if profile data failed to load
  if (profileError) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white flex">
          {/* Mobile Top Navigation */}
          <MobileTopNav />

          <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            }`}
          >
            <ProfileErrorState error={profileError} />
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex">
        {/* Mobile Top Navigation */}
        <MobileTopNav />

        {/* Left Sidebar */}
        <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <div className="flex-1 overflow-auto">
            {/* Blue Header */}
            <div className="h-32 sm:h-40 lg:h-56 relative mt-16 lg:mt-0">
              <div className="absolute inset-0">
                <img
                  src="/profile-bg.png"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Section */}
            <div className="mx-auto relative">
              <div className="px-0 sm:px-6 lg:px-8 py-4 mb-6">
                <div className="px-6 sm:px-0 flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="relative -mt-8 sm:-mt-12">
                      <Avatar
                        size="2xl"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                        alt="Profile"
                        verified={true}
                        contrastBorder={true}
                        className="shadow-lg border-4 border-white w-20 h-20 sm:w-28 sm:h-28"
                      />
                    </div>

                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-cinzel text-[#181D27] mb-1">
                        {profileData?.message?.data?.basic_info
                          ?.customer_name || "Loading..."}
                      </h1>
                      <p className="text-sm sm:text-base text-[#535862]">
                        {profileData?.message?.data?.basic_info?.email}
                        {" • "}
                        {customer}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col sm:flex-row gap-3 self-center sm:self-auto">
                    {/* <Button
                      color="secondary"
                      iconLeading={<Share size={14} data-icon />}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Share</span>
                      <span className="sm:hidden">Share Profile</span>
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">View profile</span>
                      <span className="sm:hidden">View Profile</span>
                    </Button> */}
                  </div>
                </div>

                {/* Tabs */}
                <div className="w-full bg-[#FAFAFA] overflow-x-auto">
                  <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => {
                      // Only allow tab switching if current tab is completed or onboarding is complete
                      if (flow.welcomeShown && !isProfileComplete) {
                        // In onboarding flow, check if previous tabs are completed
                        const tabOrder = [
                          "details",
                          "beneficiary",
                          "financial",
                        ];
                        const currentIndex = tabOrder.indexOf(selectedTab);
                        const targetIndex = tabOrder.indexOf(key as string);

                        // Allow navigation to next tab if current is completed, or backwards
                        if (targetIndex > currentIndex) {
                          const currentTabCompleted =
                            flow.profileCompleted[
                              selectedTab as keyof typeof flow.profileCompleted
                            ];
                          if (!currentTabCompleted) {
                            showErrorToast(
                              "Complete Current Tab",
                              "Please complete the current tab before moving to the next one.",
                              { duration: 3000 }
                            );
                            return;
                          }
                        }
                      }
                      setSelectedTab(key as string);
                    }}
                    className="w-full"
                  >
                    <Tabs.List
                      type="button-gray"
                      size="sm"
                      items={PROFILE_TABS.map((tab) => ({
                        ...tab,
                        label: (
                          <span className="flex items-center gap-2">
                            {tab.label}
                            {flow.profileCompleted[
                              tab.id as keyof typeof flow.profileCompleted
                            ] && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                          </span>
                        ),
                      }))}
                      className="flex-nowrap"
                    >
                      {(tab) => <Tabs.Item {...tab} />}
                    </Tabs.List>

                    <Tabs.Panel id="beneficiary" className="mt-1">
                      <Card className="p-4 sm:p-6 lg:p-8 border-none rounded-none shadow-none">
                        <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                          {/* Left column - Description */}
                          <div className="col-span-12 lg:col-span-3">
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
                          <CardContent className="col-span-12 lg:col-span-9 max-w-full lg:max-w-[720px] space-y-4 sm:space-y-6 border border-gra-50 shadow p-4 sm:p-6 rounded-lg">
                            <div>
                              <Select
                                label="Beneficiary Type"
                                placeholder="Select an option"
                                items={BENEFICIARY_TYPE_OPTIONS}
                                className="w-full"
                                defaultSelectedKey={mapApiValueToSelectKey(
                                  beneficiaryType,
                                  BENEFICIARY_TYPE_OPTIONS
                                )}
                                onSelectionChange={(key) =>
                                  setBeneficiaryType(key as string)
                                }
                              >
                                {(item) => (
                                  <Select.Item key={item.id} id={item.id}>
                                    {item.label}
                                  </Select.Item>
                                )}
                              </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <Input
                                  label="Beneficiary name"
                                  placeholder="Enter beneficiary name"
                                  value={beneficiaryName}
                                  onChange={(value) =>
                                    setBeneficiaryName(value)
                                  }
                                  isRequired
                                />
                              </div>

                              <div>
                                <Input
                                  label="Beneficiary Surname"
                                  placeholder="Enter beneficiary surname"
                                  value={beneficiarySurname}
                                  onChange={(value) =>
                                    setBeneficiarySurname(value)
                                  }
                                  isRequired
                                />
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="phoneNumber"
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
                                  value={beneficiaryCell}
                                  onChange={(value) =>
                                    setBeneficiaryCell(value || "")
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <Select
                                label="Relation"
                                placeholder="Select an option"
                                items={RELATION_OPTIONS}
                                className="w-full"
                                defaultSelectedKey={mapApiValueToSelectKey(
                                  beneficiaryRelation,
                                  RELATION_OPTIONS
                                )}
                                onSelectionChange={(key) =>
                                  setBeneficiaryRelation(key as string)
                                }
                                isRequired
                              >
                                {(item) => (
                                  <Select.Item key={item.id} id={item.id}>
                                    {item.label}
                                  </Select.Item>
                                )}
                              </Select>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                              <Button
                                color="secondary"
                                className="w-full sm:w-auto"
                              >
                                Cancel
                              </Button>
                              <Button
                                color="primary"
                                onClick={handleBeneficiarySubmit}
                                disabled={isUpdatingBeneficiary}
                                className="w-full sm:w-auto"
                              >
                                {isUpdatingBeneficiary
                                  ? "Saving..."
                                  : "Save changes"}
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Tabs.Panel>

                    <Tabs.Panel id="details">
                      <Card className="p-4 sm:p-6 lg:p-8 border-none rounded-none shadow-none">
                        <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                          {/* Left column - Description */}
                          <div className="col-span-12 lg:col-span-3">
                            <CardHeader className="p-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                                Personal info{" "}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600">
                                Update your photo and personal details.{" "}
                              </CardDescription>
                            </CardHeader>
                          </div>

                          <div className="col-span-12 lg:col-span-9 max-w-full lg:max-w-[720px] space-y-4 sm:space-y-6">
                            {/* First Section - Basic Info */}
                            <CardContent className="space-y-4 sm:space-y-6 border border-gra-50 shadow p-4 sm:p-6 rounded-lg">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <Input
                                    label="First Name"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(value) => setFirstName(value)}
                                    isRequired
                                  />
                                </div>
                                <div>
                                  <Input
                                    label="Last Name"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(value) => setLastName(value)}
                                    isRequired
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
                                      uploadedFiles &&
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
                                      {uploadedFiles &&
                                        uploadedFiles.map((file) => (
                                          <FileUpload.ListItemProgressBar
                                            key={file.id}
                                            {...file}
                                            size={file.size}
                                            onDelete={() =>
                                              handleDeleteFile(file.id)
                                            }
                                            onRetry={() =>
                                              handleRetryFile(file.id)
                                            }
                                          />
                                        ))}
                                    </FileUpload.List>
                                  </FileUpload.Root>
                                </div>
                              </div>
                            </CardContent>

                            {/* Second Section - Personal Information */}
                            <CardContent className="space-y-4 sm:space-y-6 border border-gra-50 shadow p-4 sm:p-6 rounded-lg">
                              <div>
                                <Select
                                  label="What do we call you"
                                  placeholder="Select title"
                                  items={TITLE_OPTIONS}
                                  className="w-full"
                                  selectedKey={mapApiValueToSelectKey(
                                    title,
                                    TITLE_OPTIONS
                                  )}
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

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <Input
                                    label="Birthdate"
                                    type="date"
                                    value={birthdate}
                                    onChange={(value) => setBirthdate(value)}
                                    isRequired
                                  />
                                </div>
                                <div>
                                  <Select
                                    label="Gender"
                                    placeholder="Select gender"
                                    items={GENDER_OPTIONS}
                                    className="w-full"
                                    selectedKey={mapApiValueToSelectKey(
                                      gender,
                                      GENDER_OPTIONS
                                    )}
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

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <Select
                                    label="Nationality"
                                    placeholder="Select nationality"
                                    items={NATIONALITY_OPTIONS}
                                    className="w-full"
                                    selectedKey={mapApiValueToSelectKey(
                                      nationality,
                                      NATIONALITY_OPTIONS
                                    )}
                                    onSelectionChange={(key) =>
                                      setNationality(key as string)
                                    }
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
                                    label="Country of Residence"
                                    placeholder="Select country of residence"
                                    items={COUNTRY_OPTIONS}
                                    className="w-full"
                                    selectedKey={mapApiValueToSelectKey(
                                      countryOfResidence,
                                      COUNTRY_OPTIONS
                                    )}
                                    onSelectionChange={(key) =>
                                      setCountryOfResidence(key as string)
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

                              <div>
                                <Select
                                  label="Race"
                                  placeholder="Select race"
                                  items={RACE_OPTIONS}
                                  className="w-full"
                                  selectedKey={mapApiValueToSelectKey(
                                    race,
                                    RACE_OPTIONS
                                  )}
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
                                    className={` rounded-lg px-3 py-2 cursor-pointer transition-all ${
                                      communicationPreference === "Whatsapp"
                                        ? "border-primary-500 border-2"
                                        : "border-gray-200 hover:border-gray-300 border"
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
                                        {communicationPreference ===
                                          "Whatsapp" && (
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
                                    className={` rounded-lg px-3 py-2 cursor-pointer transition-all ${
                                      communicationPreference === "Email"
                                        ? "border-primary-500 border-2"
                                        : "border-gray-200 hover:border-gray-300 border"
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
                                        {communicationPreference ===
                                          "Email" && (
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

                              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <Button
                                  color="secondary"
                                  className="w-full sm:w-auto"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={handleMyDetailsSubmit}
                                  disabled={
                                    isUpdatingCustomer || isUpdatingProfile
                                  }
                                  className="w-full sm:w-auto"
                                >
                                  {isUpdatingCustomer || isUpdatingProfile
                                    ? "Saving..."
                                    : "Save changes"}
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    </Tabs.Panel>

                    <Tabs.Panel id="financial">
                      <Card className="p-4 sm:p-6 lg:p-8 border-none rounded-none shadow-none">
                        <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                          {/* Left column - Description */}
                          <div className="col-span-12 lg:col-span-3">
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
                          <CardContent className="col-span-12 lg:col-span-9 max-w-full lg:max-w-[720px] space-y-4 sm:space-y-6 border border-gra-50 shadow p-4 sm:p-6 rounded-lg">
                            <div className="relative h-32 sm:h-40 lg:h-48 w-full p-4 sm:p-6 lg:p-8">
                              <div className="absolute inset-0">
                                <img
                                  src="/profile-bg.png"
                                  alt="User"
                                  className="w-full h-full rounded-lg object-cover"
                                />
                              </div>
                              <div className="relative z-10">
                                <span className="text-base text-white">
                                  I want to save
                                </span>
                              </div>
                              <div className="flex mt-4 text-center font-bold z-10 text-4xl sm:text-5xl lg:text-7xl justify-center text-white mb-4 px-1 relative">
                                <span className="font-bold font-cinzel">
                                  {amountConversion(amount?.[0] || 0)}
                                </span>
                              </div>
                              {(amount?.[0] ?? 0) > 0 ? null : (
                                <div className="relative z-10">
                                  <div className="mb-6 [&_.bg-brand-solid]:bg-[#E31B54] [&_.ring-\\[\\#1F235B\\]]:ring-[#E31B54] [&_.text-\\[\\#E31B54\\]]:text-[#E31B54] [&_.bg-slider-handle-bg]:bg-white">
                                    <Slider
                                      value={amount}
                                      onChange={(value) =>
                                        setAmount(
                                          Array.isArray(value) ? value : [value]
                                        )
                                      }
                                      isDisabled={(amount?.[0] ?? 0) > 0}
                                      minValue={5000}
                                      maxValue={1000000}
                                      step={500}
                                      labelFormatter={(value) =>
                                        amountConversion(value)
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* What are you saving for - Full width */}
                            <div>
                              <Select
                                label="What are you saving for"
                                placeholder="Select an option"
                                items={SAVING_FOR_OPTIONS}
                                className="w-full"
                                defaultSelectedKey={mapApiValueToSelectKey(
                                  savingFor,
                                  SAVING_FOR_OPTIONS
                                )}
                                onSelectionChange={(key) =>
                                  setSavingFor(key as string)
                                }
                              >
                                {(item) => (
                                  <Select.Item key={item.id} id={item.id}>
                                    {item.label}
                                  </Select.Item>
                                )}
                              </Select>
                            </div>

                            {/* Two column grid for remaining fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <Select
                                  label="Employment status"
                                  placeholder="Select an option"
                                  items={EMPLOYMENT_STATUS_OPTIONS}
                                  className="w-full"
                                  defaultSelectedKey={mapApiValueToSelectKey(
                                    employmentStatus,
                                    EMPLOYMENT_STATUS_OPTIONS
                                  )}
                                  onSelectionChange={(key) =>
                                    setEmploymentStatus(key as string)
                                  }
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
                                  items={DEPOSIT_FREQUENCY_OPTIONS}
                                  className="w-full"
                                  defaultSelectedKey={mapApiValueToSelectKey(
                                    depositFrequency,
                                    DEPOSIT_FREQUENCY_OPTIONS
                                  )}
                                  onSelectionChange={(key) =>
                                    setDepositFrequency(key as string)
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <Input
                                  label="Bank name"
                                  placeholder="Enter bank name"
                                  value={customerBank}
                                  onChange={(value) => setCustomerBank(value)}
                                  isRequired
                                />
                              </div>

                              <div>
                                <Input
                                  label="Account number"
                                  placeholder="Enter account number"
                                  value={ibanAccount}
                                  onChange={(value) => setIbanAccount(value)}
                                  isRequired
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <Select
                                  label="Source of funds"
                                  placeholder="Select an option"
                                  items={FUND_SOURCE_OPTIONS}
                                  className="w-full"
                                  defaultSelectedKey={mapApiValueToSelectKey(
                                    fundSource,
                                    FUND_SOURCE_OPTIONS
                                  )}
                                  onSelectionChange={(key) =>
                                    setFundSource(key as string)
                                  }
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
                                  value={payDay.toString()}
                                  onChange={(value) =>
                                    setPayDay(parseInt(value) || 1)
                                  }
                                  isRequired
                                />
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                              <Button
                                color="secondary"
                                className="w-full sm:w-auto"
                              >
                                Cancel
                              </Button>
                              <Button
                                color="primary"
                                onClick={handleFinancialDetailsSubmit}
                                disabled={isUpdatingFinancials}
                                className="w-full sm:w-auto"
                              >
                                {isUpdatingFinancials
                                  ? "Saving..."
                                  : "Save changes"}
                              </Button>
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
        </div>
      </div>
    </AuthGuard>
  );
}
