export interface ExternalPokemonDetails {
  name: string;
  types: string[];
  spriteUrl: string | null;
  baseExperience: number | null;
  height: number;
  weight: number;
}

export interface PokemonExternalGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
}
