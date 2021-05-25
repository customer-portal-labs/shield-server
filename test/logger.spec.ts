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

  it('test debug level', () => {
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

  it('test log level', () => {
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

  it('test info level', () => {
    const logger = new Logger({ loggerLevel: 'info' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello info', 'hello warn', 'hello error']);
  });

  it('test warn level', () => {
    const logger = new Logger({ loggerLevel: 'warn' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello warn', 'hello error']);
  });

  it('test error level', (done) => {
    const logger = new Logger({ loggerLevel: 'error' });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello error']);

    done();
  });

  it('test error level with env vars', (done) => {
    process.env.LOGGER_LEVEL = 'error';
    const logger = new Logger();
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello error']);
    done();
  });

  it('test error level with splunk setting', (done) => {
    process.env.LOGGER_LEVEL = 'error';
    const logger = new Logger({
      splunk: {
        token: 'test_token',
        host: '127.0.0.1',
        source: 'test_source',
      }
    });
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');
    expect(output).to.eql(['hello error']);
    done();
  });
});
