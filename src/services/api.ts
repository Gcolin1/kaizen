const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  cnpj?: string;
}

interface CreateTransactionData {
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
  paymentMethod?: string;
  status?: 'pago' | 'credito';
}

// Auth token management
const getAuthToken = () => localStorage.getItem('authToken');

const getAuthHeaders = () => {
  const authToken = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` })
  };
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authApi = {
  login: async (loginData: LoginData) => {
    const response = await apiCall<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    if (response.success && response.data?.token) {
      
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  },

  register: async (registerData: RegisterData) => {
    const response = await apiCall<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    
    if (response.success && response.data?.token) {
      
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  },

  logout: () => {
    
    localStorage.removeItem('authToken');
  },

  getProfile: () => apiCall('/auth/profile'),
};

// Transactions API
export const transactionsApi = {
  getAll: (params?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    type?: 'income' | 'expense';
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },

  getById: (id: string) => apiCall(`/transactions/${id}`),

  create: (transactionData: CreateTransactionData) =>
    apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),

  update: (id: string, transactionData: Partial<CreateTransactionData>) =>
    apiCall(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }),

  delete: (id: string) =>
    apiCall(`/transactions/${id}`, {
      method: 'DELETE',
    }),
};

// Categories API
export const categoriesApi = {
  getAll: () => {
    return apiCall("/categories/", {
      method: 'GET',
    });
  },

  create: (categoryData: {
    name: string;
    color?: string;
    icon?: string;
    type: 'income' | 'expense' | 'both';
  }) =>
    apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),

  update: (id: string, categoryData: Partial<{
    name: string;
    color: string;
    icon: string;
    type: 'income' | 'expense' | 'both';
  }>) =>
    apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),

  delete: (id: string) =>
    apiCall(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

// Analytics API
export const analyticsApi = {
  getSummary: () => apiCall('/analytics/summary'),
  getChartData: () => apiCall('/analytics/charts'),
  getGoals: () => apiCall('/analytics/goals'),
};

// Investments API
export const investmentsApi = {
  getAll: () => apiCall('/investments'),
  getUserInvestments: () => apiCall('/investments/user'),
  
  invest: (investmentData: {
    investmentId: string;
    investedAmount: number;
    startDate: string;
    expectedEndDate: string;
    expectedReturn: number;
  }) =>
    apiCall('/investments/user', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    }),

  updateUserInvestment: (id: string, status: 'active' | 'completed' | 'cancelled') =>
    apiCall(`/investments/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};