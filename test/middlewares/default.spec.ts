import express, { Request, Response } from 'express';
import merge from 'lodash/merge';
import request from 'supertest';
import { expect } from 'chai';
import { defaultMiddlewares, ShieldConfig, getConfig } from '../../src/index';

describe('middlewares', () => {
  it('default middleware', (done) => {
    const app = express();
    app.use(defaultMiddlewares());
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
    app.use(defaultMiddlewares({ mode: 'api' }));
    app.get('/api/user', (req: Request, res: Response) => {
      res.success({ name: 'john' });
    });
    request(app)
      .get('/api/user')
      .set('User-Agent', 'Unit test')
      .expect(
        200,
        {
          status: 'success',
          data: {
            name: 'john',
          },
        },
        done
      );
  });

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

  it('with rewrite', (done) => {
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

  it('health router', (done) => {
    const app = express();
    app.use(defaultMiddlewares());

    request(app)
      .get('/server-health')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK", done);
  });

  it('info router', (done) => {
    const newConfig: Partial<ShieldConfig> = {
      splunk: {
        host: 'https://any.any',
      },
    };

    const app = express();
    app.use(defaultMiddlewares(newConfig));
    const config = getConfig();

    request(app)
      .get('/server-info')
      .set('User-Agent', 'Unit test')
      .expect(200, merge(config, newConfig), done);
  });

  it('skip health log', (done) => {
    const app = express();
    app.use(defaultMiddlewares({morganSkip: '/server-health'}));

    request(app)
      .get('/server-health')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK", done);
  });
});
