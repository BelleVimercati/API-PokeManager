"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePokemonUseCase = void 0;
const app_error_1 = require("../../domain/errors/app.error.js");
class DeletePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id) {
        const existingPokemon = await this.pokemonRepository.findById(id);
        if (!existingPokemon) {
            throw new app_error_1.AppError('Pokemon not found', 404);
        }
        await this.pokemonRepository.delete(id);
    }
}
exports.DeletePokemonUseCase = DeletePokemonUseCase;
