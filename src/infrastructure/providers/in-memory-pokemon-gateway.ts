import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';

// Dados fixos no mesmo formato que o PokeApiAxiosGateway devolve
const POKEMONS: readonly ExternalPokemonDetails[] = [
  {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    baseExperience: 112,
    height: 4,
    weight: 60,
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
    },
  },
  {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    baseExperience: 62,
    height: 6,
    weight: 85,
    stats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
    },
  },
  {
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    baseExperience: 64,
    height: 7,
    weight: 69,
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
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
    return {
      ...pokemon,
      types: [...pokemon.types],
      stats: { ...pokemon.stats },
    };
  }
}
