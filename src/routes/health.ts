import { Router } from 'express';

const router = Router();

router.get('/server-health', (req, res) => {
  res.status(200).send("I'm OK");
});

export default router;
