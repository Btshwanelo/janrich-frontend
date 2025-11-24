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
  { id: "beneficiary", label: "Beneficiary Details" },
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
  { id: "african", label: "Black African" },
  { id: "coloured", label: "Coloured" },
  { id: "caucasian", label: "Caucasian" },
  { id: "indian", label: "Indian" },
  { id: "asian", label: "asian" },
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
  { id: "employed", label: "Employed (Full-time)" },
  { id: "self-employed", label: "Employed (Part-time)" },
  { id: "unemployed", label: "Unemployed" },
  { id: "student", label: "Student" },
  { id: "retired", label: "Retired" },
  { id: "other", label: "Other" },
] as const;

export const DEPOSIT_FREQUENCY_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "Ad hoc", label: "Ad hoc" },
  { id: "Lump Sum", label: "Lump Sum" },
  { id: "Monthly", label: "Monthly" },
  { id: "Quarterly", label: "Quarterly" },
] as const;

export const BANK_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "ABSA", label: "ABSA" },
  { id: "fnb", label: "FNB" },
  { id: "standard-bank", label: "Standard Bank" },
  { id: "nedbank", label: "Nedbank" },
  { id: "capitec", label: "Capitec" },
  { id: "other", label: "Other" },
] as const;

export const BENEFICIARY_TYPE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "My Estate", label: "My Estate" },
  { id: "My Beneficiary", label: "My Beneficiary" },
] as const;

export const RELATION_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "spouse", label: "Spouse" },
  { id: "child", label: "Child" },
  { id: "parent", label: "Parent" },
  { id: "sibling", label: "Sibling" },
  { id: "other", label: "Other" },
] as const;

export const SAVING_FOR_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "Develop Savings Habit", label: "Develop Savings Habit" },
  { id: "Januworry blues", label: "Januworry blues" },
  { id: "Pay School Fees", label: "Pay School Fees" },
  { id: "Pay off Debt", label: "Pay off Debt" },
  { id: "Plan for the Year", label: "Plan for the Year Fund" },
  { id: "Other", label: "Other" },
] as const;

export const FUND_SOURCE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "Allowance", label: "Allowance" },
  { id: "Business Profit", label: "Business Profit" },
  { id: "Employment Income", label: "Employment Income" },
  { id: "Inheritance", label: "Inheritance" },
  { id: "Investments", label: "Investments" },
  { id: "Pension", label: "Pension" },
  { id: "Social Welfare Grant", label: "Social Welfare Grant" },
  { id: "Other", label: "Other" },
] as const;

export const PROFILE_MESSAGES = {
  LOADING: "Loading profile...",
  ERROR: "Failed to load profile",
  ERROR_DESCRIPTION: "Please try refreshing the page",
  SUCCESS_UPDATE: "Profile updated successfully",
  ERROR_UPDATE: "Failed to update profile",
} as const;
