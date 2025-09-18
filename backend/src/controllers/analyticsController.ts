import { Request, Response } from 'express';
import { ApiResponse } from '../types/index';
import { AnalyticsService } from '../services/analyticsService';

export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    const dashboardMetrics = await AnalyticsService.getDashboardMetrics(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Resumo financeiro recuperado com sucesso',
      data: {
        financial: {
          totalIncome: dashboardMetrics.total_income,
          totalExpense: dashboardMetrics.total_expenses,
          balance: dashboardMetrics.balance,
          transactionCount: dashboardMetrics.transactions_count,
        },
        categories: {
          distribution: dashboardMetrics.categories_distribution,
        },
        monthlyTrend: dashboardMetrics.monthly_trend,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    const dashboardMetrics = await AnalyticsService.getDashboardMetrics(userId);
    const chartData = dashboardMetrics.monthly_trend;

    // Garantir valores válidos
    const incomes = chartData.map(d => d.income ?? 0);
    const expenses = chartData.map(d => d.expenses ?? 0);

    const avgIncome = incomes.length > 0 ? incomes.reduce((a, b) => a + b, 0) / incomes.length : 0;
    const avgExpense = expenses.length > 0 ? expenses.reduce((a, b) => a + b, 0) / expenses.length : 0;

    // Tendência segura (último vs primeiro)
    const incomeTrend =
      incomes.length > 1 && incomes[0] !== 0
        ? ((incomes[incomes.length - 1] ?? 0) - (incomes[0] ?? 0)) / (incomes[0] ?? 1) * 100
        : 0;

    const expenseTrend =
      expenses.length > 1 && expenses[0] !== 0
        ? ((expenses[expenses.length - 1] ?? 0) - (expenses[0] ?? 0)) / (expenses[0] ?? 1) * 100
        : 0;

    const analytics = {
      chartData,
      trends: {
        income: {
          average: Math.round(avgIncome),
          trend: Math.round(incomeTrend * 100) / 100,
          direction: incomeTrend >= 0 ? 'up' : 'down',
        },
        expense: {
          average: Math.round(avgExpense),
          trend: Math.round(expenseTrend * 100) / 100,
          direction: expenseTrend >= 0 ? 'up' : 'down',
        },
      },
      period: {
        months: chartData.length,
        startMonth: chartData[0]?.month,
        endMonth: chartData[chartData.length - 1]?.month,
      },
    };

    const response: ApiResponse = {
      success: true,
      message: 'Dados de gráfico recuperados com sucesso',
      data: analytics,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao gerar dados de gráfico:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const getGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    // Mock de metas financeiras
    const goals = [
      {
        id: '1',
        title: 'Reserva de Emergência',
        description: 'Acumular 6 meses de gastos',
        targetAmount: 15000,
        currentAmount: 8500,
        targetDate: '2024-12-31',
        category: 'emergencia',
        status: 'em_progresso',
      },
      {
        id: '2',
        title: 'Viagem de Férias',
        description: 'Economizar para viagem em família',
        targetAmount: 8000,
        currentAmount: 3200,
        targetDate: '2024-07-15',
        category: 'lazer',
        status: 'em_progresso',
      },
    ];

    const goalsWithProgress = goals.map(goal => ({
      ...goal,
      progress: Math.round((goal.currentAmount / goal.targetAmount) * 100),
      remaining: goal.targetAmount - goal.currentAmount,
      daysRemaining: Math.ceil(
        (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

    const response: ApiResponse = {
      success: true,
      message: 'Metas recuperadas com sucesso',
      data: {
        goals: goalsWithProgress,
        summary: {
          total: goals.length,
          completed: goals.filter(g => g.status === 'concluida').length,
          inProgress: goals.filter(g => g.status === 'em_progresso').length,
          totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
          totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};
