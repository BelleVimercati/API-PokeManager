import { Request, Response } from 'express';
import { Pokemon } from '@domain/entities/Pokemon';
import { ListPokemonUseCase } from '@application/use-cases/Pokemon/ListPokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/Pokemon/GetPokemonByIdUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/Pokemon/CreatePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/Pokemon/UpdatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/Pokemon/DeletePokemonUseCase';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/Pokemon/UpdatePokemonLevelUseCase';
import { CountPokemonUseCase } from '@application/use-cases/Pokemon/CountPokemonUseCase';
import { SearchPokemonByNameUseCase } from '@application/use-cases/Pokemon/SearchPokemonByNameUseCase';

export class PokemonController {
  constructor(
    private readonly listPokemonUseCase: ListPokemonUseCase,
    private readonly getPokemonByIdUseCase: GetPokemonByIdUseCase,
    private readonly createPokemonUseCase: CreatePokemonUseCase,
    private readonly updatePokemonUseCase: UpdatePokemonUseCase,
    private readonly deletePokemonUseCase: DeletePokemonUseCase,
    private readonly updatePokemonLevelUseCase: UpdatePokemonLevelUseCase,
    private readonly countPokemonUseCase: CountPokemonUseCase,
    private readonly searchPokemonByNameUseCase: SearchPokemonByNameUseCase,
  ) {}

  async count(_req: Request, res: Response): Promise<Response> {
    const total = await this.countPokemonUseCase.execute();
    return res.status(200).json({ total });
  }

  async list(req: Request, res: Response): Promise<Response> {
    const type =
      typeof req.query.type === 'string' ? req.query.type : undefined;
    const pokemons = await this.listPokemonUseCase.execute({ type });
    return res
      .status(200)
      .json({ data: pokemons.map((pokemon) => this.toResponse(pokemon)) });
  }

  async create(req: Request, res: Response): Promise<Response> {
    // spriteUrl, baseExperience, height e weight vêm da PokéAPI, não do cliente
    const { name, type, level } = req.body;
    const pokemon = await this.createPokemonUseCase.execute({
      name,
      type,
      level,
    });
    return res.status(201).json({
      message: 'Pokemon created successfully',
      data: this.toResponse(pokemon),
    });
  }

  async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deletePokemonUseCase.execute(id);
    return res.status(200).json({ message: 'Pokemon deleted successfully' });
  }

  async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, type, level } = req.body;
    const updatedPokemon = await this.updatePokemonUseCase.execute({
      id,
      name,
      type,
      level,
    });
    return res.status(200).json({
      message: 'Pokemon updated successfully',
      data: this.toResponse(updatedPokemon),
    });
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    const { id } = req.params;
    const pokemon = await this.getPokemonByIdUseCase.execute(id);
    return res.status(200).json({
      message: 'Pokemon retrieved successfully',
      data: this.toResponse(pokemon),
    });
  }

  async updateLevel(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    await this.updatePokemonLevelUseCase.execute(req.params.id, req.body.level);
    return res
      .status(200)
      .json({ message: 'Pokemon level updated successfully' });
  }

  async search(req: Request, res: Response): Promise<Response> {
    const term = typeof req.query.name === 'string' ? req.query.name : '';
    const pokemons = await this.searchPokemonByNameUseCase.execute(term);
    return res
      .status(200)
      .json({ data: pokemons.map((pokemon) => this.toResponse(pokemon)) });
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
    };
  }
}
