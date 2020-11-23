import https from 'https';
import * as core from 'express-serve-static-core';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { IConfig } from '../models/Config';

export const setProxies = (app: core.Express, config: IConfig) => {
  if (config.proxies) {
    config.proxies.forEach((proxy) => {
      const options: Options = {
        changeOrigin: true,
        xfwd: true,
        target: proxy.to,
      };

      if (proxy.to.startsWith('https')) {
        options.agent = https.globalAgent;
      }
      app.use(proxy.from, createProxyMiddleware(options));
    });
  }
};
