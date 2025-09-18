export interface Transaction {
  id: string
  user_id: string
  amount: number
  description: string
  date: string
  category_id: string
  type: 'income' | 'expense'
  created_at: string
  updated_at: string
}

export interface CreateTransactionData {
  amount: number
  description: string
  date: string
  category_id: string
  type: 'income' | 'expense'
  payment_method?: string
  status?: 'pago' | 'credito'
}

export interface UpdateTransactionData {
  amount?: number
  description?: string
  date?: string
  category_id?: string
  type?: 'income' | 'expense'
  payment_method?: string
  status?: 'pago' | 'credito'
}

export interface TransactionWithCategory {
  id: string
  user_id: string
  amount: number
  description: string
  date: string
  category_id: string
  type: 'income' | 'expense'
  created_at: string
  updated_at: string
  category_name: string
  category_color: string
  category_icon: string
  company_name: string
}