import { PokemonStats } from '@domain/entities/Pokemon';

export interface ExternalPokemonDetails {
  // Número na Pokédex nacional (id da PokéAPI)
  id: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
  baseExperience: number | null;
  height: number;
  weight: number;
  stats: PokemonStats;
}

export interface IPokeApiGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
}
