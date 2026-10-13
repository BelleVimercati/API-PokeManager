import { Request, Response } from 'express';
import { Pokemon } from '@domain/entities/Pokemon';
import { CapturePokemonUseCase } from '@application/use-cases/Capture/CapturePokemonUseCase';
import { GetTrainerTeamUseCase } from '@application/use-cases/Capture/GetTrainerTeamUseCase';

export class CaptureController {
  constructor(
    private readonly capturePokemonUseCase: CapturePokemonUseCase,
    private readonly getTrainerTeamUseCase: GetTrainerTeamUseCase,
  ) {}

  async capture(
    req: Request<{ trainerId: string }>,
    res: Response,
  ): Promise<Response> {
    // O trainerId já foi validado e convertido pelo trainerIdRouteParamsSchema
    const trainerId = Number(req.params.trainerId);
    const { pokemonId } = req.body;
    const pokemon = await this.capturePokemonUseCase.execute({
      trainerId,
      pokemonId,
    });
    return res.status(201).json({
      message: 'Pokemon captured successfully',
      data: this.toResponse(pokemon),
    });
  }

  async getTeam(
    req: Request<{ trainerId: string }>,
    res: Response,
  ): Promise<Response> {
    const trainerId = Number(req.params.trainerId);
    const team = await this.getTrainerTeamUseCase.execute(trainerId);
    return res
      .status(200)
      .json({ data: team.map((pokemon) => this.toResponse(pokemon)) });
  }

  private toResponse(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      spriteUrl: pokemon.spriteUrl ?? null,
      baseExperience: pokemon.baseExperience ?? null,
      height: pokemon.height ?? null,
      weight: pokemon.weight ?? null,
      trainerId: pokemon.trainerId ?? null,
    };
  }
}
