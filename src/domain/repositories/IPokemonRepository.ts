import { Pokemon } from '@domain/entities/Pokemon';

export interface IPokemonRepository {
  // Conta o time e salva numa operação atômica: duas capturas simultâneas
  // não conseguem passar do limite. Retorna false se o time já estiver cheio.
  createIfTeamHasRoom(pokemon: Pokemon, maxTeamSize: number): Promise<boolean>;
  findById(id: string): Promise<Pokemon | null>;
  findByTrainerId(trainerId: number): Promise<Pokemon[]>;
  countByTrainerId(trainerId: number): Promise<number>;
  delete(id: string): Promise<void>;
}
