import express, { Request, RequestHandler } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import history from 'connect-history-api-fallback';
import { IConfig } from '../models/Config';
import rewrite from './rewrite';
import proxy from './proxy';
import bodyParser from 'body-parser';
import responseWrapper from './responseWrapper';
import health from '../routes/health';
import info from '../routes/info';
import { getConfig } from '../config';
import Logger from '../logger';

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

  morgan.token('remote-user', (req: Request) => {
    const rhUser = req.cookies['rh_user'];
    if (rhUser) {
      return rhUser.substring(0, rhUser.indexOf('|'));
    }
    return 'nonloginuser';
  });

  const morganStream = {
    write: async (message: string) => {
      try {
        await Logger.info(message, {
          sourcetype: 'access_combined',
        });
      } catch (err) {
        console.error(err);
      }
    },
  };
  const middlewares: RequestHandler[] = [
    morgan('combined', {
      stream: morganStream,
    }),
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
    middlewares.push(responseWrapper() as RequestHandler);
  }

  return middlewares;
};
