export const ONBOARDING_INITIAL_VALUES = {
  whatToCallYou: "",
  birthdate: null as any,
  gender: "",
  nationality: "",
  countryOfResidence: "",
  race: "",
  communicationPreference: "Whatsapp",
} as const;

export const ONBOARDING_TITLE_OPTIONS = [
  { id: "dr", label: "Dr" },
  { id: "madam", label: "Madam" },
  { id: "master", label: "Master" },
  { id: "miss", label: "Miss" },
  { id: "mr", label: "Mr" },
  { id: "mrs", label: "Mrs" },
  { id: "ms", label: "Ms" },
  { id: "mx", label: "Mx" },
  { id: "prof", label: "Prof" },
] as const;

export const ONBOARDING_GENDER_OPTIONS = [
  { id: "female", label: "Female" },
  { id: "genderqueer", label: "Genderqueer" },
  { id: "male", label: "Male" },
  { id: "non-conforming", label: "Non-Conforming" },
  { id: "other", label: "Other" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
  { id: "transgender", label: "Transgender" },
] as const;

export const ONBOARDING_NATIONALITY_OPTIONS = [
  { id: "South Africa", label: "South African" },
  { id: "american", label: "American" },
  { id: "british", label: "British" },
  { id: "canadian", label: "Canadian" },
  { id: "australian", label: "Australian" },
  { id: "other", label: "Other" },
] as const;

export const ONBOARDING_COUNTRY_OPTIONS = [
  { id: "South Africa", label: "South Africa" },
  { id: "united-states", label: "United States" },
  { id: "united-kingdom", label: "United Kingdom" },
  { id: "canada", label: "Canada" },
  { id: "australia", label: "Australia" },
  { id: "other", label: "Other" },
] as const;

export const ONBOARDING_RACE_OPTIONS = [
  { id: "Black African", label: "African" },
  { id: "Asian", label: "Asian" },
  { id: "Caucasian", label: "Caucasian" },
  { id: "Coloured", label: "Coloured" },
  { id: "Indian", label: "Indian" },
  { id: "Other", label: "Other" },
] as const;

export const ONBOARDING_COMMUNICATION_OPTIONS = [
  { id: "Whatsapp", label: "WhatsApp" },
  { id: "Email", label: "Email" },
] as const;
