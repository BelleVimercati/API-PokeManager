import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';
import { AppError } from '@domain/errors/app.error';

export class GetPokemonByIdUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<Pokemon | null> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new AppError('Pokemon not found', 404);
    }
    return pokemon;
  }
}
