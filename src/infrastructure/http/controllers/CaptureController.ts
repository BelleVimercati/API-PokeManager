import { Request, Response } from 'express';
import { Pokemon } from '@domain/entities/Pokemon';
import { CapturePokemonUseCase } from '@application/use-cases/Capture/CapturePokemonUseCase';
import { GetTrainerTeamUseCase } from '@application/use-cases/Capture/GetTrainerTeamUseCase';
import { ReleasePokemonUseCase } from '@application/use-cases/Capture/ReleasePokemonUseCase';

export class CaptureController {
  constructor(
    private readonly capturePokemonUseCase: CapturePokemonUseCase,
    private readonly getTrainerTeamUseCase: GetTrainerTeamUseCase,
    private readonly releasePokemonUseCase: ReleasePokemonUseCase,
  ) {}

  async capture(
    req: Request<{ trainerId: string }>,
    res: Response,
  ): Promise<Response> {
    // O trainerId já foi validado e convertido pelo trainerIdRouteParamsSchema
    const trainerId = Number(req.params.trainerId);
    const { name } = req.body;
    const pokemon = await this.capturePokemonUseCase.execute({
      trainerId,
      pokemonName: name,
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

  async release(
    req: Request<{ trainerId: string; pokemonId: string }>,
    res: Response,
  ): Promise<Response> {
    await this.releasePokemonUseCase.execute({
      trainerId: Number(req.params.trainerId),
      pokemonId: req.params.pokemonId,
    });
    return res.status(204).send();
  }

  private toResponse(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      pokedexId: pokemon.pokedexId,
      name: pokemon.name,
      types: pokemon.types,
      spriteUrl: pokemon.spriteUrl,
      level: pokemon.level,
      stats: pokemon.stats,
      trainerId: pokemon.trainerId,
      capturedAt: pokemon.capturedAt ?? null,
    };
  }
}
