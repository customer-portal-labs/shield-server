import Log2Splunk, { ILog2SplunkOptions, IMetadata } from 'log2splunk';
import { LoggerLevel, ShieldConfig } from './models/Config';
import { getConfig } from './config';
import { merge } from 'lodash';

export class Logger {
  private SplunkLogger;
  private defaultMetadata: IMetadata;
  private shouldSendToSplunk = false;
  private levelConfig: LoggerLevel = 'info';
  private loggerLevelMapping: { [key in LoggerLevel]: number } = {
    error: 0,
    warn: 1,
    info: 2,
    log: 3,
    debug: 4,
  };
  constructor(options: Partial<ShieldConfig> = getConfig()) {
    const config = merge(getConfig(), options);
    const opts: Partial<ILog2SplunkOptions> = {
      token: config.splunk.token,
      host: config.splunk.host,
      source: config.splunk.source,
      https: {
        rejectUnauthorized: false,
      },
    };

    this.defaultMetadata = {
      host: config.splunk.sourceHost,
    };
    this.SplunkLogger = new Log2Splunk(opts);
    this.levelConfig = config.loggerLevel;

    if (!!config.splunk.token && !!config.splunk.host) {
      this.shouldSendToSplunk = true;
    }
  }

  private sendToSplunk(
    message: string | Record<string, unknown>,
    level: LoggerLevel,
    metadata: IMetadata = this.defaultMetadata
  ) {
    if (this.shouldSendToSplunk) {
      const newMetadata = {
        ...this.defaultMetadata,
        ...metadata,
      };
      this.SplunkLogger.send(message, {
        sourcetype: level,
        ...newMetadata,
      }).catch((err) => {
        console.error('Send log to Splunk failed:', err)
      });
    }
  }

  private stringMessage(message?: string | Record<string, unknown>) {
    if (typeof message !== 'string') {
      return JSON.stringify(message);
    }
    return message;
  }

  private shouldShow(level: LoggerLevel): boolean {
    return (
      this.loggerLevelMapping[this.levelConfig] >=
      this.loggerLevelMapping[level]
    );
  }

  log(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (this.shouldShow('log')) {
      console.log(this.stringMessage(message));
      this.sendToSplunk(message, 'log', metadata);
    }
  }

  info(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (this.shouldShow('info')) {
      console.info(this.stringMessage(message));
      this.sendToSplunk(message, 'info', metadata);
    }
  }

  debug(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (this.shouldShow('debug')) {
      console.debug(this.stringMessage(message));
      this.sendToSplunk(message, 'debug', metadata);
    }
  }

  warn(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (this.shouldShow('warn')) {
      console.warn(this.stringMessage(message));
      this.sendToSplunk(message, 'warn', metadata);
    }
  }

  error(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (this.shouldShow('error')) {
      console.error(this.stringMessage(message));
      this.sendToSplunk(message, 'error', metadata);
    }
  }
}

export const logger = new Logger();
