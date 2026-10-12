import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';

const pokemonController = makePokemonController();

const router = Router();

router.get('/', (req, res) => pokemonController.list(req, res));
router.get('/:id', (req, res) => pokemonController.getById(req, res));
router.post('/', (req, res) => pokemonController.create(req, res));
router.put('/:id', (req, res) => pokemonController.update(req, res));
router.delete('/:id', (req, res) => pokemonController.delete(req, res));

export { router as pokemonRoutes };
