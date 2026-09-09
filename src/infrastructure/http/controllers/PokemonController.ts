import { Request, Response } from 'express';
import { ListPokemonUseCase } from '@application/use-cases/ListPokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/GetPokemonByIdUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/CreatePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/UpdatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/DeletePokemonUseCase';

export class PokemonController {
  constructor(
    private readonly listPokemonUseCase: ListPokemonUseCase,
    private readonly getPokemonByIdUseCase: GetPokemonByIdUseCase,
    private readonly createPokemonUseCase: CreatePokemonUseCase,
    private readonly updatePokemonUseCase: UpdatePokemonUseCase,
    private readonly deletePokemonUseCase: DeletePokemonUseCase,
  ) {}

  async list(req: Request, res: Response): Promise<Response> {
    const type =
      typeof req.query.type === 'string' ? req.query.type : undefined;
    const pokemons = await this.listPokemonUseCase.execute({ type });

    const formattedPokemons = pokemons.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
    }));
    return res.status(200).json({ data: formattedPokemons });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, type } = req.body;
    const pokemon = await this.createPokemonUseCase.execute({ name, type });
    return res.status(201).json({
      message: 'Pokemon created successfully',
      data: { name: pokemon.name, type: pokemon.type },
    });
  }

  async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deletePokemonUseCase.execute(id);
    return res.status(200).json({ message: 'Pokemon deleted successfully' });
  }

  async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, type } = req.body;
    const updatedPokemon = await this.updatePokemonUseCase.execute({
      id,
      name,
      type,
    });
    return res.status(200).json({
      message: 'Pokemon updated successfully',
      data: { name: updatedPokemon.name, type: updatedPokemon.type },
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
      data: { id: pokemon.id, name: pokemon.name, type: pokemon.type },
    });
  }
}
