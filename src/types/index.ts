export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
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
}

export interface ChartData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}