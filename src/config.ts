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

  if (defaultConfig.splunk) {
    if (process.env.SPLUNK_HOST !== undefined) {
      defaultConfig.splunk.host = process.env.SPLUNK_HOST;
    }
    if (process.env.SPLUNK_TOKEN !== undefined) {
      defaultConfig.splunk.token = process.env.SPLUNK_TOKEN;
    }
    if (process.env.SPLUNK_SOURCE !== undefined) {
      defaultConfig.splunk.source = process.env.SPLUNK_SOURCE;
    }
    if (process.env.SPLUNK_SOURCE_TYPE !== undefined) {
      defaultConfig.splunk.sourceType = process.env.SPLUNK_SOURCE_TYPE;
    }
    if (process.env.SPLUNK_SOURCE_HOST !== undefined) {
      defaultConfig.splunk.sourceHost = process.env.SPLUNK_SOURCE_HOST;
    }
  }

  if (rcResult) {
    const rcConfig = rcResult.config;
    return Object.assign(defaultConfig, rcConfig);
  }
  return defaultConfig;
};

export const config = getConfig();
