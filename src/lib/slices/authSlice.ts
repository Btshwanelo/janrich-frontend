import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

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

export interface AuthState {
  user: string | null;
  sid: string | null;
  fullName: string | null;
  homePage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  sid: null,
  fullName: null,
  homePage: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth API slice
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'janriches.api.auth.jan_user_login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'janriches.api.portal_customer.customer_step1_create',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      user: string;
      sid: string;
      fullName: string;
      homePage: string;
    }>) => {
      state.user = action.payload.user;
      state.sid = action.payload.sid;
      state.fullName = action.payload.fullName;
      state.homePage = action.payload.homePage;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.sid = null;
      state.fullName = null;
      state.homePage = null;
      state.isAuthenticated = false;
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

export const { setCredentials, clearCredentials, setLoading, setError } = authSlice.actions;

// Helper functions for cookie management
export const setAuthCookie = (isAuthenticated: boolean) => {
  if (typeof window !== 'undefined') {
    document.cookie = `auth-token=${isAuthenticated}; path=/; max-age=${isAuthenticated ? 86400 : 0}`;
  }
};

export const clearAuthCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth-token=false; path=/; max-age=0';
  }
};
export default authSlice.reducer;
