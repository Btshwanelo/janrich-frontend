import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  useLoginMutation,
  setCredentials,
  setLoading,
  setAuthCookie,
} from "@/lib/slices/authSlice";
import { addPageError, clearAllPageErrors } from "@/lib/slices/errorSlice";
import { extractErrorMessage } from "@/utils/errorHelpers";
import { resetOnboardingFlow } from "@/lib/slices/onboardingSlice";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);
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

        const result = await login({
          email: values.email,
          password: values.password,
        }).unwrap();

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

        // Don't reset onboarding flow on login - let it persist
        // The profile page will sync completion state based on actual data
        // Only reset if this is truly a first-time user (we'll check savings goal in dashboard)

        // Set authentication cookie
        setAuthCookie(true);

        // Redirect to dashboard
        router.push("/dashboard");
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
    [dispatch, login, router]
  );

  return {
    handleSubmit,
    isLoading: isLoading || isLoginLoading,
  };
};
