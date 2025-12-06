/**
 * Utility functions to manage onboarding state using Redux
 * Tracks the progress through: savings goal → welcome → profile completion
 * 
 * Note: This is now a wrapper around Redux state. Use Redux hooks directly
 * for better performance in components.
 */

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  startOnboarding as startOnboardingAction,
  markWelcomeShown as markWelcomeShownAction,
  markGoalCompleted as markGoalCompletedAction,
  markFinancialCompleted as markFinancialCompletedAction,
  markBeneficiaryCompleted as markBeneficiaryCompletedAction,
  completeOnboarding as completeOnboardingAction,
  resetOnboardingFlow as resetOnboardingFlowAction,
  selectOnboardingFlow,
  selectIsOnboardingComplete,
  type OnboardingFlowState,
} from "@/lib/slices/onboardingSlice";

/**
 * Hook to get the current onboarding flow state
 */
export const useOnboardingFlow = () => {
  const flow = useAppSelector(selectOnboardingFlow);
  const isOnboardingComplete = useAppSelector(selectIsOnboardingComplete);
  const dispatch = useAppDispatch();

  return {
    flow,
    isOnboardingComplete,
    startOnboarding: () => dispatch(startOnboardingAction()),
    markWelcomeShown: () => dispatch(markWelcomeShownAction()),
    markGoalCompleted: () => dispatch(markGoalCompletedAction()),
    markFinancialCompleted: () => dispatch(markFinancialCompletedAction()),
    markBeneficiaryCompleted: () => dispatch(markBeneficiaryCompletedAction()),
    completeOnboarding: () => dispatch(completeOnboardingAction()),
    resetOnboardingFlow: () => dispatch(resetOnboardingFlowAction()),
  };
};

/**
 * Get the next step in the onboarding flow
 */
export const getNextOnboardingStep = (
  flow: OnboardingFlowState
): "welcome" | "goal" | "financial" | "beneficiary" | "complete" => {
  if (!flow.welcomeShown) {
    return "welcome";
  }

  if (!flow.goalCompleted) {
    return "goal";
  }

  if (!flow.financialCompleted) {
    return "financial";
  }

  if (!flow.beneficiaryCompleted) {
    return "beneficiary";
  }

  return "complete";
};

// Legacy functions for backward compatibility (now use Redux)
// These are kept for components that haven't been migrated yet
export const getOnboardingState = (): OnboardingFlowState => {
  if (typeof window === "undefined") {
    return {
      isOnboardingComplete: true,
      savingsGoalCreated: false,
      welcomeShown: false,
      depositModalShown: false,
      profileCompleted: {
        details: false,
        beneficiary: false,
        financial: false,
      },
    };
  }

  // This is a fallback - components should use useOnboardingFlow hook instead
  // We can't access Redux state here without a store instance
  // This function is deprecated and should be replaced with useOnboardingFlow
  console.warn(
    "getOnboardingState() is deprecated. Use useOnboardingFlow() hook instead."
  );
  return {
    isOnboardingComplete: true,
    savingsGoalCreated: false,
    welcomeShown: false,
    depositModalShown: false,
    profileCompleted: {
      details: false,
      beneficiary: false,
      financial: false,
    },
  };
};

export const markSavingsGoalCreated = () => {
  console.warn(
    "markSavingsGoalCreated() is deprecated. Use useOnboardingFlow() hook instead."
  );
};

export const markWelcomeShown = () => {
  console.warn(
    "markWelcomeShown() is deprecated. Use useOnboardingFlow() hook instead."
  );
};

export const markProfileTabCompleted = (
  tab: "details" | "beneficiary" | "financial"
) => {
  console.warn(
    "markProfileTabCompleted() is deprecated. Use useOnboardingFlow() hook instead."
  );
};

export const isProfileComplete = (): boolean => {
  console.warn(
    "isProfileComplete() is deprecated. Use useOnboardingFlow() hook instead."
  );
  return false;
};

export const isOnboardingComplete = (): boolean => {
  console.warn(
    "isOnboardingComplete() is deprecated. Use useOnboardingFlow() hook instead."
  );
  return false;
};

export const resetOnboardingState = () => {
  console.warn(
    "resetOnboardingState() is deprecated. Use useOnboardingFlow() hook instead."
  );
};
