import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types (re-exported from authSlice for convenience)
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

export interface LedgerState {
  transactions: LedgerEntry[];
  currentTransaction: LedgerEntry | null;
  isLoading: boolean;
  error: string | null;
  totalRecords: number | null;
  customerId: string | null;
}

const initialState: LedgerState = {
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
  totalRecords: null,
  customerId: null,
};

// Ledger slice
const ledgerSlice = createSlice({
  name: "ledger",
  initialState,
  reducers: {
    setTransactions: (
      state,
      action: PayloadAction<{
        transactions: LedgerEntry[];
        totalRecords: number;
        customerId: string;
      }>
    ) => {
      state.transactions = action.payload.transactions;
      state.totalRecords = action.payload.totalRecords;
      state.customerId = action.payload.customerId;
      state.error = null;
    },
    setCurrentTransaction: (
      state,
      action: PayloadAction<LedgerEntry | null>
    ) => {
      state.currentTransaction = action.payload;
    },
    addTransaction: (state, action: PayloadAction<LedgerEntry>) => {
      state.transactions.unshift(action.payload);
      state.totalRecords = (state.totalRecords || 0) + 1;
    },
    updateTransaction: (
      state,
      action: PayloadAction<{
        transactionRef: string;
        updates: Partial<LedgerEntry>;
      }>
    ) => {
      const index = state.transactions.findIndex(
        (t) => t.transaction_ref === action.payload.transactionRef
      );
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload.updates,
        };
        // Update current transaction if it's the one being updated
        if (
          state.currentTransaction?.transaction_ref ===
          action.payload.transactionRef
        ) {
          state.currentTransaction = {
            ...state.currentTransaction,
            ...action.payload.updates,
          };
        }
      }
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.transaction_ref !== action.payload
      );
      state.totalRecords = (state.totalRecords || 1) - 1;
      // Clear current transaction if it's the one being removed
      if (state.currentTransaction?.transaction_ref === action.payload) {
        state.currentTransaction = null;
      }
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.currentTransaction = null;
      state.totalRecords = null;
      state.customerId = null;
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
  setTransactions,
  setCurrentTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
  clearTransactions,
  setLoading,
  setError,
} = ledgerSlice.actions;

export default ledgerSlice.reducer;

