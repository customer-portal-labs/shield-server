import * as core from 'express-serve-static-core';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';
import compression from 'compression';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { getConfig } from '../config';
import responseWrapper from './responseWrapper';
import errorHandler from './errorHandler';
import health from '../routes/health';
import info from '../routes/info';
import { IConfig } from '../models/Config';
import { setProxies } from './proxy';
import rewrite from './rewrite';

const defaultConfig = getConfig();
/**
 * Use all default middlewares for Express app
 * This should be apply with any server type
 * @param app Express()
 */
export const useDefaultMiddlewares = (
  app: core.Express,
  config: IConfig = defaultConfig
) => {
  const morganOption = config.debug ? 'dev' : 'combined';
  if (config.isSentrySupport) {
    Sentry.init({
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
    });
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  }

  if (config.rewrite) {
    app.use(
      rewrite({
        rules: config.rewrite,
      })
    );
  }

  if (config.compress) {
    app.use(compression());
  }

  if (config.cors) {
    console.info(`cors: ${config.cors}`);
    app.use(cors());
  }

  app
    .use(compression())
    .use(
      helmet({
        contentSecurityPolicy: false,
        referrerPolicy: false,
      })
    )
    .use(health)
    .use(info(config));

  setProxies(app, config);

  if (config.historyApiFallback) {
    app.use(history({ verbose: config.debug }));
  }

  if (config.staticDir) {
    const publicPath = config.publicPath || '/';
    app.use(publicPath, express.static(config.staticDir));
  }

  app.use(morgan(morganOption));

  if (config.mode === 'api') {
    app.use(helmet());
    app.use(bodyParser.json()).use(responseWrapper);
  }
  return app;
};

export const useErrorHandler = (
  app: core.Express,
  config: IConfig = defaultConfig
) => {
  const isAPIResponse = config.mode === 'api';
  const isDebugMode = config.debug;
  if (config.isSentrySupport) {
    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());
  }
  app.use(errorHandler({ isAPIResponse, isDebugMode }));
  return app;
};
