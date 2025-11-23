import * as Yup from "yup";

// Login form validation schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

// Forgot password form validation schema
export const forgotPasswordSchema = Yup.object({
  whatsapp: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number (e.g., +923332184595)"
    )
    .required("Phone number is required"),
  username: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

// New password (reset password) form validation schema
export const newPasswordSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

// Onboarding form validation schema
export const onboardingSchema = Yup.object({
  whatToCallYou: Yup.string().required("Please select a title"),
  birthdate: Yup.date().required("Please select your birthdate"),
  gender: Yup.string().required("Please select your gender"),
  nationality: Yup.string().required("Please select your nationality"),
  countryOfResidence: Yup.string().required(
    "Please select your country of residence"
  ),
  race: Yup.string().required("Please select your race"),
  communicationPreference: Yup.string().required(
    "Please select a communication preference"
  ),
});

// Registration form validation schema
export const registrationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  surname: Yup.string()
    .min(2, "Surname must be at least 2 characters")
    .required("Surname is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(10, "Please enter a valid phone number"),
  whatsappNumber: Yup.string().when("whatsappSame", {
    is: false,
    then: (schema) =>
      schema
        .required("WhatsApp number is required when not using same as phone")
        .min(10, "Please enter a valid WhatsApp number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Please confirm your password"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

