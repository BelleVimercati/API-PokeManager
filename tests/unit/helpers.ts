import { randomUUID } from 'node:crypto';
import { Pokemon } from '@domain/entities/Pokemon';
import { Trainer } from '@domain/entities/Trainer';
import { InMemoryTrainerRepository } from '@infrastructure/database/in-memory/InMemoryTrainerRepository';

export async function createTrainer(
  repository: InMemoryTrainerRepository,
  name = 'Ash Ketchum',
): Promise<Trainer> {
  return repository.create(new Trainer({ name, email: null, specialty: null }));
}

export function makePokemon(trainerId: number, name = 'pikachu'): Pokemon {
  return new Pokemon({
    id: randomUUID(),
    pokedexId: 25,
    name,
    types: ['electric'],
    spriteUrl: null,
    level: 1,
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
    },
    trainerId,
    capturedAt: new Date(),
  });
}
