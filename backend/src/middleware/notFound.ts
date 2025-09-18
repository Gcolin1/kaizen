import { Request, Response } from 'express';
import { ApiResponse } from '../types/index'; // Corrigido: caminho relativo para o arquivo de tipos

export const notFound = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  };

  res.status(404).json(response);
};