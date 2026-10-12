"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePokemonLevelUseCase = void 0;
const app_error_1 = require("../../domain/errors/app.error.js");
class UpdatePokemonLevelUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id, newLevel) {
        if (!Number.isInteger(newLevel) || newLevel < 1 || newLevel > 100) {
            throw new app_error_1.AppError('O nível deve ser um inteiro entre 1 e 100.', 400);
        }
        const pokemon = await this.pokemonRepository.findById(id);
        if (!pokemon) {
            throw new app_error_1.AppError('Pokemon not found', 404);
        }
        await this.pokemonRepository.updateLevel(id, newLevel);
    }
}
exports.UpdatePokemonLevelUseCase = UpdatePokemonLevelUseCase;
