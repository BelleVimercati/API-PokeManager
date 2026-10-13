import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';

import { randomUUID } from 'node:crypto';

interface CreatePokemonDTO {
  name: string;
  type: string;
  level?: number;
}

export class CreatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const id = randomUUID();
    const newPokemon = new Pokemon({ ...data, id, level: data.level ?? 1 });
    await this.pokemonRepository.create(newPokemon);
    return newPokemon;
  }
}
