import { Request, Response, NextFunction } from 'express';
import { IRewriteRule } from '../models/Config';

export interface IRewriteOptions {
  rules: IRewriteRule[];
}

export default function (options: IRewriteOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rules = options.rules;

    if (options.rules) {
      options.rules.forEach((rule) => {
        req.url = req.url.replace(rule.from, rule.to);
      });
    }
    next();
  };
}
