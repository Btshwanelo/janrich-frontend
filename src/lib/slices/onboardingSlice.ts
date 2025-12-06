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
  isOnboardingComplete: boolean; // Main flag to check if onboarding is done
  welcomeShown: boolean;
  goalCompleted: boolean;
  financialCompleted: boolean;
  beneficiaryCompleted: boolean;
}

export interface OnboardingState {
  customerId: string | null;
  customer: string | null;
  age: number | null;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  savingGoal: number | null;
  // Onboarding flow state
  flow: OnboardingFlowState;
}

const initialFlowState: OnboardingFlowState = {
  isOnboardingComplete: true, // Default to true - user has completed onboarding
  welcomeShown: false,
  goalCompleted: false,
  financialCompleted: false,
  beneficiaryCompleted: false,
};

const initialState: OnboardingState = {
  customerId: null,
  customer: null,
  age: null,
  isCompleted: false,
  isLoading: false,
  error: null,
  flow: initialFlowState,
  savingGoal: null,
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
      state.savingGoal = null;
      state.error = null;
      state.flow = initialFlowState;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Onboarding flow actions
    startOnboarding: (state) => {
      // Set onboarding as incomplete when user starts the flow
      state.flow.isOnboardingComplete = false;
    },
    markWelcomeShown: (state) => {
      state.flow.welcomeShown = true;
    },
    markGoalCompleted: (state) => {
      state.flow.goalCompleted = true;
    },
    markFinancialCompleted: (state) => {
      state.flow.financialCompleted = true;
    },
    markBeneficiaryCompleted: (state) => {
      state.flow.beneficiaryCompleted = true;
      // Mark onboarding as complete when all steps are done
      if (
        state.flow.welcomeShown &&
        state.flow.goalCompleted &&
        state.flow.financialCompleted &&
        state.flow.beneficiaryCompleted
      ) {
        state.flow.isOnboardingComplete = true;
      }
    },
    completeOnboarding: (state) => {
      // Explicitly mark onboarding as complete
      state.flow.isOnboardingComplete = true;
    },
    resetOnboardingFlow: (state) => {
      state.flow = initialFlowState;
    },
    setOnboardingGoal: (state, action) => {
      state.savingGoal = action.payload.goal;
    },
    updateOnboardingFlow: (
      state,
      action: PayloadAction<Partial<OnboardingFlowState>>
    ) => {
      state.flow = {
        ...state.flow,
        ...action.payload,
      };
    },
  },
});

export const {
  setOnboardingData,
  clearOnboardingData,
  setLoading,
  setError,
  startOnboarding,
  markWelcomeShown,
  markGoalCompleted,
  markFinancialCompleted,
  markBeneficiaryCompleted,
  completeOnboarding,
  resetOnboardingFlow,
  updateOnboardingFlow,
  setOnboardingGoal,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Selectors with defensive checks
export const selectOnboardingFlow = (state: RootState) =>
  state.onboarding?.flow || initialFlowState;
export const selectIsOnboardingComplete = (state: RootState) =>
  state.onboarding?.flow?.isOnboardingComplete ?? true; // Default to true
export const selectWelcomeShown = (state: RootState) =>
  state.onboarding?.flow?.welcomeShown || false;
export const selectGoalCompleted = (state: RootState) =>
  state.onboarding?.flow?.goalCompleted || false;
export const selectFinancialCompleted = (state: RootState) =>
  state.onboarding?.flow?.financialCompleted || false;
export const selectBeneficiaryCompleted = (state: RootState) =>
  state.onboarding?.flow?.beneficiaryCompleted || false;
