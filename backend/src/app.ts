import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar rotas
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import investmentRoutes from './routes/investments';
import analyticsRoutes from './routes/analytics';
import categoryRoutes from './routes/categories';

// Importar middlewares
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares globais
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS - aceitar múltiplas origens
const allowedOrigins = [
  'http://localhost:5173',
  'https://kaizenfinance.vercel.app',
  'https://kaizenfinance-7ijrzktwb-gcolin1s-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, etc)
    if (!origin) return callback(null, true);
    
    // Verificar se a origin está na lista permitida ou é do Vercel
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Permitir preflight OPTIONS sem contar no rate limiter
app.options('*', cors());

// Middleware para aplicar rate limiter apenas em requisições diferentes de OPTIONS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  limiter(req, res, next);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kaizen API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Test Supabase connection
app.get('/test-db', async (req, res) => {
  try {
    const { supabase } = require('./config/database');
    
    // Debug: verificar variáveis de ambiente
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_SERVICE_KEY presente:', !!process.env.SUPABASE_SERVICE_KEY);
    
    // Teste simples: listar tabelas
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.status(200).json({
      success: true,
      message: 'Supabase connection working!',
      data: data || []
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);

// Middleware de erro 404
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
