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

  const [
    sendRegisterOTP,
    { isLoading: isRegisterOtpLoading, isSuccess, isError, error },
  ] = useSendWhatsappOTPMutation();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({});

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  // Show OTP modal when OTP is sent successfully
  useEffect(() => {
    if (isSuccess) {
      setShowOTPModal(true);
    }
  }, [isSuccess]);

  const buildRegistrationPayload = useCallback(
    (values: RegistrationFormValues) => {
      setLoginData({
        email: values.email,
        password: values.password,
      });
      console.log("loginData", {
        email: values.email,
        password: values.password,
      });
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

  useEffect(() => {
    if (isError) {
      const errorMessage = extractErrorMessage(
        error,
        "Registration failed. Please try again."
      );
      dispatch(addPageError({ message: errorMessage }));
    }
  }, [isError]);

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

        const whatsappNumber = values.whatsappSame
          ? values.phoneNumber
          : values.whatsappNumber;

        sendRegisterOTP({
          whatsapp: whatsappNumber,
          username: values.email,
        });
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
    [dispatch, register, sendRegisterOTP, buildRegistrationPayload]
  );

  const handleOTPSuccess = useCallback(async () => {
    try {
      console.log("loginData 1", loginData);
      //log in user
      const result = await login(loginData).unwrap();

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

      //
      setShowOTPModal(false);
      router.push("/onboarding");
    } catch (error: unknown) {
      setShowOTPModal(false);
      const errorMessage = extractErrorMessage(
        error,
        "Something went wrong when logging you in."
      );
      dispatch(addPageError({ message: errorMessage }));
    }
  }, [router]);

  return {
    handleSubmit,
    handleOTPSuccess,
    showOTPModal,
    setShowOTPModal,
    isLoading: isSubmitting || isRegisterLoading || isLoginLoading,
    isSendingOTP: isRegisterOtpLoading,
  };
};
