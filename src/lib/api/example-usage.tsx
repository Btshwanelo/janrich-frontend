// Example usage of the Redux Toolkit API slices
// This file shows how to use the hooks in your components

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useLoginMutation, useRegisterMutation } from "@/lib/slices/authSlice";
import { useCompleteOnboardingMutation } from "@/lib/slices/onboardingSlice";
import { setCredentials, clearCredentials } from "@/lib/slices/authSlice";
import { setOnboardingData } from "@/lib/slices/onboardingSlice";

// Example component showing how to use the auth hooks
export function ExampleAuthComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();

      // Dispatch the credentials to the auth slice
      dispatch(
        setCredentials({
          user: result.message.user,
          sid: result.message.sid,
          fullName: result.full_name,
          homePage: result.home_page,
        })
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const result = await register(userData).unwrap();
      console.log("Registration successful:", result);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => handleLogin("mike@xyz.com", "Tshw@nelo")}
            disabled={isLoginLoading}
          >
            {isLoginLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      )}
    </div>
  );
}

// Example component showing how to use the onboarding hooks
export function ExampleOnboardingComponent() {
  const dispatch = useAppDispatch();
  const { customerId, isCompleted } = useAppSelector(
    (state) => state.onboarding
  );

  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();

  const handleCompleteOnboarding = async (onboardingData: any) => {
    try {
      const result = await completeOnboarding(onboardingData).unwrap();

      // Dispatch the onboarding data to the slice
      dispatch(
        setOnboardingData({
          customerId: result.message.customer_id,
          customer: result.message.customer,
          age: result.message.age,
        })
      );
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  return (
    <div>
      {isCompleted ? (
        <p>Onboarding completed for customer: {customerId}</p>
      ) : (
        <button
          onClick={() =>
            handleCompleteOnboarding({
              customer_id: "JR0002",
              title: "Mr",
              birth_date: "05/09/1990",
              gender: "Other",
              nationality: "Pakistan",
              country_of_residence: "South Africa",
              race: "Other",
              race_other: "Mixed",
              communication_preference: "Whatsapp",
            })
          }
          disabled={isLoading}
        >
          {isLoading ? "Completing..." : "Complete Onboarding"}
        </button>
      )}
    </div>
  );
}
