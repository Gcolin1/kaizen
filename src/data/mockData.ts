import { Transaction, Investment, ChartData, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Alimentação', color: '#FF6B6B', icon: 'UtensilsCrossed' },
  { id: '2', name: 'Transporte', color: '#4ECDC4', icon: 'Car' },
  { id: '3', name: 'Lazer', color: '#45B7D1', icon: 'GamepadIcon' },
  { id: '4', name: 'Trabalho', color: '#96CEB4', icon: 'Briefcase' },
  { id: '5', name: 'Saúde', color: '#FFEAA7', icon: 'Heart' },
  { id: '6', name: 'Casa', color: '#DDA0DD', icon: 'Home' },
  { id: '7', name: 'Educação', color: '#98D8C8', icon: 'GraduationCap' },
  { id: '8', name: 'Outros', color: '#F7DC6F', icon: 'MoreHorizontal' },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    description: 'Salário Mensal',
    date: '2024-01-15',
    category: 'Trabalho',
    type: 'income'
  },
  {
    id: '2',
    amount: -1200,
    description: 'Aluguel',
    date: '2024-01-05',
    category: 'Casa',
    type: 'expense'
  },
  {
    id: '3',
    amount: -350,
    description: 'Supermercado',
    date: '2024-01-10',
    category: 'Alimentação',
    type: 'expense'
  },
  {
    id: '4',
    amount: 2500,
    description: 'Freelance Design',
    date: '2024-01-20',
    category: 'Trabalho',
    type: 'income'
  },
  {
    id: '5',
    amount: -180,
    description: 'Cinema e Jantar',
    date: '2024-01-12',
    category: 'Lazer',
    type: 'expense'
  },
  {
    id: '6',
    amount: -450,
    description: 'Gasolina',
    date: '2024-01-08',
    category: 'Transporte',
    type: 'expense'
  }
];

export const investments: Investment[] = [
  {
    id: '1',
    name: 'CDB Banco Inter',
    type: 'CDB',
    yield: 12.5,
    minInvestment: 1000,
    risk: 'baixo',
    duration: '1-2 anos',
    description: 'CDB com liquidez diária e rentabilidade de 120% do CDI'
  },
  {
    id: '2',
    name: 'LCI Santander',
    type: 'LCI',
    yield: 11.8,
    minInvestment: 5000,
    risk: 'baixo',
    duration: '2 anos',
    description: 'Letra de Crédito Imobiliário isenta de IR'
  },
  {
    id: '3',
    name: 'Tesouro Selic',
    type: 'Tesouro',
    yield: 10.9,
    minInvestment: 100,
    risk: 'baixo',
    duration: 'Flexível',
    description: 'Título público com liquidez diária'
  },
  {
    id: '4',
    name: 'FII Hospital',
    type: 'FII',
    yield: 8.5,
    minInvestment: 2000,
    risk: 'medio',
    duration: 'Indeterminado',
    description: 'Fundo de Investimento Imobiliário focado em hospitais'
  },
  {
    id: '5',
    name: 'Ações Petrobras',
    type: 'Ações',
    yield: 15.2,
    minInvestment: 500,
    risk: 'alto',
    duration: 'Indeterminado',
    description: 'Ações ordinárias da Petrobras com bom dividend yield'
  },
  {
    id: '6',
    name: 'CRA Agro',
    type: 'CRA',
    yield: 13.1,
    minInvestment: 3000,
    risk: 'medio',
    duration: '3 anos',
    description: 'Certificado de Recebíveis do Agronegócio'
  }
];

export const chartData: ChartData[] = [
  { month: 'Jan', income: 7500, expense: 2180, balance: 5320 },
  { month: 'Fev', income: 6200, expense: 2450, balance: 8070 },
  { month: 'Mar', income: 8100, expense: 2890, balance: 13280 },
  { month: 'Abr', income: 5800, expense: 2100, balance: 16980 },
  { month: 'Mai', income: 7200, expense: 2650, balance: 21530 },
  { month: 'Jun', income: 6900, expense: 2300, balance: 26130 },
];