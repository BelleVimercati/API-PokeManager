import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class CountPokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(): Promise<number> {
    return this.pokemonRepository.count();
  }
}
