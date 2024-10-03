import { ErrorResponse } from '../types';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../shared/errors';
import logger from '../shared/logger';

export function errorHandlerMiddleware(
  error: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isHttpError = error instanceof HttpError;
  const isJsonFormatError = error instanceof SyntaxError && 'body' in error;

  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorName = 'InternalServerError';

  if (isHttpError) {
    statusCode = error.status;
    errorMessage = error.message;
    errorName = error.name;
  } else if (isJsonFormatError) {
    statusCode = 400;
    errorName = 'Bad JSON format';
    errorMessage = error.message;
  }

  const isInternalServerError = statusCode >= 500 && statusCode <= 599;

  if (isInternalServerError) {
    logger.error(error);
  } else {
    logger.debug(error);
  }

  res.status(statusCode).json({
    error: {
      name: errorName,
      message: errorMessage,
      status: statusCode,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  });
}
