// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse, AuthTokenPayload } from '../types'; // corrigido o import

// Estender interface do Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Token de acesso requerido',
      };
      res.status(401).json(response);
      return;
    }

    try {
      // Versão síncrona do jwt.verify para simplificar o fluxo
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as AuthTokenPayload;
      req.user = decoded;
      next();
    } catch (err: any) {
      let message = 'Token inválido';

      if (err.name === 'TokenExpiredError') {
        message = 'Token expirado';
      } else if (err.name === 'JsonWebTokenError') {
        message = 'Token malformado';
      }

      const response: ApiResponse = {
        success: false,
        message,
      };
      res.status(403).json(response);
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Erro interno do servidor',
    };
    res.status(500).json(response);
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = req.user?.role;

      if (!userRole || !roles.includes(userRole)) {
        const response: ApiResponse = {
          success: false,
          message: 'Acesso negado. Permissões insuficientes.',
        };
        res.status(403).json(response);
        return;
      }

      next();
    } catch (error) {
      console.error('Erro na autorização:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  };
};
