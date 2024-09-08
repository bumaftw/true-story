export type ErrorResponse = {
  error: {
    name: string;
    message: string;
    status: number;
    stack?: string;
  };
};
