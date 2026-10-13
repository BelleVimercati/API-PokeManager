import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon as PrismaPokemon } from '../../../../generated/prisma/client';
import { prisma } from './client';

export class PrismaPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.create({
      data: {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        level: pokemon.level,
        spriteUrl: pokemon.spriteUrl,
        baseExperience: pokemon.baseExperience,
        height: pokemon.height,
        weight: pokemon.weight,
      },
    });
  }

  /* Filtro de tipo */
  async findByType(type: string): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({ where: { type } });
    return rows.map((row) => this.toEntity(row));
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async count(): Promise<number> {
    return prisma.pokemon.count();
  }

  async findAll(): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany();
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<Pokemon | null> {
    const row = await prisma.pokemon.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async update(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: {
        name: pokemon.name,
        type: pokemon.type,
        level: pokemon.level,
        spriteUrl: pokemon.spriteUrl,
        baseExperience: pokemon.baseExperience,
        height: pokemon.height,
        weight: pokemon.weight,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await prisma.pokemon.update({
      where: { id },
      data: { level: newLevel },
    });
  }

  private toEntity(row: PrismaPokemon): Pokemon {
    return new Pokemon({
      id: row.id,
      name: row.name,
      type: row.type,
      level: row.level,
      spriteUrl: row.spriteUrl,
      baseExperience: row.baseExperience,
      height: row.height,
      weight: row.weight,
    });
  }
}
