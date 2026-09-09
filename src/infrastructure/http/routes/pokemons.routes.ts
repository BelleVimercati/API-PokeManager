import { Router } from 'express';
import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/InMemoryPokemonRepository';
import { ListPokemonUseCase } from '@application/use-cases/ListPokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/GetPokemonByIdUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/CreatePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/UpdatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/DeletePokemonUseCase';
import { PokemonController } from '@infrastructure/http/controllers/PokemonController';

const repository = new InMemoryPokemonRepository();

const pokemonController = new PokemonController(
  new ListPokemonUseCase(repository),
  new GetPokemonByIdUseCase(repository),
  new CreatePokemonUseCase(repository),
  new UpdatePokemonUseCase(repository),
  new DeletePokemonUseCase(repository),
);

const router = Router();

router.get('/', (req, res) => pokemonController.list(req, res));
router.get('/:id', (req, res) => pokemonController.getById(req, res));
router.post('/', (req, res) => pokemonController.create(req, res));
router.put('/:id', (req, res) => pokemonController.update(req, res));
router.delete('/:id', (req, res) => pokemonController.delete(req, res));

export { router as pokemonRoutes };
