import * as core from 'express-serve-static-core';
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

const config = getConfig();
/**
 * Use all default middlewares for Express app
 * This should be apply with any server type
 * @param app Express()
 */
export const useDefaultMiddlewares = (app: core.Express) => {
  const apiMode = app.get('apiMode');
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

  app.use(helmet());

  if (config.compress) {
    app.use(compression());
  }

  if (config.cors) {
    app.use(cors());
  }
  app
    .use(helmet())
    .use(compression())
    .use(
      history({
        verbose: config.debug,
        rewrites: [
          {
            from: /^\/labsbeta\/.*$/,
            to: (ctx) => '/labs/' + ctx.parsedUrl.pathname,
          },
        ],
      })
    );
  if (apiMode) {
    app.use(bodyParser.json()).use(responseWrapper);
  }
  return app;
};

export const useErrorHandler = (app: core.Express) => {
  const apiMode = app.get('apiMode');
  if (config.isSentrySupport) {
    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());
  }
  app.use(errorHandler({ isAPIResponse: apiMode }));
};
