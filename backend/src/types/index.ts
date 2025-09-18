export interface User {
  id: string;
  email: string;
  companyName: string;
  cnpj?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
  type: 'income' | 'expense';
  paymentMethod?: string;
  status?: 'pago' | 'credito';
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  yield: number;
  minInvestment: number;
  risk: 'baixo' | 'medio' | 'alto';
  duration: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  cnpj: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
  paymentMethod?: string;
  status?: 'pago' | 'credito';
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'income' | 'expense';
  search?: string;
  page?: number;
  limit?: number;
}