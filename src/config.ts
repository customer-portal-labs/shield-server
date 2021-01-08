import { cosmiconfigSync } from 'cosmiconfig';
import merge from 'lodash/merge';
import { ShieldConfig, LoggerLevel } from './models/Config';

const explorerSync = cosmiconfigSync('shield');

export const getConfig = (): ShieldConfig => {
  const rcResult = explorerSync.search();
  const defaultConfig: ShieldConfig = {
    name: 'shield-server',
    compression: true,
    cors: true,
    mode: 'static',
    morganFormat: 'combined',
    port: 8080,
    debug: false,
    splunk: {
      httpRequest: false,
    },
    historyApiFallback: false,
    helmetOption: {
      contentSecurityPolicy: false,
      referrerPolicy: false,
    },
    loggerLevel: 'info',
    requestBodySize: '100kb',
  };

  let config = defaultConfig;
  if (rcResult) {
    const rcConfig = rcResult.config;
    config = merge(defaultConfig, rcConfig);
  }

  if (process.env.LOGGER_LEVEL !== undefined) {
    config.loggerLevel = process.env.LOGGER_LEVEL as LoggerLevel;
  }

  if (process.env.SPLUNK_HOST !== undefined) {
    config.splunk.host = process.env.SPLUNK_HOST;
  }
  if (process.env.SPLUNK_TOKEN !== undefined) {
    config.splunk.token = process.env.SPLUNK_TOKEN;
  }
  if (process.env.SPLUNK_SOURCE !== undefined) {
    config.splunk.source = process.env.SPLUNK_SOURCE;
  }
  if (process.env.SPLUNK_SOURCE_TYPE !== undefined) {
    config.splunk.sourceType = process.env.SPLUNK_SOURCE_TYPE;
  }
  if (process.env.SPLUNK_SOURCE_HOST !== undefined) {
    config.splunk.sourceHost = process.env.SPLUNK_SOURCE_HOST;
  }

  return defaultConfig;
};
