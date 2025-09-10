// utils/validation.ts
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[0-9]{10,15}$/;

export const requiredMsg = (field: string) => `${field} is required`;
export const invalidEmailMsg = 'Invalid email format';
export const invalidPhoneMsg = 'Invalid phone number';
export const passwordMismatchMsg = 'Passwords do not match';
export const minPasswordLength = 6;