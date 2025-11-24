import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import {
  useSendRegistrationOTPMutation,
  useSendWhatsappOTPMutation,
} from "@/lib/slices/authSlice";
import { addPageError, clearAllPageErrors } from "@/lib/slices/errorSlice";
import { useSuccessToast, useErrorToast } from "@/components/base/toast";
import { extractErrorMessage } from "@/utils/errorHelpers";

export interface ForgotPasswordFormValues {
  whatsapp: string;
  username: string;
}

export const useForgotPassword = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendWhatsappOTPMutation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (values: ForgotPasswordFormValues) => {
      try {
        dispatch(clearAllPageErrors());

        await sendOTP({
          whatsapp: values.whatsapp,
          username: values.username,
        }).unwrap();

        showSuccessToast("OTP sent successfully. Please check your WhatsApp.");
        router.push(
          `/forgot-password/new/${encodeURIComponent(values.username)}`
        );
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          "Failed to send OTP. Please try again."
        );

        showErrorToast(errorMessage);
        dispatch(addPageError({ message: errorMessage }));
      }
    },
    [dispatch, sendOTP, router, showSuccessToast, showErrorToast]
  );

  return {
    handleSubmit,
    isLoading: isSendingOTP,
  };
};
