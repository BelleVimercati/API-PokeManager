import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodType, ZodError } from 'zod';
import { AppError } from '@domain/errors/app.error';

interface RequestValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

// RequestHandler<any> evita que o middleware sobrescreva o tipo de req.params
// inferido pela rota (ex.: '/:id' -> { id: string }) nos handlers seguintes
export const validateRequest = (
  schemas: RequestValidationSchemas,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): RequestHandler<any> => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        const query = await schemas.query.parseAsync(req.query);
        // Express 5: req.query é um getter, não pode ser reatribuído diretamente
        Object.defineProperty(req, 'query', { value: query, writable: true });
      }

      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(
          req.params,
        )) as Request['params'];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issueDetails = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return next(
          new AppError('Dados de entrada inválidos', 400, issueDetails),
        );
      }
      next(error);
    }
  };
};
