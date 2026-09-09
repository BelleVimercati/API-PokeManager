import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { AppError } from '@domain/errors/app.error';

export class DeletePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<void> {
    const existingPokemon = await this.pokemonRepository.findById(id);
    if (!existingPokemon) {
      throw new AppError('Pokemon not found', 404);
    }

    await this.pokemonRepository.delete(id);
  }
}
