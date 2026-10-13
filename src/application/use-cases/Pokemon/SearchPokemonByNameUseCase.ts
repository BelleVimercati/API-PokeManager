import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { Pokemon } from '@domain/entities/Pokemon';

export class SearchPokemonByNameUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(name: string): Promise<Pokemon[]> {
    return this.pokemonRepository.searchByName(name);
  }
}
