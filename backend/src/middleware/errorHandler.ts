import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index'; // Corrigido: importar do caminho correto

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response<ApiResponse> => { // Garantindo que sempre retorna Response
  // Log do erro para debugging
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  let response: ApiResponse;

  // Erro de validação do express-validator
  if (err.name === 'ValidationError') {
    response = {
      success: false,
      message: 'Dados inválidos',
      errors: [err.message],
    };
    return res.status(400).json(response);
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    response = {
      success: false,
      message: 'Token inválido ou expirado',
    };
    return res.status(401).json(response);
  }

  // Erro de sintaxe JSON
  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    response = {
      success: false,
      message: 'Formato JSON inválido',
    };
    return res.status(400).json(response);
  }

  // Erro operacional personalizado
  if (err.isOperational) {
    response = {
      success: false,
      message: err.message,
    };
    return res.status(err.statusCode || 500).json(response);
  }

  // Erro genérico
  response = {
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err.message,
  };

  return res.status(err.statusCode || 500).json(response);
};

// Cria um erro operacional
export const createAppError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// Wrapper para funções async
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
