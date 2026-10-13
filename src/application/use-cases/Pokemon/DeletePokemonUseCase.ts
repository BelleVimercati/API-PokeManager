import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { NotFoundError } from '@domain/errors/not-found-error';

export class DeletePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<void> {
    const existingPokemon = await this.pokemonRepository.findById(id);
    if (!existingPokemon) {
      throw new NotFoundError('Pokemon');
    }

    await this.pokemonRepository.delete(id);
  }
}
