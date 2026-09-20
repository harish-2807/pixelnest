export interface User {
  id: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  address: string;
  city: string;
  password: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobile?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export const CITIES = [
  'Hyderabad',
  'Mumbai',
  'Pune',
  'Bengaluru',
  'Chennai',
  'Delhi',
] as const;

export type City = (typeof CITIES)[number];