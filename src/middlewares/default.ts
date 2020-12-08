import express, { Request, RequestHandler } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import history from 'connect-history-api-fallback';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { IConfig } from '../models/Config';
import rewrite from './rewrite';
import proxy from './proxy';
import bodyParser from 'body-parser';
import responseWrapper from './responseWrapper';
import health from '../routes/health';
import info from '../routes/info';
import { getConfig } from '../config';

const defaultConfig = getConfig();

export default (options: IConfig = defaultConfig): RequestHandler[] => {
  morgan.token('remote-addr', (req: Request) => {
    const akamaiIP = req.header('True-Client-IP');
    const realIP = req.header('x-real-ip');
    const forwardedIP = req.header('x-forwarded-for');
    return (
      akamaiIP ||
      realIP ||
      forwardedIP ||
      req.ip ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
    );
  });
  const middlewares: RequestHandler[] = [
    morgan(options.morganFormat),
    helmet(options.helmetOption),
  ];

  if (options.compression) {
    middlewares.push(compression());
  }

  if (options.cors) {
    middlewares.push(cors(options.corsOption));
  }

  if (options.isSentrySupport) {
    Sentry.init({
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express(),
      ],
      tracesSampleRate: 1.0,
    });
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    middlewares.push(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    middlewares.push(Sentry.Handlers.tracingHandler());
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
    middlewares.push(responseWrapper() as RequestHandler);
  }

  return middlewares;
};
