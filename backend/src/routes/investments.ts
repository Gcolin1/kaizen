import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { 
  getInvestments, 
  getInvestmentById, 
  simulateInvestment 
} from '@controllers/investmentController';
import { authenticateToken } from '@middleware/auth';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const queryValidation = [
  query('type')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Tipo de investimento inválido'),
  query('risk')
    .optional()
    .isIn(['baixo', 'medio', 'alto'])
    .withMessage('Risco deve ser baixo, medio ou alto'),
  query('minYield')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rentabilidade mínima deve ser um número positivo'),
  query('maxYield')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rentabilidade máxima deve ser um número positivo'),
  query('minInvestment')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Investimento mínimo deve ser um número positivo'),
  query('maxInvestment')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Investimento máximo deve ser um número positivo'),
];

const paramValidation = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('ID do investimento é obrigatório'),
];

const simulationValidation = [
  body('investmentId')
    .isLength({ min: 1 })
    .withMessage('ID do investimento é obrigatório'),
  body('amount')
    .isNumeric()
    .withMessage('Valor deve ser numérico')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      return true;
    }),
  body('months')
    .isInt({ min: 1, max: 600 })
    .withMessage('Período deve ser entre 1 e 600 meses'),
];

// Rotas
router.get('/', queryValidation, getInvestments);
router.get('/:id', paramValidation, getInvestmentById);
router.post('/simulate', simulationValidation, simulateInvestment);

export default router;