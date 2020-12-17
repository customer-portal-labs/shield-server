import { Router } from 'express';
import { ShieldConfig } from '../models/Config';

export default (config: ShieldConfig): Router => {
  const router = Router();

  router.get('/server-info', (req, res) => {
    res.status(200).json(config);
  });

  return router;
};
