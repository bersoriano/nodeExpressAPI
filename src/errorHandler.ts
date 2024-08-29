import { Request, Response, NextFunction } from 'express';

type ErrorWithStatus = Error & { status?: number };

type ErrorResponse = {
  message: string;
  error?: Record<string, unknown>;
};

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

const isErrorWithStatus = (error: unknown): error is ErrorWithStatus => {
  return error instanceof Error && 'status' in error;
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (err instanceof HttpError) {
    statusCode = err.status;
    errorMessage = err.message;
  } else if (isErrorWithStatus(err) && err.status) {
    statusCode = err.status;
    errorMessage = err.message;
  }

  const errorResponse: ErrorResponse = {
    message: errorMessage,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error = err instanceof Error ? { stack: err.stack } : { unknown: String(err) };
  }

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError(`Not Found - ${req.originalUrl}`));
};