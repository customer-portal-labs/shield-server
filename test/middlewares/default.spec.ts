import express, { Request, Response } from 'express';
import request from 'supertest';
import defaultMiddleware from '../../src/middlewares/default';
import { getConfig } from '../../src/config';
import SelfResponse from '../../src/models/Response';

describe('middlewares', () => {
  it('default middleware', (done) => {
    const app = express();
    app.use(defaultMiddleware());
    app.get('/user', (req: Request, res: Response) => {
      res.status(200).json({ name: 'john' });
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

  it('api mode', (done) => {
    const app = express();
    const config = getConfig();
    app.use(defaultMiddleware({ ...config, mode: 'api' }));
    app.get('/api/user', (req: Request, res: Response) => {
      (res as SelfResponse).success({ name: 'john' });
    });
    request(app)
      .get('/api/user')
      .set('User-Agent', 'Unit test')
      .expect(
        200,
        {
          status: 200,
          data: {
            name: 'john',
          },
        },
        done
      );
  });

  it('with proxy', (done) => {
    const app = express();
    const config = getConfig();
    app.use(
      defaultMiddleware({
        ...config,
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
  });

  it('with rewrite', (done) => {
    const app = express();
    const config = getConfig();
    app.use(
      defaultMiddleware({
        ...config,
        rewrite: [
          {
            from: '/api/user',
            to: '/user',
          },
        ],
      })
    );

    app.get('/user', (req: Request, res: Response) => {
      res.status(200).json({ name: 'john' });
    });
    request(app)
      .get('/api/user')
      .set('User-Agent', 'Unit test')
      .expect(200)
      .end(done);
  });
});
