import { supabase } from '../config/database'
import { Transaction, CreateTransactionData, UpdateTransactionData, TransactionWithCategory } from '../models/Transaction'

export class TransactionService {
  static async createTransaction(userId: string, transactionData: CreateTransactionData): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        ...transactionData
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`)
    }

    return data
  }

  static async getTransactionsByUserId(userId: string, limit?: number, offset?: number): Promise<TransactionWithCategory[]> {
    let query = supabase
      .from('transaction_details')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to get transactions: ${error.message}`)
    }

    return data || []
  }

  static async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get transaction: ${error.message}`)
    }

    return data
  }

  static async updateTransaction(id: string, userId: string, transactionData: UpdateTransactionData): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transactionData)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`)
    }

    return data
  }

  static async deleteTransaction(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`)
    }
  }

  static async getTransactionsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<TransactionWithCategory[]> {
    const { data, error } = await supabase
      .from('transaction_details')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      throw new Error(`Failed to get transactions by date range: ${error.message}`)
    }

    return data || []
  }

  static async getTransactionsByCategory(userId: string, categoryId: string): Promise<TransactionWithCategory[]> {
    const { data, error } = await supabase
      .from('transaction_details')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .order('date', { ascending: false })

    if (error) {
      throw new Error(`Failed to get transactions by category: ${error.message}`)
    }

    return data || []
  }
}