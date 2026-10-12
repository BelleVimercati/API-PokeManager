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

