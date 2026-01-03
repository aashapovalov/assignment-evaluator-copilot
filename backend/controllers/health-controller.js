import { mlService } from '../services/index.js';

export const healthController = {
  async checkHealth(req, res, next) {
    try {
      const mlHealth = await mlService.checkHealth();

      res.status(200).json({
        backend: 'healthy',
        ml_service: mlHealth,
      });
    } catch (error) {
      res.status(503).json({
        backend: 'healthy',
        ml_service: 'unavailable',
        error: error.message,
      });
    }
  },
};