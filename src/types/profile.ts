export interface ProfileFormData {
  firstName: string;
  lastName: string;
  detailsPhoneNumber: string;
  whatsappSame: boolean;
  title: string;
  birthdate: string;
  gender: string;
  nationality: string;
  countryOfResidence: string;
  race: string;
  communicationPreference: string;
}

export interface FinancialDetailsFormData {
  employmentStatus: string;
  employmentStatusOther: string;
  depositFrequency: string;
  depositFrequencyOther: string;
  customerBank: string;
  customerBankOther: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  annualSavingsGoal: number;
}

export interface BeneficiaryFormData {
  beneficiaryType: string;
  beneficiaryName: string;
  beneficiaryTitle: string;
  beneficiaryCell: string;
  beneficiaryRelation: string;
}

export interface ProfileState {
  selectedTab: string;
  phoneNumber: string;
  amount: number[];
  isSidebarCollapsed: boolean;
  profileFormData: ProfileFormData;
  financialDetailsFormData: FinancialDetailsFormData;
  beneficiaryFormData: BeneficiaryFormData;
}

export interface SelectOption {
  id: string;
  label: string;
}

export interface ProfileTab {
  id: string;
  label: string;
}

export interface ProfileHeaderProps {
  profileData: any;
  onShare: () => void;
  onViewProfile: () => void;
}

export interface ProfileFormProps {
  formData: ProfileFormData;
  onFormDataChange: (data: Partial<ProfileFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export interface FinancialDetailsFormProps {
  formData: FinancialDetailsFormData;
  onFormDataChange: (data: Partial<FinancialDetailsFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export interface BeneficiaryFormProps {
  formData: BeneficiaryFormData;
  onFormDataChange: (data: Partial<BeneficiaryFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}
