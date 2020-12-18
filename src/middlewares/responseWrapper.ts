import { Request, Response, NextFunction, RequestHandler } from 'express';
// import { WrapperResponse } from '../models/Response';

export enum Status {
  success,
  fail,
  error,
}

interface SuccessResponseBody<T> {
  status: string;
  data: T;
  message?: string;
}

interface FailResponseBody<T> {
  status: string;
  error: T;
  message?: string;
}

type ResponseBody<T> = SuccessResponseBody<T> & FailResponseBody<T>;

export default (): Partial<RequestHandler> => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.success = <T>(data: T, statusCode = 200, message?: string) => {
    res.status(statusCode).json(format('success', data, null, message));
  };

  res.fail = <T>(error: T, statusCode = 400, message?: string) => {
    res.status(statusCode).json(format('fail', null, error, message));
  };

  res.error = <T>(error: T, statusCode = 500, message?: string) => {
    res.status(statusCode).json(format('error', null, error, message));
  };
  next();
};

const format = <T>(
  status: string,
  data?: T,
  error?: T,
  message?: string
): Partial<ResponseBody<T>> => {
  const obj: Partial<ResponseBody<T>> = {
    status,
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
