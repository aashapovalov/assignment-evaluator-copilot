import { Router } from 'express';

import { evaluationController } from '../controllers';
import { upload } from '../middleware';

export const evaluationRouter = Router();

evaluationRouter.post(
    '/api/evaluate',
    upload.fields([
      { name: 'assignment', maxCount: 1 },
      { name: 'notebook', maxCount: 1 },
    ]),
    evaluationController
);
