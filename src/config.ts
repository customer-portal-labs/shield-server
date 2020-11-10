import { cosmiconfigSync } from 'cosmiconfig';
import { IConfig } from './models/Config';

const explorerSync = cosmiconfigSync('shield');

export const getConfig = (): IConfig => {
  const defaultConfig: IConfig = {
    mode: 'static',
    port: 8080,
    debug: process.env.NODE_ENV !== 'production',
    isSentrySupport: !!process.env.SENTRY_DSN,
    historyApiFallback: false,
  };
  const rcResult = explorerSync.search();

  if (rcResult) {
    const rcConfig = rcResult.config;
    return Object.assign(defaultConfig, rcConfig);
  }
  return defaultConfig;
};

const getEnvironment = () => {
  const openShiftNamespace = process.env.OPENSHIFT_NAMESPACE;
  if (openShiftNamespace) {
    return openShiftNamespace.replace(/^labs/i, '');
  }
  return 'local';
};

const isProduction = process.env.NODE_ENV === 'production';
const isDebugMode = process.env.DEBUG_MODE === 'true';
const isSentrySupport = !!process.env.SENTRY_DSN;
const port = process.env.PORT || 8080;
const environment = getEnvironment();

// // Will using OpenShift config to replace it
// const nodeOptions: { [key: string]: string } = {
//   // Increase the header size to avoid HTTP 431 Error
//   'max-http-header-size': '32768',
// };

// process.env.NODE_OPTIONS = Object.keys(
//   (key: string) => `--${key}=${nodeOptions[key]}`
// ).join(' ');

export default {
  isProduction,
  isDebugMode,
  isSentrySupport,
  environment,
  port,
};
