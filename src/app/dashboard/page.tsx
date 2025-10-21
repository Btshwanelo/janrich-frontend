"use client";
import React, { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAppSelector } from "@/lib/hooks";
import { useGetProfileQuery, useGetLedgerQuery } from "@/lib/slices/authSlice";
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

  const { user, fullName, customer } = useAppSelector((state) => state.auth);
  const { data, refetch, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery(customer || "");
  const { data: dataLedger, isLoading: isLedgerLoading, error: ledgerError } = useGetLedgerQuery(customer || "");

  const savingsGoal = data?.message?.data?.financials?.annual_savings_goal || 0;
  const transactions: Transaction[] = dataLedger?.message?.data || [];

  // Loading and error states
  const isLoading = isProfileLoading || isLedgerLoading;
  const hasError = profileError || ledgerError;

  // Custom hooks
  const savingsResult = useSavingsCalculation(savingsGoal, transactions);
  const { currentPage, totalPages, currentItems: currentTransactions, handlePageChange } = usePagination({
    items: transactions,
    itemsPerPage: DASHBOARD_CONSTANTS.ITEMS_PER_PAGE,
  });
  const {
    isModalOpen,
    handleModalClose,
    handleModalSave,
  } = useSavingsModal({
    savingsGoal: data?.message?.data?.financials?.annual_savings_goal,
    refetch,
  });

  // Handle retry function
  const handleRetry = () => {
    if (profileError) refetch();
    // Note: RTK Query doesn't expose a direct refetch for useGetLedgerQuery
    // You might need to implement a manual refetch mechanism
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
                error={
                  (profileError && 'message' in profileError ? profileError.message : '') ||
                  (ledgerError && 'message' in ledgerError ? ledgerError.message : '') ||
                  "Failed to load dashboard data"
                }
                onRetry={handleRetry}
              />
            ) : (
              <div className="p-4 lg:p-8 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Savings Breakdown Chart */}
                  <SavingsBreakdownChart chartData={savingsResult.chartData} />

                  {/* Savings Goal Card */}
                  <SavingsGoalCard savingsGoalPercentage={savingsResult.saving_goal_percentage} />
                </div>

                {/* Transactions */}
                <TransactionsTable
                  transactions={transactions}
                  currentTransactions={currentTransactions}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
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
