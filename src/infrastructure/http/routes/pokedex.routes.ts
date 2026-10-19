import { Router } from 'express';
import { makePokedexController } from '@main/factories/makePokedexController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import { searchPokedexQuerySchema } from '@infrastructure/http/schemas/pokedex-schemas';

const pokedexController = makePokedexController();

const router = Router();

router.get(
  '/search',
  validateRequest({ query: searchPokedexQuerySchema }),
  (req, res) => pokedexController.search(req, res),
);

export { router as pokedexRoutes };
