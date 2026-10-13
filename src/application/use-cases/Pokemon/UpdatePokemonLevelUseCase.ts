import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { AppError } from '@domain/errors/app.error';
import { NotFoundError } from '@domain/errors/not-found-error';

export class UpdatePokemonLevelUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: string, newLevel: number): Promise<void> {
    if (!Number.isInteger(newLevel) || newLevel < 1 || newLevel > 100) {
      throw new AppError('O nível deve ser um inteiro entre 1 e 100.', 400);
    }

    const pokemon = await this.pokemonRepository.findById(id);
    if (!pokemon) {
      throw new NotFoundError('Pokemon');
    }

    await this.pokemonRepository.updateLevel(id, newLevel);
  }
}
