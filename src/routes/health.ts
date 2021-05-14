import { Router } from 'express';

export default (healthCheckPath: string): Router => {
  const router = Router();

  router.get(healthCheckPath, (req, res) => {
    res.status(200).send("I'm OK");
  });

  return router;
};
