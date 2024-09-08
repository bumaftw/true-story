export type ErrorResponse = {
  error: {
    name: string;
    message: string;
    status: number;
    stack?: string;
  };
};

export class NetworkError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}
