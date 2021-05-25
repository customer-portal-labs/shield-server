import express, { Request, Response } from 'express';
import request from 'supertest';
import { defaultMiddlewares } from '../../src/index';

describe('proxy middleware', () => {
  it('with proxy', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
        proxies: [
          {
            from: '/library',
            to: 'https://www.apple.com',
          },
        ],
      })
    );
    request(app)
      .get('/library/test/success.html')
      .set('User-Agent', 'Unit test')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(done);
  }).timeout(300000);

  it('with proxy but no match request', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
        proxies: [
          {
            from: '/library',
            to: 'https://www.apple.com',
          },
        ],
      })
    );
    request(app)
      .get('/server-health')
      .set('User-Agent', 'Unit test')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(done);
  });
});
