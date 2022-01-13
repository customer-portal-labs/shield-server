import { Request } from 'express';
import rateLimit, {
  Options,
  RateLimitRequestHandler,
} from 'express-rate-limit';
import { getIP } from '../util';

export default (
  opt: Omit<Partial<Options>, 'store'>
): RateLimitRequestHandler => {
  return rateLimit({
    ...opt,
    keyGenerator: (req: Request) => {
      const ip = getIP(req);
      return ip;
    },
  });
};
