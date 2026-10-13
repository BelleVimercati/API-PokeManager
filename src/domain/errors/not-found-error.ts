import { AppError } from './app.error';

export class NotFoundError extends AppError {
  constructor(entityName: string, message?: string) {
    super(message ?? `${entityName} não encontrado`, 404);
  }
}
