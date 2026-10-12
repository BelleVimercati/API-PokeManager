"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgPokemonRepository = void 0;
const Pokemon_1 = require("../../../domain/entities/Pokemon.js");
const connection_1 = require("./connection");
class PgPokemonRepository {
    async create(pokemon) {
        const query = `
      INSERT INTO pokemons (id, name, type)
      VALUES ($1, $2, $3)
    `;
        await connection_1.postgresPool.query(query, [pokemon.id, pokemon.name, pokemon.type]);
    }
    async findByName(name) {
        const query = `SELECT id, name, type FROM pokemons WHERE name = $1`;
        const result = await connection_1.postgresPool.query(query, [name]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return new Pokemon_1.Pokemon({ id: row.id, name: row.name, type: row.type });
    }
    async findAll() {
        const query = `SELECT id, name, type FROM pokemons`;
        const result = await connection_1.postgresPool.query(query);
        return result.rows.map((row) => new Pokemon_1.Pokemon({ id: row.id, name: row.name, type: row.type }));
    }
    async findById(id) {
        const query = `SELECT id, name, type FROM pokemons WHERE id = $1`;
        const result = await connection_1.postgresPool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return new Pokemon_1.Pokemon({ id: row.id, name: row.name, type: row.type });
    }
    async update(pokemon) {
        const query = `
      UPDATE pokemons
      SET name = $1, type = $2
      WHERE id = $3
    `;
        await connection_1.postgresPool.query(query, [pokemon.name, pokemon.type, pokemon.id]);
    }
    async delete(id) {
        const query = `DELETE FROM pokemons WHERE id = $1`;
        await connection_1.postgresPool.query(query, [id]);
    }
}
exports.PgPokemonRepository = PgPokemonRepository;
