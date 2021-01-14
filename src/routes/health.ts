import { Router } from 'express';

export default (): Router => {
  const router = Router();

  router.get('/server-health', (req, res) => {
    res.status(200).send("I'm OK");
  });

  return router;
};
