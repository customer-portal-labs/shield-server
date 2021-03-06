import { Request, RequestHandler, Response, NextFunction } from 'express';
import morgan, { StreamOptions } from 'morgan';
import { logger } from '../logger';
import { ShieldConfig } from '../models/Config';
import { getIP } from '../util';

export const log = (options: ShieldConfig): RequestHandler => {
  morgan.token('remote-addr', (req: Request) => getIP(req));
  morgan.token('remote-user', (req: Request) => {
    const rhUser = req.cookies['rh_user'];
    if (rhUser) {
      return rhUser.substring(0, rhUser.indexOf('|'));
    }
    return 'nonloginuser';
  });

  let stream: StreamOptions = process.stdout;
  if (options.splunk.httpRequest) {
    stream = {
      write: async (message: string) => {
        try {
          await logger.info(message, {
            sourcetype: 'access_combined',
          });
        } catch (err) {
          console.error(err);
        }
      },
    };
  }

  let skip;
  if (options.morganSkip) {
    if (typeof options.morganSkip === 'string') {
      const skipUrl = options.morganSkip as string;
      skip = (req: Request) => req.url === skipUrl;
    } else if (typeof options.morganSkip === 'function') {
      skip = options.morganSkip;
    }
  }

  const opts: morgan.Options<Request, Response> = {
    stream,
  };

  if (skip) {
    opts.skip = skip as (req: Request, res: Response) => boolean;
  }

  return (req: Request, res: Response, next: NextFunction) =>
    morgan('combined', opts)(req, res, next);
};
