import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { getIP } from '../util';

export default (opt: rateLimit.Options): rateLimit.RateLimit => {
  opt.keyGenerator = (req: Request) => {
    const ip = getIP(req);
    return ip;
  };
  return rateLimit(opt);
};
