import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon as PrismaPokemon } from '../../../../generated/prisma/client';
import { prisma } from './client';

export class PrismaPokemonRepository implements IPokemonRepository {
  async createIfTeamHasRoom(
    pokemon: Pokemon,
    maxTeamSize: number,
  ): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      // Trava a linha do treinador até o fim da transação: outra captura para
      // o mesmo treinador espera aqui e só conta o time depois deste commit
      await tx.$queryRaw`SELECT id FROM trainers WHERE id = ${pokemon.trainerId} FOR UPDATE`;

      const teamSize = await tx.pokemon.count({
        where: { trainerId: pokemon.trainerId },
      });
      if (teamSize >= maxTeamSize) {
        return false;
      }

      await tx.pokemon.create({ data: this.toData(pokemon) });
      return true;
    });
  }

  async findById(id: string): Promise<Pokemon | null> {
    const row = await prisma.pokemon.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }

  private toData(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      pokedexId: pokemon.pokedexId,
      name: pokemon.name,
      types: pokemon.types,
      spriteUrl: pokemon.spriteUrl,
      level: pokemon.level,
      hp: pokemon.stats.hp,
      attack: pokemon.stats.attack,
      defense: pokemon.stats.defense,
      specialAttack: pokemon.stats.specialAttack,
      specialDefense: pokemon.stats.specialDefense,
      speed: pokemon.stats.speed,
      trainerId: pokemon.trainerId,
      capturedAt: pokemon.capturedAt,
    };
  }

  async findByTrainerId(trainerId: number): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: { trainerId },
      orderBy: { capturedAt: 'asc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async countByTrainerId(trainerId: number): Promise<number> {
    return prisma.pokemon.count({ where: { trainerId } });
  }

  private toEntity(row: PrismaPokemon): Pokemon {
    return new Pokemon({
      id: row.id,
      pokedexId: row.pokedexId,
      name: row.name,
      types: row.types,
      spriteUrl: row.spriteUrl,
      level: row.level,
      stats: {
        hp: row.hp,
        attack: row.attack,
        defense: row.defense,
        specialAttack: row.specialAttack,
        specialDefense: row.specialDefense,
        speed: row.speed,
      },
      trainerId: row.trainerId,
      capturedAt: row.capturedAt,
    });
  }
}
