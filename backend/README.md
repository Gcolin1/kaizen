# Kaizen Backend API

API RESTful para o sistema de gestão financeira Kaizen, desenvolvida em Node.js com TypeScript.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem de programação
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Segurança HTTP headers
- **morgan** - Logger de requisições
- **compression** - Compressão de respostas

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── middleware/      # Middlewares customizados
│   ├── models/         # Modelos de dados (futuro)
│   ├── routes/         # Definição das rotas
│   ├── services/       # Lógica de negócio (futuro)
│   ├── types/          # Definições TypeScript
│   ├── utils/          # Utilitários e helpers
│   └── app.ts          # Configuração principal do Express
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Instalação e Configuração

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### 3. Executar em desenvolvimento
```bash
npm run dev
```

### 4. Build para produção
```bash
npm run build
npm start
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de nova empresa
- `POST /api/auth/forgot-password` - Recuperação de senha
- `GET /api/auth/profile` - Perfil do usuário (protegido)

### Transações
- `GET /api/transactions` - Listar transações (protegido)
- `POST /api/transactions` - Criar transação (protegido)
- `GET /api/transactions/:id` - Buscar transação por ID (protegido)
- `PUT /api/transactions/:id` - Atualizar transação (protegido)
- `DELETE /api/transactions/:id` - Excluir transação (protegido)

### Investimentos
- `GET /api/investments` - Listar investimentos disponíveis (protegido)
- `GET /api/investments/:id` - Buscar investimento por ID (protegido)
- `POST /api/investments/simulate` - Simular investimento (protegido)

### Analytics
- `GET /api/analytics/summary` - Resumo financeiro (protegido)
- `GET /api/analytics/charts` - Dados para gráficos (protegido)
- `GET /api/analytics/goals` - Metas financeiras (protegido)

### Health Check
- `GET /health` - Status da API

## 🔒 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu_jwt_token>
```

## 📋 Exemplos de Uso

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "123456"
  }'
```

### Criar Transação
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 1500,
    "description": "Venda de produto",
    "date": "2024-01-15",
    "category": "Trabalho",
    "type": "income",
    "paymentMethod": "Pix"
  }'
```

### Listar Transações com Filtros
```bash
curl "http://localhost:3001/api/transactions?type=income&startDate=2024-01-01&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

## 🗃️ Estrutura de Resposta

Todas as respostas seguem o padrão:

```json
{
  "success": boolean,
  "message": "string",
  "data": any,
  "errors": ["array de erros"] // opcional
}
```

## 🛡️ Segurança

- **Helmet** - Headers de segurança HTTP
- **CORS** - Configurado para frontend específico
- **Rate Limiting** - Limitação de requisições por IP
- **Input Validation** - Validação rigorosa de dados
- **JWT Authentication** - Tokens seguros com expiração
- **Password Hashing** - Senhas hasheadas com bcrypt

## 📊 Validações

### Transações
- Amount: Numérico, maior que 0
- Description: 3-200 caracteres
- Date: Formato ISO8601
- Type: 'income' ou 'expense'
- Category: Obrigatória

### Usuário
- Email: Formato válido
- Password: Mínimo 6 caracteres
- CNPJ: Formato 00.000.000/0001-00

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Executar em desenvolvimento com hot-reload
npm run build    # Build para produção
npm start        # Executar build de produção
npm run lint     # Verificar código com ESLint
npm run lint:fix # Corrigir problemas do ESLint automaticamente
npm test         # Executar testes (quando implementados)
```

## 🚧 Próximos Passos

### Banco de Dados
1. Escolher e configurar banco (PostgreSQL/MongoDB)
2. Implementar ORM/ODM (Prisma/Mongoose)
3. Criar migrations e seeds
4. Substituir dados mock por consultas reais

### Funcionalidades
1. Upload de arquivos/imagens
2. Envio de emails
3. Relatórios em PDF
4. Backup automático
5. Logs estruturados

### Testes
1. Testes unitários (Jest)
2. Testes de integração
3. Testes e2e
4. Coverage reports

### DevOps
1. Docker containers
2. CI/CD pipeline
3. Monitoramento
4. Deploy automatizado

## 📈 Monitoramento

Para monitoramento em produção, considere implementar:
- Health checks avançados
- Métricas de performance
- Logs estruturados
- Alertas automáticos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.