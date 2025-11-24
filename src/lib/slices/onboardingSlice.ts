import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import type { RootState } from "../store";

// Types
export interface OnboardingRequest {
  customer_id: string;
  title: string;
  birth_date: string;
  gender: string;
  nationality: string;
  country_of_residence: string;
  race: string;
  race_other?: string;
  communication_preference: string;
}

export interface OnboardingResponse {
  message: {
    ok: boolean;
    customer_id: string;
    customer: string;
    message: string;
    age: number;
  };
}

export interface OnboardingFlowState {
  savingsGoalCreated: boolean;
  welcomeShown: boolean;
  profileCompleted: {
    details: boolean;
    beneficiary: boolean;
    financial: boolean;
  };
}

export interface OnboardingState {
  customerId: string | null;
  customer: string | null;
  age: number | null;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  // Onboarding flow state
  flow: OnboardingFlowState;
}

const initialFlowState: OnboardingFlowState = {
  savingsGoalCreated: false,
  welcomeShown: false,
  profileCompleted: {
    details: false,
    beneficiary: false,
    financial: false,
  },
};

const initialState: OnboardingState = {
  customerId: null,
  customer: null,
  age: null,
  isCompleted: false,
  isLoading: false,
  error: null,
  flow: initialFlowState,
};

// Onboarding API slice
// Note: This API endpoint is for completing onboarding profile data (step 2)
// The onboarding flow state (savings goal, welcome, profile tabs) is managed in Redux below
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onboardingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // @ts-ignore - RTK Query type inference limitation with union types in invalidatesTags
    completeOnboarding: builder.mutation<OnboardingResponse, OnboardingRequest>(
      {
        query: (onboardingData) => ({
          url: "janriches.api.portal_customer.customer_step2_profile",
          method: "POST",
          body: onboardingData,
        }),
        invalidatesTags: ["Onboarding"],
      }
    ),
  }),
}) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { useCompleteOnboardingMutation } = onboardingApiSlice;

// Onboarding slice
const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setOnboardingData: (
      state,
      action: PayloadAction<{
        customerId: string;
        customer: string;
        age: number;
      }>
    ) => {
      state.customerId = action.payload.customerId;
      state.customer = action.payload.customer;
      state.age = action.payload.age;
      state.isCompleted = true;
      state.error = null;
    },
    clearOnboardingData: (state) => {
      state.customerId = null;
      state.customer = null;
      state.age = null;
      state.isCompleted = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Onboarding flow actions
    markSavingsGoalCreated: (state) => {
      state.flow.savingsGoalCreated = true;
    },
    markWelcomeShown: (state) => {
      state.flow.welcomeShown = true;
    },
    markProfileTabCompleted: (
      state,
      action: PayloadAction<"details" | "beneficiary" | "financial">
    ) => {
      state.flow.profileCompleted[action.payload] = true;
    },
    resetOnboardingFlow: (state) => {
      state.flow = initialFlowState;
    },
    updateOnboardingFlow: (
      state,
      action: PayloadAction<Partial<OnboardingFlowState>>
    ) => {
      state.flow = {
        ...state.flow,
        ...action.payload,
        profileCompleted: {
          ...state.flow.profileCompleted,
          ...(action.payload.profileCompleted || {}),
        },
      };
    },
  },
});

export const {
  setOnboardingData,
  clearOnboardingData,
  setLoading,
  setError,
  markSavingsGoalCreated,
  markWelcomeShown,
  markProfileTabCompleted,
  resetOnboardingFlow,
  updateOnboardingFlow,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Selectors with defensive checks
export const selectOnboardingFlow = (state: RootState) =>
  state.onboarding?.flow || initialFlowState;
export const selectSavingsGoalCreated = (state: RootState) =>
  state.onboarding?.flow?.savingsGoalCreated || false;
export const selectWelcomeShown = (state: RootState) =>
  state.onboarding?.flow?.welcomeShown || false;
export const selectProfileCompleted = (state: RootState) =>
  state.onboarding?.flow?.profileCompleted || initialFlowState.profileCompleted;
export const selectIsProfileComplete = (state: RootState) => {
  const profileCompleted = state.onboarding?.flow?.profileCompleted;
  if (!profileCompleted) return false;
  const { details, beneficiary, financial } = profileCompleted;
  return details && beneficiary && financial;
};
export const selectIsOnboardingComplete = (state: RootState) => {
  const flow = state.onboarding?.flow;
  if (!flow) return false;
  return (
    flow.savingsGoalCreated &&
    flow.welcomeShown &&
    selectIsProfileComplete(state)
  );
};
