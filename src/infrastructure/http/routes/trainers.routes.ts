import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import {
  createTrainerSchema,
  updateTrainerSchema,
  trainerIdParamsSchema,
} from '@infrastructure/http/schemas/trainer-schemas';

const trainerController = makeTrainerController();

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

export { router as trainerRoutes };
