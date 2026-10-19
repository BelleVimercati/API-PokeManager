import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { NotFoundError } from '@domain/errors/not-found-error';

interface ReleasePokemonDTO {
  trainerId: number;
  pokemonId: string;
}

export class ReleasePokemonUseCase {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly trainerRepository: IPgTrainerRepository,
  ) {}

  async execute({ trainerId, pokemonId }: ReleasePokemonDTO): Promise<void> {
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) throw new NotFoundError('Treinador');

    // Pokémon de outro treinador responde igual a inexistente:
    // um treinador não pode soltar (nem descobrir) o Pokémon de outro
    const pokemon = await this.pokemonRepository.findById(pokemonId);
    if (!pokemon || pokemon.trainerId !== trainerId) {
      throw new NotFoundError(
        'Pokémon',
        'Pokémon não encontrado no time deste treinador',
      );
    }

    await this.pokemonRepository.delete(pokemonId);
  }
}
