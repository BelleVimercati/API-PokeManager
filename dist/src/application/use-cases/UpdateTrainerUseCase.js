"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrainerUseCase = void 0;
const Trainer_1 = require("../../domain/entities/Trainer.js");
const app_error_1 = require("../../domain/errors/app.error.js");
class UpdateTrainerUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute(data) {
        const existingTrainer = await this.trainerRepository.findById(data.id);
        if (!existingTrainer) {
            throw new app_error_1.AppError('Trainer not found', 404);
        }
        const updatedTrainer = new Trainer_1.Trainer({
            id: existingTrainer.id,
            name: data.name ?? existingTrainer.name,
            email: data.email ?? existingTrainer.email,
            specialty: data.specialty ?? existingTrainer.specialty,
        });
        await this.trainerRepository.update(updatedTrainer);
        return updatedTrainer;
    }
}
exports.UpdateTrainerUseCase = UpdateTrainerUseCase;
