import { Router } from 'express';
import { query } from 'express-validator';
import { 
  getSummary, 
  getChartData, 
  getGoals 
} from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const summaryValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data de início inválida'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data de fim inválida'),
];

const chartValidation = [
  query('period')
    .optional()
    .isIn(['3months', '6months', '1year', '2years'])
    .withMessage('Período deve ser 3months, 6months, 1year ou 2years'),
  query('type')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Tipo deve ser daily, weekly, monthly ou yearly'),
];

// Rotas
router.get('/summary', summaryValidation, getSummary);
router.get('/charts', chartValidation, getChartData);
router.get('/goals', getGoals);

export default router;