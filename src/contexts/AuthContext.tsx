import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  email: string;
  companyName: string;
  cnpj?: string;
  role: 'administrator' | 'user';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  cnpj: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthContext agora usa a API real do backend

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há uma sessão salva ao carregar a aplicação
  useEffect(() => {
    const savedUser = localStorage.getItem('Kaizen_user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem('Kaizen_user');
        localStorage.removeItem('authToken');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          companyName: response.data.user.companyName,
          cnpj: response.data.user.cnpj,
          role: response.data.user.role,
          createdAt: response.data.user.createdAt
        };
        
        // Salvar no localStorage
        localStorage.setItem('Kaizen_user', JSON.stringify(userData));
        localStorage.setItem('authToken', response.data.token);
        
        setUser(userData);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        const userResponseData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          companyName: response.data.user.companyName,
          cnpj: response.data.user.cnpj,
          role: response.data.user.role,
          createdAt: response.data.user.createdAt
        };
        
        // Salvar no localStorage
        localStorage.setItem('Kaizen_user', JSON.stringify(userResponseData));
        localStorage.setItem('authToken', response.data.token);
        
        setUser(userResponseData);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Chama o endpoint da API (implementar quando necessário)
      // Por enquanto simular o comportamento esperado
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Email inválido' };
      }
      
      // TODO: Implementar chamada para API quando o endpoint existir
      return { success: true, message: 'Se este email estiver cadastrado, você receberá um link de recuperação' };
      
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
    localStorage.removeItem('Kaizen_user');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}