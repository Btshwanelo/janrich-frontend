import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { useVerifyRegistrationOTPMutation } from "@/lib/slices/authSlice";
import { addPageError, clearAllPageErrors } from "@/lib/slices/errorSlice";
import { useErrorToast } from "@/components/base/toast";
import { extractErrorMessage } from "@/utils/errorHelpers";

export interface NewPasswordFormValues {
  otp: string;
  password: string;
  confirmPassword: string;
}

export const useNewPassword = (email: string) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [verifyOTP, { isLoading: isVerifying }] =
    useVerifyRegistrationOTPMutation();
  const showErrorToast = useErrorToast();
  const [otp, setOtp] = useState("");

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (values: NewPasswordFormValues) => {
      try {
        dispatch(clearAllPageErrors());

        await verifyOTP({
          email: email,
          otp_input: otp || values.otp,
          password: values.password,
        }).unwrap();

        router.push("/new-password-success");
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          "Failed to reset password. Please try again."
        );

        dispatch(addPageError({ message: errorMessage }));
      }
    },
    [dispatch, verifyOTP, email, otp, router, showErrorToast]
  );

  return {
    handleSubmit,
    isLoading: isVerifying,
    otp,
    setOtp,
  };
};

