import { useState, useCallback } from 'react';
import { BeneficiaryFormData } from '@/types/profile';

const initialFormData: BeneficiaryFormData = {
  beneficiaryType: "",
  beneficiaryName: "",
  beneficiaryTitle: "",
  beneficiaryCell: "",
  beneficiaryRelation: "",
};

export const useBeneficiaryForm = () => {
  const [formData, setFormData] = useState<BeneficiaryFormData>(initialFormData);

  const updateFormData = useCallback((updates: Partial<BeneficiaryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const isFormValid = useCallback(() => {
    return formData.beneficiaryType.trim() !== "" && 
           formData.beneficiaryName.trim() !== "" &&
           formData.beneficiaryCell.trim() !== "" &&
           formData.beneficiaryRelation.trim() !== "";
  }, [formData]);

  return {
    formData,
    updateFormData,
    resetForm,
    isFormValid,
  };
};
