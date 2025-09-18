import { Request, Response } from 'express';
import { ApiResponse, Investment } from '../types/index';

// Mock database - substituir por banco real
const investments: Investment[] = [
  {
    id: '1',
    name: 'CDB Banco Inter',
    type: 'CDB',
    yield: 12.5,
    minInvestment: 1000,
    risk: 'baixo',
    duration: '1-2 anos',
    description: 'CDB com liquidez diária e rentabilidade de 120% do CDI',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  // ... demais investimentos
];

export const getInvestments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, risk, minYield, maxYield, minInvestment, maxInvestment } = req.query;

    let filteredInvestments = investments.filter(inv => inv.isActive);

    if (type) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.type.toLowerCase() === (type as string).toLowerCase()
      );
    }

    if (risk) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.risk === risk
      );
    }

    if (minYield) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.yield >= parseFloat(minYield as string)
      );
    }

    if (maxYield) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.yield <= parseFloat(maxYield as string)
      );
    }

    if (minInvestment) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.minInvestment >= parseFloat(minInvestment as string)
      );
    }

    if (maxInvestment) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.minInvestment <= parseFloat(maxInvestment as string)
      );
    }

    filteredInvestments.sort((a, b) => b.yield - a.yield);

    const response: ApiResponse = {
      success: true,
      message: 'Investimentos recuperados com sucesso',
      data: {
        investments: filteredInvestments,
        summary: {
          total: filteredInvestments.length,
          byRisk: {
            baixo: filteredInvestments.filter(inv => inv.risk === 'baixo').length,
            medio: filteredInvestments.filter(inv => inv.risk === 'medio').length,
            alto: filteredInvestments.filter(inv => inv.risk === 'alto').length,
          },
          byType: filteredInvestments.reduce((acc: any, inv) => {
            acc[inv.type] = (acc[inv.type] || 0) + 1;
            return acc;
          }, {}),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    } as ApiResponse);
  }
};

export const getInvestmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const investment = investments.find(inv => inv.id === id && inv.isActive);

    if (!investment) {
      res.status(404).json({
        success: false,
        message: 'Investimento não encontrado',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Investimento recuperado com sucesso',
      data: investment,
    } as ApiResponse);
  } catch (error) {
    console.error('Erro ao buscar investimento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    } as ApiResponse);
  }
};

export const simulateInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { investmentId, amount, months } = req.body;

    if (!investmentId || !amount || !months) {
      res.status(400).json({
        success: false,
        message: 'ID do investimento, valor e período são obrigatórios',
      } as ApiResponse);
      return;
    }

    const investment = investments.find(inv => inv.id === investmentId && inv.isActive);

    if (!investment) {
      res.status(404).json({
        success: false,
        message: 'Investimento não encontrado',
      } as ApiResponse);
      return;
    }

    const investmentAmount = parseFloat(amount);
    const periodMonths = parseInt(months);

    if (investmentAmount < investment.minInvestment) {
      res.status(400).json({
        success: false,
        message: `Valor mínimo para este investimento é R$ ${investment.minInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      } as ApiResponse);
      return;
    }

    const monthlyRate = investment.yield / 100 / 12;
    const finalAmount = investmentAmount * Math.pow(1 + monthlyRate, periodMonths);
    const totalReturn = finalAmount - investmentAmount;
    const totalReturnPercentage = (totalReturn / investmentAmount) * 100;

    const simulation = {
      investment: {
        id: investment.id,
        name: investment.name,
        type: investment.type,
        yield: investment.yield,
        risk: investment.risk,
      },
      simulation: {
        initialAmount: investmentAmount,
        periodMonths,
        finalAmount: Math.round(finalAmount * 100) / 100,
        totalReturn: Math.round(totalReturn * 100) / 100,
        totalReturnPercentage: Math.round(totalReturnPercentage * 100) / 100,
        monthlyReturn: Math.round((totalReturn / periodMonths) * 100) / 100,
      },
      details: {
        monthlyRate: Math.round(monthlyRate * 10000) / 100,
        annualRate: investment.yield,
        riskLevel: investment.risk,
        minInvestment: investment.minInvestment,
      },
    };

    res.status(200).json({
      success: true,
      message: 'Simulação realizada com sucesso',
      data: simulation,
    } as ApiResponse);
  } catch (error) {
    console.error('Erro na simulação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    } as ApiResponse);
  }
};
