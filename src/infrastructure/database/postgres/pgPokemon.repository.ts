import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { postgresPool } from './connection';

export class PgPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    const query = `
      INSERT INTO pokemons (id, name, type)
      VALUES ($1, $2, $3)
    `;
    await postgresPool.query(query, [pokemon.id, pokemon.name, pokemon.type]);
  }

  async findByName(name: string): Promise<Pokemon | null> {
    const query = `SELECT id, name, type FROM pokemons WHERE name = $1`;
    const result = await postgresPool.query(query, [name]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Pokemon({ id: row.id, name: row.name, type: row.type });
  }

  async findAll(): Promise<Pokemon[]> {
    const query = `SELECT id, name, type FROM pokemons`;
    const result = await postgresPool.query(query);

    return result.rows.map(
      (row) => new Pokemon({ id: row.id, name: row.name, type: row.type }),
    );
  }

  async findById(id: string): Promise<Pokemon | null> {
    const query = `SELECT id, name, type FROM pokemons WHERE id = $1`;
    const result = await postgresPool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Pokemon({ id: row.id, name: row.name, type: row.type });
  }

  async update(pokemon: Pokemon): Promise<void> {
    const query = `
      UPDATE pokemons
      SET name = $1, type = $2
      WHERE id = $3
    `;
    await postgresPool.query(query, [pokemon.name, pokemon.type, pokemon.id]);
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM pokemons WHERE id = $1`;
    await postgresPool.query(query, [id]);
  }
}
