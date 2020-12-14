import { CorsOptions, CorsOptionsDelegate } from 'cors';

export interface IConfig {
  name: string;
  mode: TMode;
  debug: boolean;
  morganFormat: string;
  port?: number;
  ssl?: ISSL;
  compression?: boolean;
  cors?: boolean;
  corsOption?: CorsOptions | CorsOptionsDelegate;
  helmetOption?: Record<string, unknown>;
  staticDir?: string;
  publicPath?: string;
  isSplunkSupport?: boolean;
  historyApiFallback?: boolean;
  proxies?: IProxy[];
  rewrite?: IRewriteRule[];
}

export interface ISSL {
  cert: string;
  key: string;
  ca?: string;
}

export interface IProxy {
  from: string;
  to: string;
}

export interface IRewriteRule {
  from: string;
  to: string;
}

export type TMode = 'static' | 'api' | 'fullstack';
