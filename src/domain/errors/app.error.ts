export class AppError extends Error {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}
