"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPokemonRepository = void 0;
const Pokemon_1 = require("../../../domain/entities/Pokemon.js");
class InMemoryPokemonRepository {
    items = [];
    async create(pokemon) {
        this.items.push(pokemon);
    }
    async findById(id) {
        const pokemon = this.items.find((item) => item.id === id);
        if (!pokemon)
            return null;
        return pokemon;
    }
    async findAll() {
        return this.items;
    }
    async update(pokemon) {
        const index = this.items.findIndex((item) => item.id === pokemon.id);
        if (index !== -1) {
            this.items[index] = pokemon;
        }
    }
    async delete(id) {
        const pokemon = this.items.find((item) => item.id === id);
        if (pokemon) {
            this.items = this.items.filter((item) => item.id !== id);
        }
    }
    async findByType(type) {
        return this.items.filter((item) => item.type.toLowerCase() === type.toLowerCase());
    }
    async updateLevel(id, newLevel) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            const current = this.items[index];
            this.items[index] = new Pokemon_1.Pokemon({
                id: current.id,
                name: current.name,
                type: current.type,
                level: newLevel,
            });
        }
    }
}
exports.InMemoryPokemonRepository = InMemoryPokemonRepository;
