import { Request, Response, NextFunction } from 'express';

export default function () {
  return (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace(/^\/labsbeta\//, '/labs/');
    next();
  };
}
