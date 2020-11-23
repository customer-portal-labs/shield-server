export interface IConfig {
  mode: TMode;
  debug: boolean;
  port?: number;
  ssl?: ISSL;
  compress?: boolean;
  cors?: boolean;
  staticDir?: string;
  publicPath?: string;
  isSentrySupport?: boolean;
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

class Config {}
