import express, { Request, Response } from 'express';
import request from 'supertest';
import {
  defaultMiddlewares,
  defaultErrorHandlers,
} from '../../src/index';

describe('rateLimit middleware', () => {
  const app = express();
  app.use(
    defaultMiddlewares({
      rateLimitOption: {
        max: 2,
      },
    })
  );

  app.get('/api/user', (req: Request, res: Response) => {
    res.success({ name: 'john' });
  });

  app.use(defaultErrorHandlers());

  const agent = request.agent(app);

  it('should throw rate error since 3rd request', async () => {
    await agent
      .get('/api/user')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(200, {
        status: 'success',
        data: {
          name: 'john',
        },
      });

    await agent
      .get('/api/user')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(200, {
        status: 'success',
        data: {
          name: 'john',
        },
      });

    await agent
      .get('/api/user')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(429);
    await agent
      .get('/api/user')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(429);
  });

  it('should skip health check', async () => {
    await agent
      .get('/server-health')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK");

    await agent
      .get('/server-health')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK");

    await agent
      .get('/server-health')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK");
    await agent
      .get('/server-health')
      .set('True-Client-IP', '192.168.1.1')
      .set('User-Agent', 'Unit test')
      .expect(200, "I'm OK");
  });
});
