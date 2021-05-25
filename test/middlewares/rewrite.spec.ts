import express, { Request, Response } from 'express';
import request from 'supertest';
import { defaultMiddlewares } from '../../src/index';

describe('rewrite middleware', () => {
  it('with rewrite and url match', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
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

  it('with rewrite and url not match', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
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
      .get('/server-health')
      .set('User-Agent', 'Unit test')
      .expect(200)
      .end(done);
  });
});
