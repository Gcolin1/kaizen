import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus,
  PiggyBank,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { transactions, investments} from '../data/mockData';
import TransactionModal from './TransactionModal';

export default function Dashboard() {
  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const [modalType, setModalType] = useState<null | 'income' | 'expense'>(null);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpense;
  const topInvestments = investments.slice(0, 3);
  const recentTransactions = transactions.slice(0, 5);

  const handleSubmit = (data: void) => {
    console.log('Nova transação:', data);
    setModalType(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 capitalize">Resumo de {currentMonth}</p>
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

      {/* Se o modal estiver ativo */}
      {modalType && (
        <TransactionModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Entradas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                R$ {totalIncome.toLocaleString('pt-BR')}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-sm font-medium ml-1">+12,5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Saídas</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                R$ {totalExpense.toLocaleString('pt-BR')}
              </p>
              <div className="flex items-center mt-2">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm font-medium ml-1">-8,2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Saldo Atual</p>
              <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                R$ {balance.toLocaleString('pt-BR')}
              </p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-purple-500 text-sm font-medium ml-1">Meta: 70%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transações Recentes</h2>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Investments */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Melhores Investimentos</h2>
          </div>
          
          <div className="space-y-4">
            {topInvestments.map((investment) => (
              <div key={investment.id} className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <PiggyBank className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{investment.name}</p>
                      <p className="text-sm text-gray-500">{investment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{investment.yield}%</p>
                    <p className="text-xs text-gray-500">ao ano</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    investment.risk === 'baixo' ? 'bg-green-100 text-green-800' :
                    investment.risk === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Risco {investment.risk}
                  </span>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Investir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/*<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold mb-2">Organize suas finanças</h2>
            <p className="text-purple-100">
              Acompanhe seus gastos, invista com inteligência e alcance seus objetivos financeiros.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Planejar Mês</span>
            </button>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Definir Meta</span>
            </button>
          </div>
        </div>
      </div>*/}
    </div>
  );
}