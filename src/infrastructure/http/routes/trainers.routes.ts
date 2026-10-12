import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';

const trainerController = makeTrainerController();

const router = Router();

router.get('/', (req, res) => trainerController.list(req, res));
router.get('/:id', (req, res) => trainerController.getById(req, res));
router.post('/', (req, res) => trainerController.create(req, res));
router.put('/:id', (req, res) => trainerController.update(req, res));

export { router as trainerRoutes };
