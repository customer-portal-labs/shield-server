import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RewriteRule } from '../models/Config';

export interface IRewriteOptions {
  rules: RewriteRule[];
}

export default (options: IRewriteOptions): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (options.rules) {
    options.rules.forEach((rule) => {
      req.url = req.url.replace(rule.from, rule.to);
    });
  }
  next();
};
