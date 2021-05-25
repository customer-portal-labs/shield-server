import express, { Request, Response } from 'express';
import request from 'supertest';
import { defaultMiddlewares } from '../../src/index';

describe('responseWrapper middleware', () => {
  it('success response', (done) => {
    const app = express();
    app.use(defaultMiddlewares());
    app.get('/user', (req: Request, res: Response) => {
      res.success({ name: 'john' });
    });

    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(200)
      .end(() => {
        done();
      });
  });

  it('fail response', (done) => {
    const app = express();
    app.use(defaultMiddlewares());
    app.get('/user', (req: Request, res: Response) => {
      res.fail('test fail', 401);
    });

    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(401)
      .end(() => {
        done();
      });
  });

  it('error response', (done) => {
    const app = express();
    app.use(defaultMiddlewares());
    app.get('/user', (req: Request, res: Response) => {
      res.error('test error', 500);
    });

    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(400)
      .end(() => {
        done();
      });
  });
});
