import { Request, Response } from 'express';
import { ListPokemonUseCase } from '@application/use-cases/ListPokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/GetPokemonByIdUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/CreatePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/UpdatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/DeletePokemonUseCase';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/UpdatePokemonLevelUseCase';
import { CountPokemonUseCase } from '@application/use-cases/CountPokemonUseCase';
import { SearchPokemonByNameUseCase } from '@application/use-cases/SearchPokemonByNameUseCase';

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

    const formattedPokemons = pokemons.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
    }));
    return res.status(200).json({ data: formattedPokemons });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, type, level } = req.body;
    const pokemon = await this.createPokemonUseCase.execute({
      name,
      type,
      level,
    });
    return res.status(201).json({
      message: 'Pokemon created successfully',
      data: {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        level: pokemon.level,
      },
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
      data: {
        id: updatedPokemon.id,
        name: updatedPokemon.name,
        type: updatedPokemon.type,
        level: updatedPokemon.level,
      },
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
      data: {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        level: pokemon.level,
      },
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
    return res.status(200).json({
      data: pokemons.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        level: p.level,
      })),
    });
  }
}
