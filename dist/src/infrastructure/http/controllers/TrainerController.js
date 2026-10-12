"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerController = void 0;
const app_error_1 = require("../../../domain/errors/app.error.js");
class TrainerController {
    listTrainersUseCase;
    getTrainerByIdUseCase;
    createTrainerUseCase;
    updateTrainerUseCase;
    constructor(listTrainersUseCase, getTrainerByIdUseCase, createTrainerUseCase, updateTrainerUseCase) {
        this.listTrainersUseCase = listTrainersUseCase;
        this.getTrainerByIdUseCase = getTrainerByIdUseCase;
        this.createTrainerUseCase = createTrainerUseCase;
        this.updateTrainerUseCase = updateTrainerUseCase;
    }
    async list(_req, res) {
        const trainers = await this.listTrainersUseCase.execute();
        return res.status(200).json({ data: trainers.map(this.toResponse) });
    }
    async getById(req, res) {
        const id = this.parseId(req.params.id);
        const trainer = await this.getTrainerByIdUseCase.execute(id);
        return res.status(200).json({
            message: 'Trainer retrieved successfully',
            data: this.toResponse(trainer),
        });
    }
    async create(req, res) {
        const { name, email, specialty } = req.body;
        const trainer = await this.createTrainerUseCase.execute({
            name,
            email,
            specialty,
        });
        return res.status(201).json({
            message: 'Trainer created successfully',
            data: this.toResponse(trainer),
        });
    }
    async update(req, res) {
        const id = this.parseId(req.params.id);
        const { name, email, specialty } = req.body;
        const trainer = await this.updateTrainerUseCase.execute({
            id,
            name,
            email,
            specialty,
        });
        return res.status(200).json({
            message: 'Trainer updated successfully',
            data: this.toResponse(trainer),
        });
    }
    parseId(rawId) {
        const id = Number(rawId);
        if (!Number.isInteger(id) || id < 1) {
            throw new app_error_1.AppError('O id do treinador deve ser um número inteiro.', 400);
        }
        return id;
    }
    toResponse(trainer) {
        return {
            id: trainer.id,
            name: trainer.name,
            email: trainer.email,
            specialty: trainer.specialty,
        };
    }
}
exports.TrainerController = TrainerController;
