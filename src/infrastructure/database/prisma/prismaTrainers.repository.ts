import { Trainer } from '@domain/entities/Trainer';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { AppError } from '@domain/errors/app.error';
import {
  Prisma,
  Trainer as PrismaTrainer,
} from '../../../../generated/prisma/client';
import { prisma } from './client';

const UNIQUE_VIOLATION = 'P2002';
const DUPLICATED_EMAIL_MESSAGE =
  'Já existe um Treinador cadastrado com este e-mail.';

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === UNIQUE_VIOLATION
  );
}

export class PrismaTrainerRepository implements IPgTrainerRepository {
  async create(trainer: Trainer): Promise<Trainer> {
    try {
      const row = await prisma.trainer.create({
        data: {
          name: trainer.name,
          email: trainer.email,
          specialty: trainer.specialty,
        },
      });
      return this.toEntity(row);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(DUPLICATED_EMAIL_MESSAGE, 409);
      }
      throw error;
    }
  }

  async update(trainer: Trainer): Promise<void> {
    if (trainer.id === undefined) {
      throw new Error('Não é possível atualizar um Treinador sem id.');
    }

    try {
      await prisma.trainer.update({
        where: { id: trainer.id },
        data: {
          name: trainer.name,
          email: trainer.email,
          specialty: trainer.specialty,
        },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(DUPLICATED_EMAIL_MESSAGE, 409);
      }
      throw error;
    }
  }

  async findById(id: number): Promise<Trainer | null> {
    const row = await prisma.trainer.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findAll(): Promise<Trainer[]> {
    const rows = await prisma.trainer.findMany({ orderBy: { id: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: PrismaTrainer): Trainer {
    return new Trainer({
      id: row.id,
      name: row.name,
      email: row.email,
      specialty: row.specialty,
    });
  }
}
