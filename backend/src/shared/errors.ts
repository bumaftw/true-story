export class ConfigError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class HttpError extends Error {
  status: number;
  constructor(message: string | undefined, status = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string | undefined) {
    super(message);
    this.status = 400;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string | undefined) {
    super(message);
    this.status = 401;
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string | undefined) {
    super(message);
    this.status = 403;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string | undefined) {
    super(message);
    this.status = 404;
  }
}

export class AlreadyExistsError extends HttpError {
  constructor(message: string | undefined) {
    super(message);
    this.status = 409;
  }
}
