import { expect } from 'chai';
import { Logger } from '../src/logger';
import { LoggerLevel } from '../src/models/Config';

describe('logger', () => {
  const initialLoggerLevel: LoggerLevel = process.env
    .LOGGER_LEVEL as LoggerLevel;
  const consoleWarn = console.warn;
  const consoleLog = console.log;
  const consoleInfo = console.info;
  const consoleDebug = console.debug;
  const consoleError = console.error;
  let output: string[] = [];
  const mockedConsole = (str: string) => output.push(str);
  beforeEach(async () => {
    console.log = mockedConsole;
    console.warn = mockedConsole;
    console.debug = mockedConsole;
    console.info = mockedConsole;
    console.error = mockedConsole;
  });
  afterEach(() => {
    process.env.LOGGER_LEVEL = initialLoggerLevel;
    console.log = consoleLog;
    console.warn = consoleWarn;
    console.debug = consoleDebug;
    console.info = consoleInfo;
    console.error = consoleError;
    output = [];
  });

  it('test debug level', async () => {
    const logger = new Logger({ loggerLevel: 'debug' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql([
      'hello log',
      'hello info',
      'hello warn',
      'hello error',
      'hello debug',
    ]);
  });

  it('test log level', async () => {
    const logger = new Logger({ loggerLevel: 'log' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql([
      'hello log',
      'hello info',
      'hello warn',
      'hello error',
    ]);
  });

  it('test info level', async () => {
    const logger = new Logger({ loggerLevel: 'info' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello info', 'hello warn', 'hello error']);
  });

  it('test warn level', async () => {
    const logger = new Logger({ loggerLevel: 'warn' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello warn', 'hello error']);
  });

  it('test error level', async () => {
    const logger = new Logger({ loggerLevel: 'error' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello error']);
  });

  it('test error level with env vars', async () => {
    process.env.LOGGER_LEVEL = 'error';
    const logger = new Logger();
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello error']);
  });
});
