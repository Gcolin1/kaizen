import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse, CreateTransactionRequest, UpdateTransactionRequest, TransactionFilters } from '../types/index';
import { TransactionService } from '../services/transactionService';
import { CategoryService } from '../services/categoryService';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { startDate, endDate, category, type, search, page = 1, limit = 10 }: TransactionFilters = req.query;

    let transactions;

    if (startDate && endDate) {
      transactions = await TransactionService.getTransactionsByDateRange(userId!, startDate, endDate);
    } else if (category) {
      transactions = await TransactionService.getTransactionsByCategory(userId!, category);
    } else {
      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const offset = (pageNum - 1) * limitNum;
      transactions = await TransactionService.getTransactionsByUserId(userId!, limitNum, offset);
    }

    let filteredTransactions = transactions;

    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    if (search) {
      filteredTransactions = filteredTransactions.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());

    const response: ApiResponse = {
      success: true,
      message: 'Transações recuperadas com sucesso',
      data: {
        transactions: filteredTransactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredTransactions.length,
          pages: Math.ceil(filteredTransactions.length / limitNum),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: 'Dados inválidos',
        errors: errors.array().map(err => err.msg),
      };
      res.status(400).json(response);
      return;
    }

    const userId = (req as any).user?.userId;
    const transactionData: CreateTransactionRequest = req.body;

    const category = await CategoryService.getCategoryById(transactionData.category);
    if (!category) {
      const response: ApiResponse = {
        success: false,
        message: 'Categoria não encontrada',
      };
      res.status(400).json(response);
      return;
    }

    const createData: any = {
      amount: Math.abs(transactionData.amount),
      description: transactionData.description,
      date: transactionData.date,
      category_id: transactionData.category,
      type: transactionData.type,
    };

    if (transactionData.paymentMethod) {
      createData.payment_method = transactionData.paymentMethod;
    }

    if (transactionData.status) {
      createData.status = transactionData.status;
    }

    const newTransaction = await TransactionService.createTransaction(userId!, createData);

    const response: ApiResponse = {
      success: true,
      message: 'Transação criada com sucesso',
      data: newTransaction,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: 'Dados inválidos',
        errors: errors.array().map(err => err.msg),
      };
      res.status(400).json(response);
      return;
    }

    const userId = (req as any).user?.userId;
    const { id } = req.params;
    const updateData: UpdateTransactionRequest = req.body;

    if (updateData.category) {
      const category = await CategoryService.getCategoryById(updateData.category);
      if (!category) {
        const response: ApiResponse = {
          success: false,
          message: 'Categoria não encontrada',
        };
        res.status(400).json(response);
        return;
      }
    }

    const updatePayload: any = {};

    if (updateData.amount !== undefined) {
      updatePayload.amount = Math.abs(updateData.amount);
    }
    if (updateData.description !== undefined) {
      updatePayload.description = updateData.description;
    }
    if (updateData.date !== undefined) {
      updatePayload.date = updateData.date;
    }
    if (updateData.category !== undefined) {
      updatePayload.category_id = updateData.category;
    }
    if (updateData.type !== undefined) {
      updatePayload.type = updateData.type;
    }
    if (updateData.paymentMethod !== undefined) {
      updatePayload.payment_method = updateData.paymentMethod;
    }
    if (updateData.status !== undefined) {
      updatePayload.status = updateData.status;
    }

    const updatedTransaction = await TransactionService.updateTransaction(id as string, userId!, updatePayload);

    const response: ApiResponse = {
      success: true,
      message: 'Transação atualizada com sucesso',
      data: updatedTransaction,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    await TransactionService.deleteTransaction(id as string, userId!);

    const response: ApiResponse = {
      success: true,
      message: 'Transação excluída com sucesso',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    const transaction = await TransactionService.getTransactionById(id as string, userId!);

    if (!transaction) {
      const response: ApiResponse = {
        success: false,
        message: 'Transação não encontrada',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Transação recuperada com sucesso',
      data: transaction,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};
