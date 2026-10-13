import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/app.error';
import { ConflictError } from '@domain/errors/conflict-error';

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

    if (data.email) {
      const trainerWithEmail = await this.trainerRepository.findByEmail(
        data.email,
      );
      if (trainerWithEmail) {
        throw new ConflictError(
          'Já existe um Treinador cadastrado com este e-mail.',
        );
      }
    }

    const trainer = new Trainer({
      name: data.name,
      email: data.email ?? null,
      specialty: data.specialty ?? null,
    });

    return this.trainerRepository.create(trainer);
  }
}
