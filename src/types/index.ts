export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  type: 'income' | 'expense';
  created_at: string;
  updated_at: string;
}

export interface TransactionWithCategory {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  type: 'income' | 'expense';
  created_at: string;
  updated_at: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  company_name: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  return_rate: number;
  minimum_investment: number;
  risk: 'low' | 'medium' | 'high';
  duration: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInvestment {
  id: string;
  user_id: string;
  investment_id: string;
  invested_amount: number;
  start_date: string;
  expected_end_date: string;
  expected_return: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ChartData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  company_name: string;
  tax_id?: string;
  role: 'administrator' | 'user';
  created_at: string;
}