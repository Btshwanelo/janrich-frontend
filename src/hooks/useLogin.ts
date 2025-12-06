import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  useLoginMutation,
  setCredentials,
  setLoading,
  setAuthCookie,
} from "@/lib/slices/authSlice";
import { addPageError, clearAllPageErrors } from "@/lib/slices/errorSlice";
import { extractErrorMessage } from "@/utils/errorHelpers";
import {
  resetOnboardingFlow,
  startOnboarding,
} from "@/lib/slices/onboardingSlice";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isVerificationComplete: currentVerificationStatus } =
    useAppSelector((state) => state.auth);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAllPageErrors());
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearAllPageErrors());
        dispatch(resetOnboardingFlow());

        const result = await login({
          email: values.email,
          password: values.password,
        }).unwrap();

        // Dispatch credentials to Redux store
        // For regular logins, preserve existing verification status from persisted state
        // If no persisted state, default to true (existing users are typically verified)
        // For new registrations, this will be explicitly set to false in useRegistration
        const isVerified = true;
        dispatch(
          setCredentials({
            user: result.message.user,
            sid: result.message.sid,
            fullName: result.full_name,
            homePage: result.home_page,
            customer: result.message.customer.name,
            isVerificationComplete: isVerified,
          })
        );
        // Reset onboarding flow and set isOnboardingComplete to false for new logins
        dispatch(resetOnboardingFlow());
        // Set authentication cookie
        setAuthCookie(true);

        // Redirect based on verification status
        // If not verified, redirect to verification page, otherwise to dashboard
        const redirectPath = isVerified ? "/dashboard" : "/verification";
        window.location.href = redirectPath;
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          "Login failed. Please try again."
        );
        dispatch(addPageError({ message: errorMessage }));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, login]
  );

  return {
    handleSubmit,
    isLoading: isLoading || isLoginLoading,
  };
};
