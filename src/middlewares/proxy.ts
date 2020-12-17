import https from 'https';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { ProxyConfig } from '../models/Config';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export default (proxies: ProxyConfig[]): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const match = proxies.find((p) => req.url.startsWith(p.from));
  if (match) {
    const opt: Options = {
      changeOrigin: true,
      xfwd: true,
      target: match.to,
    };

    if (match.to.startsWith('https')) {
      opt.agent = https.globalAgent;
    }

    return createProxyMiddleware(opt)(req, res, next);
  }
  next();
};
