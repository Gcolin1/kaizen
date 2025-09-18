import { supabase } from '../config/database'
import { FinancialSummary, MonthlyBalance, DashboardMetrics } from '../models/Analytics'

export class AnalyticsService {
  static async getFinancialSummary(userId: string): Promise<FinancialSummary | null> {
    const { data, error } = await supabase
      .from('financial_summary')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get financial summary: ${error.message}`)
    }

    return data
  }

  static async getMonthlyBalance(userId: string, yearMonth: string): Promise<MonthlyBalance[]> {
    const { data, error } = await supabase
      .rpc('calculate_monthly_balance', {
        p_user_id: userId,
        p_year_month: yearMonth
      })

    if (error) {
      throw new Error(`Failed to get monthly balance: ${error.message}`)
    }

    return data || []
  }

  static async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    const [summaryResult, categoriesResult, trendResult] = await Promise.all([
      this.getFinancialSummary(userId),
      this.getCategoriesDistribution(userId),
      this.getMonthlyTrend(userId)
    ])

    return {
      total_income: summaryResult?.total_income || 0,
      total_expenses: summaryResult?.total_expenses || 0,
      balance: summaryResult?.balance || 0,
      transactions_count: summaryResult?.total_transactions || 0,
      categories_distribution: categoriesResult,
      monthly_trend: trendResult
    }
  }

  private static async getCategoriesDistribution(userId: string) {
    const { data, error } = await supabase
      .from('transaction_details')
      .select('category_name, category_color, category_icon, amount')
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to get categories distribution: ${error.message}`)
    }

    const categoryTotals = new Map()
    let totalAmount = 0

    data?.forEach(transaction => {
      const key = `${transaction.category_name}-${transaction.category_color}-${transaction.category_icon}`
      const current = categoryTotals.get(key) || 0
      categoryTotals.set(key, current + Number(transaction.amount))
      totalAmount += Number(transaction.amount)
    })

    return Array.from(categoryTotals.entries()).map(([key, amount]) => {
      const [category_name, category_color, category_icon] = key.split('-')
      return {
        category_name,
        category_color,
        category_icon,
        total_amount: amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      }
    })
  }

  private static async getMonthlyTrend(userId: string, months: number = 6) {
    const { data, error } = await supabase
      .from('analytics_cache')
      .select('*')
      .eq('user_id', userId)
      .eq('period', 'monthly')
      .order('reference_date', { ascending: false })
      .limit(months)

    if (error) {
      throw new Error(`Failed to get monthly trend: ${error.message}`)
    }

    return data?.map(item => ({
      month: new Date(item.reference_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: Number(item.total_income),
      expenses: Number(item.total_expenses),
      balance: Number(item.balance)
    })).reverse() || []
  }

  static async updateAnalyticsCache(userId: string): Promise<void> {
    const { error } = await supabase
      .rpc('update_analytics_cache', {
        p_user_id: userId
      })

    if (error) {
      throw new Error(`Failed to update analytics cache: ${error.message}`)
    }
  }
}