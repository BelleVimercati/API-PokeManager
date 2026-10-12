"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPokemonByNameUseCase = void 0;
class SearchPokemonByNameUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(name) {
        return this.pokemonRepository.searchByName(name);
    }
}
exports.SearchPokemonByNameUseCase = SearchPokemonByNameUseCase;
