import { Trainer } from '@domain/entities/Trainer';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';

export class InMemoryTrainerRepository implements IPgTrainerRepository {
  public items: Trainer[] = [];
  private nextId = 1;

  async create(trainer: Trainer): Promise<Trainer> {
    // Simula o autoincrement do banco
    const created = new Trainer({
      id: this.nextId++,
      name: trainer.name,
      email: trainer.email,
      specialty: trainer.specialty,
    });
    this.items.push(created);
    return created;
  }

  async update(trainer: Trainer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === trainer.id);
    if (index !== -1) {
      this.items[index] = trainer;
    }
  }

  async findById(id: number): Promise<Trainer | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async findAll(): Promise<Trainer[]> {
    return this.items;
  }
}
