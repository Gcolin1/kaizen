import React, { useState } from 'react';
import { 
  Calculator as CalculatorIcon, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Percent,
  Target,
  PiggyBank,
  RefreshCw
} from 'lucide-react';

interface CalculationResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  monthlyData: Array<{
    month: number;
    invested: number;
    interest: number;
    total: number;
  }>;
}

export default function Calculator() {
  const [calculatorType, setCalculatorType] = useState<'compound' | 'goal' | 'retirement'>('compound');
  const [values, setValues] = useState({
    initialAmount: 1000,
    monthlyAmount: 500,
    interestRate: 12,
    timeInMonths: 12,
    goalAmount: 100000,
    currentAge: 30,
    retirementAge: 60
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateCompoundInterest = () => {
    const { initialAmount, monthlyAmount, interestRate, timeInMonths } = values;
    const monthlyRate = interestRate / 100 / 12;
    
    let totalAmount = initialAmount;
    let totalInvested = initialAmount;
    const monthlyData = [];

    for (let month = 1; month <= timeInMonths; month++) {
      totalAmount = totalAmount * (1 + monthlyRate) + monthlyAmount;
      totalInvested += monthlyAmount;
      
      monthlyData.push({
        month,
        invested: totalInvested,
        interest: totalAmount - totalInvested,
        total: totalAmount
      });
    }

    setResult({
      finalAmount: totalAmount,
      totalInvested,
      totalInterest: totalAmount - totalInvested,
      monthlyData: monthlyData.slice(-12) // Show last 12 months
    });
  };

  const calculateGoalAmount = () => {
    const { goalAmount, interestRate, timeInMonths } = values;
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate required monthly investment
    const requiredMonthly = goalAmount * monthlyRate / (Math.pow(1 + monthlyRate, timeInMonths) - 1);
    
    // Generate projection
    let totalAmount = 0;
    let totalInvested = 0;
    const monthlyData = [];

    for (let month = 1; month <= timeInMonths; month++) {
      totalAmount = totalAmount * (1 + monthlyRate) + requiredMonthly;
      totalInvested += requiredMonthly;
      
      monthlyData.push({
        month,
        invested: totalInvested,
        interest: totalAmount - totalInvested,
        total: totalAmount
      });
    }

    setResult({
      finalAmount: totalAmount,
      totalInvested,
      totalInterest: totalAmount - totalInvested,
      monthlyData: monthlyData.slice(-12)
    });
  };

  const handleCalculate = () => {
    if (calculatorType === 'compound') {
      calculateCompoundInterest();
    } else if (calculatorType === 'goal') {
      calculateGoalAmount();
    }
  };

  const calculatorTypes = [
    { id: 'compound', name: 'Juros Compostos', icon: TrendingUp },
    { id: 'goal', name: 'Meta Financeira', icon: Target },
    { id: 'retirement', name: 'Aposentadoria', icon: PiggyBank },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculadora Financeira</h1>
          <p className="text-gray-600 mt-1">Simule seus investimentos e planeje seu futuro</p>
        </div>
      </div>

      {/* Calculator Type Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-4">
          {calculatorTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setCalculatorType(type.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  calculatorType === type.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{type.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <CalculatorIcon className="w-6 h-6 text-purple-600" />
            <span>Parâmetros da Simulação</span>
          </h2>

          <div className="space-y-6">
            {calculatorType === 'compound' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Inicial (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={values.initialAmount}
                      onChange={(e) => setValues({...values, initialAmount: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aporte Mensal (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={values.monthlyAmount}
                      onChange={(e) => setValues({...values, monthlyAmount: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                </div>
              </>
            )}

            {calculatorType === 'goal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Financeira (R$)
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={values.goalAmount}
                    onChange={(e) => setValues({...values, goalAmount: Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="100000"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Juros Anual (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.1"
                  value={values.interestRate}
                  onChange={(e) => setValues({...values, interestRate: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período (meses)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={values.timeInMonths}
                  onChange={(e) => setValues({...values, timeInMonths: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="12"
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Calcular</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resultados da Simulação</h2>

          {result ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Valor Final</p>
                      <p className="text-2xl font-bold">
                        R$ {result.finalAmount.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Investido</p>
                      <p className="text-2xl font-bold">
                        R$ {result.totalInvested.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Juros Ganhos</p>
                      <p className="text-2xl font-bold">
                        R$ {result.totalInterest.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                    <Percent className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Goal-specific result */}
              {calculatorType === 'goal' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    <p className="font-bold text-yellow-800">Aporte Necessário</p>
                  </div>
                  <p className="text-yellow-700">
                    Para atingir sua meta de R$ {values.goalAmount.toLocaleString('pt-BR')} em {values.timeInMonths} meses,
                    você precisa investir aproximadamente <strong>R$ {(values.goalAmount * (values.interestRate / 100 / 12) / (Math.pow(1 + values.interestRate / 100 / 12, values.timeInMonths) - 1)).toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}</strong> por mês.
                  </p>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-4">Métricas de Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retorno total:</span>
                    <span className="font-bold text-green-600">
                      {((result.totalInterest / result.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo de duplicação:</span>
                    <span className="font-bold text-purple-600">
                      {(Math.log(2) / Math.log(1 + values.interestRate / 100 / 12)).toFixed(0)} meses
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Juros sobre investido:</span>
                    <span className="font-bold text-blue-600">
                      {((result.totalInterest / result.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalculatorIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Realize uma simulação</p>
              <p className="text-gray-400 text-sm">Preencha os campos e clique em "Calcular" para ver os resultados</p>
            </div>
          )}
        </div>
      </div>

      {/* Investment Tips */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Dicas para Potencializar seus Investimentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <TrendingUp className="w-8 h-8 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Comece Cedo</h3>
            <p className="text-purple-100 text-sm">
              O tempo é seu maior aliado. Quanto antes você começar a investir, mais os juros compostos trabalharão a seu favor.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <Calendar className="w-8 h-8 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Seja Consistente</h3>
            <p className="text-purple-100 text-sm">
              Aportes regulares, mesmo que pequenos, podem gerar grandes resultados ao longo do tempo.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <Target className="w-8 h-8 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Defina Metas</h3>
            <p className="text-purple-100 text-sm">
              Ter objetivos claros ajuda a manter o foco e a disciplina necessária para investir regularmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}