import { Pokemon } from '@domain/entities/Pokemon';

export interface IPokemonRepository {
  findById(id: string): Promise<Pokemon | null>;
  findAll(): Promise<Pokemon[]>;
  create(pokemon: Pokemon): Promise<void>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: string): Promise<void>;
}
