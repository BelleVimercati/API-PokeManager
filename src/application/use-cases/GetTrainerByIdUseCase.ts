import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/app.error';

export class GetTrainerByIdUseCase {
  constructor(private readonly trainerRepository: IPgTrainerRepository) {}

  async execute(id: number): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);

    if (!trainer) {
      throw new AppError('Trainer not found', 404);
    }

    return trainer;
  }
}
