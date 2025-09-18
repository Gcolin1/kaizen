import { supabase } from '../config/database'
import { 
  Investment, 
  CreateInvestmentData, 
  UpdateInvestmentData,
  UserInvestment,
  CreateUserInvestmentData,
  UserInvestmentWithDetails
} from '../models/Investment'

export class InvestmentService {
  static async createInvestment(investmentData: CreateInvestmentData): Promise<Investment> {
    const { data, error } = await supabase
      .from('investments')
      .insert(investmentData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create investment: ${error.message}`)
    }

    return data
  }

  static async getAllInvestments(): Promise<Investment[]> {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Failed to get investments: ${error.message}`)
    }

    return data || []
  }

  static async getInvestmentById(id: string): Promise<Investment | null> {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get investment: ${error.message}`)
    }

    return data
  }

  static async updateInvestment(id: string, investmentData: UpdateInvestmentData): Promise<Investment> {
    const { data, error } = await supabase
      .from('investments')
      .update(investmentData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update investment: ${error.message}`)
    }

    return data
  }

  static async deleteInvestment(id: string): Promise<void> {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete investment: ${error.message}`)
    }
  }

  static async createUserInvestment(userId: string, investmentData: CreateUserInvestmentData): Promise<UserInvestment> {
    const { data, error } = await supabase
      .from('user_investments')
      .insert({
        user_id: userId,
        ...investmentData
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create user investment: ${error.message}`)
    }

    return data
  }

  static async getUserInvestments(userId: string): Promise<UserInvestmentWithDetails[]> {
    const { data, error } = await supabase
      .from('user_investments')
      .select(`
        *,
        investments (
          name,
          type,
          risk
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get user investments: ${error.message}`)
    }

    return data?.map(item => ({
      ...item,
      investment_name: item.investments.name,
      investment_type: item.investments.type,
      investment_risk: item.investments.risk
    })) || []
  }

  static async updateUserInvestment(id: string, userId: string, status: 'active' | 'completed' | 'cancelled'): Promise<UserInvestment> {
    const { data, error } = await supabase
      .from('user_investments')
      .update({ status })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update user investment: ${error.message}`)
    }

    return data
  }

  static async deleteUserInvestment(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_investments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete user investment: ${error.message}`)
    }
  }
}