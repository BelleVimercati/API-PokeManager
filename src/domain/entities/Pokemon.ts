export interface PokemonProps {
  id: string;
  name: string;
  type: string;
  level: number;
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
}
