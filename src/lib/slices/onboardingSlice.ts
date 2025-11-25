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
  savingsGoalCreated: boolean;
  welcomeShown: boolean;
  depositModalShown: boolean; // Track if deposit modal has been shown
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
  isOnboardingComplete: false, // Default to false - user needs to complete onboarding
  savingsGoalCreated: false,
  welcomeShown: false,
  depositModalShown: false,
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
    markDepositModalShown: (state) => {
      state.flow.depositModalShown = true;
    },
    completeOnboarding: (state) => {
      // Explicitly mark onboarding as complete
      state.flow.isOnboardingComplete = true;
    },
    resetOnboardingFlow: (state) => {
      state.flow = initialFlowState;
    },
    fixInconsistentState: (state) => {
      // Fix inconsistent state where isOnboardingComplete is true but flow steps are incomplete
      const isFlowActuallyComplete = 
        state.flow.savingsGoalCreated &&
        state.flow.welcomeShown &&
        state.flow.profileCompleted.details &&
        state.flow.profileCompleted.beneficiary &&
        state.flow.profileCompleted.financial &&
        state.flow.depositModalShown;
      
      // If flag says complete but flow isn't, fix it
      if (state.flow.isOnboardingComplete && !isFlowActuallyComplete) {
        state.flow.isOnboardingComplete = false;
      }
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
  startOnboarding,
  markSavingsGoalCreated,
  markWelcomeShown,
  markDepositModalShown,
  markProfileTabCompleted,
  completeOnboarding,
  resetOnboardingFlow,
  fixInconsistentState,
  updateOnboardingFlow,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Selectors with defensive checks
export const selectOnboardingFlow = (state: RootState) =>
  state.onboarding?.flow || initialFlowState;
export const selectIsOnboardingComplete = (state: RootState) => {
  const flow = state.onboarding?.flow;
  if (!flow) return false;
  
  // Check if state is consistent - if flag says complete, verify all steps are actually complete
  if (flow.isOnboardingComplete) {
    const isActuallyComplete = 
      flow.savingsGoalCreated &&
      flow.welcomeShown &&
      flow.profileCompleted.details &&
      flow.profileCompleted.beneficiary &&
      flow.profileCompleted.financial &&
      flow.depositModalShown;
    
    // If flag says complete but steps aren't, fix the inconsistency
    if (!isActuallyComplete) {
      return false;
    }
  }
  
  return flow.isOnboardingComplete ?? false;
};
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
