import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types/index';
import { CategoryService } from '../services/categoryService';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;

    let categories;
    if (type && (type === 'income' || type === 'expense' || type === 'both')) {
      categories = await CategoryService.getCategoriesByType(type as 'income' | 'expense' | 'both');
    } else {
      categories = await CategoryService.getAllCategories();
    }

    const response: ApiResponse = {
      success: true,
      message: 'Categorias recuperadas com sucesso',
      data: categories,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
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

    const categoryData = req.body;
    const newCategory = await CategoryService.createCategory(categoryData);

    const response: ApiResponse = {
      success: true,
      message: 'Categoria criada com sucesso',
      data: newCategory,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
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

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: 'ID é obrigatório' });
      return;
    }

    const updateData = req.body;
    const updatedCategory = await CategoryService.updateCategory(id, updateData);

    const response: ApiResponse = {
      success: true,
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: 'ID é obrigatório' });
      return;
    }

    await CategoryService.deleteCategory(id);

    const response: ApiResponse = {
      success: true,
      message: 'Categoria excluída com sucesso',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    const response: ApiResponse = {
      success: false,
      message: (error as Error).message || 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};
