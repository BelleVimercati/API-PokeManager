import { Request, Response } from 'express';
import { ExternalPokemonDetails } from '@domain/gateways/IPokeApiGateway';
import { SearchPokedexUseCase } from '@application/use-cases/Pokedex/SearchPokedexUseCase';

export class PokedexController {
  constructor(private readonly searchPokedexUseCase: SearchPokedexUseCase) {}

  async search(req: Request, res: Response): Promise<Response> {
    // O name já foi validado e normalizado pelo searchPokedexQuerySchema
    const name = String(req.query.name);
    const details = await this.searchPokedexUseCase.execute(name);
    return res.status(200).json({ data: this.toResponse(details) });
  }

  private toResponse(details: ExternalPokemonDetails) {
    return {
      pokedexId: details.id,
      name: details.name,
      types: details.types,
      spriteUrl: details.spriteUrl,
      baseExperience: details.baseExperience,
      height: details.height,
      weight: details.weight,
      stats: details.stats,
    };
  }
}
