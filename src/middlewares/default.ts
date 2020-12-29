import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import history from 'connect-history-api-fallback';
import helmet from 'helmet';
import merge from 'lodash/merge';
import { getConfig } from '../config';
import { ShieldConfig } from '../models/Config';
import health from '../routes/health';
import info from '../routes/info';
import { log } from './log';
import rewrite from './rewrite';
import proxy from './proxy';
import responseWrapper from './responseWrapper';

export const defaultMiddlewares = (
  conf: Partial<ShieldConfig> = getConfig()
): RequestHandler[] => {
  const options = merge(getConfig(), conf);

  const middlewares: RequestHandler[] = [
    log(options),
    helmet(options.helmetOption),
    cookieParser(),
  ];

  if (options.compression) {
    middlewares.push(compression());
  }

  if (options.cors) {
    middlewares.push(cors(options.corsOption));
  }

  if (options.rewrite) {
    middlewares.push(
      rewrite({
        rules: options.rewrite,
      })
    );
  }

  if (options.proxies) {
    middlewares.push(proxy(options.proxies));
  }

  if (options.historyApiFallback) {
    middlewares.push(history({ verbose: options.debug }));
  }

  if (options.staticDir) {
    middlewares.push(express.static(options.staticDir));
  }

  middlewares.push(health);
  middlewares.push(info(options));

  if (options.mode === 'api') {
    middlewares.push(bodyParser.json());

    if (options.responseWrapper) {
      middlewares.push(responseWrapper() as RequestHandler);
    }
  }

  return middlewares;
};
