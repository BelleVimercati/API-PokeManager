import { Trainer } from '@domain/entities/Trainer';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { AppError } from '@domain/errors/app.error';
import { postgresPool } from './connection';

const UNIQUE_VIOLATION = '23505';
const DUPLICATED_EMAIL_MESSAGE =
  'Já existe um Treinador cadastrado com este e-mail.';

interface TrainerRow {
  id: number;
  nome: string;
  email: string | null;
  especialidade: string | null;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === UNIQUE_VIOLATION
  );
}

export class PgTrainerRepository implements IPgTrainerRepository {
  async create(trainer: Trainer): Promise<Trainer> {
    const query = `
      INSERT INTO trainers (nome, email, especialidade)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email, especialidade
    `;

    try {
      const result = await postgresPool.query<TrainerRow>(query, [
        trainer.name,
        trainer.email,
        trainer.specialty,
      ]);
      return this.toEntity(result.rows[0]);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(DUPLICATED_EMAIL_MESSAGE, 409);
      }
      throw error;
    }
  }

  async update(trainer: Trainer): Promise<void> {
    const query = `
      UPDATE trainers
      SET nome = $1, email = $2, especialidade = $3
      WHERE id = $4
    `;

    try {
      await postgresPool.query(query, [
        trainer.name,
        trainer.email,
        trainer.specialty,
        trainer.id,
      ]);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(DUPLICATED_EMAIL_MESSAGE, 409);
      }
      throw error;
    }
  }

  async findById(id: number): Promise<Trainer | null> {
    const query = `SELECT id, nome, email, especialidade FROM trainers WHERE id = $1`;
    const result = await postgresPool.query<TrainerRow>(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.toEntity(result.rows[0]);
  }

  async findAll(): Promise<Trainer[]> {
    const query = `SELECT id, nome, email, especialidade FROM trainers ORDER BY id`;
    const result = await postgresPool.query<TrainerRow>(query);

    return result.rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: TrainerRow): Trainer {
    return new Trainer({
      id: row.id,
      name: row.nome,
      email: row.email,
      specialty: row.especialidade,
    });
  }
}
