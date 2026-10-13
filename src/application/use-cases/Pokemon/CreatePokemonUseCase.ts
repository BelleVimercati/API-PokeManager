import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';

import { randomUUID } from 'node:crypto';
import { IPokeApiGateway } from '@domain/gateways/IPokeApiGateway';
import { NotFoundError } from '@domain/errors/not-found-error';

interface CreatePokemonDTO {
  name: string;
  // Opcional: se não vier, usa o tipo primário oficial da PokéAPI
  type?: string;
  level?: number;
}

export class CreatePokemonUseCase {
  constructor(
    private pokemonRepository: IPokemonRepository,
    private pokeApiGateway: IPokeApiGateway,
  ) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const details = await this.pokeApiGateway.findByName(data.name);

    if (!details) {
      // Mensagem neutra: o gateway pode ser a PokéAPI ou o mock em memória
      throw new NotFoundError('Pokémon', 'Pokémon não encontrado');
    }

    const newPokemon = new Pokemon({
      id: randomUUID(),
      name: details.name,
      type: data.type ?? details.types[0],
      level: data.level ?? 1,
      spriteUrl: details.spriteUrl,
      baseExperience: details.baseExperience,
      height: details.height,
      weight: details.weight,
    });
    await this.pokemonRepository.create(newPokemon);
    return newPokemon;
  }
}
