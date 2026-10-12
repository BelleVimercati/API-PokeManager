import { PgPokemonRepository } from '@infrastructure/database/postgres/pgPokemon.repository';
import { ListPokemonUseCase } from '@application/use-cases/ListPokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/GetPokemonByIdUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/CreatePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/UpdatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/DeletePokemonUseCase';
import { PokemonController } from '@infrastructure/http/controllers/PokemonController';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/UpdatePokemonLevelUseCase';

const repository = new PgPokemonRepository();

export function makePokemonController(): PokemonController {
  const listPokemonUseCase = new ListPokemonUseCase(repository);
  const updatePokemonLevelUseCase = new UpdatePokemonLevelUseCase(repository);
  const getPokemonByIdUseCase = new GetPokemonByIdUseCase(repository);
  const createPokemonUseCase = new CreatePokemonUseCase(repository);
  const updatePokemonUseCase = new UpdatePokemonUseCase(repository);
  const deletePokemonUseCase = new DeletePokemonUseCase(repository);

  return new PokemonController(
    listPokemonUseCase,
    getPokemonByIdUseCase,
    createPokemonUseCase,
    updatePokemonUseCase,
    deletePokemonUseCase,
    updatePokemonLevelUseCase,
  );
}
