import { Router } from 'express';
import { body } from 'express-validator';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validações para criação de categoria
const createCategoryValidation = [
  body('name')
    .isLength({ min: 2 })
    .withMessage('Nome da categoria deve ter pelo menos 2 caracteres'),
  body('type')
    .isIn(['income', 'expense', 'both'])
    .withMessage('Tipo deve ser income, expense ou both'),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('Cor deve ser um código hexadecimal válido'),
  body('icon')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Ícone deve ter pelo menos 1 caracter'),
];

// Validações para atualização de categoria
const updateCategoryValidation = [
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Nome da categoria deve ter pelo menos 2 caracteres'),
  body('type')
    .optional()
    .isIn(['income', 'expense', 'both'])
    .withMessage('Tipo deve ser income, expense ou both'),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('Cor deve ser um código hexadecimal válido'),
  body('icon')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Ícone deve ter pelo menos 1 caracter'),
];

// Todas as rotas de categorias são protegidas
router.use(authenticateToken);

// Rotas
router.get('/', getCategories);
router.post('/', createCategoryValidation, createCategory);
router.put('/:id', updateCategoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

export default router;