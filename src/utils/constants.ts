/**
 * Constants for form select options
 * Generated from application form fields
 */

// Saving purposes
export const SAVING_FOR_OPTIONS = [
  "Develop Savings Habit",
  "Januworry blues",
  "Other",
  "Pay School Fees",
  "Pay off Debt",
  "Plan for the Year",
] as const;

export type SavingForOption = (typeof SAVING_FOR_OPTIONS)[number];

// Saving purposes
export const BENEFITIARY_TYPE_OPTIONS = [
  "My Beneficiary",
  "My Estate",
] as const;

export type BeneficiaryTypeOption = (typeof BENEFITIARY_TYPE_OPTIONS)[number];
// Saving purposes
export const BENEFITIARY_RELATION_OPTION = [
  "Spouse",
  "Partner",
  "Child",
  "Parent",
  "Sibling",
  "Friend",
  "Grand-Parent",
  "Aunt/Uncle",
  "Niece/Nephew",
  "Cousin",
  "Other",
] as const;

export type BeneficiaryRelationOption =
  (typeof BENEFITIARY_RELATION_OPTION)[number];

// Fund sources
export const FUND_SOURCE_OPTIONS = [
  "Allowance",
  "Business Profit",
  "Employment Income",
  "Inheritance",
  "Investments",
  "Other",
  "Pension",
  "Social Welfare Grant",
] as const;

export type FundSourceOption = (typeof FUND_SOURCE_OPTIONS)[number];

// Deposit frequencies
export const DEPOSIT_FREQUENCY_OPTIONS = [
  "Ad hoc",
  "Lump Sum",
  "Monthly",
  "Quarterly",
] as const;

export type DepositFrequencyOption = (typeof DEPOSIT_FREQUENCY_OPTIONS)[number];

// Employment status
export const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed (Full-time)",
  "Employed (Part-time)",
  "Other",
  "Retired",
  "Self-Employed",
  "Student",
  "Unemployed",
] as const;

export type EmploymentStatusOption = (typeof EMPLOYMENT_STATUS_OPTIONS)[number];

// Beneficiary titles
export const BENEFICIARY_TITLE_OPTIONS = [
  "Dr",
  "Madam",
  "Master",
  "Miss",
  "Mr",
  "Mrs",
  "Ms",
  "Mx",
] as const;

export type BeneficiaryTitleOption = (typeof BENEFICIARY_TITLE_OPTIONS)[number];

// Nationalities (partial list from screenshots)
export const NATIONALITY_OPTIONS = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  // Add more countries as needed
] as const;

export type NationalityOption = (typeof NATIONALITY_OPTIONS)[number];
// Nationalities (partial list from screenshots)
export const RACE_OPTIONS = [
  "Black African",
  "Coloured",
  "Caucasian",
  "Indian",
  "Asian",
  "Other",
  // Add more countries as needed
] as const;

export type RaceOption = (typeof RACE_OPTIONS)[number];

// Country of residence (uses same list as nationality)
export const COUNTRY_OF_RESIDENCE_OPTIONS = NATIONALITY_OPTIONS;

export type CountryOfResidenceOption =
  (typeof COUNTRY_OF_RESIDENCE_OPTIONS)[number];

/**
 * Helper function to check if a value is a valid option
 */
export function isValidOption<T extends readonly string[]>(
  value: string,
  options: T
): value is T[number] {
  return (options as readonly string[]).includes(value);
}

/**
 * Helper function to get option label (if you need custom formatting)
 */
export function getOptionLabel(value: string): string {
  return value;
}
