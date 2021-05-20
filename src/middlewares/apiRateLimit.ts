import { NextFunction, Request, RequestHandler, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getIP} from '../util';



export default (options?: rateLimit.Options) : RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (options) {
    options.keyGenerator = (req: Request) => getIP(req);
    return rateLimit(options)(req, res, next);
  }
  next();
}

