import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, forgotPassword, getProfile } from '@controllers/authController';
import { authenticateToken } from '@middleware/auth';

const router = Router();

// Validações
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
];

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Senhas não coincidem');
      }
      return true;
    }),
  body('companyName')
    .isLength({ min: 2 })
    .withMessage('Nome da empresa deve ter pelo menos 2 caracteres'),
  body('cnpj')
    .optional()
    .isLength({ min: 11 })
    .withMessage('CNPJ deve ter pelo menos 11 caracteres'),
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
];

// Rotas públicas
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);

// Rotas protegidas
router.get('/profile', authenticateToken, getProfile);

export default router;