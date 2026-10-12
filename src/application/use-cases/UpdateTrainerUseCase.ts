import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/app.error';

interface UpdateTrainerDTO {
  id: number;
  name?: string;
  email?: string;
  specialty?: string;
}

export class UpdateTrainerUseCase {
  constructor(private readonly trainerRepository: IPgTrainerRepository) {}

  async execute(data: UpdateTrainerDTO): Promise<Trainer> {
    const existingTrainer = await this.trainerRepository.findById(data.id);

    if (!existingTrainer) {
      throw new AppError('Trainer not found', 404);
    }

    const updatedTrainer = new Trainer({
      id: existingTrainer.id,
      name: data.name ?? existingTrainer.name,
      email: data.email ?? existingTrainer.email,
      specialty: data.specialty ?? existingTrainer.specialty,
    });

    await this.trainerRepository.update(updatedTrainer);
    return updatedTrainer;
  }
}
