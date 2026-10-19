// Atributos base (stats) oficiais da PokéAPI
export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

// Pokémon capturado: sempre pertence a um treinador
export interface PokemonProps {
  id: string;
  pokedexId: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
  level: number;
  stats: PokemonStats;
  trainerId: number;
  capturedAt?: Date;
}

export class Pokemon {
  private readonly props: PokemonProps;

  constructor(props: PokemonProps) {
    this.props = props;
  }

  public get id(): string {
    return this.props.id;
  }

  public get pokedexId(): number {
    return this.props.pokedexId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get types(): string[] {
    return this.props.types;
  }

  public get spriteUrl(): string | null {
    return this.props.spriteUrl;
  }

  public get level(): number {
    return this.props.level;
  }

  public get stats(): PokemonStats {
    return this.props.stats;
  }

  public get trainerId(): number {
    return this.props.trainerId;
  }

  public get capturedAt(): Date | undefined {
    return this.props.capturedAt;
  }
}
