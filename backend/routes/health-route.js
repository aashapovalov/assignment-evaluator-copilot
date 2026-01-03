import { Router } from 'express';

import { healthController } from '../controllers/index.js';

export const healthRouter = Router();

healthRouter.get('/health', healthController.checkHealth);