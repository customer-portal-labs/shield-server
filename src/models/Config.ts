export interface ShieldConfig {
  name: string;
  mode: ShieldMode;
  debug: boolean;
  morganFormat: string;
  morganSkip?: string | ((req: Request, res: Response) => boolean);
  port?: number;
  ssl?: SSLConfig;
  compression?: boolean;
  cors?: boolean;
  corsOption?: Record<string, unknown>;
  helmetOption?: Record<string, unknown>;
  staticDir?: string;
  publicPath?: string;
  splunk: SplunkOption;
  historyApiFallback?: boolean;
  proxies?: ProxyConfig[];
  rewrite?: RewriteRule[];
  loggerLevel: LoggerLevel;
  requestBodySize?: string;
  healthCheckPath: string;
  rateLimitOption?: Record<string, unknown>;
}

export interface SSLConfig {
  cert: string;
  key: string;
  ca?: string;
}

export interface ProxyConfig {
  from: string;
  to: string;
}

export interface RewriteRule {
  from: string;
  to: string;
}

export interface SplunkOption {
  host?: string;
  token?: string;
  source?: string;
  sourceType?: string;
  sourceHost?: string;
  httpRequest?: boolean;
}

export type ShieldMode = 'static' | 'api' | 'fullstack';
export type LoggerLevel = 'log' | 'info' | 'warn' | 'debug' | 'error';
