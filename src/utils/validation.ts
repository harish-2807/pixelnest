import { RegisterFormData, LoginFormData, ValidationErrors } from '../types/auth';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRegisterForm = (data: RegisterFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.gender) {
    errors.gender = 'Please select a gender';
  }

  if (!data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!validateMobile(data.mobile)) {
    errors.mobile = 'Mobile number must be exactly 10 digits';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!data.city) {
    errors.city = 'Please select a city';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};