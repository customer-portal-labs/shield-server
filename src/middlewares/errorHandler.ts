import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import merge from 'lodash/merge';
import { getConfig } from '../config';
import { ShieldConfig } from '../models/Config';
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
      res.error(error.message, 500, error.stack);
      return;
    } else {
      res.statusCode = 500;
      res.end(error + '\n');
    }
  }
  next();
};

export const defaultErrorHandlers = (
  conf: Partial<ShieldConfig> = getConfig()
): ErrorRequestHandler[] => {
  const options = merge(getConfig(), conf);
  const errorHandlers: ErrorRequestHandler[] = [errorHandler(options)];

  return errorHandlers;
};
