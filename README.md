# Conéctar - Sistema de Gerenciamento de Usuários

Uma aplicação full-stack completa para gerenciamento de usuários, desenvolvida como parte do desafio técnico da Conéctar. O sistema oferece autenticação segura, controle de permissões e interface administrativa moderna.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Linguagem de programação tipada
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento SPA
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript/JavaScript
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas
- **Swagger** - Documentação da API
- **Jest** - Testes automatizados

## 📋 Funcionalidades

### Autenticação e Autorização
- ✅ Sistema de login com JWT
- ✅ Registro de novos usuários
- ✅ Controle de permissões (Admin/User)
- ✅ Proteção de rotas
- ✅ Logout seguro

### Gerenciamento de Usuários (Admin)
- ✅ Dashboard administrativo
- ✅ Listagem de todos os usuários
- ✅ Filtros por papel (admin/user)
- ✅ Ordenação por nome ou data
- ✅ Visualização de usuários inativos
- ✅ Exclusão de usuários
- ✅ Estatísticas do sistema

### Perfil do Usuário
- ✅ Visualização do perfil pessoal
- ✅ Edição de nome e senha
- ✅ Histórico de atividade
- ✅ Interface responsiva

### Segurança
- ✅ Senhas criptografadas (bcrypt)
- ✅ Tokens JWT seguros
- ✅ Validação de dados
- ✅ Proteção contra XSS
- ✅ CORS configurado

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/FabioToledo12/conectar-user-management
cd conectar-user-management
```

### 2. Instale as dependências
```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..
```

### 3. Configure o banco de dados
- Crie um banco PostgreSQL chamado `conectar_db`
- Configure as credenciais no arquivo `backend/.env`

### 4. Configure as variáveis de ambiente
```bash
cd backend
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 5. Execute a aplicação
```bash
# Executar frontend e backend simultaneamente
npm run dev

# Ou executar separadamente:
# Frontend: npm run dev:frontend
# Backend: npm run dev:backend
```

## 🌐 Acesso à Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Documentação Swagger**: http://localhost:3001/api

## 👥 Usuários de Teste

Para facilitar os testes, crie usuários com os seguintes dados:

**Administrador:**
- Email: admin@conectar.com
- Senha: admin123

**Usuário Regular:**
- Email: user@conectar.com
- Senha: user123

## 📚 Estrutura do Projeto

```
├── src/                    # Frontend (React)
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços de API
│   ├── store/             # Gerenciamento de estado
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários
└── backend/               # Backend (NestJS)
    ├── src/
    │   ├── auth/          # Módulo de autenticação
    │   ├── users/         # Módulo de usuários
    │   └── common/        # Utilitários compartilhados
    └── test/              # Testes automatizados
```

## 🧪 Testes

```bash
# Testes do backend
cd backend
npm run test        # Testes unitários
npm run test:cov    # Cobertura de testes
npm run test:e2e    # Testes end-to-end
```

## 📖 API Endpoints

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de novo usuário

### Usuários (Autenticação obrigatória)
- `GET /users` - Listar usuários (apenas admin)
- `GET /users/profile` - Perfil do usuário logado
- `PATCH /users/profile` - Atualizar perfil
- `GET /users/inactive` - Usuários inativos (apenas admin)
- `DELETE /users/:id` - Excluir usuário (apenas admin)

## 🔒 Segurança Implementada

- **Autenticação JWT**: Tokens seguros com expiração
- **Criptografia de Senhas**: bcrypt com salt
- **Validação de Dados**: class-validator no backend
- **Controle de Acesso**: Guards e middlewares
- **CORS**: Configuração adequada para produção
- **Sanitização**: Proteção contra injeção de código

## 🚀 Deploy

### Frontend (Netlify/Vercel)
```bash
npm run build
# Fazer upload da pasta dist/
```

### Backend (Heroku/Railway)
```bash
cd backend
npm run build
# Configurar variáveis de ambiente
# Deploy conforme documentação da plataforma
```

## 📈 Melhorias Futuras

- [ ] Integração com OAuth (Google, Microsoft)
- [ ] Sistema de notificações por email
- [ ] Logs de auditoria
- [ ] Exportação de dados
- [ ] Dashboard com gráficos
- [ ] Testes do frontend
- [ ] Paginação de usuários
- [ ] Filtros avançados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo.

## 📞 Contato

Desenvolvido para o desafio técnico da **Conéctar**.

---

⚡ **Powered by**: React + NestJS + TypeScript + PostgreSQL

## 🏗️ Decisões de Design e Arquitetura

### Arquitetura Geral
O sistema foi desenvolvido em arquitetura full-stack desacoplada, com frontend em React + TypeScript e backend em NestJS + TypeScript. A escolha por NestJS se deu pela robustez, modularidade e integração nativa com TypeORM, JWT e Swagger. O frontend utiliza React 18, com gerenciamento de estado via Zustand e formulários com React Hook Form, visando simplicidade e performance.

### Separação de Papéis e Permissões
A aplicação implementa dois papéis: `admin` e `user`. O backend controla permissões via guards e validações nos endpoints, garantindo que apenas admins possam acessar rotas sensíveis (CRUD de usuários, filtros, etc). O frontend exibe ou oculta funcionalidades conforme o papel do usuário autenticado.

### Lógica de Inatividade
Usuários são considerados inativos se não realizarem login nos últimos 30 dias. Essa lógica é implementada no backend, que expõe um endpoint específico para listar usuários inativos. O campo `lastLogin` é atualizado a cada login bem-sucedido.

### Seeds e Usuários de Teste
Scripts de seed (`backend/src/seed-admin.ts` e `backend/src/seed-inactive-user.ts`) automatizam a criação de usuários admin e inativos para facilitar testes e demonstrações. Para rodar os seeds:
```bash
cd backend
npx ts-node src/seed-admin.ts
npx ts-node src/seed-inactive-user.ts
```

### Autenticação JWT
A autenticação é baseada em JWT, com tokens armazenados no localStorage do frontend. O backend utiliza guards para proteger rotas e valida a expiração dos tokens. O frontend redireciona automaticamente para login em caso de token inválido ou expirado.

### Segurança
- Senhas são criptografadas com bcrypt.
- Validação de dados rigorosa com class-validator.
- CORS restrito às origens do frontend.
- Proteção contra SQL Injection via TypeORM.
- Tokens JWT com expiração e renovação via login.

### Arquitetura Modular
O backend segue o padrão modular do NestJS, separando autenticação, usuários e utilitários. O frontend organiza componentes, hooks, serviços e páginas em pastas distintas, facilitando manutenção e escalabilidade.

### Decisões de UI/UX
A interface utiliza Tailwind CSS para garantir responsividade e agilidade no desenvolvimento. O dashboard administrativo é acessível apenas para admins, e o sistema de feedback utiliza React Hot Toast para notificações claras ao usuário.

## 🧑‍💻 Build e Testes do Frontend

### Build
```bash
npm run build
```
O build será gerado na pasta `dist/`.

### Testes
Atualmente, os testes automatizados estão concentrados no backend. Para rodar testes do backend:
```bash
cd backend
npm run test
```