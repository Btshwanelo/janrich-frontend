import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  customer_name: string;
  customer_type: string;
  title: string;
  first_name: string;
  last_name: string;
  last_nameemail: string;
  email: string;
  phone: string;
  country_code: string;
  new_password: string;
  agree_to_terms: number;
}

export interface LoginResponse {
  message: {
    success: boolean;
    user: string;
    sid: string;
  };
  home_page: string;
  full_name: string;
}

export interface RegisterResponse {
  message: {
    ok: boolean;
    customer: string;
    user: string;
    contact: string;
    address: string | null;
    message: string;
  };
}

export interface ProfileResponse {
  message: {
    result: string;
    message: string;
    data: {
      basic_info: {
        customer_id: string;
        customer_name: string;
        customer_type: string;
        customer_group: string;
        territory: string;
        email: string;
        phone: string;
        whatsapp_number: string;
        country_code: string;
        salutation: string;
        gender: string;
        agree_to_terms: number;
        constitution_version: string | null;
        agree_datetime: string | null;
      };
      about_you: {
        birth_date: string;
        age: string;
        profile_gender: string;
        nationality: string;
        country_of_residence: string;
        race: string;
        race_other: string;
        communication_preference: string;
      };
      financials: {
        employment_status: string;
        employee_status_other: string;
        deposit_frequency: string;
        deposit_frequency_other: string;
        customer_bank: string;
        bank_other: string;
        fund_source: string;
        fund_source_other: string;
        saving_for: string;
        saving_for_other: string;
        account_holder: string;
        branch_code: string;
        iban_account: string;
        annual_savings_goal: number;
        household_size: number;
        pay_day: number;
      };
      beneficiary: {
        beneficiary_type: string;
        beneficiary_name: string;
        beneficiary_surname: string;
        beneficiary_cell: string;
        beneficiary_relation: string;
      };
      addresses: any[];
    };
  };
}

export interface AuthState {
  user: string | null;
  sid: string | null;
  fullName: string | null;
  homePage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Registration data
  customer: string | null;
  contact: string | null;
  address: string | null;
  registrationMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  sid: null,
  fullName: null,
  homePage: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  // Registration data
  customer: null,
  contact: null,
  address: null,
  registrationMessage: null,
};

// Auth API slice
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "janriches.api.auth.jan_user_login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "janriches.api.portal_customer.customer_step1_create",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    getProfile: builder.query<ProfileResponse, string>({
      query: (customerId) => ({
        url: `jan.customer?customer_id=${customerId}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation ,useGetProfileQuery} = authApiSlice;

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: string;
        sid: string;
        fullName: string;
        homePage: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.sid = action.payload.sid;
      state.fullName = action.payload.fullName;
      state.homePage = action.payload.homePage;
      state.isAuthenticated = true;
      state.error = null;
      // Set auth cookie for additional security
      setAuthCookie(true);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.sid = null;
      state.fullName = null;
      state.homePage = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear registration data
      state.customer = null;
      state.contact = null;
      state.address = null;
      state.registrationMessage = null;
      // Clear persisted data
      clearAuthCookie();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRegistrationData: (
      state,
      action: PayloadAction<{
        customer: string;
        user: string;
        contact: string;
        address: string | null;
        message: string;
      }>
    ) => {
      state.customer = action.payload.customer;
      state.user = action.payload.user;
      state.contact = action.payload.contact;
      state.address = action.payload.address;
      state.registrationMessage = action.payload.message;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  setRegistrationData,
} = authSlice.actions;

// Helper functions for cookie management
export const setAuthCookie = (isAuthenticated: boolean) => {
  if (typeof window !== "undefined") {
    document.cookie = `auth-token=${isAuthenticated}; path=/; max-age=${
      isAuthenticated ? 86400 : 0
    }`;
  }
};

export const clearAuthCookie = () => {
  if (typeof window !== "undefined") {
    document.cookie = "auth-token=false; path=/; max-age=0";
  }
};
export default authSlice.reducer;
