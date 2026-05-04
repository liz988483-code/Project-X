import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SOKO API Gateway',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

export default router;