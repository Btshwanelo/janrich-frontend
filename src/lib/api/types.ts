// Common API response types
export interface ApiResponse<T> {
  message: T;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Auth specific types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  customer_name: string;
  customer_type: string;
  title: string;
  first_name: string;
  last_name: string;
  last_nameemail: string;
  email: string;
  phone: string;
  country_code: string;
  new_password: string;
  agree_to_terms: number;
}

export interface OnboardingData {
  customer_id: string;
  title: string;
  birth_date: string;
  gender: string;
  nationality: string;
  country_of_residence: string;
  race: string;
  race_other?: string;
  communication_preference: string;
}
