import { useState, useCallback } from 'react';
import { ProfileFormData } from '@/types/profile';

const initialFormData: ProfileFormData = {
  firstName: "",
  lastName: "",
  detailsPhoneNumber: "",
  whatsappSame: true,
  title: "",
  birthdate: "",
  gender: "",
  nationality: "",
  countryOfResidence: "",
  race: "",
  communicationPreference: "",
};

export const useProfileForm = () => {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  const updateFormData = useCallback((updates: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const isFormValid = useCallback(() => {
    return formData.firstName.trim() !== "" && 
           formData.lastName.trim() !== "" &&
           formData.detailsPhoneNumber.trim() !== "";
  }, [formData]);

  return {
    formData,
    updateFormData,
    resetForm,
    isFormValid,
  };
};
