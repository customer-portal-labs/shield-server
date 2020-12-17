import { expect } from 'chai';
import { logger } from '../src/logger';

describe('logger', () => {
  it('default logger', (done) => {
    logger.log('hello log');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');
    logger.debug('hello debug');

    done();
  });
});
