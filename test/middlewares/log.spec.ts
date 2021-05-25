import express, { Request, Response } from 'express';
import request from 'supertest';
import { defaultMiddlewares } from '../../src/index';

describe('log middleware', () => {
  it('log with cookie', (done) => {
    const app = express();
    app.use(defaultMiddlewares());

    app.get('/user', (req: Request, res: Response) => {
      res.status(200).json({ name: 'john' });
    });

    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .set('Cookie', 'rh_user=testuser|Test|P|;')
      .expect(200)
      .end(done);
  });

  it('log with skip', (done) => {
    const app = express();
    app.use(defaultMiddlewares({
      morganSkip: (req, res) => req.url === '/user'
    }));

    app.get('/user', (req: Request, res: Response) => {
      res.status(200).json({ name: 'john' });
    });

    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .set('Cookie', 'rh_user=testuser|Test|P|;')
      .expect(200)
      .end(done);
  });

  it('log with splunk', (done) => {
    const app = express();
    app.use(defaultMiddlewares({
      splunk: {
        httpRequest: true
      }
    }));

    app.get('/user', (req: Request, res: Response) => {
      res.status(200).json({ name: 'john' });
    });

    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .set('Cookie', 'rh_user=testuser|Test|P|;')
      .expect(200)
      .end(done);
  });
});
