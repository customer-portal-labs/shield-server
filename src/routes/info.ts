import { Router } from 'express';
import { IConfig } from '../models/Config';

export default (config: IConfig): Router => {
  const router = Router();

  router.get('/server-info', (req, res) => {
    res.status(200).json(config);
  });

  return router;
};
