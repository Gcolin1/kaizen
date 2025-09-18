import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import { transactionsApi, categoriesApi } from '../services/api';
import { TransactionWithCategory, Category } from '../types';
import TransactionModal from './TransactionModal';

export default function CashFlow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<null | 'income' | 'expense'>(null);
  
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsResponse, categoriesResponse] = await Promise.all([
        transactionsApi.getAll(),
        categoriesApi.getAll()
      ]);

      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data?.transactions || []);
      } else {
        console.warn('Failed to load transactions:', transactionsResponse.message);
        setError(`Erro ao carregar transações: ${transactionsResponse.message}`);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      } else {
        console.warn('Failed to load categories:', categoriesResponse.message);
        setError(`Erro ao carregar categorias: ${categoriesResponse.message}`);
      }
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      
      if (error.message?.includes('Muitas tentativas')) {
        setError('Muitas requisições à API. Aguarde alguns minutos e recarregue a página.');
      } else if (retryCount < 2) {
        // Tentar novamente após 2 segundos (máximo 2 tentativas)
        setTimeout(() => {
          loadData(retryCount + 1);
        }, 2000 * (retryCount + 1));
        setError(`Tentando reconectar... (tentativa ${retryCount + 2}/3)`);
        return;
      } else {
        setError('Erro de conexão com o servidor. Verifique sua internet e recarregue a página.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category_id === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleSubmit = async (data: any) => {
    try {
      const response = await transactionsApi.create(data);
      if (response.success) {
        setModalType(null);
        setError(null);
        // Recarregar dados após criar transação
        await loadData();
      } else {
        setError(`Erro ao criar transação: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      if (error.message?.includes('Muitas tentativas')) {
        setError('Muitas requisições à API. Aguarde alguns minutos antes de tentar novamente.');
      } else {
        setError('Erro ao criar transação. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        const response = await transactionsApi.delete(id);
        if (response.success) {
          setError(null);
          // Recarregar dados após deletar transação
          await loadData();
        } else {
          setError(`Erro ao excluir transação: ${response.message}`);
        }
      } catch (error: any) {
        console.error('Error deleting transaction:', error);
        if (error.message?.includes('Muitas tentativas')) {
          setError('Muitas requisições à API. Aguarde alguns minutos antes de tentar novamente.');
        } else {
          setError('Erro ao excluir transação. Verifique sua conexão e tente novamente.');
        }
      }
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className={`border rounded-lg p-4 ${
          error.includes('Muitas requisições') 
            ? 'bg-red-50 border-red-200' 
            : error.includes('Tentando reconectar')
            ? 'bg-blue-50 border-blue-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {error.includes('Tentando reconectar') ? (
                <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className={`h-5 w-5 ${
                  error.includes('Muitas requisições') ? 'text-red-400' : 'text-yellow-400'
                }`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${
                error.includes('Muitas requisições') 
                  ? 'text-red-800' 
                  : error.includes('Tentando reconectar')
                  ? 'text-blue-800'
                  : 'text-yellow-800'
              }`}>{error}</p>
            </div>
            <div className="ml-auto pl-3">
              {!error.includes('Tentando reconectar') && (
                <div className="flex space-x-2">
                  {(error.includes('Muitas requisições') || error.includes('conexão')) && (
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
                    >
                      Recarregar
                    </button>
                  )}
                  <button 
                    onClick={() => setError(null)}
                    className={`${
                      error.includes('Muitas requisições') ? 'text-red-400 hover:text-red-600' : 'text-yellow-400 hover:text-yellow-600'
                    }`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p className="text-gray-600 mt-1">Gerencie suas transações financeiras</p>
        </div>
        <div className="flex space-x-4 mt-4 lg:mt-0">
          <button
            onClick={() => setModalType('income')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Receita</span>
          </button>
          <button
            onClick={() => setModalType('expense')}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {modalType && (
        <TransactionModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Entradas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                R$ {totalIncome.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Saídas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                R$ {totalExpense.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Saldo</p>
              <p className={`text-2xl font-bold mt-1 ${
                (totalIncome - totalExpense) >= 0 ? 'text-purple-600' : 'text-red-600'
              }`}>
                R$ {(totalIncome - totalExpense).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Transações ({filteredTransactions.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Nenhuma transação encontrada</p>
                <p className="text-gray-400 text-sm">Tente ajustar os filtros ou adicionar uma nova transação</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTransactions.map((transaction, index) => (
                  <div key={transaction.id} className={`p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors ${index === filteredTransactions.length - 1 ? 'border-b-0' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{transaction.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                              <Tag className="w-4 h-4" />
                              <span>{categories.find(c => c.id === transaction.category_id)?.name || 'Sem Categoria'}</span>
                            </span>
                            <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
