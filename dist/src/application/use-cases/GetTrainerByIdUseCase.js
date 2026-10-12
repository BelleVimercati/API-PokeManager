"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTrainerByIdUseCase = void 0;
const app_error_1 = require("../../domain/errors/app.error.js");
class GetTrainerByIdUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute(id) {
        const trainer = await this.trainerRepository.findById(id);
        if (!trainer) {
            throw new app_error_1.AppError('Trainer not found', 404);
        }
        return trainer;
    }
}
exports.GetTrainerByIdUseCase = GetTrainerByIdUseCase;
