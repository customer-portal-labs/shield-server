import { Request, Response, NextFunction } from 'express';
import NewResponse from '../models/Response';

export interface IErrorHandlerOptions {
  isDebugMode: boolean;
  isAPIResponse: boolean;
}

const errorHandler = function (options: IErrorHandlerOptions) {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      if (options.isAPIResponse) {
        if (options.isDebugMode) {
          (res as NewResponse).error(error, 500, (res as NewResponse).sentry);
        } else {
          (res as NewResponse).error(error);
          return;
        }
      } else {
        res.statusCode = 500;
        res.end((res as NewResponse).sentry + '\n');
      }
    }
    next();
  };
};

export default errorHandler;
