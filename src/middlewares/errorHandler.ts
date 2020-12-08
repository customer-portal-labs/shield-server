import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import * as Sentry from '@sentry/node';
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
      if (options.debug) {
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

export default (options: IConfig = defaultConfig): ErrorRequestHandler[] => {
  const errorHandlers: ErrorRequestHandler[] = [];
  if (options.isSentrySupport) {
    // The error handler must be before any other error middleware and after all controllers
    errorHandlers.push(Sentry.Handlers.errorHandler());
  }
  errorHandlers.push(errorHandler(options));

  return errorHandlers;
};
