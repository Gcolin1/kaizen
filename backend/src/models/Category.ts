export interface Category {
  id: string
  name: string
  color: string
  icon: string
  type: 'income' | 'expense' | 'both'
  created_at: string
  updated_at: string
}

export interface CreateCategoryData {
  name: string
  color?: string
  icon?: string
  type: 'income' | 'expense' | 'both'
}

export interface UpdateCategoryData {
  name?: string
  color?: string
  icon?: string
  type?: 'income' | 'expense' | 'both'
}