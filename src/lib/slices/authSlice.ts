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
  // title: string;
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
    customer: { name: string; customer_name: string };
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
export interface BalanceResponse {
  message: {
    result: string;
    message: string;
    total_balance: number;
  };
}

export interface FinancialDetailsRequest {
  customer_id: string;
  custom_employment_status: string;
  custom_employee_status_other?: string;
  custom_deposit_frequency: string;
  custom_deposit_frequency_other?: string;
  custom_customer_bank: string;
  custom_bank_other?: string;
  custom_fund_source: string;
  custom_fund_source_other?: string;
  custom_saving_for: string;
  custom_saving_for_other?: string;
  custom_account_holder: string;
  custom_branch_code: string;
  custom_iban_account: string;
  custom_annual_savings_goal: number;
  custom_household_size: number;
  custom_pay_day: number;
}

export interface FinancialDetailsResponse {
  message: {
    ok: boolean;
    customer_id: string;
    updated_fields: string[];
    message: string;
  };
}

export interface BeneficiaryRequest {
  customer_id: string;
  beneficiary_type: string;
  beneficiary_name: string;
  beneficiary_title: string;
  beneficiary_surname?: string;
  beneficiary_cell: string;
  beneficiary_relation: string;
}

export interface BeneficiaryResponse {
  message: {
    result: string;
    customer_id: string;
    message: string;
    beneficiary: {
      type: string;
      name: string;
      surname: string;
      cell: string;
      relation: string;
    };
  };
}

export interface CustomerUpdateRequest {
  customer_id: string;
  customer_name: string;
  first_name: string;
  last_name: string;
  territory: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  country_code: string;
  title: string;
  gender: string;
  agree_to_terms: number;
}

export interface CustomerUpdateResponse {
  message: {
    result: string;
    message: string;
  };
}

// Ledger interfaces
export interface LedgerRequest {
  customer_id: string;
}

export interface LedgerEntry {
  customer_id: string;
  customer_name: string;
  payment_date: string;
  amount: number;
  currency: string;
  gateway: string;
  status: string;
  payment_type: string;
  transaction_ref: string;
}

export interface LedgerResponse {
  message: {
    result: string;
    customer_id: string;
    total_records: number;
    data: LedgerEntry[];
  };
}

// Deposit interfaces
export interface DepositRequest {
  customer: string;
  amount: number;
  currency: string;
  payment_type: string;
  payment_date: string;
  gateway: string;
  status: string;
  transaction_ref: string;
}

export interface DepositResponse {
  message: {
    result: string;
    message: string;
    data: {
      customer: string;
      amount: number;
      currency: string;
      payment_type: string;
      payment_date: string;
      gateway: string;
      status: string;
      transaction_ref: string;
    };
  };
}
export interface RequestPayoutResponse {
  message: {
    result: string;
    message: string;
  };
}
export interface RequestPayoutRequest {
  customer: string;
  date: string;
  amount: number;
  remarks: string;
  bank: string;
  bank_code: string;
  bank_account: string;
  account_holder: string;
}

export interface ProfileUpdateRequest {
  customer_id: string;
  birth_date: string;
  gender: string;
  nationality: string;
  country_of_residence: string;
  race: string;
  race_other: string;
  communication_preference: string;
}

export interface ProfileUpdateResponse {
  message: {
    ok: boolean;
    customer_id: string;
    customer: string;
    message: string;
    age: number;
    result: string;
  };
}

// Email verification interfaces
export interface SendOTPRequest {
  whatsapp: string;
  username: string;
}

export interface SendOTPResponse {
  message: {
    result?: "success" | "failed";
    message?: string;
    status?: string;
    otp_id?: string;
  };
}

export interface VerifyOTPRequest {
  email: string;
  otp_input: string;
  password?: string; // Optional for password reset
}

export interface VerifyOTPResponse {
  message: {
    result?: "success" | "failed";
    message?: string;
    status?: string;
    user?: string;
  };
}

// Savings goal interfaces
export interface SavingsGoalRequest {
  customer_id: string;
  annual_savings_goal: number;
}

export interface SavingsGoalResponse {
  message: {
    ok: boolean;
    customer_id: string;
    message: string;
    annual_savings_goal: number;
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
        url: "jan.login",
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
    getBalance: builder.query<BalanceResponse, string>({
      query: (customerId) => ({
        url: `jan.balance?customer_id=${customerId}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    updateFinancialDetails: builder.mutation<
      FinancialDetailsResponse,
      FinancialDetailsRequest
    >({
      query: (financialData) => ({
        url: "jan.payment",
        method: "POST",
        body: financialData,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateBeneficiary: builder.mutation<
      BeneficiaryResponse,
      BeneficiaryRequest
    >({
      query: (beneficiaryData) => ({
        url: "jan.beneficiary",
        method: "POST",
        body: beneficiaryData,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateCustomer: builder.mutation<
      CustomerUpdateResponse,
      CustomerUpdateRequest
    >({
      query: (customerData) => ({
        url: "jan.update.customer",
        method: "POST",
        body: customerData,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<
      ProfileUpdateResponse,
      ProfileUpdateRequest
    >({
      query: (profileData) => ({
        url: "jan.profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["Auth"],
    }),
    sendEmailOTP: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (otpData) => ({
        url: "janriches.api.otp.send_registration_otp",
        method: "POST",
        body: otpData,
      }),
    }),
    sendWhatsappOTP: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (otpData) => ({
        url: "jan.sendotp",
        method: "POST",
        body: otpData,
      }),
    }),
    sendForgotPasswordOTP: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (otpData) => ({
        url: "jan.sendotp",
        method: "POST",
        body: otpData,
      }),
    }),
    verifyRegistrationOTP: builder.mutation<
      VerifyOTPResponse,
      VerifyOTPRequest
    >({
      query: (verifyData) => ({
        url: "janriches.api.otp.verify_and_register",
        method: "POST",
        body: verifyData,
      }),
    }),
    updateSavingsGoal: builder.mutation<
      SavingsGoalResponse,
      SavingsGoalRequest
    >({
      query: (savingsData) => ({
        url: "jan.goal",
        method: "POST",
        body: savingsData,
      }),
      invalidatesTags: ["Auth"],
    }),
    getLedger: builder.query<LedgerResponse, string>({
      query: (customerId) => ({
        url: `jan.ledger?customer_id=${customerId}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    addDeposit: builder.mutation<DepositResponse, DepositRequest>({
      query: (depositData) => ({
        url: "jan.deposit",
        method: "POST",
        body: depositData,
      }),
      invalidatesTags: ["Auth"],
    }),
    requestPayout: builder.mutation<
      RequestPayoutResponse,
      RequestPayoutRequest
    >({
      query: (depositData) => ({
        url: "jan.payout",
        method: "POST",
        body: depositData,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetBalanceQuery,
  useUpdateFinancialDetailsMutation,
  useUpdateBeneficiaryMutation,
  useUpdateCustomerMutation,
  useUpdateProfileMutation,
  useSendEmailOTPMutation,
  useVerifyRegistrationOTPMutation,
  useUpdateSavingsGoalMutation,
  useGetLedgerQuery,
  useAddDepositMutation,
  useRequestPayoutMutation,
  useSendWhatsappOTPMutation,
} = authApiSlice;

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
        customer: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.sid = action.payload.sid;
      state.fullName = action.payload.fullName;
      state.homePage = action.payload.homePage;
      state.customer = action.payload.customer;
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
    setContactData: (
      state,
      action: PayloadAction<{
        contact: string;
      }>
    ) => {
      state.contact = action.payload.contact;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setContactData,
  clearCredentials,
  setLoading,
  setError,
  setRegistrationData,
} = authSlice.actions;

// Helper functions for cookie management
// Sync localStorage persist:root to cookie for middleware access
export const syncAuthFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const persistedState = localStorage.getItem("persist:root");
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        if (parsed.auth) {
          const authState = JSON.parse(parsed.auth);
          const isAuthenticated = authState?.isAuthenticated === true;
          setAuthCookie(isAuthenticated);
          return isAuthenticated;
        }
      }
    } catch (error) {
      console.error("Error syncing auth from localStorage:", error);
    }
    // If no persisted state or error, set to false
    setAuthCookie(false);
    return false;
  }
  return false;
};

export const setAuthCookie = (isAuthenticated: boolean) => {
  if (typeof window !== "undefined") {
    document.cookie = `auth-token=${isAuthenticated}; path=/; max-age=${
      isAuthenticated ? 86400 : 0
    }; SameSite=Lax`;
  }
};

export const clearAuthCookie = () => {
  if (typeof window !== "undefined") {
    document.cookie = "auth-token=false; path=/; max-age=0; SameSite=Lax";
  }
};
export default authSlice.reducer;
