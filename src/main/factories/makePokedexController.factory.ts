import { SearchPokedexUseCase } from '@application/use-cases/Pokedex/SearchPokedexUseCase';
import { PokedexController } from '@infrastructure/http/controllers/PokedexController';
import { makePokeApiGateway } from '@main/factories/makePokeApiGateway.factory';

const pokeApiGateway = makePokeApiGateway();

export function makePokedexController(): PokedexController {
  return new PokedexController(new SearchPokedexUseCase(pokeApiGateway));
}
