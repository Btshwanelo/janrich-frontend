import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

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

export interface OnboardingState {
  customerId: string | null;
  customer: string | null;
  age: number | null;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OnboardingState = {
  customerId: null,
  customer: null,
  age: null,
  isCompleted: false,
  isLoading: false,
  error: null,
};

// Onboarding API slice
export const onboardingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    completeOnboarding: builder.mutation<OnboardingResponse, OnboardingRequest>({
      query: (onboardingData) => ({
        url: 'janriches.api.portal_customer.customer_step2_profile',
        method: 'POST',
        body: onboardingData,
      }),
      invalidatesTags: ['Onboarding'],
    }),
  }),
});

export const { useCompleteOnboardingMutation } = onboardingApiSlice;

// Onboarding slice
const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingData: (state, action: PayloadAction<{
      customerId: string;
      customer: string;
      age: number;
    }>) => {
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
  },
});

export const { 
  setOnboardingData, 
  clearOnboardingData, 
  setLoading, 
  setError 
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
