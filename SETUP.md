# 🚀 Setup e Execução - API PokeManager

## Pré-requisitos

- Node.js 26+ ou Docker Desktop
- npm ou yarn

## Instalação Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

API estará disponível em: `http://localhost:3333`

## Com Docker Compose

### 1. Build da imagem
```bash
docker-compose up --build
```

### 2. Serviços disponíveis

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| API | http://localhost:3333 | - |
| Docs (Swagger) | http://localhost:3333/api/docs | - |
| PostgreSQL | localhost:5432 | manager/password |
| pgAdmin | http://localhost:8080 | admin@manager.com/adminpassword |

### 3. Comandos úteis

```bash
# Parar os containers
docker-compose down

# Ver logs
docker-compose logs -f api

# Acessar PostgreSQL
docker exec -it manager_postgres psql -U manager -d manager_db
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia com hot-reload

# Build
npm run build        # Compila TypeScript para dist/

# Linting
npm run lint         # Executa ESLint
```

## Estrutura do Projeto

```
src/
├── domain/           # Entidades e interfaces
│   ├── entities/
│   └── repositories/
├── application/      # Use cases e lógica de negócio
│   └── use-cases/
├── infrastructure/   # Database, HTTP, external services
│   ├── database/
│   ├── http/
│   └── config/
└── main/             # Entry point
    ├── server.ts
    └── factories/
```

## Troubleshooting

### "Port 3333 is already in use"
```bash
# Mudar porta no docker-compose
PORT=3334 docker-compose up
```

### "Connection refused to PostgreSQL"
```bash
# Aguardar PostgreSQL iniciar (healthcheck)
docker-compose logs postgres
```

### Limpar tudo
```bash
docker-compose down -v  # Remove volumes também
```
