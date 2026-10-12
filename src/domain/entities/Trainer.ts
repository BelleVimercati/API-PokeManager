export interface TrainerProps {
  id?: number;
  name: string;
  email: string | null;
  specialty: string | null;
}

export class Trainer {
  private readonly props: TrainerProps;

  constructor(props: TrainerProps) {
    this.props = props;
  }

  public get id(): number | undefined {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get email(): string | null {
    return this.props.email;
  }

  public get specialty(): string | null {
    return this.props.specialty;
  }
}
