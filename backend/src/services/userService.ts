import { supabase } from '../config/database'
import { User, CreateUserData, UpdateUserData, UserResponse } from '../models/User'
import bcrypt from 'bcryptjs'

export class UserService {
  static async createUser(userData: CreateUserData): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        password_hash: hashedPassword,
        company_name: userData.company_name,
        tax_id: userData.tax_id,
        role: userData.role || 'user'
      })
      .select('id, email, company_name, tax_id, role, created_at')
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return data
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get user: ${error.message}`)
    }

    return data
  }

  static async getUserById(id: string): Promise<UserResponse | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, company_name, tax_id, role, created_at')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get user: ${error.message}`)
    }

    return data
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<UserResponse> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select('id, email, company_name, tax_id, role, created_at')
      .single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return data
  }

  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  }

  static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}