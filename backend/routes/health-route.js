import { Router } from 'express';
import { healthController } from '../controllers';

export const healthRoute = Router();

healthRoute.get('/health', healthController.checkHealth);