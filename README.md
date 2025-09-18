# Sistema Kaizen - Gestão Financeira

Sistema completo de gestão financeira empresarial desenvolvido com React + TypeScript (frontend) e Node.js + Express (backend).

## 📁 Estrutura do Projeto

```
project/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Middlewares de segurança
│   │   ├── routes/          # Rotas da API
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   ├── package.json
│   └── README.md
├── src/                    # Frontend React + TypeScript
│   ├── components/         # Componentes React
│   ├── contexts/           # Context API
│   ├── data/              # Dados mock
│   └── types/             # Tipos TypeScript
├── package.json           # Frontend dependencies
└── README.md
```

## 🚀 Como Executar

### Frontend (React + Vite)
```bash
# Na pasta raiz do projeto
npm install
npm run dev
# Acesse: http://localhost:5173
```

### Backend (Node.js + Express)
```bash
# Na pasta backend
cd backend
npm install
cp .env.example .env
npm run dev
# API disponível em: http://localhost:3001
```

## 🔗 Integração Frontend-Backend

### Configuração CORS
O backend está configurado para aceitar requisições do frontend em `http://localhost:5173`.

### Endpoints Disponíveis
- **Auth**: `http://localhost:3001/api/auth/*`
- **Transactions**: `http://localhost:3001/api/transactions/*`
- **Investments**: `http://localhost:3001/api/investments/*`
- **Analytics**: `http://localhost:3001/api/analytics/*`

### Migração dos Dados Mock
Para conectar o frontend com o backend:

1. **Substitua o AuthContext** para usar API real:
```typescript
// Em src/contexts/AuthContext.tsx
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

2. **Atualize os componentes** para buscar dados da API:
```typescript
// Exemplo para Dashboard
useEffect(() => {
  fetch('http://localhost:3001/api/analytics/summary', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setDashboardData(data));
}, []);
```

## 🛠️ Tecnologias

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Recharts 2.8.0

### Backend
- Node.js + Express
- TypeScript
- JWT Authentication
- bcryptjs
- express-validator

## 📚 Documentação

- **Frontend**: Documentação técnica em `DOCUMENTACAO_TECNICA.md`
- **Backend**: Documentação da API em `backend/README.md`

## 🔒 Segurança

- JWT Authentication
- Password hashing
- Rate limiting
- CORS configurado
- Input validation
- Security headers

## 🎯 Próximos Passos

1. **Conectar Frontend ↔ Backend**: Substituir dados mock por chamadas API
2. **Implementar Banco de Dados**: PostgreSQL ou MongoDB
3. **Deploy**: Configurar produção
4. **Testes**: Implementar testes unitários e e2e

## 📄 Licença

MIT