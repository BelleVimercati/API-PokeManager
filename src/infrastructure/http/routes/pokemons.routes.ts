import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import {
  createPokemonSchema,
  updatePokemonSchema,
  updatePokemonLevelSchema,
  pokemonIdParamsSchema,
  listPokemonQuerySchema,
  searchPokemonQuerySchema,
} from '@infrastructure/http/schemas/pokemon-schemas';

const pokemonController = makePokemonController();

const router = Router();

router.get(
  '/',
  validateRequest({ query: listPokemonQuerySchema }),
  (req, res) => pokemonController.list(req, res),
);
router.post('/', validateRequest({ body: createPokemonSchema }), (req, res) =>
  pokemonController.create(req, res),
);

// Rotas fixas precisam vir antes de '/:id', senão "search" e "count" viram um id
router.get(
  '/search',
  validateRequest({ query: searchPokemonQuerySchema }),
  (req, res) => pokemonController.search(req, res),
);
router.get('/count', (req, res) => pokemonController.count(req, res));

router.get(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => pokemonController.getById(req, res),
);
router.put(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema, body: updatePokemonSchema }),
  (req, res) => pokemonController.update(req, res),
);
router.delete(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => pokemonController.delete(req, res),
);
router.patch(
  '/:id/level',
  validateRequest({
    params: pokemonIdParamsSchema,
    body: updatePokemonLevelSchema,
  }),
  (req, res) => pokemonController.updateLevel(req, res),
);

export { router as pokemonRoutes };
