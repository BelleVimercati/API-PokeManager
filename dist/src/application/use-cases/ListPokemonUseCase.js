"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPokemonUseCase = void 0;
class ListPokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(filter) {
        const all = await this.pokemonRepository.findAll();
        if (!filter?.type)
            return all;
        return all.filter((pokemon) => pokemon.type.toLowerCase() === filter.type?.toLocaleLowerCase());
    }
}
exports.ListPokemonUseCase = ListPokemonUseCase;
