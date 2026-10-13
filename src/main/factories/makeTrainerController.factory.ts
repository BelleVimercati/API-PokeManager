import { ListTrainersUseCase } from '@application/use-cases/Trainer/ListTrainersUseCase';
import { GetTrainerByIdUseCase } from '@application/use-cases/Trainer/GetTrainerByIdUseCase';
import { CreateTrainerUseCase } from '@application/use-cases/Trainer/CreateTrainerUseCase';
import { UpdateTrainerUseCase } from '@application/use-cases/Trainer/UpdateTrainerUseCase';
import { TrainerController } from '@infrastructure/http/controllers/TrainerController';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainers.repository';

const repository = new PrismaTrainerRepository();

export function makeTrainerController(): TrainerController {
  return new TrainerController(
    new ListTrainersUseCase(repository),
    new GetTrainerByIdUseCase(repository),
    new CreateTrainerUseCase(repository),
    new UpdateTrainerUseCase(repository),
  );
}
