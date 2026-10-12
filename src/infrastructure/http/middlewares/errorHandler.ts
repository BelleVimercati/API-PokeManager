import { Request, Response, NextFunction } from 'express';
import { AppError } from '@domain/errors/app.error';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    const responsePayload: Record<string, unknown> = {
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
    };

    if (error.details !== undefined && error.details !== null) {
      responsePayload.details = error.details;
    }

    return res.status(error.statusCode).json(responsePayload);
  }

  console.error('💥 [Uncaught Exception]:', error);

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Erro interno no servidor.',
  });
}
