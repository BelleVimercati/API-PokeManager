"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrainerUseCase = void 0;
const Trainer_1 = require("../../domain/entities/Trainer.js");
const app_error_1 = require("../../domain/errors/app.error.js");
class CreateTrainerUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute(data) {
        if (!data.name?.trim()) {
            throw new app_error_1.AppError('O nome do treinador é obrigatório.', 400);
        }
        const trainer = new Trainer_1.Trainer({
            name: data.name,
            email: data.email ?? null,
            specialty: data.specialty ?? null,
        });
        return this.trainerRepository.create(trainer);
    }
}
exports.CreateTrainerUseCase = CreateTrainerUseCase;
