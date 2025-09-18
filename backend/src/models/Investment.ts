export interface Investment {
  id: string
  name: string
  type: string
  return_rate: number
  minimum_investment: number
  risk: 'low' | 'medium' | 'high'
  duration: string
  description?: string
  created_at: string
  updated_at: string
}

export interface CreateInvestmentData {
  name: string
  type: string
  return_rate: number
  minimum_investment: number
  risk: 'low' | 'medium' | 'high'
  duration: string
  description?: string
}

export interface UpdateInvestmentData {
  name?: string
  type?: string
  return_rate?: number
  minimum_investment?: number
  risk?: 'low' | 'medium' | 'high'
  duration?: string
  description?: string
}

export interface UserInvestment {
  id: string
  user_id: string
  investment_id: string
  invested_amount: number
  start_date: string
  expected_end_date: string
  expected_return: number
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface CreateUserInvestmentData {
  investment_id: string
  invested_amount: number
  start_date: string
  expected_end_date: string
  expected_return: number
}

export interface UserInvestmentWithDetails extends UserInvestment {
  investment_name: string
  investment_type: string
  investment_risk: 'low' | 'medium' | 'high'
}