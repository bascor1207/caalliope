const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();
export const isValidEmail = (value: string) => EMAIL.test(value);
export const displayName = (email: string) => email.split("@")[0];
