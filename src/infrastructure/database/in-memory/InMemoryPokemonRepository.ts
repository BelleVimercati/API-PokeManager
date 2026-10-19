import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class InMemoryPokemonRepository implements IPokemonRepository {
  public items: Pokemon[] = [];

  // Atômico por natureza: contagem e push rodam sem nenhum await no meio
  async createIfTeamHasRoom(
    pokemon: Pokemon,
    maxTeamSize: number,
  ): Promise<boolean> {
    const teamSize = this.items.filter(
      (item) => item.trainerId === pokemon.trainerId,
    ).length;
    if (teamSize >= maxTeamSize) {
      return false;
    }
    this.items.push(pokemon);
    return true;
  }

  async findById(id: string): Promise<Pokemon | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByTrainerId(trainerId: number): Promise<Pokemon[]> {
    return this.items.filter((item) => item.trainerId === trainerId);
  }

  async countByTrainerId(trainerId: number): Promise<number> {
    return this.items.filter((item) => item.trainerId === trainerId).length;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
