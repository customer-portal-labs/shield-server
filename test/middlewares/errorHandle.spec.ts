import express, { Request, Response } from 'express';
import request from 'supertest';
import { expect } from 'chai';
import {
  defaultMiddlewares,
  defaultErrorHandlers,
  config,
  Response as SelfResponse,
} from '../../src/index';

describe('errorHandlers', () => {
  it('default error', (done) => {
    const app = express();

    app.get('/user', (req: Request, res: Response) => {
      throw new Error('Unit test error');
    });
    app.use(defaultErrorHandlers());

    request(app).get('/user').set('User-Agent', 'Unit test').expect(500, done);
  });

  it('api mode', (done) => {
    const app = express();
    app.use(defaultMiddlewares({ ...config, mode: 'api' }));

    app.get('/api/user', (req: Request, res: Response) => {
      throw new Error('Unit test error');
    });

    app.use(defaultErrorHandlers({ ...config, mode: 'api' }));

    request(app)
      .get('/api/user')
      .set('User-Agent', 'Unit test')
      .expect(500)
      .expect((res) => {
        expect(res.body).to.contains({
          status: 'error',
          error: 'Unit test error',
        });
      })
      .end(done);
  });
});
