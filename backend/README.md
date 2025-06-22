# Conéctar - Backend (NestJS)

Sistema de gerenciamento de usuários desenvolvido em NestJS com TypeScript, PostgreSQL e JWT.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados
- **TypeORM** - ORM para TypeScript/JavaScript
- **JWT** - Autenticação e autorização
- **Swagger** - Documentação da API
- **bcrypt** - Criptografia de senhas
- **Jest** - Testes automatizados

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## 🔧 Instalação e Configuração

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar banco de dados:**
   - Crie um banco PostgreSQL chamado `conectar_db`
   - Configure as credenciais no arquivo `.env`

3. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

4. **Executar migrações (automático no desenvolvimento):**
   - O TypeORM está configurado para sincronizar automaticamente em desenvolvimento

## 🚦 Como Executar

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Testes
```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 📚 Documentação da API

A documentação da API está disponível via Swagger em:
```
http://localhost:3001/api
```

## 🛠️ Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação
│   ├── dto/           # Data Transfer Objects
│   ├── guards/        # Guards de autenticação
│   ├── strategies/    # Estratégias do Passport
│   └── ...
├── users/             # Módulo de usuários
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # Entidades do banco
│   └── ...
├── common/            # Utilitários compartilhados
└── config/            # Configurações
```

## 🔐 Autenticação e Autorização

### Papéis de Usuário
- **Admin**: Pode gerenciar todos os usuários
- **User**: Pode apenas visualizar e editar seus próprios dados

### Endpoints Principais

#### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register` - Registro

#### Usuários (requer autenticação)
- `GET /users` - Listar usuários (apenas admin)
- `GET /users/profile` - Perfil do usuário logado
- `PATCH /users/profile` - Atualizar perfil
- `GET /users/inactive` - Usuários inativos (apenas admin)
- `DELETE /users/:id` - Excluir usuário (apenas admin)

## 🧪 Testes

O projeto inclui testes automatizados para:
- Serviços (unit tests)
- Controladores (unit tests)
- Integração (e2e tests)

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT para autenticação
- Validação de dados com class-validator
- CORS configurado adequadamente
- Proteção contra SQL Injection via TypeORM

## 📝 Funcionalidades Implementadas

- ✅ Registro e login de usuários
- ✅ Autenticação JWT
- ✅ CRUD completo de usuários
- ✅ Controle de permissões (admin/user)
- ✅ Filtros e ordenação
- ✅ Listagem de usuários inativos
- ✅ Documentação Swagger
- ✅ Testes automatizados
- ✅ Validação de dados
- ✅ Criptografia de senhas
- ✅ Arquitetura modular e limpa

## 👥 Usuários de Teste

Ao iniciar a aplicação, são criados usuários de teste:

**Administrador:**
- Email: admin@conectar.com
- Senha: admin123

**Usuário Regular:**
- Email: user@conectar.com
- Senha: user123

## 🏗️ Decisões de Design e Arquitetura

### Escolha de Tecnologias
NestJS foi escolhido pelo suporte nativo a TypeScript, modularidade, integração fácil com TypeORM, JWT e Swagger. O uso de TypeORM facilita a modelagem e segurança do banco de dados. JWT foi adotado para autenticação stateless e escalável.

### Lógica de Inatividade
A lógica de inatividade considera usuários sem login nos últimos 30 dias, baseada no campo `lastLogin`. O endpoint `/users/inactive` retorna esses usuários para administração.

### Seeds e Usuários de Teste
Scripts de seed (`src/seed-admin.ts` e `src/seed-inactive-user.ts`) criam usuários admin e inativos automaticamente. Para rodar os seeds:
```bash
npx ts-node src/seed-admin.ts
npx ts-node src/seed-inactive-user.ts
```

### Autenticação e Permissões
A autenticação JWT protege todas as rotas sensíveis. Guards e decorators controlam o acesso por papel (`admin`/`user`).

### Segurança
- Senhas criptografadas com bcrypt
- Validação de dados com class-validator
- CORS restrito
- Proteção contra SQL Injection via TypeORM
- Tokens JWT com expiração

### Arquitetura Modular
O backend é dividido em módulos (auth, users, common), facilitando manutenção e testes.