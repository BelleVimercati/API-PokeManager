import { AppError } from './app.error';

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Serviço indisponível no momento') {
    super(message, 503);
  }
}
