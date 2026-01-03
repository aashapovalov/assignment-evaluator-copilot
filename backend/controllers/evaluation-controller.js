import fs from 'fs/promises';
import { evaluationService } from '../services';

export async function evaluationController (req, res, next){
  /**
   * Main evaluation endpoint (HTTP layer)
   * - validates input
   * - delegates to evaluationService
   * - always cleans up uploaded files
   */
    let assignmentPath, notebookPath;

    try {
      const assignmentFile = req.files?.assignment?.[0];
      const notebookFile = req.files?.notebook?.[0];

      if (!assignmentFile || !notebookFile) {
        return res.status(400).json({
          error: 'Both assignment and notebook files are required',
        });
      }

      assignmentPath = assignmentFile.path;
      notebookPath = notebookFile.path;

      const report = await evaluationService({
        assignmentPath,
        notebookPath,
      });

      res.json(report);
    } catch (err) {
      next(err);
    } finally {
      await Promise.all([
        assignmentPath ? fs.unlink(assignmentPath).catch(() => {}) : null,
        notebookPath ? fs.unlink(notebookPath).catch(() => {}) : null,
      ]);
    }
  }
