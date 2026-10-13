import { PokeApiAxiosGateway } from '@infrastructure/providers/poke-api-axios-gateway';
import { InMemoryPokemonGateway } from '@infrastructure/providers/in-memory-pokemon-gateway';
import { IPokeApiGateway } from '@domain/gateways/IPokeApiGateway';

export function makePokeApiGateway(): IPokeApiGateway {
  // Variáveis de ambiente são sempre string: compare com 'false', não com false
  if (process.env.USE_EXTERNAL_API === 'false') {
    return new InMemoryPokemonGateway();
  }
  return new PokeApiAxiosGateway();
}
