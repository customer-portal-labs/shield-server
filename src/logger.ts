import Log2Splunk, { ILog2SplunkOptions, IMetadata } from 'log2splunk';
import { LoggerLevel } from './models/Config';
import { config } from './config';

const opts: Partial<ILog2SplunkOptions> = {
  token: process.env.SPLUNK_TOKEN || '',
  host: process.env.SPLUNK_HOST,
  source: process.env.SPLUNK_SOURCE,
  https: {
    rejectUnauthorized: false,
  },
};

const defaultMetadata: IMetadata = {
  host: process.env.SPLUNK_SOURCE_HOST,
};

class Logger {
  private SplunkLogger = new Log2Splunk(opts);

  private sendToSplunk(
    message: string | Record<string, unknown>,
    level: LoggerLevel,
    metadata: IMetadata = defaultMetadata
  ) {
    if (!!process.env.SPLUNK_TOKEN && !!process.env.SPLUNK_HOST) {
      this.SplunkLogger.send(message, {
        sourcetype: level,
        ...metadata,
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
    process.stdout.write(this.stringMessage(message));
    this.sendToSplunk(message, 'log', metadata);
  }

  info(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    process.stdout.write(this.stringMessage(message));
    this.sendToSplunk(message, 'info', metadata);
  }

  debug(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (config.loggerLevel === 'debug') {
      process.stdout.write(this.stringMessage(message));
      this.sendToSplunk(message, 'debug', metadata);
    }
  }

  warn(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    if (config.loggerLevel === 'warn') {
      process.stdout.write(this.stringMessage(message));
      this.sendToSplunk(message, 'warn', metadata);
    }
  }

  error(message: string | Record<string, unknown>, metadata?: IMetadata): void {
    process.stderr.write(this.stringMessage(message));
    this.sendToSplunk(message, 'error', metadata);
  }
}

export const logger = new Logger();
