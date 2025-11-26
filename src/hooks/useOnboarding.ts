import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useCompleteOnboardingMutation } from "@/lib/slices/onboardingSlice";
import {
  useSendRegistrationOTPMutation,
  useSendWhatsappOTPMutation,
} from "@/lib/slices/authSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { formatDateDDMMYYYY } from "@/lib/utils";
import { extractErrorMessage } from "@/utils/errorHelpers";

export interface OnboardingFormValues {
  whatToCallYou: string;
  birthdate: any;
  gender: string;
  nationality: string;
  countryOfResidence: string;
  race: string;
  communicationPreference: string;
}

export const useOnboarding = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, customer, contact } = useSelector(
    (state: RootState) => state.auth
  );

  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendWhatsappOTPMutation();

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const handleSubmit = useCallback(
    async (values: OnboardingFormValues) => {
      if (!customer) {
        return;
      }

      try {
        const onboardingData = {
          customer_id: customer,
          title: values.whatToCallYou,
          birth_date: values.birthdate
            ? formatDateDDMMYYYY(values.birthdate)
            : "",
          gender: values.gender,
          nationality: values.nationality,
          country_of_residence: values.countryOfResidence,
          race: values.race,
          communication_preference: values.communicationPreference,
        };

        await completeOnboarding(onboardingData).unwrap();

        showSuccessToast(
          "Profile Updated!",
          "Your profile has been saved successfully. Now let's verify your email.",
          {
            duration: 4000,
          }
        );

        const email = user;
        setUserEmail(email);

        // Send OTP for email verification
        try {
          await sendOTP({
            whatsapp: contact,
            username: user,
          }).unwrap();
          setShowOTPModal(true);
        } catch (otpError: unknown) {
          const errorMessage = extractErrorMessage(
            otpError,
            "Unable to send verification email. Please try again."
          );
          showErrorToast("OTP Send Failed", errorMessage, {
            duration: 4000,
          });
        }
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          "Unable to save your profile. Please try again."
        );
        showErrorToast("Update Failed", errorMessage, {
          duration: 4000,
        });
      }
    },
    [
      customer,
      user,
      completeOnboarding,
      sendOTP,
      showSuccessToast,
      showErrorToast,
    ]
  );

  const handleOTPSuccess = useCallback(() => {
    setShowOTPModal(false);
    showSuccessToast(
      "Email Verified!",
      "Your email has been verified successfully. You can now proceed to payment.",
      {
        duration: 5000,
      }
    );
    router.push("/payment");
  }, [router, showSuccessToast]);

  return {
    handleSubmit,
    handleOTPSuccess,
    showOTPModal,
    setShowOTPModal,
    userEmail,
    userContact: contact,
    isLoading: isLoading || isSendingOTP,
  };
};

