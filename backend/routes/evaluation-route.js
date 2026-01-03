import { Router } from 'express';

import { evaluationController } from '../controllers/index.js';

import { upload } from '../middleware/index.js';

export const evaluationRouter = Router();

evaluationRouter.post(
    '/api/evaluate',
    upload.fields([
      { name: 'assignment', maxCount: 1 },
      { name: 'notebook', maxCount: 1 },
    ]),
    evaluationController
);
