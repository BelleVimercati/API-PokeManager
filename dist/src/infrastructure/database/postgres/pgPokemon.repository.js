"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgPokemonRepository = void 0;
const Pokemon_1 = require("../../../domain/entities/Pokemon.js");
const connection_1 = require("./connection");
class PgPokemonRepository {
    async create(pokemon) {
        const query = `
      INSERT INTO pokemons (id, name, type, level)
      VALUES ($1, $2, $3, $4)
    `;
        await connection_1.postgresPool.query(query, [
            pokemon.id,
            pokemon.name,
            pokemon.type,
            pokemon.level,
        ]);
    }
    /* Filtro de tipo */
    async findByType(type) {
        const query = `SELECT id, name, type, level FROM pokemons WHERE type = $1`;
        const result = await connection_1.postgresPool.query(query, [type]);
        return result.rows.map((row) => this.toEntity(row));
    }
    toEntity(row) {
        return new Pokemon_1.Pokemon({
            id: row.id,
            name: row.name,
            type: row.type,
            level: row.level,
        });
    }
    async findByName(name) {
        const query = `SELECT id, name, type, level FROM pokemons WHERE name = $1`;
        const result = await connection_1.postgresPool.query(query, [name]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return new Pokemon_1.Pokemon({
            id: row.id,
            name: row.name,
            type: row.type,
            level: row.level,
        });
    }
    async findAll() {
        const query = `SELECT id, name, type, level FROM pokemons`;
        const result = await connection_1.postgresPool.query(query);
        return result.rows.map((row) => new Pokemon_1.Pokemon({
            id: row.id,
            name: row.name,
            type: row.type,
            level: row.level,
        }));
    }
    async findById(id) {
        const query = `SELECT id, name, type, level FROM pokemons WHERE id = $1`;
        const result = await connection_1.postgresPool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return new Pokemon_1.Pokemon({
            id: row.id,
            name: row.name,
            type: row.type,
            level: row.level,
        });
    }
    async update(pokemon) {
        const query = `
      UPDATE pokemons
      SET name = $1, type = $2, level = $3
      WHERE id = $4
    `;
        await connection_1.postgresPool.query(query, [
            pokemon.name,
            pokemon.type,
            pokemon.level,
            pokemon.id,
        ]);
    }
    async delete(id) {
        const query = `DELETE FROM pokemons WHERE id = $1`;
        await connection_1.postgresPool.query(query, [id]);
    }
    async updateLevel(id, newLevel) {
        const query = `UPDATE pokemons SET level = $1 WHERE id = $2`;
        await connection_1.postgresPool.query(query, [newLevel, id]);
    }
}
exports.PgPokemonRepository = PgPokemonRepository;
