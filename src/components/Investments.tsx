import React, { useState } from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  Info, 
  Star,
  Filter,
  Search,
  ArrowUpRight,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import { investments } from '../data/mockData';

export default function Investments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('yield');

  const filteredInvestments = investments
    .filter(investment => {
      const matchesSearch = investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investment.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = selectedRisk === 'all' || investment.risk === selectedRisk;
      const matchesType = selectedType === 'all' || investment.type === selectedType;
      
      return matchesSearch && matchesRisk && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'yield') return b.yield - a.yield;
      if (sortBy === 'minInvestment') return a.minInvestment - b.minInvestment;
      return a.name.localeCompare(b.name);
    });

  const investmentTypes = [...new Set(investments.map(inv => inv.type))];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'baixo': return 'bg-green-100 text-green-800 border-green-200';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alto': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'baixo': return <Shield className="w-4 h-4" />;
      case 'medio': return <TrendingUp className="w-4 h-4" />;
      case 'alto': return <ArrowUpRight className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investimentos</h1>
          <p className="text-gray-600 mt-1">Descubra as melhores oportunidades de investimento</p>
        </div>
        <div className="flex space-x-4 mt-4 lg:mt-0">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Meus Favoritos</span>
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-purple-100 text-sm font-medium">Patrimônio Total</p>
            <p className="text-3xl font-bold mt-2">R$ 45.750</p>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-300" />
              <span className="text-green-300 text-sm font-medium ml-1">+8,5% este mês</span>
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm font-medium">Rendimento Médio</p>
            <p className="text-3xl font-bold mt-2">11,2%</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-green-300 text-sm font-medium ml-1">Acima da média</span>
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm font-medium">Produtos Ativos</p>
            <p className="text-3xl font-bold mt-2">4</p>
            <div className="flex items-center mt-2">
              <PiggyBank className="w-4 h-4 text-purple-200" />
              <span className="text-purple-200 text-sm font-medium ml-1">Diversificado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar investimento..."
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
            {investmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todos os riscos</option>
            <option value="baixo">Risco Baixo</option>
            <option value="medio">Risco Médio</option>
            <option value="alto">Risco Alto</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="yield">Maior Rendimento</option>
            <option value="minInvestment">Menor Investimento</option>
            <option value="name">Nome A-Z</option>
          </select>

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Investment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvestments.map((investment) => (
          <div key={investment.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <PiggyBank className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{investment.name}</h3>
                  <p className="text-purple-600 font-medium text-sm">{investment.type}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Star className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Rendimento anual</span>
                <span className="text-2xl font-bold text-green-600">{investment.yield}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Investimento mínimo</span>
                <span className="font-semibold text-gray-900">
                  R$ {investment.minInvestment.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Prazo</span>
                <div className="flex items-center space-x-1 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{investment.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(investment.risk)}`}>
                {getRiskIcon(investment.risk)}
                <span>Risco {investment.risk}</span>
              </div>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
                <Info className="w-4 h-4" />
                <span>Detalhes</span>
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-2">
              {investment.description}
            </p>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Investir</span>
              </button>
              <button className="px-4 py-3 border-2 border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInvestments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">Nenhum investimento encontrado</p>
          <p className="text-gray-400 text-sm">Tente ajustar os filtros de busca</p>
        </div>
      )}

      {/* Investment Tips */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dicas de Investimento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Diversifique</h3>
            <p className="text-gray-600 text-sm">
              Não coloque todos os ovos na mesma cesta. Diversifique seus investimentos para reduzir riscos.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Longo Prazo</h3>
            <p className="text-gray-600 text-sm">
              Investimentos de longo prazo tendem a apresentar melhores resultados devido ao poder dos juros compostos.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Reserva de Emergência</h3>
            <p className="text-gray-600 text-sm">
              Mantenha uma reserva de emergência antes de começar a investir em produtos de maior risco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}