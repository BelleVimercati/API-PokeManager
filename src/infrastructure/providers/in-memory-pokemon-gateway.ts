import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';

// Dados fixos no mesmo formato que o PokeApiAxiosGateway devolve
const POKEMONS: readonly ExternalPokemonDetails[] = [
  {
    name: 'pikachu',
    types: ['electric'],
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    baseExperience: 112,
    height: 4,
    weight: 60,
  },
  {
    name: 'charmander',
    types: ['fire'],
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    baseExperience: 62,
    height: 6,
    weight: 85,
  },
  {
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    baseExperience: 64,
    height: 7,
    weight: 69,
  },
];

export class InMemoryPokemonGateway implements IPokeApiGateway {
  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    const normalized = name.trim().toLowerCase();
    const pokemon = POKEMONS.find((p) => p.name === normalized);
    if (!pokemon) {
      return null;
    }
    // Devolve uma cópia para ninguém alterar a lista estática
    return { ...pokemon, types: [...pokemon.types] };
  }
}
