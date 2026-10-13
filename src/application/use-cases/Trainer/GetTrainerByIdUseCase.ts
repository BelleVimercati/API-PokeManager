import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';
import { NotFoundError } from '@domain/errors/not-found-error';

export class GetTrainerByIdUseCase {
  constructor(private readonly trainerRepository: IPgTrainerRepository) {}

  async execute(id: number): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);

    if (!trainer) {
      throw new NotFoundError('Treinador');
    }

    return trainer;
  }
}
