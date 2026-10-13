import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { Trainer } from '@domain/entities/Trainer';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

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
      throw new NotFoundError('Treinador');
    }

    if (data.email && data.email !== existingTrainer.email) {
      const trainerWithEmail = await this.trainerRepository.findByEmail(
        data.email,
      );
      if (trainerWithEmail && trainerWithEmail.id !== existingTrainer.id) {
        throw new ConflictError(
          'Já existe um Treinador cadastrado com este e-mail.',
        );
      }
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
