export interface IConfig {
  mode: TMode;
  debug: boolean;
  port?: number;
  ssl?: ISSL;
  compress?: boolean;
  cors?: boolean;
  staticDir?: string;
  isSentrySupport?: boolean;
  historyApiFallback?: boolean;
}

export interface ISSL {
  cert: string;
  key: string;
  ca?: string;
}

export type TMode = 'static' | 'api' | 'fullstack';
