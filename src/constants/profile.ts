export const PROFILE_CONSTANTS = {
  DEFAULT_AMOUNT: [100000],
  AVATAR_SIZE: {
    MOBILE: "w-20 h-20",
    DESKTOP: "w-28 h-28",
  },
  HEADER_HEIGHT: {
    MOBILE: "h-32",
    SM: "h-40", 
    LG: "h-56",
  },
} as const;

export const PROFILE_TABS: Array<{ id: string; label: string }> = [
  { id: "details", label: "My details" },
  { id: "beneficiary", label: "Beneficiary" },
  { id: "financial", label: "Financial details" },
] as const;

export const TITLE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "mr", label: "Mr" },
  { id: "mrs", label: "Mrs" },
  { id: "ms", label: "Ms" },
  { id: "dr", label: "Dr" },
  { id: "prof", label: "Prof" },
] as const;

export const GENDER_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

export const NATIONALITY_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "south-african", label: "South African" },
  { id: "other", label: "Other" },
] as const;

export const COUNTRY_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "south-africa", label: "South Africa" },
  { id: "other", label: "Other" },
] as const;

export const RACE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "african", label: "African" },
  { id: "coloured", label: "Coloured" },
  { id: "indian", label: "Indian" },
  { id: "white", label: "White" },
  { id: "other", label: "Other" },
] as const;

export const COMMUNICATION_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "phone", label: "Phone call" },
] as const;

export const EMPLOYMENT_STATUS_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "employed", label: "Employed" },
  { id: "self-employed", label: "Self-employed" },
  { id: "unemployed", label: "Unemployed" },
  { id: "student", label: "Student" },
  { id: "retired", label: "Retired" },
  { id: "other", label: "Other" },
] as const;

export const DEPOSIT_FREQUENCY_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "annually", label: "Annually" },
  { id: "other", label: "Other" },
] as const;

export const BANK_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "absa", label: "ABSA" },
  { id: "fnb", label: "FNB" },
  { id: "standard-bank", label: "Standard Bank" },
  { id: "nedbank", label: "Nedbank" },
  { id: "capitec", label: "Capitec" },
  { id: "other", label: "Other" },
] as const;

export const BENEFICIARY_TYPE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "individual", label: "Individual" },
  { id: "organization", label: "Organization" },
] as const;

export const RELATION_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "spouse", label: "Spouse" },
  { id: "child", label: "Child" },
  { id: "parent", label: "Parent" },
  { id: "sibling", label: "Sibling" },
  { id: "friend", label: "Friend" },
  { id: "other", label: "Other" },
] as const;

export const PROFILE_MESSAGES = {
  LOADING: "Loading profile...",
  ERROR: "Failed to load profile",
  ERROR_DESCRIPTION: "Please try refreshing the page",
  SUCCESS_UPDATE: "Profile updated successfully",
  ERROR_UPDATE: "Failed to update profile",
} as const;
