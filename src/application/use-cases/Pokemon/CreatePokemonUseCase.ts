import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';

import { randomUUID } from 'node:crypto';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
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
    private pokemonExternalGateway: PokemonExternalGateway,
  ) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const details = await this.pokemonExternalGateway.findByName(data.name);

    if (!details) {
      throw new NotFoundError(
        'Pokémon',
        'Pokémon não encontrado na base oficial da PokeAPI',
      );
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
