import Log2Splunk, { ILog2SplunkOptions, IMetadata } from 'log2splunk';
import { LoggerLevel } from './models/Config';
import { config } from './config';

const opts: Partial<ILog2SplunkOptions> = {
  token: config.splunk?.token,
  host: config.splunk?.host,
  source: config.splunk?.source,
  https: {
    rejectUnauthorized: false,
  },
};

const defaultMetadata: IMetadata = {
  host: config.splunk?.sourceHost,
};

class Logger {
  private SplunkLogger = new Log2Splunk(opts);

  private sendToSplunk(
    message: string | Record<string, unknown>,
    level: LoggerLevel,
    metadata: IMetadata = defaultMetadata
  ) {
    if (!!config.splunk?.token && !!config.splunk?.host) {
      const newMetadata = {
        ...defaultMetadata,
        ...metadata,
      };
      this.SplunkLogger.send(message, {
        sourcetype: level,
        ...newMetadata,
      });
    }
  }

  private stringMessage(message?: string | Record<string, unknown>) {
    if (typeof message !== 'string') {
      return JSON.stringify(message);
    }
    return message;
  }

  log(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    console.log(this.stringMessage(message));
    this.sendToSplunk(message, 'log', metadata);
  }

  info(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    console.info(this.stringMessage(message));
    this.sendToSplunk(message, 'info', metadata);
  }

  debug(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (config.loggerLevel === 'debug') {
      console.debug(this.stringMessage(message));
      this.sendToSplunk(message, 'debug', metadata);
    }
  }

  warn(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (config.loggerLevel === 'warn') {
      console.warn(this.stringMessage(message));
      this.sendToSplunk(message, 'warn', metadata);
    }
  }

  error(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    console.error(this.stringMessage(message));
    this.sendToSplunk(message, 'error', metadata);
  }
}

export const logger = new Logger();
