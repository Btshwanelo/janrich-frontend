import { useState, useCallback } from 'react';
import { FinancialDetailsFormData } from '@/types/profile';

const initialFormData: FinancialDetailsFormData = {
  employmentStatus: "",
  employmentStatusOther: "",
  depositFrequency: "",
  depositFrequencyOther: "",
  customerBank: "",
  customerBankOther: "",
  monthlyIncome: 0,
  monthlyExpenses: 0,
  annualSavingsGoal: 0,
};

export const useFinancialDetailsForm = () => {
  const [formData, setFormData] = useState<FinancialDetailsFormData>(initialFormData);

  const updateFormData = useCallback((updates: Partial<FinancialDetailsFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const isFormValid = useCallback(() => {
    return formData.employmentStatus.trim() !== "" && 
           formData.depositFrequency.trim() !== "" &&
           formData.customerBank.trim() !== "";
  }, [formData]);

  return {
    formData,
    updateFormData,
    resetForm,
    isFormValid,
  };
};
