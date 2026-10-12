"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountPokemonUseCase = void 0;
class CountPokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute() {
        return this.pokemonRepository.count();
    }
}
exports.CountPokemonUseCase = CountPokemonUseCase;
