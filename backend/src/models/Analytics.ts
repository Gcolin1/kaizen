export interface AnalyticsCache {
  id: string
  user_id: string
  period: string
  reference_date: string
  total_income: number
  total_expenses: number
  balance: number
  created_at: string
  updated_at: string
}

export interface FinancialSummary {
  user_id: string
  company_name: string
  total_transactions: number
  total_income: number
  total_expenses: number
  balance: number
}

export interface MonthlyBalance {
  user_id: string
  year: number
  month: number
  total_income: number
  total_expenses: number
  balance: number
}

export interface DashboardMetrics {
  total_income: number
  total_expenses: number
  balance: number
  transactions_count: number
  categories_distribution: {
    category_name: string
    category_color: string
    category_icon: string
    total_amount: number
    percentage: number
  }[]
  monthly_trend: {
    month: string
    income: number
    expenses: number
    balance: number
  }[]
}