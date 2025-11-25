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
  markSavingsGoalCreated as markSavingsGoalCreatedAction,
  markWelcomeShown as markWelcomeShownAction,
  markDepositModalShown as markDepositModalShownAction,
  markProfileTabCompleted as markProfileTabCompletedAction,
  completeOnboarding as completeOnboardingAction,
  resetOnboardingFlow as resetOnboardingFlowAction,
  selectOnboardingFlow,
  selectIsProfileComplete,
  selectIsOnboardingComplete,
  type OnboardingFlowState,
} from "@/lib/slices/onboardingSlice";

/**
 * Hook to get the current onboarding flow state
 */
export const useOnboardingFlow = () => {
  const flow = useAppSelector(selectOnboardingFlow);
  const isProfileComplete = useAppSelector(selectIsProfileComplete);
  const isOnboardingComplete = useAppSelector(selectIsOnboardingComplete);
  const dispatch = useAppDispatch();

  return {
    flow,
    isProfileComplete,
    isOnboardingComplete,
    startOnboarding: () => dispatch(startOnboardingAction()),
    markSavingsGoalCreated: () => dispatch(markSavingsGoalCreatedAction()),
    markWelcomeShown: () => dispatch(markWelcomeShownAction()),
    markDepositModalShown: () => dispatch(markDepositModalShownAction()),
    markProfileTabCompleted: (tab: "details" | "beneficiary" | "financial") =>
      dispatch(markProfileTabCompletedAction(tab)),
    completeOnboarding: () => dispatch(completeOnboardingAction()),
    resetOnboardingFlow: () => dispatch(resetOnboardingFlowAction()),
  };
};

/**
 * Get the next step in the onboarding flow
 */
export const getNextOnboardingStep = (
  flow: OnboardingFlowState
): "savings" | "welcome" | "profile" | "deposit" | "complete" => {
  if (!flow.savingsGoalCreated) {
    return "savings";
  }

  if (!flow.welcomeShown) {
    return "welcome";
  }

  const isProfileComplete =
    flow.profileCompleted.details &&
    flow.profileCompleted.beneficiary &&
    flow.profileCompleted.financial;

  if (!isProfileComplete) {
    return "profile";
  }

  if (!flow.depositModalShown) {
    return "deposit";
  }

  return "complete";
};

// Legacy functions for backward compatibility (now use Redux)
// These are kept for components that haven't been migrated yet
export const getOnboardingState = (): OnboardingFlowState => {
  if (typeof window === "undefined") {
    return {
      isOnboardingComplete: false,
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
    isOnboardingComplete: false,
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
