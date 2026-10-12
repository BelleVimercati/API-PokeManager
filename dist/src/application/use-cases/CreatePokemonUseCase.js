"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePokemonUseCase = void 0;
const Pokemon_1 = require("../../domain/entities/Pokemon.js");
const node_crypto_1 = require("node:crypto");
class CreatePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(data) {
        const id = (0, node_crypto_1.randomUUID)();
        const newPokemon = new Pokemon_1.Pokemon({ ...data, id, level: data.level ?? 1 });
        await this.pokemonRepository.create(newPokemon);
        return newPokemon;
    }
}
exports.CreatePokemonUseCase = CreatePokemonUseCase;
