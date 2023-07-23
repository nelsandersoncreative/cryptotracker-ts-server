export interface User {
  id?: number;
  user_name?: string;
  user_email?: string;
  user_password?: string;
  error?: boolean | string;
}

export type UserValidationField = 'user_name' | 'user_email' | 'user_password';

export interface DatabaseUserEntry {
  user_name: string;
  user_email: string;
  user_password: string;
}

export interface ValidationMethods {
  user_name: (user_name: string) => User;
  user_email: (user_email: string) => User;
  user_password: (user_password: string) => User;
}
