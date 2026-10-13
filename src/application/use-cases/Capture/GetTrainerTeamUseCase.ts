import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { NotFoundError } from '@domain/errors/not-found-error';

export class GetTrainerTeamUseCase {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly trainerRepository: IPgTrainerRepository,
  ) {}

  async execute(trainerId: number): Promise<Pokemon[]> {
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) throw new NotFoundError('Treinador');

    return this.pokemonRepository.findByTrainerId(trainerId);
  }
}
