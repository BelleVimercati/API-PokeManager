import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../../../generated/prisma/client';
import { AppError } from '@domain/errors/app.error';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/prisma-error-mapper';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  // 1. Erros Operacionais de Domínio e Regras de Negócio Mapeadas
  if (error instanceof AppError) {
    const responsePayload: Record<string, unknown> = {
      status: 'error',
      message: error.message,
    };

    if (error.details !== undefined && error.details !== null) {
      responsePayload.details = error.details;
    }
    return res.status(error.statusCode).json(responsePayload);
  }

  // 2. Erros de Validação da Borda (Zod)
  if (error instanceof ZodError) {
    const issueDetails = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Dados de entrada inválidos',
      details: issueDetails,
    });
  }

  // 3. Erros Conhecidos de Infraestrutura / Banco de Dados (Prisma)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = PrismaErrorMapper.toAppError(error);
    return res.status(appError.statusCode).json({
      status: 'error',
      message: appError.message,
    });
  }

  // 4. JSON malformado no corpo (lançado pelo express.json())
  if (
    error instanceof SyntaxError &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'JSON malformado no corpo da requisição',
    });
  }

  // 5. Erros Desconhecidos ou Críticos de Sistema (500 Internal Server Error)
  console.error('💥 [Unhandled System Error]:', error);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};
