import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface ToastError {
  message: string;
  id: string;
  type?: "error" | "warning" | "info";
}

export interface PageError {
  message: string;
  id: string;
  code?: string;
  details?: any;
}

export interface ErrorState {
  // Toast errors - array of temporary notifications
  toastErrors: ToastError[];
  // Page errors - array of persistent errors
  pageErrors: PageError[];
}

const initialState: ErrorState = {
  toastErrors: [],
  pageErrors: [],
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    // Toast error actions
    addToastError: (
      state,
      action: PayloadAction<{
        message: string;
        id?: string;
        type?: "error" | "warning" | "info";
      }>
    ) => {
      const error: ToastError = {
        message: action.payload.message,
        id:
          action.payload.id ||
          Date.now().toString() + Math.random().toString(),
        type: action.payload.type || "error",
      };
      state.toastErrors.push(error);
    },
    removeToastError: (state, action: PayloadAction<string>) => {
      state.toastErrors = state.toastErrors.filter(
        (error) => error.id !== action.payload
      );
    },
    clearAllToastErrors: (state) => {
      state.toastErrors = [];
    },

    // Page error actions
    addPageError: (
      state,
      action: PayloadAction<{
        message: string;
        id?: string;
        code?: string;
        details?: any;
      }>
    ) => {
      const error: PageError = {
        message: action.payload.message,
        id:
          action.payload.id ||
          Date.now().toString() + Math.random().toString(),
        code: action.payload.code,
        details: action.payload.details,
      };
      state.pageErrors.push(error);
    },
    removePageError: (state, action: PayloadAction<string>) => {
      state.pageErrors = state.pageErrors.filter(
        (error) => error.id !== action.payload
      );
    },
    clearAllPageErrors: (state) => {
      state.pageErrors = [];
    },

    // Clear all errors
    clearAllErrors: (state) => {
      state.toastErrors = [];
      state.pageErrors = [];
    },
  },
});

export const {
  addToastError,
  removeToastError,
  clearAllToastErrors,
  addPageError,
  removePageError,
  clearAllPageErrors,
  clearAllErrors,
} = errorSlice.actions;

export default errorSlice.reducer;

