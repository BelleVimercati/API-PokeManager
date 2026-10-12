"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTrainerController = makeTrainerController;
const pgTrainer_repository_1 = require("../../infrastructure/database/postgres/pgTrainer.repository.js");
const ListTrainersUseCase_1 = require("../../application/use-cases/ListTrainersUseCase.js");
const GetTrainerByIdUseCase_1 = require("../../application/use-cases/GetTrainerByIdUseCase.js");
const CreateTrainerUseCase_1 = require("../../application/use-cases/CreateTrainerUseCase.js");
const UpdateTrainerUseCase_1 = require("../../application/use-cases/UpdateTrainerUseCase.js");
const TrainerController_1 = require("../../infrastructure/http/controllers/TrainerController.js");
const repository = new pgTrainer_repository_1.PgTrainerRepository();
function makeTrainerController() {
    return new TrainerController_1.TrainerController(new ListTrainersUseCase_1.ListTrainersUseCase(repository), new GetTrainerByIdUseCase_1.GetTrainerByIdUseCase(repository), new CreateTrainerUseCase_1.CreateTrainerUseCase(repository), new UpdateTrainerUseCase_1.UpdateTrainerUseCase(repository));
}
