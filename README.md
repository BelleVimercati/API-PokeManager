# PokéManager API

![Node.js](https://img.shields.io/badge/Node.js-v20+-green?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-v5.9+-blue?logo=typescript) ![Express](https://img.shields.io/badge/Express-v5.2+-black?logo=express) ![Architecture](https://img.shields.io/badge/Architecture-Clean-brightgreen) ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger)

## 📋 Descrição do Projeto

A **PokéManager API** é uma aplicação backend moderna desenvolvida com Node.js, TypeScript e Express seguindo os princípios de **Clean Architecture**. O objetivo é permitir que treinadores Pokémon realizem cadastros e gerenciem suas coleções de forma intuitiva.

**Entrega 1 (Atual):** Criação da estrutura base com Clean Architecture e gerenciamento do catálogo local em memória.

---

## 🏗️ Arquitetura

O projeto segue a **Clean Architecture** com separação rigorosa de camadas:

```
src/
├── domain/                          # Camada de Domínio (Regras de Negócio)
│   ├── entities/
│   │   └── Pokemon.ts              # Entidade Pokemon
│   ├── repositories/
│   │   └── IPokemonRepository.ts   # Interface do Repositório
│   └── errors/
│       └── app.error.ts            # Erros de Domínio
│
├── application/                     # Camada de Aplicação (Casos de Uso)
│   └── use-cases/
│       ├── CreatePokemonUseCase.ts
│       ├── ListPokemonUseCase.ts
│       ├── GetPokemonByIdUseCase.ts
│       ├── UpdatePokemonUseCase.ts
│       └── DeletePokemonUseCase.ts
│
├── infrastructure/                  # Camada de Infraestrutura (Implementações)
│   ├── database/in-memory/
│   │   └── InMemoryPokemonRepository.ts  # Repositório em Memória
│   └── http/
│       ├── controllers/
│       │   └── PokemonController.ts
│       ├── middlewares/
│       │   └── errorHandler.ts
│       ├── routes/
│       │   └── pokemons.routes.ts
│       └── docs/
│           └── openapi.json        # Documentação Swagger
│
└── main/                            # Camada Main (Composição & Entrada)
    ├── server.ts                   # Ponto de entrada
    └── config/
        └── swagger.ts              # Configuração do Swagger
```

### Princípios Arquiteturais:
- **Separação de Responsabilidades:** Cada camada tem um propósito bem definido
- **Inversão de Dependência:** A aplicação depende de interfaces, não de implementações
- **Testabilidade:** Componentes isolados e independentes
- **Manutenibilidade:** Fácil evolução (ex.: trocar repositório em memória por banco de dados)

---

## 🛠️ Tech Stack

| Aspecto | Ferramenta |
|---------|-----------|
| **Runtime** | Node.js v20+ |
| **Linguagem** | TypeScript 5.9 (Strict Mode) |
| **Framework HTTP** | Express 5.2 |
| **Arquitetura** | Clean Architecture (4 camadas) |
| **Banco de Dados** | Em Memória (Entrega 1) |
| **Documentação** | Swagger UI + OpenAPI 3.0 |
| **Validação** | Zod |
| **Linting** | ESLint 8.57 + Prettier 3.9 |
| **Executor TS** | tsx 4.23 |

---

## 🚀 Setup & Execução

### Pré-requisitos
- **Node.js** v20 ou superior
- **npm** (incluído com Node.js)

### Instalação

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd API-PokeManager

# 2. Instalar dependências
npm install

# 3. Verificar compilação TypeScript
npm run build

# 4. Verificar linting
npm run lint
```

### Executar o Servidor

```bash
# Modo desenvolvimento (com watch)
npm run dev

# Modo produção (compilado)
npm run build && npm start
```

O servidor estará disponível em: **http://localhost:3000**

Documentação interativa: **http://localhost:3000/api/docs**

---

## 📡 Endpoints da API

### Base URL
```
http://localhost:3000/api/v1
```

### Rotas Disponíveis

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| **GET** | `/pokemons` | Lista todos os Pokémons (suporta filtro por tipo) | `200 OK` |
| **GET** | `/pokemons?type=fire` | Filtra Pokémons pelo tipo | `200 OK` |
| **GET** | `/pokemons/:id` | Busca um Pokémon por ID | `200 OK` |
| **POST** | `/pokemons` | Cria um novo Pokémon | `201 Created` |
| **PUT** | `/pokemons/:id` | Atualiza um Pokémon existente | `200 OK` |
| **DELETE** | `/pokemons/:id` | Remove um Pokémon | `204 No Content` |

---

## 📝 Exemplos de Uso

### 1. Listar todos os Pokémons

```bash
curl -X GET http://localhost:3000/api/v1/pokemons
```

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": "7f85e01a-bc53-440d-897d-75d39ca66a7d",
      "name": "Pikachu",
      "type": "electric"
    }
  ]
}
```

### 2. Filtrar Pokémons por Tipo

```bash
curl -X GET "http://localhost:3000/api/v1/pokemons?type=fire"
```

### 3. Criar um novo Pokémon

```bash
curl -X POST http://localhost:3000/api/v1/pokemons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charizard",
    "type": "fire"
  }'
```

**Resposta (201 Created):**
```json
{
  "message": "Pokemon created successfully",
  "data": {
    "name": "Charizard",
    "type": "fire"
  }
}
```

### 4. Buscar Pokémon por ID

```bash
curl -X GET http://localhost:3000/api/v1/pokemons/7f85e01a-bc53-440d-897d-75d39ca66a7d
```

### 5. Atualizar Pokémon

```bash
curl -X PUT http://localhost:3000/api/v1/pokemons/7f85e01a-bc53-440d-897d-75d39ca66a7d \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raichu",
    "type": "electric"
  }'
```

### 6. Deletar Pokémon

```bash
curl -X DELETE http://localhost:3000/api/v1/pokemons/7f85e01a-bc53-440d-897d-75d39ca66a7d
```

**Resposta (204 No Content)**

---

## ⚠️ Tratamento de Erros

### Estrutura de Resposta de Erro

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Pokemon not found"
}
```

### Códigos de Status

| Status | Significado |
|--------|------------|
| `200 OK` | Requisição bem-sucedida |
| `201 Created` | Recurso criado com sucesso |
| `204 No Content` | Requisição bem-sucedida sem corpo de resposta |
| `400 Bad Request` | Dados inválidos na requisição |
| `404 Not Found` | Recurso não encontrado |
| `500 Internal Server Error` | Erro interno do servidor |

### Exemplo de Erro (404)

```bash
curl -X GET http://localhost:3000/api/v1/pokemons/id-inexistente
```

**Resposta (404 Not Found):**
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Pokemon not found"
}
```

---

## 📚 Scripts Disponíveis

```bash
npm run dev        # Inicia o servidor em modo desenvolvimento com watch
npm run start      # Inicia o servidor compilado
npm run build      # Compila TypeScript para JavaScript
npm run lint       # Verifica linting com ESLint
npm run lint:fix   # Corrige problemas de linting automaticamente
npm run format     # Formata código com Prettier
```

---

## 🧪 Documentação Interativa

A API inclui documentação automática com **Swagger UI** (OpenAPI 3.0).

Acesse: **http://localhost:3000/api/docs**

- Explore todos os endpoints
- Teste requisições diretamente na interface
- Visualize schemas de request/response

---

## 📦 Dependências Principais

### Production
- `express@^5.2.1` - Framework HTTP
- `swagger-ui-express@^5.0.1` - Interface Swagger

### Development
- `typescript@^5.9.3` - Compilador TypeScript
- `tsx@^4.23.13` - Executor TypeScript nativo para Node
- `eslint@^8.57.1` - Linter JavaScript/TypeScript
- `prettier@^3.9.6` - Formatador de código
- `@typescript-eslint/*` - Plugins ESLint para TypeScript

---


## 👨‍💻 Autor

**Isabelle Vimercati**  
Email: isabellepvimercati@gmail.com  
Universidade Federal Fluminense (UFF)  
Departamento de Ciência da Computação (RCM)

---

## 📄 Licença

MIT

---

## 🙏 Referências

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- Repositório de Referência: [CarlosEduAC/express-sample](https://github.com/CarlosEduAC/express-sample)
