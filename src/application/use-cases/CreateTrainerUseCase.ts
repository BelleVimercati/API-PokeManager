import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/app.error';

interface CreateTrainerDTO {
  name: string;
  email?: string;
  specialty?: string;
}

export class CreateTrainerUseCase {
  constructor(private readonly trainerRepository: IPgTrainerRepository) {}

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    if (!data.name?.trim()) {
      throw new AppError('O nome do treinador é obrigatório.', 400);
    }

    const trainer = new Trainer({
      name: data.name,
      email: data.email ?? null,
      specialty: data.specialty ?? null,
    });

    return this.trainerRepository.create(trainer);
  }
}
