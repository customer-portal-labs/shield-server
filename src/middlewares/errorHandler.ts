import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { config } from '../config';
import { ShieldConfig } from '../models/Config';
import { Response as NewResponse } from '../models/Response';
import { logger } from '../logger';

export interface IErrorHandlerOptions {
  isDebugMode: boolean;
  isAPIResponse: boolean;
}

const errorHandler = (options: ShieldConfig): ErrorRequestHandler => (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error) {
    logger.error({
      url: req.url,
      error: error.message,
      message: error.stack,
    });
    if (options.mode === 'api') {
      (res as NewResponse).error(error.message, 500, error.stack);
      return;
    } else {
      res.statusCode = 500;
      res.end(error + '\n');
    }
  }
  next();
};

export const defaultErrorHandlers = (
  options: ShieldConfig = config
): ErrorRequestHandler[] => {
  const errorHandlers: ErrorRequestHandler[] = [errorHandler(options)];

  return errorHandlers;
};
