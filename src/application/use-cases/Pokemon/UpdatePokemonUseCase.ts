import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';
import { AppError } from '@domain/errors/app.error';

interface UpdatePokemonDTO {
  id: string;
  name?: string;
  type?: string;
  level?: number;
}

export class UpdatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(data: UpdatePokemonDTO): Promise<Pokemon> {
    const existingPokemon = await this.pokemonRepository.findById(data.id);

    if (!existingPokemon) {
      throw new AppError('Pokemon not found', 404);
    }

    const updatedPokemon = new Pokemon({
      id: existingPokemon.id,
      name: data.name ?? existingPokemon.name,
      type: data.type ?? existingPokemon.type,
      level: data.level ?? existingPokemon.level,
    });

    await this.pokemonRepository.update(updatedPokemon);
    return updatedPokemon;
  }
}
