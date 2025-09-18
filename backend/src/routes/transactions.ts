import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransactionById 
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const createTransactionValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Valor deve ser numérico')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      return true;
    }),
  body('description')
    .isLength({ min: 3, max: 200 })
    .withMessage('Descrição deve ter entre 3 e 200 caracteres'),
  body('date')
    .isISO8601()
    .withMessage('Data inválida'),
  body('category')
    .isLength({ min: 2 })
    .withMessage('Categoria é obrigatória'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Tipo deve ser income ou expense'),
  body('paymentMethod')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Método de pagamento inválido'),
  body('status')
    .optional()
    .isIn(['pago', 'credito'])
    .withMessage('Status deve ser pago ou credito'),
];

const updateTransactionValidation = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('ID da transação é obrigatório'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Valor deve ser numérico')
    .custom((value) => {
      if (value !== undefined && value <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      return true;
    }),
  body('description')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Descrição deve ter entre 3 e 200 caracteres'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Data inválida'),
  body('category')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Categoria inválida'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Tipo deve ser income ou expense'),
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data de início inválida'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data de fim inválida'),
  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Tipo deve ser income ou expense'),
];

const paramValidation = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('ID da transação é obrigatório'),
];

// Rotas
router.get('/', queryValidation, getTransactions);
router.post('/', createTransactionValidation, createTransaction);
router.get('/:id', paramValidation, getTransactionById);
router.put('/:id', updateTransactionValidation, updateTransaction);
router.delete('/:id', paramValidation, deleteTransaction);

export default router;