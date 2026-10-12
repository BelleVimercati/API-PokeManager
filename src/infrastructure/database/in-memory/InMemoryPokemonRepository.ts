import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class InMemoryPokemonRepository implements IPokemonRepository {
  public items: Pokemon[] = [];

  async create(pokemon: Pokemon): Promise<void> {
    this.items.push(pokemon);
  }

  async findById(id: string): Promise<Pokemon | null> {
    const pokemon = this.items.find((item) => item.id === id);
    if (!pokemon) return null;
    return pokemon;
  }

  async findAll(): Promise<Pokemon[]> {
    return this.items;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.items.findIndex((item) => item.id === pokemon.id);
    if (index !== -1) {
      this.items[index] = pokemon;
    }
  }

  async delete(id: string): Promise<void> {
    const pokemon = this.items.find((item) => item.id === id);
    if (pokemon) {
      this.items = this.items.filter((item) => item.id !== id);
    }
  }

  async findByType(type: string): Promise<Pokemon[]> {
    return this.items.filter(
      (item) => item.type.toLowerCase() === type.toLowerCase(),
    );
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      const current = this.items[index];
      this.items[index] = new Pokemon({
        id: current.id,
        name: current.name,
        type: current.type,
        level: newLevel,
      });
    }
  }

  async searchByName(name: string): Promise<Pokemon[]> {
    return this.items.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  async count(): Promise<number> {
    return this.items.length;
  }
}
