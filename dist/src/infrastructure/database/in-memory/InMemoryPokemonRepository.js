"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPokemonRepository = void 0;
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
}
exports.InMemoryPokemonRepository = InMemoryPokemonRepository;
