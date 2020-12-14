import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { getConfig } from '../config';
import { IConfig } from '../models/Config';
import NewResponse from '../models/Response';

const defaultConfig = getConfig();

export interface IErrorHandlerOptions {
  isDebugMode: boolean;
  isAPIResponse: boolean;
}

const errorHandler = (options: IConfig): ErrorRequestHandler => (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error) {
    if (options.mode === 'api') {
      (res as NewResponse).error(error, 500);
      return;
    } else {
      res.statusCode = 500;
      res.end(error + '\n');
    }
  }
  next();
};

export default (options: IConfig = defaultConfig): ErrorRequestHandler[] => {
  const errorHandlers: ErrorRequestHandler[] = [errorHandler(options)];

  return errorHandlers;
};
