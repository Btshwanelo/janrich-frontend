"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useGetProfileQuery, useGetLedgerQuery } from "@/lib/slices/authSlice";
import {
  setTransactions,
  setCurrentTransaction,
} from "@/lib/slices/ledgerSlice";
import SavingsGoalModal from "@/components/SavingsGoalModal";
import { DepositModal } from "@/components/dashboard/DepositModal";
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
import { getMonthsRemainingInYear } from "@/utils/dateUtils";
import {
  useOnboardingFlow,
  getNextOnboardingStep,
} from "@/utils/onboardingState";
import { resetOnboardingFlow, fixInconsistentState } from "@/lib/slices/onboardingSlice";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, fullName, customer } = useAppSelector((state) => state.auth);
  const { flow, isOnboardingComplete, markDepositModalShown, completeOnboarding } = useOnboardingFlow();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
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

  const savingsGoal = data?.message?.data?.financials?.annual_savings_goal || 0;
  const transactions: Transaction[] = dataLedger?.message?.data || [];

  // Check onboarding state and redirect if needed
  useEffect(() => {
    if (!isProfileLoading && data) {
      const savingsGoal = data?.message?.data?.financials?.annual_savings_goal || 0;
      
      console.log("🔵 DASHBOARD - Onboarding Check:", {
        savingsGoal,
        isOnboardingComplete,
        flow: {
          savingsGoalCreated: flow.savingsGoalCreated,
          welcomeShown: flow.welcomeShown,
          depositModalShown: flow.depositModalShown,
          profileCompleted: flow.profileCompleted,
        },
      });
      
      // Check if flow state is actually complete
      const isFlowActuallyComplete = 
        flow.savingsGoalCreated &&
        flow.welcomeShown &&
        flow.profileCompleted.details &&
        flow.profileCompleted.beneficiary &&
        flow.profileCompleted.financial &&
        flow.depositModalShown;
      
      console.log("🔵 DASHBOARD - Flow Completion Check:", {
        isFlowActuallyComplete,
        breakdown: {
          savingsGoalCreated: flow.savingsGoalCreated,
          welcomeShown: flow.welcomeShown,
          details: flow.profileCompleted.details,
          beneficiary: flow.profileCompleted.beneficiary,
          financial: flow.profileCompleted.financial,
          depositModalShown: flow.depositModalShown,
        },
      });
      
      // Check if state is inconsistent (flag says complete but flow isn't)
      const isStateInconsistent = isOnboardingComplete && !isFlowActuallyComplete;
      
      console.log("🔵 DASHBOARD - State Consistency:", {
        isStateInconsistent,
        isOnboardingComplete,
        isFlowActuallyComplete,
      });
      
      // If state is inconsistent, fix it immediately
      if (isStateInconsistent) {
        console.log("🔴 DASHBOARD - Fixing inconsistent state!");
        dispatch(fixInconsistentState());
      }
      
      // Check if user is a first-time user (savings goal is 0)
      // If so, reset onboarding flow to ensure fresh state
      if (savingsGoal === 0) {
        console.log("🟡 DASHBOARD - First-time user detected (savings goal = 0), resetting onboarding");
        dispatch(resetOnboardingFlow());
        // After reset, show savings goal modal
        return;
      }
      
      // Main check: if onboarding is not complete, redirect based on flow state
      // Use the actual flow state, not just the flag (which might be inconsistent)
      if (!isFlowActuallyComplete) {
        const nextStep = getNextOnboardingStep(flow);
        console.log("🟢 DASHBOARD - Onboarding incomplete, next step:", nextStep);
        
        if (nextStep === "savings") {
          // Show savings goal modal (handled by useSavingsModal hook)
          // Don't redirect, let the modal show
          console.log("🟢 DASHBOARD - Showing savings goal modal");
        } else if (nextStep === "welcome") {
          console.log("🟢 DASHBOARD - Redirecting to /welcome");
          router.push("/welcome");
        } else if (nextStep === "profile") {
          console.log("🟢 DASHBOARD - Redirecting to /profile");
          router.push("/profile");
        } else if (nextStep === "deposit") {
          // Show deposit modal
          console.log("🟢 DASHBOARD - Showing deposit modal");
          setIsDepositModalOpen(true);
        }
      } else {
        console.log("✅ DASHBOARD - Onboarding complete, staying on dashboard");
      }
      // If flow is actually complete, user can stay on dashboard
    }
  }, [isProfileLoading, data, router, isOnboardingComplete, flow, dispatch]);

  // Handle deposit modal close
  const handleDepositModalClose = () => {
    console.log("🟢 DASHBOARD - Deposit modal closed, marking as shown and completing onboarding");
    markDepositModalShown();
    completeOnboarding();
    setIsDepositModalOpen(false);
  };

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
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={handleDepositModalClose}
          profileData={{
            customer_name: data?.message?.data?.basic_info?.customer_name,
            customer_id: data?.message?.data?.basic_info?.customer_id,
            email: data?.message?.data?.basic_info?.email,
            account_holder: data?.message?.data?.financials?.account_holder,
            branch_code: data?.message?.data?.financials?.branch_code,
            iban_account: data?.message?.data?.financials?.iban_account,
            customer_bank: data?.message?.data?.financials?.customer_bank,
          }}
          savingsData={{
            totalSaved: savingsResult.totalSaved,
            savingGoal: savingsGoal,
            paymentsToGo: getMonthsRemainingInYear(),
          }}
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
