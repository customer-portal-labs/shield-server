import { expect } from 'chai';
import { getConfig } from '../src/config';

describe('config', () => {
  it('default config', () => {
    const config = getConfig();

    expect(config).to.be.not.null;
    expect(config.mode).to.eq('static');
    expect(config.port).to.eq(8080);
    expect(config.cors).to.true;
    expect(config.debug).to.false;
  });

  it('With Splunk ENV', () => {
    // process.env.LOGGER_LEVEL = 'error';
    process.env.SPLUNK_HOST = 'mock_host';
    process.env.SPLUNK_TOKEN = 'mock_token';
    process.env.SPLUNK_SOURCE = 'mock_source';
    process.env.SPLUNK_SOURCE_TYPE = 'mock_source_type';
    process.env.SPLUNK_SOURCE_HOST = 'mock_source_host';

    const config = getConfig();
    expect(config.splunk).to.be.not.null;
    expect(config.splunk.host).to.eq('mock_host');
    expect(config.splunk.token).to.eq('mock_token');
    expect(config.splunk.source).to.eq('mock_source');
    expect(config.splunk.sourceType).to.eq('mock_source_type');
    expect(config.splunk.sourceHost).to.eq('mock_source_host');
  });

  it('With Logger ENV', () => {
    process.env.LOGGER_LEVEL = 'error';

    const config = getConfig();
    expect(config.loggerLevel).to.be.not.null;
    expect(config.loggerLevel).to.eq('error');
  });

  afterEach(() => {
    delete process.env.SPLUNK_HOST;
    delete process.env.SPLUNK_TOKEN;
    delete process.env.SPLUNK_SOURCE;
    delete process.env.SPLUNK_SOURCE_TYPE;
    delete process.env.SPLUNK_SOURCE_HOST;
    delete process.env.LOGGER_LEVEL;
  })

});
