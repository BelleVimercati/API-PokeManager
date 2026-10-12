import { PgTrainerRepository } from '@infrastructure/database/postgres/pgTrainer.repository';
import { ListTrainersUseCase } from '@application/use-cases/ListTrainersUseCase';
import { GetTrainerByIdUseCase } from '@application/use-cases/GetTrainerByIdUseCase';
import { CreateTrainerUseCase } from '@application/use-cases/CreateTrainerUseCase';
import { UpdateTrainerUseCase } from '@application/use-cases/UpdateTrainerUseCase';
import { TrainerController } from '@infrastructure/http/controllers/TrainerController';

const repository = new PgTrainerRepository();

export function makeTrainerController(): TrainerController {
  return new TrainerController(
    new ListTrainersUseCase(repository),
    new GetTrainerByIdUseCase(repository),
    new CreateTrainerUseCase(repository),
    new UpdateTrainerUseCase(repository),
  );
}
