"use client";
import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useGetProfileQuery, useGetLedgerQuery } from "@/lib/slices/authSlice";
import {
  setTransactions,
  setCurrentTransaction,
} from "@/lib/slices/ledgerSlice";
import SavingsGoalModal from "@/components/SavingsGoalModal";
import SidebarWrapper from "@/components/SidebarWrapper";
import MobileTopNav from "@/components/MobileTopNav";
import {
  DashboardHeader,
  SavingsBreakdownChart,
  SavingsGoalCard,
  TransactionsTable,
  LoadingState,
  ErrorState,
} from "@/components/dashboard";
import { useSavingsCalculation } from "@/hooks/useSavingsCalculation";
import { usePagination } from "@/hooks/usePagination";
import { useSavingsModal } from "@/hooks/useSavingsModal";
import { Transaction } from "@/types/dashboard";
import { DASHBOARD_CONSTANTS } from "@/constants/dashboard";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  const { user, fullName, customer } = useAppSelector((state) => state.auth);
  const {
    data,
    refetch,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(customer);
  const {
    data: dataLedger,
    isLoading: isLedgerLoading,
    error: ledgerError,
  } = useGetLedgerQuery(customer);

  // Store transactions in ledger slice on successful API response
  useEffect(() => {
    if (dataLedger?.message?.result === "success" && dataLedger.message.data) {
      dispatch(
        setTransactions({
          transactions: dataLedger.message.data,
          totalRecords: dataLedger.message.total_records,
          customerId: dataLedger.message.customer_id,
        })
      );
    }
  }, [dataLedger, dispatch]);

  console.log("dataLedger", dataLedger);

  const savingsGoal = data?.message?.data?.financials?.annual_savings_goal || 0;
  const transactions: Transaction[] = dataLedger?.message?.data || [];

  // Loading and error states
  const isLoading = isProfileLoading || isLedgerLoading;
  const hasError = profileError || ledgerError;
  // Custom hooks
  const savingsResult = useSavingsCalculation(savingsGoal, transactions);
  const {
    currentPage,
    totalPages,
    currentItems: currentTransactions,
    handlePageChange,
  } = usePagination({
    items: transactions,
    itemsPerPage: DASHBOARD_CONSTANTS.ITEMS_PER_PAGE,
  });
  const { isModalOpen, handleModalClose, handleModalSave } = useSavingsModal({
    savingsGoal: data?.message?.data?.financials?.annual_savings_goal,
    refetch,
  });

  // Handle retry function
  const handleRetry = () => {
    refetch();
    // Note: RTK Query doesn't expose a direct refetch for useGetLedgerQuery
    // You might need to implement a manual refetch mechanism
  };

  // Handle transaction selection
  const handleTransactionSelect = (transaction: Transaction) => {
    dispatch(setCurrentTransaction(transaction));
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex">
        {/* Mobile Top Navigation */}
        <MobileTopNav />

        {/* Left Sidebar */}
        <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
        <SavingsGoalModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          customerId={customer || undefined}
          onSave={handleModalSave}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          {/* Header */}
          <DashboardHeader fullName={fullName || ""} user={user} />

          {/* Dashboard Content */}
          <main className="flex-1">
            {isLoading ? (
              <LoadingState />
            ) : hasError ? (
              <ErrorState
                error={profileError || "Failed to load dashboard data"}
                onRetry={handleRetry}
              />
            ) : (
              <div className="p-4 lg:p-8 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Savings Breakdown Chart */}
                  <SavingsBreakdownChart chartData={savingsResult.chartData} />

                  {/* Savings Goal Card */}
                  <SavingsGoalCard
                    savingsGoalPercentage={savingsResult.saving_goal_percentage}
                    totalSaved={savingsResult.totalSaved}
                    savingGoal={savingsGoal}
                    profileData={{
                      customer_name:
                        data?.message?.data?.basic_info?.customer_name,
                      email: data?.message?.data?.basic_info?.email,
                      account_holder:
                        data?.message?.data?.financials?.account_holder,
                      branch_code: data?.message?.data?.financials?.branch_code,
                      iban_account:
                        data?.message?.data?.financials?.iban_account,
                      customer_bank:
                        data?.message?.data?.financials?.customer_bank,
                      customer_id: data?.message?.data?.basic_info?.customer_id,
                    }}
                  />
                </div>

                {/* Transactions */}
                <TransactionsTable
                  transactions={transactions}
                  currentTransactions={currentTransactions}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onTransactionSelect={handleTransactionSelect}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
