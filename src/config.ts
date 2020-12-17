import { cosmiconfigSync } from 'cosmiconfig';
import { ShieldConfig } from './models/Config';

const explorerSync = cosmiconfigSync('shield');

const getConfig = (): ShieldConfig => {
  const rcResult = explorerSync.search();
  const defaultConfig: ShieldConfig = {
    name: 'shield-server',
    compression: true,
    cors: true,
    mode: 'static',
    morganFormat: 'combined',
    port: 8080,
    debug: false,
    responseWrapper: true, // Only works when mode = api
    splunk: {
      httpRequest: false,
    },
    historyApiFallback: false,
    helmetOption: {
      contentSecurityPolicy: false,
      referrerPolicy: false,
    },
    loggerLevel: 'info',
  };
  if (rcResult) {
    const rcConfig = rcResult.config;
    return Object.assign(defaultConfig, rcConfig);
  }
  return defaultConfig;
};

export const config = getConfig();
