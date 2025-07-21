import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  companyName: string;
  cnpj?: string;
  role: 'admin' | 'user';
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

// Mock database - em produção seria uma API real
const mockUsers = [
  {
    id: '1',
    email: 'admin@empresa.com',
    password: '123456',
    companyName: 'Empresa Demo Ltda',
    cnpj: '12.345.678/0001-90',
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há uma sessão salva ao carregar a aplicação
  useEffect(() => {
    const savedUser = localStorage.getItem('Kaizen_user');
    const savedToken = localStorage.getItem('Kaizen_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        // Verificar se o token ainda é válido (simulação)
        const tokenData = JSON.parse(atob(savedToken.split('.')[1]));
        const isExpired = Date.now() >= tokenData.exp * 1000;
        
        if (!isExpired) {
          setUser(userData);
        } else {
          // Token expirado, limpar dados
          localStorage.removeItem('Kaizen_user');
          localStorage.removeItem('Kaizen_token');
        }
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem('Kaizen_user');
        localStorage.removeItem('Kaizen_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Validações básicas
      if (!email || !password) {
        return { success: false, message: 'Email e senha são obrigatórios' };
      }
      
      if (!email.includes('@')) {
        return { success: false, message: 'Email inválido' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' };
      }
      
      // Verificar credenciais no mock database
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { success: false, message: 'Email ou senha incorretos' };
      }
      
      // Criar token JWT simulado
      const token = btoa(JSON.stringify({
        userId: foundUser.id,
        email: foundUser.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
      }));
      
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        companyName: foundUser.companyName,
        cnpj: foundUser.cnpj,
        role: foundUser.role,
        createdAt: foundUser.createdAt
      };
      
      // Salvar no localStorage
      localStorage.setItem('Kaizen_user', JSON.stringify(userData));
      localStorage.setItem('Kaizen_token', token);
      
      setUser(userData);
      
      return { success: true, message: 'Login realizado com sucesso!' };
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Validações
      if (!userData.email || !userData.password || !userData.companyName || !userData.cnpj) {
        return { success: false, message: 'Todos os campos são obrigatórios' };
      }
      
      if (!userData.email.includes('@')) {
        return { success: false, message: 'Email inválido' };
      }
      
      if (userData.password.length < 6) {
        return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' };
      }
      
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: 'Senhas não coincidem' };
      }
      
      // Validar CNPJ (validação básica)
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      if (!cnpjRegex.test(userData.cnpj)) {
        return { success: false, message: 'CNPJ inválido. Use o formato: 00.000.000/0001-00' };
      }
      
      // Verificar se email já existe
      const emailExists = mockUsers.some(u => u.email === userData.email);
      if (emailExists) {
        return { success: false, message: 'Este email já está cadastrado' };
      }
      
      // Verificar se CNPJ já existe
      const cnpjExists = mockUsers.some(u => u.cnpj === userData.cnpj);
      if (cnpjExists) {
        return { success: false, message: 'Este CNPJ já está cadastrado' };
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password,
        companyName: userData.companyName,
        cnpj: userData.cnpj,
        role: 'admin' as const,
        createdAt: new Date().toISOString()
      };
      
      // Adicionar ao mock database
      mockUsers.push(newUser);
      
      // Fazer login automático após registro
      const loginResult = await login(userData.email, userData.password);
      
      if (loginResult.success) {
        return { success: true, message: 'Conta criada com sucesso! Bem-vindo ao Kaizen!' };
      } else {
        return { success: false, message: 'Conta criada, mas houve erro no login automático' };
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
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Email inválido' };
      }
      
      // Verificar se email existe
      const userExists = mockUsers.some(u => u.email === email);
      
      if (!userExists) {
        // Por segurança, não revelar se o email existe ou não
        return { success: true, message: 'Se este email estiver cadastrado, você receberá um link de recuperação' };
      }
      
      // Simular envio de email
      console.log(`Email de recuperação enviado para: ${email}`);
      
      return { success: true, message: 'Link de recuperação enviado para seu email!' };
      
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('Kaizen_user');
    localStorage.removeItem('Kaizen_token');
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