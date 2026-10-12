import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { postgresPool } from './connection';

interface PokemonRow {
  id: string;
  name: string;
  type: string;
  level: number;
}

export class PgPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    const query = `
      INSERT INTO pokemons (id, name, type, level)
      VALUES ($1, $2, $3, $4)
    `;
    await postgresPool.query(query, [
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.level,
    ]);
  }

  /* Filtro de tipo */
  async findByType(type: string): Promise<Pokemon[]> {
    const query = `SELECT id, name, type, level FROM pokemons WHERE type = $1`;
    const result = await postgresPool.query(query, [type]);
    return result.rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: PokemonRow): Pokemon {
    return new Pokemon({
      id: row.id,
      name: row.name,
      type: row.type,
      level: row.level,
    });
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const query = `SELECT id, name, type, level FROM pokemons WHERE name ILIKE $1`;
    const result = await postgresPool.query(query, [`%${term}%`]);
    return result.rows.map((row) => this.toEntity(row));
  }

  async count(): Promise<number> {
    const result = await postgresPool.query(
      `SELECT COUNT(*)::int AS total FROM pokemons`,
    );
    return result.rows[0].total;
  }

  async findAll(): Promise<Pokemon[]> {
    const query = `SELECT id, name, type, level FROM pokemons`;
    const result = await postgresPool.query(query);

    return result.rows.map(
      (row) =>
        new Pokemon({
          id: row.id,
          name: row.name,
          type: row.type,
          level: row.level,
        }),
    );
  }

  async findById(id: string): Promise<Pokemon | null> {
    const query = `SELECT id, name, type, level FROM pokemons WHERE id = $1`;
    const result = await postgresPool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Pokemon({
      id: row.id,
      name: row.name,
      type: row.type,
      level: row.level,
    });
  }

  async update(pokemon: Pokemon): Promise<void> {
    const query = `
      UPDATE pokemons
      SET name = $1, type = $2, level = $3
      WHERE id = $4
    `;
    await postgresPool.query(query, [
      pokemon.name,
      pokemon.type,
      pokemon.level,
      pokemon.id,
    ]);
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM pokemons WHERE id = $1`;
    await postgresPool.query(query, [id]);
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const query = `UPDATE pokemons SET level = $1 WHERE id = $2`;
    await postgresPool.query(query, [newLevel, id]);
  }
}
