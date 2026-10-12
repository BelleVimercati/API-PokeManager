"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPokemonByIdUseCase = void 0;
const app_error_1 = require("../../domain/errors/app.error.js");
class GetPokemonByIdUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id) {
        const pokemon = await this.pokemonRepository.findById(id);
        if (!pokemon) {
            throw new app_error_1.AppError('Pokemon not found', 404);
        }
        return pokemon;
    }
}
exports.GetPokemonByIdUseCase = GetPokemonByIdUseCase;
