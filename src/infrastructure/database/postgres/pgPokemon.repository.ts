import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { postgresPool } from './connection';

interface PokemonRow {
  id: string;
  name: string;
  type: string;
  level: number;
  spriteUrl: string | null;
  baseExperience: number | null;
  height: number | null;
  weight: number | null;
}

// As colunas no banco são snake_case (sprite_url, base_experience); o alias
// entre aspas mantém o camelCase de PokemonRow (sem aspas o Postgres usa minúsculas)
const SELECT_COLUMNS = `
  id, name, type, level,
  sprite_url AS "spriteUrl",
  base_experience AS "baseExperience",
  height, weight
`;

export class PgPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    const query = `
      INSERT INTO pokemons (id, name, type, level, sprite_url, base_experience, height, weight)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await postgresPool.query(query, [
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.level,
      pokemon.spriteUrl,
      pokemon.baseExperience,
      pokemon.height,
      pokemon.weight,
    ]);
  }

  /* Filtro de tipo */
  async findByType(type: string): Promise<Pokemon[]> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons WHERE type = $1`;
    const result = await postgresPool.query<PokemonRow>(query, [type]);
    return result.rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: PokemonRow): Pokemon {
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

  async searchByName(term: string): Promise<Pokemon[]> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons WHERE name ILIKE $1`;
    const result = await postgresPool.query<PokemonRow>(query, [`%${term}%`]);
    return result.rows.map((row) => this.toEntity(row));
  }

  async count(): Promise<number> {
    const result = await postgresPool.query(
      `SELECT COUNT(*)::int AS total FROM pokemons`,
    );
    return result.rows[0].total;
  }

  async findAll(): Promise<Pokemon[]> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons`;
    const result = await postgresPool.query<PokemonRow>(query);
    return result.rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<Pokemon | null> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons WHERE id = $1`;
    const result = await postgresPool.query<PokemonRow>(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.toEntity(result.rows[0]);
  }

  async update(pokemon: Pokemon): Promise<void> {
    const query = `
      UPDATE pokemons
      SET name = $1, type = $2, level = $3, sprite_url = $4,
          base_experience = $5, height = $6, weight = $7
      WHERE id = $8
    `;
    await postgresPool.query(query, [
      pokemon.name,
      pokemon.type,
      pokemon.level,
      pokemon.spriteUrl,
      pokemon.baseExperience,
      pokemon.height,
      pokemon.weight,
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
