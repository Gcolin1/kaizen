import { supabase } from '../config/database'
import { Category, CreateCategoryData, UpdateCategoryData } from '../models/Category'

export class CategoryService {
  static async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`)
    }

    return data
  }

  static async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Failed to get categories: ${error.message}`)
    }

    return data || []
  }

  static async getCategoriesByType(type: 'income' | 'expense' | 'both'): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`type.eq.${type},type.eq.both`)
      .order('name')

    if (error) {
      throw new Error(`Failed to get categories by type: ${error.message}`)
    }

    return data || []
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get category: ${error.message}`)
    }

    return data
  }

  static async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`)
    }

    return data
  }

  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`)
    }
  }
}