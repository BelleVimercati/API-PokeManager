# Anotações

## Por que usar uma factory neste projeto

### O problema

Para atender uma requisição, o `PokemonController` precisa de cinco use cases, e cada use case precisa de um repositório. Sem factory, essa montagem (a "composição" das dependências) ficaria espalhada pelas rotas:

```ts
const repository = new InMemoryPokemonRepository();
const pokemonController = new PokemonController(
  new ListPokemonUseCase(repository),
  new GetPokemonByIdUseCase(repository),
  // ...
);
```

Se outro arquivo precisasse de um `PokemonController`, teria que repetir essa montagem inteira. E, se a ordem dos argumentos mudasse, todos os pontos de uso quebrariam.

### O que a factory resolve

- **Um único lugar de composição.** `makePokemonController()` (em `src/main/factories/`) é a única parte do código que sabe quais implementações concretas são usadas. O resto do sistema recebe o controller pronto.
- **Troca de implementação sem mexer nas outras camadas.** A TODO do projeto pede a troca do `InMemoryPokemonRepository` por um `PrismaPokemonRepository` sem alterar o domínio. Com a factory, basta trocar a linha que instancia o repositório. As rotas, os use cases e o domínio continuam iguais.
- **Respeito à Clean Architecture.** A camada `application` depende apenas da interface `IPokemonRepository` (domínio), nunca da implementação. Quem conhece as implementações concretas é a camada `main`, que é a composição da aplicação. A factory fica exatamente nessa camada.
- **Estado compartilhado de forma controlada.** O repositório in-memory é criado uma vez, no nível do módulo. Assim, todas as chamadas da API enxergam os mesmos dados. Se a factory criasse um repositório a cada chamada, cada requisição veria uma lista vazia.

### Como fica a camada `main`

```text
src/main/
  factories/           -> monta as dependências (composição)
  server.ts            -> sobe o servidor e usa as rotas
```

As rotas passam a depender só da factory, e não de cada use case ou do repositório.

### Pontos de atenção

- A factory é uma composição manual de dependências (injeção de dependência feita à mão). Para um projeto deste tamanho, isso é suficiente e fácil de entender. Em projetos maiores, existem containers de DI, mas eles não são necessários aqui.
- Se for preciso testar o controller com um repositório falso, a factory pode receber o repositório como parâmetro opcional, por exemplo `makePokemonController(repository = new InMemoryPokemonRepository())`. Isso ainda não foi implementado.
- Como o repositório fica no nível do módulo, ele é único em toda a aplicação. Isso é desejado para o in-memory, mas precisa ser revisto quando o Prisma for introduzido.

## Acesso ao banco: `pg` e Prisma

O projeto tem duas implementações de repositório para o PostgreSQL. As duas implementam as mesmas interfaces do domínio (`IPokemonRepository` e `IPgTrainerRepository`), então os use cases não percebem a diferença.

```text
src/infrastructure/database/
  postgres/   -> pg: SQL escrito à mão (PgPokemonRepository, PgTrainerRepository)
  prisma/     -> Prisma: ORM com client gerado (PrismaPokemonRepository, PrismaTrainerRepository)
```

### Usando o `pg` (SQL puro)

- **Um pool único de conexões.** `postgres/connection.ts` cria um `Pool` e o exporta. Todos os repositórios reutilizam esse pool, em vez de abrir uma conexão nova a cada consulta.
- **Consultas parametrizadas.** Os valores vão em `$1`, `$2`... e nunca concatenados na string do SQL. Isso evita SQL injection.
- **Conversão manual de linha para entidade.** O banco devolve linhas (`row`), e um método `toEntity` monta a entidade do domínio. É ali que nomes de coluna diferentes são traduzidos (por exemplo, `nome` → `name` e `especialidade` → `specialty`).
- **Erros identificados pelo código do Postgres.** E-mail duplicado chega como o código `23505` (violação de `UNIQUE`), que o repositório converte em `AppError` 409.
- **Quem cria as tabelas é você.** No `pg`, a estrutura do banco vinha do `docker/postgres/init.sql`, que o Postgres só executa na primeira vez em que o volume é criado.

### Usando o Prisma

- **O `schema.prisma` descreve as tabelas.** Cada `model` vira uma tabela, e o Prisma gera um client com tipos para essas tabelas.
  - `@@map("pokemons")` liga o model ao nome real da tabela.
  - `@map("nome")` liga um campo a uma coluna com outro nome. Assim o código fica em inglês e o banco continua igual.
  - `String?` indica um campo que pode ser `null`.
  - `@db.Uuid` e `@db.VarChar(100)` definem o tipo exato da coluna no Postgres.
  - Os tipos do Prisma são próprios: inteiro é `Int`, não `Number`.
  - `@default(uuid())` gera o id como texto UUID; `@default(autoincrement())` equivale ao `SERIAL`.
- **O client é gerado, não escrito.** `npx prisma generate` cria o client em `generated/prisma` (configurado no `output` do generator `prisma-client`). Por isso o import é de `generated/prisma/client`, e não de `@prisma/client`. Sempre que o schema muda, é preciso gerar de novo.
- **Consultas sem SQL.** `findMany`, `findUnique`, `create`, `update`, `delete` e `count` substituem o SQL. O `ILIKE '%termo%'` vira `{ contains: termo, mode: 'insensitive' }`.
- **Erros com códigos próprios.** E-mail duplicado chega como `PrismaClientKnownRequestError` com o código `P2002`, e não mais `23505`.
- **`update` e `delete` falham se o registro não existe** (código `P2025`). No SQL puro, um `UPDATE` sem linhas afetadas simplesmente não faz nada. Aqui não muda nada na prática, porque os use cases chamam `findById` antes e respondem 404.

### Migrations

- `npx prisma migrate dev` compara o schema com o banco, cria uma pasta em `prisma/migrations` com o SQL e aplica. É usado durante o desenvolvimento.
- `npx prisma migrate deploy` só aplica as migrations que já existem. É o comando usado em produção e no Docker.
- O Prisma guarda quais migrations já rodaram na tabela `_prisma_migrations`. Na primeira execução, o Postgres registra no log `relation "_prisma_migrations" does not exist`. Isso é esperado: o Prisma procura a tabela, não acha e então a cria.
- O `migrate dev` usa um banco temporário de verificação (shadow database). Os logs de `checkpoint` que aparecem no Postgres vêm dele sendo criado e apagado.
- **Não misturar `init.sql` e migrations.** Se as duas coisas criam as mesmas tabelas, o `migrate deploy` falha com "relation already exists". Com o Prisma, a migration passa a ser a única fonte da estrutura do banco. Para um banco que já tem as tabelas, dá para marcar a migration como aplicada com `npx prisma migrate resolve --applied <nome_da_migration>`.

### Prisma no Docker

- **Gerar o client antes de compilar.** O `Dockerfile` roda `npx prisma generate` antes do `npm run build`, senão o `tsc` não encontra o client.
- **O `prisma.config.ts` exige `DATABASE_URL`** já ao carregar. No build não existe banco, então o `generate` recebe um valor provisório (ele não se conecta).
- **O `tsc` não copia o engine.** O client compilado vai para `dist/generated/prisma`, mas o arquivo binário do engine (`*.node`) precisa ser copiado à mão para lá.
- **O CLI precisa estar em `dependencies`.** O estágio final instala com `npm ci --omit=dev`. Como o `migrate deploy` roda no container, o pacote `prisma` não pode ficar em `devDependencies`.
- **Alpine precisa de `openssl`.** O engine do Prisma depende dele, e a imagem `node:alpine` não traz.
- **Migrations antes do servidor.** No `docker-compose.yml`, o serviço `api` roda `npx prisma migrate deploy && node dist/src/main/server.js`. Assim o banco está atualizado antes da API aceitar requisições.

### Comparação

| | `pg` | Prisma |
| --- | --- | --- |
| Como consulta | SQL escrito à mão | Métodos do client (`findMany`, `create`...) |
| Tipos das linhas | Interface escrita à mão (`PokemonRow`) | Gerados a partir do schema |
| Estrutura do banco | `init.sql` | `schema.prisma` + migrations |
| Erro de valor duplicado | Código `23505` | Código `P2002` |
| Controle sobre o SQL | Total | Menor, mas dá para usar `$queryRaw` quando necessário |
| Passo extra | Nenhum | `prisma generate` sempre que o schema muda |

Os dois caminhos funcionam com a mesma arquitetura: como o domínio só conhece as interfaces, trocar de `pg` para Prisma é trocar a linha da factory que cria o repositório.

## Validação de entrada com middleware e Zod

### O problema sem validação

Antes da validação, o controller pegava os dados da requisição e repassava direto para o use case:

```ts
const { name, type, level } = req.body;
```

Nada garantia que `name` existia, que `level` era um número ou que o `id` da URL era um UUID. Um `GET /pokemons/123` chegava até o banco e só falhava lá, como erro 500. E, se cada controller validasse por conta própria, as mesmas checagens (`if (!name)`, `if (typeof level !== 'number')`...) ficariam repetidas em vários lugares, cada uma com uma mensagem de erro diferente.

### O que o middleware resolve

- **Os dados são barrados na entrada.** A validação acontece antes do controller. Se os dados forem inválidos, o controller, o use case e o banco nem são chamados.
- **Um único ponto de validação.** O `validateRequest` (em `src/infrastructure/http/middlewares/validate-request.ts`) serve para qualquer rota. Cada rota só diz qual schema usar.
- **Respostas de erro padronizadas.** Toda falha de validação volta como 400, no mesmo formato, com a lista de campos e mensagens.
- **Cada camada com sua responsabilidade.** Verificar o formato dos dados (campo obrigatório, tipo, tamanho) é papel da camada HTTP. Regras de negócio (por exemplo, "pokémon não encontrado") continuam nos use cases.

### O que é um schema

Um schema do Zod descreve o formato que um dado precisa ter. Os schemas ficam em `src/infrastructure/http/schemas/pokemon-schemas.ts`:

```ts
export const createPokemonSchema = z.object({
  name: z
    .string({ error: 'O nome é obrigatório' })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres'),
  // ...
});
```

- **A ordem importa.** O Zod executa as regras na ordem em que são escritas. O `.trim()` vem antes do `.min(3)`, senão `"  ab  "` passaria no tamanho mínimo antes de ter os espaços removidos.
- **Reaproveitamento.** `updatePokemonSchema` é o `createPokemonSchema` com `.partial()` (todos os campos opcionais), e `updatePokemonLevelSchema` usa `.pick({ level: true })`. Se uma regra mudar no schema de criação, ela muda nos outros também.
- **`.refine()` para regras próprias.** No `PUT`, o `refine` exige que ao menos um campo seja enviado.
- **Zod 4.** A mensagem de campo obrigatório usa `{ error: '...' }`; o antigo `required_error` não existe mais. Para UUID, usa-se `z.uuid()` no lugar de `z.string().uuid()`.

### Partes da requisição

Cada parte da requisição pode ter seu próprio schema:

| Parte | De onde vem | Exemplo |
| --- | --- | --- |
| `body` | JSON enviado em POST, PUT e PATCH | `{ "name": "Pikachu", "level": 5 }` |
| `params` | Trechos da URL com `:` | `/pokemons/:id` |
| `query` | O que vem depois do `?` na URL | `/pokemons?type=fire` |

`params` e `query` sempre chegam como texto. Para receber um número por eles, é preciso usar `z.coerce.number()`.

### Como o middleware funciona

```text
requisição -> validateRequest -> controller -> use case -> repositório
                    |
                    └─ dado inválido -> next(AppError 400) -> errorHandler -> resposta 400
```

1. A rota informa qual schema valida cada parte:

   ```ts
   router.put(
     '/:id',
     validateRequest({ params: pokemonIdParamsSchema, body: updatePokemonSchema }),
     (req, res) => pokemonController.update(req, res),
   );
   ```

2. O middleware chama `schema.parseAsync(...)` para cada parte informada.
3. **Se os dados forem válidos**, o Zod devolve o dado já tratado (com `trim` aplicado e campos desconhecidos removidos). O middleware coloca esse valor de volta na requisição e chama `next()`, liberando o controller.
4. **Se forem inválidos**, o Zod lança um `ZodError` com todos os problemas encontrados, não só o primeiro. O middleware converte esse erro em `AppError('Dados de entrada inválidos', 400, details)` e chama `next(erro)`.
5. O `errorHandler` recebe o `AppError` e monta a resposta:

   ```json
   {
     "status": "error",
     "statusCode": 400,
     "message": "Dados de entrada inválidos",
     "details": [
       { "field": "name", "message": "O nome deve ter no mínimo 3 caracteres" },
       { "field": "level", "message": "O nível deve ser um número inteiro positivo" }
     ]
   }
   ```

Para isso, o `AppError` ganhou o campo opcional `details`, e o `errorHandler` só o inclui na resposta quando ele existe.

### Pontos de atenção na validação

- **`req.query` não pode ser reatribuído no Express 5.** Nessa versão, `req.query` é um getter, e `req.query = ...` lança um `TypeError`. Por isso o middleware usa `Object.defineProperty(req, 'query', { value: query, writable: true })`.
- **Tipo do retorno do middleware.** O `validateRequest` retorna `RequestHandler<any>`. Sem isso, o Express passava a usar o tipo do middleware para os handlers seguintes, e o TypeScript deixava de reconhecer o `{ id: string }` dos parâmetros das rotas `/:id`.
- **O schema precisa estar na parte certa.** `validateRequest(schema)` sem dizer se é `body`, `query` ou `params` não compila. E um schema na parte errada (por exemplo, validar `level` nos `params`) faz toda requisição falhar com 400.
- **Rotas sem entrada não precisam de validação.** O `GET /count` não recebe dados, então não usa o middleware.

