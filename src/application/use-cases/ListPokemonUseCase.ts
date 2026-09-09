import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class ListPokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(filter?: { type?: string }) {
    const all = await this.pokemonRepository.findAll();

    if (!filter?.type) return all;
    return all.filter(
      (pokemon) =>
        pokemon.type.toLowerCase() === filter.type?.toLocaleLowerCase(),
    );
  }
}
