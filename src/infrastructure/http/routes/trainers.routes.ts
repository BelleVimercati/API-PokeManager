import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { makeCaptureController } from '@main/factories/makeCaptureController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import {
  createTrainerSchema,
  updateTrainerSchema,
  trainerIdParamsSchema,
  trainerIdRouteParamsSchema,
  capturePokemonSchema,
  teamPokemonParamsSchema,
} from '@infrastructure/http/schemas/trainer-schemas';

const trainerController = makeTrainerController();
const captureController = makeCaptureController();

const router = Router();

router.get('/', (req, res) => trainerController.list(req, res));
router.get(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => trainerController.getById(req, res),
);
router.post('/', validateRequest({ body: createTrainerSchema }), (req, res) =>
  trainerController.create(req, res),
);
router.put(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema, body: updateTrainerSchema }),
  (req, res) => trainerController.update(req, res),
);
router.post(
  '/:trainerId/captures',
  validateRequest({
    params: trainerIdRouteParamsSchema,
    body: capturePokemonSchema,
  }),
  (req, res) => captureController.capture(req, res),
);
router.get(
  '/:trainerId/team',
  validateRequest({ params: trainerIdRouteParamsSchema }),
  (req, res) => captureController.getTeam(req, res),
);
router.delete(
  '/:trainerId/team/:pokemonId',
  validateRequest({ params: teamPokemonParamsSchema }),
  (req, res) => captureController.release(req, res),
);

export { router as trainerRoutes };
