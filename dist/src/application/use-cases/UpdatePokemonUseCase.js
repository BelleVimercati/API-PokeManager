"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePokemonUseCase = void 0;
const Pokemon_1 = require("../../domain/entities/Pokemon.js");
const app_error_1 = require("../../domain/errors/app.error.js");
class UpdatePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(data) {
        const existingPokemon = await this.pokemonRepository.findById(data.id);
        if (!existingPokemon) {
            throw new app_error_1.AppError('Pokemon not found', 404);
        }
        const updatedPokemon = new Pokemon_1.Pokemon({
            id: existingPokemon.id,
            name: data.name ?? existingPokemon.name,
            type: data.type ?? existingPokemon.type,
            level: data.level ?? existingPokemon.level,
        });
        await this.pokemonRepository.update(updatedPokemon);
        return updatedPokemon;
    }
}
exports.UpdatePokemonUseCase = UpdatePokemonUseCase;
