import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import {
  useRegisterMutation,
  setLoading,
  setRegistrationData,
  useSendWhatsappOTPMutation,
  useLoginMutation,
  setCredentials,
} from "@/lib/slices/authSlice";
import { addPageError, clearAllPageErrors } from "@/lib/slices/errorSlice";
import { extractErrorMessage } from "@/utils/errorHelpers";
import { DEFAULT_COUNTRY_CODE } from "@/constants/registration";
import { resetOnboardingFlow } from "@/lib/slices/onboardingSlice";

export interface RegistrationFormValues {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  whatsappSame: boolean;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  rememberMe: boolean;
}

export const useRegistration = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  const buildRegistrationPayload = useCallback(
    (values: RegistrationFormValues) => {
      return {
        customer_name: `${values.name} ${values.surname}`,
        customer_type: "Individual",
        first_name: values.name,
        last_name: values.surname,
        last_nameemail: values.surname,
        email: values.email,
        phone: values.phoneNumber,
        whatsapp_number: values.whatsappSame
          ? values.phoneNumber
          : values.whatsappNumber,
        country_code: DEFAULT_COUNTRY_CODE, // TODO: Make dynamic based on user selection
        new_password: values.password,
        agree_to_terms: values.agreeTerms ? 1 : 0,
      };
    },
    []
  );

  const handleLoginUser = useCallback(
    async (email: string, password: string) => {
      try {
        const loginCredentials = {
          email: email,
          password: password,
        };

        dispatch(clearAllPageErrors());
        dispatch(resetOnboardingFlow());

        console.log("Attempting login with:", loginCredentials);

        // Log in user
        const result = await login(loginCredentials).unwrap();

        // Dispatch credentials to Redux store
        dispatch(
          setCredentials({
            user: result.message.user,
            sid: result.message.sid,
            fullName: result.full_name,
            homePage: result.home_page,
            customer: result.message.customer.name,
          })
        );

        // Use window.location for more reliable redirect after state update
        // This ensures the redirect happens before PublicRouteGuard can interfere
        // Small delay to ensure Redux state and cookie are updated
        setTimeout(() => {
          window.location.href = "/verification";
        }, 100);
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          "Something went wrong when logging you in."
        );
        dispatch(addPageError({ message: errorMessage }));
      }
    },
    [dispatch, login, router]
  );

  const handleSubmit = useCallback(
    async (values: RegistrationFormValues) => {
      try {
        dispatch(clearAllPageErrors());
        setIsSubmitting(true);

        const registrationPayload = buildRegistrationPayload(values);
        const result = await register(registrationPayload).unwrap();

        dispatch(
          setRegistrationData({
            customer: result.message.customer,
            user: registrationPayload.email,
            contact: registrationPayload.whatsapp_number,
            address: result.message.address,
            message: result.message.message,
          })
        );

        // Log in user immediately after successful registration
        await handleLoginUser(values.email, values.password);
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          "Registration failed. Please try again."
        );
        dispatch(addPageError({ message: errorMessage }));
      } finally {
        dispatch(setLoading(false));
        setIsSubmitting(false);
      }
    },
    [dispatch, register, buildRegistrationPayload, handleLoginUser]
  );

  return {
    handleSubmit,
    isLoading: isSubmitting || isRegisterLoading || isLoginLoading,
  };
};
