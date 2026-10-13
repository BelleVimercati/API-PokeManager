import { ListPokemonUseCase } from '@application/use-cases/Pokemon/ListPokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/Pokemon/GetPokemonByIdUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/Pokemon/CreatePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/Pokemon/UpdatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/Pokemon/DeletePokemonUseCase';
import { PokemonController } from '@infrastructure/http/controllers/PokemonController';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/Pokemon/UpdatePokemonLevelUseCase';
import { CountPokemonUseCase } from '@application/use-cases/Pokemon/CountPokemonUseCase';
import { SearchPokemonByNameUseCase } from '@application/use-cases/Pokemon/SearchPokemonByNameUseCase';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prismaPokemon.repository';
import { PokeApiAxiosGateway } from '@infrastructure/gateways/poke-api-axios-gateway';

const repository = new PrismaPokemonRepository();
const pokemonExternalGateway = new PokeApiAxiosGateway();

export function makePokemonController(): PokemonController {
  const listPokemonUseCase = new ListPokemonUseCase(repository);
  const updatePokemonLevelUseCase = new UpdatePokemonLevelUseCase(repository);
  const getPokemonByIdUseCase = new GetPokemonByIdUseCase(repository);
  const createPokemonUseCase = new CreatePokemonUseCase(
    repository,
    pokemonExternalGateway,
  );
  const updatePokemonUseCase = new UpdatePokemonUseCase(repository);
  const deletePokemonUseCase = new DeletePokemonUseCase(repository);
  const countPokemonUseCase = new CountPokemonUseCase(repository);
  const searchPokemonByNameUseCase = new SearchPokemonByNameUseCase(repository);

  return new PokemonController(
    listPokemonUseCase,
    getPokemonByIdUseCase,
    createPokemonUseCase,
    updatePokemonUseCase,
    deletePokemonUseCase,
    updatePokemonLevelUseCase,
    countPokemonUseCase,
    searchPokemonByNameUseCase,
  );
}
