import { Request, NextFunction } from 'express';
import Response from '../models/Response';

export enum Status {
  success,
  fail,
  error,
}

interface SuccessResponseBody<T> {
  status: number;
  data: T;
  message?: string;
}

interface FailResponseBody<T> {
  status: number;
  error: T;
  message?: string;
}

interface ErrorResponseBody<T> extends FailResponseBody<T> {}

export default () => (req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data: T, statusCode = 200, message?: string) => {
    res.status(statusCode).json(format(statusCode, data, null, message));
  };

  res.fail = <T>(error: T, statusCode = 400, message?: string) => {
    res.status(statusCode).json(format(statusCode, null, error, message));
  };

  res.error = <T>(error: T, statusCode = 500, message?: string) => {
    res.status(statusCode).json(format(statusCode, null, error, message));
  };
};

const format = <T>(
  statusCode: number,
  data?: T,
  error?: T,
  message?: string
): SuccessResponseBody<T> | FailResponseBody<T> | ErrorResponseBody<T> => {
  const obj: any = {
    status: statusCode,
  };

  if (data) {
    obj.data = data;
  }

  if (error) {
    obj.error = error;
  }

  if (message) {
    obj.message = message;
  }
  return obj;
};
