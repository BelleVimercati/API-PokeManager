export interface PokemonProps {
  id: string;
  name: string;
  type: string;
  level: number;
  spriteUrl?: string | null;
  baseExperience?: number | null;
  height?: number | null;
  weight?: number | null;
}

export class Pokemon {
  private props: PokemonProps;

  constructor(props: PokemonProps) {
    this.props = props;
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get type(): string {
    return this.props.type;
  }

  public get level(): number {
    return this.props.level;
  }

  public set level(level: number) {
    this.props.level = level;
  }

  public get spriteUrl(): string | null | undefined {
    return this.props.spriteUrl;
  }
  public get baseExperience(): number | null | undefined {
    return this.props.baseExperience;
  }

  public get height(): number | null | undefined {
    return this.props.height;
  }

  public get weight(): number | null | undefined {
    return this.props.weight;
  }

  public setSpriteUrl(spriteUrl: string | null): void {
    this.props.spriteUrl = spriteUrl;
  }

  public setBaseExperience(baseExperience: number | null): void {
    this.props.baseExperience = baseExperience;
  }

  public setHeight(height: number | null): void {
    this.props.height = height;
  }

  public setWeight(weight: number | null): void {
    this.props.weight = weight;
  }
}
