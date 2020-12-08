import { cosmiconfigSync } from 'cosmiconfig';
import { IConfig } from './models/Config';

const explorerSync = cosmiconfigSync('shield');

export const getConfig = (): IConfig => {
  const rcResult = explorerSync.search();
  const defaultConfig: IConfig = {
    compression: true,
    cors: true,
    mode: 'static',
    morganFormat: 'combined',
    port: 8080,
    debug: false,
    isSentrySupport: !!process.env.SENTRY_DSN,
    historyApiFallback: false,
    helmetOption: {
      contentSecurityPolicy: false,
      referrerPolicy: false,
    },
  };
  if (rcResult) {
    const rcConfig = rcResult.config;
    return Object.assign(defaultConfig, rcConfig);
  }
  return defaultConfig;
};
