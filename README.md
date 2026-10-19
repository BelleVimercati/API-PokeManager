# PokéManager API

![Node.js](https://img.shields.io/badge/Node.js-v20+-green?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-v5.9+-blue?logo=typescript) ![Express](https://img.shields.io/badge/Express-v5.2+-black?logo=express) ![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql) ![Architecture](https://img.shields.io/badge/Architecture-Clean-brightgreen) ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger)

## 📋 Descrição do Projeto

A **PokéManager API** é uma aplicação backend desenvolvida com Node.js, TypeScript e Express seguindo os princípios de **Clean Architecture**. Treinadores Pokémon se cadastram, consultam a Pokédex e montam o seu time de até 6 Pokémons.

**Entrega 2 (Atual):** persistência relacional com PostgreSQL + Prisma, validação de entrada com Zod, tratamento global de erros e integração com a [PokéAPI](https://pokeapi.co/) oficial.

- A **PokéAPI é a fonte dos dados dos Pokémons**: a API não mantém um catálogo local.
- O **banco guarda apenas** os treinadores e os Pokémons capturados por eles (o time).

---

## 🏗️ Arquitetura

```
src/
├── domain/                                # Regras de negócio (não conhece Express, Prisma ou Axios)
│   ├── entities/          Pokemon.ts, Trainer.ts
│   ├── gateways/          IPokeApiGateway.ts           # Contrato da PokéAPI
│   ├── repositories/      IPokemonRepository.ts, IPgTrainerRepository.ts
│   └── errors/            AppError + NotFound, Conflict, ServiceUnavailable, Unauthorized
│
├── application/use-cases/                 # Casos de uso
│   ├── Pokedex/           SearchPokedexUseCase
│   ├── Capture/           CapturePokemonUseCase, GetTrainerTeamUseCase, ReleasePokemonUseCase
│   └── Trainer/           Create, List, GetById, Update
│
├── infrastructure/
│   ├── providers/         poke-api-axios-gateway.ts    # IPokeApiGateway com Axios
│   │                      in-memory-pokemon-gateway.ts # Mock offline (USE_EXTERNAL_API=false)
│   ├── database/prisma/   PrismaPokemonRepository, PrismaTrainerRepository
│   ├── database/in-memory/InMemoryPokemonRepository, InMemoryTrainerRepository (testes)
│   └── http/              controllers, routes, schemas (Zod), middlewares, docs (OpenAPI)
│
└── main/                  server.ts + factories (injeção de dependências)
```

### Fluxo da captura

```
POST /trainers/1/captures { "name": "pikachu" }
  → Zod valida trainerId e name
  → CapturePokemonUseCase
      1. treinador existe?                    (404)
      2. time já tem 6 Pokémons?              (409)
      3. IPokeApiGateway.findByName(...)      (404 / 503)
      4. createIfTeamHasRoom(...)             → salva imagem, tipos e stats com o trainerId (409 se encheu)
  → 201 Created
```

**Capturas simultâneas:** a checagem do passo 2 sozinha não basta. Duas requisições ao mesmo tempo poderiam ler "5 no time" e as duas salvarem, deixando 7. Por isso o passo 4 conta e insere dentro de uma transação que trava a linha do treinador (`SELECT ... FOR UPDATE`). A segunda captura espera a primeira terminar e só então conta o time. Testado com 10 capturas em paralelo: 6 viram `201` e 4 viram `409`.

---

## 🛠️ Tech Stack

| Aspecto | Ferramenta |
|---------|-----------|
| **Runtime** | Node.js v20+ |
| **Linguagem** | TypeScript 5.9 (Strict Mode) |
| **Framework HTTP** | Express 5.2 |
| **Banco de Dados** | PostgreSQL + Prisma ORM 6 |
| **Integração externa** | PokéAPI via Axios (timeout de 3s) |
| **Validação** | Zod 4 |
| **Documentação** | Swagger UI + OpenAPI 3.0 |
| **Linting** | ESLint 8.57 + Prettier 3.9 |

---

## 🚀 Setup & Execução

Veja o passo a passo completo em [SETUP.md](SETUP.md). Resumo:

```bash
# Com Docker (sobe API + PostgreSQL + pgAdmin e aplica as migrations)
cp .env.example .env
docker-compose up --build

# Ou localmente (com um PostgreSQL rodando)
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npm run dev
```

- API: **http://localhost:3333/api/v1**
- Documentação interativa: **http://localhost:3333/api/docs**

Com `USE_EXTERNAL_API=false` no `.env`, a API usa um mock em memória (pikachu, charmander e bulbasaur) no lugar da PokéAPI, o que é útil para rodar sem internet.

---

## 📡 Endpoints da API

| Método | Rota | Descrição | Sucesso |
|--------|------|-----------|---------|
| **GET** | `/pokedex/search?name=pikachu` | Consulta direto na PokéAPI e devolve o DTO formatado | `200` |
| **POST** | `/trainers` | Cadastra um treinador | `201` |
| **GET** | `/trainers` | Lista os treinadores | `200` |
| **GET** | `/trainers/:id` | Busca um treinador | `200` |
| **PUT** | `/trainers/:id` | Atualiza um treinador | `200` |
| **POST** | `/trainers/:trainerId/captures` | Captura um Pokémon (PokéAPI → banco), até 6 por time | `201` |
| **GET** | `/trainers/:trainerId/team` | Lista o time atual do treinador | `200` |
| **DELETE** | `/trainers/:trainerId/team/:pokemonId` | Solta um Pokémon do time (libera a vaga) | `204` |

---

## 📝 Exemplos de Uso

### 1. Consultar a Pokédex

```bash
curl "http://localhost:3333/api/v1/pokedex/search?name=pikachu"
```

```json
{
  "data": {
    "pokedexId": 25,
    "name": "pikachu",
    "types": ["electric"],
    "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "baseExperience": 112,
    "height": 4,
    "weight": 60,
    "stats": { "hp": 35, "attack": 55, "defense": 40, "specialAttack": 50, "specialDefense": 50, "speed": 90 }
  }
}
```

### 2. Cadastrar um treinador

```bash
curl -X POST http://localhost:3333/api/v1/trainers \
  -H "Content-Type: application/json" \
  -d '{ "name": "Ash Ketchum", "email": "ash@pokemon.com", "specialty": "Elétrico" }'
```

### 3. Capturar um Pokémon

```bash
curl -X POST http://localhost:3333/api/v1/trainers/1/captures \
  -H "Content-Type: application/json" \
  -d '{ "name": "pikachu" }'
```

```json
{
  "message": "Pokemon captured successfully",
  "data": {
    "id": "3f2b8c1e-7a4d-4c2e-9b1a-2d5e6f7a8b9c",
    "pokedexId": 25,
    "name": "pikachu",
    "types": ["electric"],
    "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "level": 1,
    "stats": { "hp": 35, "attack": 55, "defense": 40, "specialAttack": 50, "specialDefense": 50, "speed": 90 },
    "trainerId": 1,
    "capturedAt": "2026-10-13T20:00:00.000Z"
  }
}
```

### 4. Ver o time do treinador

```bash
curl http://localhost:3333/api/v1/trainers/1/team
```

---

## ⚠️ Tratamento de Erros

Todos os erros passam pelo middleware global (`errorHandler`) e seguem o mesmo formato:

```json
{
  "status": "error",
  "message": "O treinador já possui 6 Pokémons no time"
}
```

Erros de validação (Zod) incluem `details`:

```json
{
  "status": "error",
  "message": "Dados de entrada inválidos",
  "details": [{ "field": "name", "message": "O nome do Pokémon é obrigatório" }]
}
```

| Status | Quando |
|--------|--------|
| `400 Bad Request` | Falha na validação do Zod ou JSON malformado |
| `404 Not Found` | Treinador ou Pokémon não encontrado, ou rota inexistente |
| `409 Conflict` | Time cheio (6 Pokémons) ou e-mail de treinador já cadastrado |
| `503 Service Unavailable` | PokéAPI fora do ar ou fora do tempo limite |
| `500 Internal Server Error` | Erro inesperado |

---

## 📚 Scripts Disponíveis

```bash
npm run dev        # Servidor em modo desenvolvimento (watch)
npm run build      # Compila TypeScript para dist/
npm run start      # Inicia o servidor compilado
npm run lint       # Verifica o código com ESLint
npm run typecheck  # Checa os tipos de src/ e tests/
npm test           # Roda os testes unitários (Vitest)
npm run test:coverage  # Testes + relatório de cobertura (coverage/index.html)
```

---

## 🧪 Testes

Os testes unitários ficam em `tests/unit/` e cobrem os casos de uso de captura, time, soltar Pokémon e Pokédex. Eles não precisam de banco nem de internet: os use cases recebem os repositórios em memória (`InMemoryPokemonRepository`, `InMemoryTrainerRepository`) e o `InMemoryPokemonGateway` no lugar do Prisma e da PokéAPI. Isso só é possível porque os use cases dependem de interfaces do domínio, não das implementações.

Cenários cobertos, entre outros:

- captura com sucesso, treinador inexistente e Pokémon inexistente na PokéAPI;
- time cheio (sem chamar a PokéAPI à toa);
- 10 capturas simultâneas, das quais só 6 entram;
- um treinador não consegue soltar o Pokémon de outro.

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

- [PokéAPI](https://pokeapi.co/docs/v2)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod](https://zod.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- Repositório de Referência: [CarlosEduAC/express-sample](https://github.com/CarlosEduAC/express-sample)
