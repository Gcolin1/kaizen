export interface User {
  id: string
  email: string
  password_hash: string
  company_name: string
  tax_id?: string
  role: 'administrator' | 'user'
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  password: string
  company_name: string
  tax_id?: string
  role?: 'administrator' | 'user'
}

export interface UpdateUserData {
  email?: string
  company_name?: string
  tax_id?: string
  role?: 'administrator' | 'user'
}

export interface LoginData {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  company_name: string
  tax_id?: string
  role: 'administrator' | 'user'
  created_at: string
}