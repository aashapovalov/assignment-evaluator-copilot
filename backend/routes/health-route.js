import { Router } from 'express';
import { healthController } from '../controllers';

export const healthRouter = Router();

healthRouter.get('/health', healthController.checkHealth);