import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';
import { NotFoundError } from '@domain/errors/not-found-error';

export class SearchPokedexUseCase {
  constructor(private readonly pokeApiGateway: IPokeApiGateway) {}

  async execute(name: string): Promise<ExternalPokemonDetails> {
    const details = await this.pokeApiGateway.findByName(name);
    if (!details) throw new NotFoundError('Pokémon');
    return details;
  }
}
