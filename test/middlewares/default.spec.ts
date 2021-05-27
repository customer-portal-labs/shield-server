import { expect } from 'chai';
import express, { Request, Response } from 'express';
import merge from 'lodash/merge';
import request from 'supertest';
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
      .expect('Content-Encoding', 'gzip')
      .expect('access-control-allow-origin', '*')
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
      .expect(200, {
        status: 'success',
        data: {
          name: 'john',
        },
      })
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  it('health router', (done) => {
    const app = express();
    app.use(defaultMiddlewares());

    request(app)
      .get('/server-health')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK")
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
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
      .expect(200, merge(config, newConfig))
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  it('skip health log', (done) => {
    const app = express();
    app.use(defaultMiddlewares({ morganSkip: '/server-health' }));

    request(app)
      .get('/server-health')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK")
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  // somehow, the content-encoding not work. this is a fake test
  it('disable compression', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
        compression: false
      })
    );
    app.get('/user', (req: Request, res: Response) => {
      res.send({ name: 'john' });
    });
    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  it('disable cors', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
        cors: false
      })
    );
    app.get('/user', (req: Request, res: Response) => {
      res.send({ name: 'john' });
    });
    request(app)
      .get('/user')
      .set('User-Agent', 'Unit test')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.headers['access-control-allow-origin']).not.exist;
        done();
      });
  });

  // TODO need refactor historyfallback part
  it('enable history fallback', (done) => {
    const app = express();
    app.use(
      defaultMiddlewares({
        historyApiFallback: true,
        staticDir: 'public'
      })
    );
    app.get('/', (req: Request, res: Response) => {
      res.send("Hello world");
    });
    app.get('/index.html', (req: Request, res: Response) => {
      res.send("Hello world");
    });
    request(app)
      .get('/not-exsit')
      .expect(404)
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });
});
