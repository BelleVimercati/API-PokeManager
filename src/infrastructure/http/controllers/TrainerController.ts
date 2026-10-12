import { Request, Response } from 'express';
import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/app.error';
import { ListTrainersUseCase } from '@application/use-cases/ListTrainersUseCase';
import { GetTrainerByIdUseCase } from '@application/use-cases/GetTrainerByIdUseCase';
import { CreateTrainerUseCase } from '@application/use-cases/CreateTrainerUseCase';
import { UpdateTrainerUseCase } from '@application/use-cases/UpdateTrainerUseCase';

export class TrainerController {
  constructor(
    private readonly listTrainersUseCase: ListTrainersUseCase,
    private readonly getTrainerByIdUseCase: GetTrainerByIdUseCase,
    private readonly createTrainerUseCase: CreateTrainerUseCase,
    private readonly updateTrainerUseCase: UpdateTrainerUseCase,
  ) {}

  async list(_req: Request, res: Response): Promise<Response> {
    const trainers = await this.listTrainersUseCase.execute();
    return res.status(200).json({ data: trainers.map(this.toResponse) });
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    const id = this.parseId(req.params.id);
    const trainer = await this.getTrainerByIdUseCase.execute(id);
    return res.status(200).json({
      message: 'Trainer retrieved successfully',
      data: this.toResponse(trainer),
    });
  }

  async create(req: Request, res: Response): Promise<Response> {
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

  async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
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

  private parseId(rawId: string): number {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) {
      throw new AppError('O id do treinador deve ser um número inteiro.', 400);
    }
    return id;
  }

  private toResponse(trainer: Trainer) {
    return {
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      specialty: trainer.specialty,
    };
  }
}
