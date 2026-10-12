import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';

export class ListTrainersUseCase {
  constructor(private readonly trainerRepository: IPgTrainerRepository) {}

  async execute(): Promise<Trainer[]> {
    return this.trainerRepository.findAll();
  }
}
