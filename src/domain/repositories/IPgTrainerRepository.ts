import { Trainer } from '@domain/entities/Trainer';

export interface IPgTrainerRepository {
  create(trainer: Trainer): Promise<Trainer>;
  update(trainer: Trainer): Promise<void>;
  findById(id: number): Promise<Trainer | null>;
  findByEmail(email: string): Promise<Trainer | null>;
  findAll(): Promise<Trainer[]>;
}
