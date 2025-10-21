import { useCallback } from 'react';
import { useSuccessToast, useErrorToast } from '@/components/base/toast';
import {
  useUpdateFinancialDetailsMutation,
  useUpdateBeneficiaryMutation,
  useUpdateCustomerMutation,
  useUpdateProfileMutation,
} from '@/lib/slices/authSlice';
import { ProfileFormData, FinancialDetailsFormData, BeneficiaryFormData } from '@/types/profile';

export const useProfileMutations = (customerId: string | null) => {
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const [updateFinancialDetails, { isLoading: isUpdatingFinancials }] = useUpdateFinancialDetailsMutation();
  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] = useUpdateBeneficiaryMutation();
  const [updateCustomer, { isLoading: isUpdatingCustomer }] = useUpdateCustomerMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const handleProfileUpdate = useCallback(async (formData: ProfileFormData) => {
    if (!customerId) return;

    try {
      await updateCustomer({
        customer_id: customerId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        title: formData.title,
        gender: formData.gender,
        nationality: formData.nationality,
        country_of_residence: formData.countryOfResidence,
        race: formData.race,
        communication_preference: formData.communicationPreference,
      }).unwrap();

      showSuccessToast("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showErrorToast("Failed to update profile");
    }
  }, [customerId, updateCustomer, showSuccessToast, showErrorToast]);

  const handleFinancialDetailsUpdate = useCallback(async (formData: FinancialDetailsFormData) => {
    if (!customerId) return;

    try {
      await updateFinancialDetails({
        customer_id: customerId,
        employment_status_other: formData.employmentStatusOther,
        deposit_frequency: formData.depositFrequency,
        deposit_frequency_other: formData.depositFrequencyOther,
        customer_bank: formData.customerBank,
        customer_bank_other: formData.customerBankOther,
        monthly_income: formData.monthlyIncome,
        monthly_expenses: formData.monthlyExpenses,
        annual_savings_goal: formData.annualSavingsGoal,
      }).unwrap();

      showSuccessToast("Financial details updated successfully");
    } catch (error) {
      console.error("Failed to update financial details:", error);
      showErrorToast("Failed to update financial details");
    }
  }, [customerId, updateFinancialDetails, showSuccessToast, showErrorToast]);

  const handleBeneficiaryUpdate = useCallback(async (formData: BeneficiaryFormData) => {
    if (!customerId) return;

    try {
      await updateBeneficiary({
        customer_id: customerId,
        beneficiary_type: formData.beneficiaryType,
        beneficiary_name: formData.beneficiaryName,
        beneficiary_title: formData.beneficiaryTitle,
        beneficiary_cell: formData.beneficiaryCell,
        beneficiary_relation: formData.beneficiaryRelation,
      }).unwrap();

      showSuccessToast("Beneficiary details updated successfully");
    } catch (error) {
      console.error("Failed to update beneficiary:", error);
      showErrorToast("Failed to update beneficiary details");
    }
  }, [customerId, updateBeneficiary, showSuccessToast, showErrorToast]);

  return {
    handleProfileUpdate,
    handleFinancialDetailsUpdate,
    handleBeneficiaryUpdate,
    isUpdatingFinancials,
    isUpdatingBeneficiary,
    isUpdatingCustomer,
    isUpdatingProfile,
  };
};
