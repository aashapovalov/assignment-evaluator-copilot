import fs from 'fs/promises';
import { evaluationService } from '../services/index.js';

/**
 * @typedef {Object} MulterFile
 * @property {string} fieldname - Field name specified in the form
 * @property {string} originalname - Name of the file on user's computer
 * @property {string} encoding - Encoding type of the file
 * @property {string} mimetype - MIME type of the file
 * @property {number} size - Size of the file in bytes
 * @property {string} destination - Folder to which the file has been saved
 * @property {string} filename - Name of the file within the destination
 * @property {string} path - Full path to the uploaded file
 */

/**
 * @typedef {Object} EvaluationRequest
 * @property {Object} files - Uploaded files object
 * @property {Array<MulterFile>} files.assignment - Assignment text file(s)
 * @property {Array<MulterFile>} files.notebook - Notebook file(s)
 */

/**
 * Main evaluation controller (HTTP layer).
 * Handles file upload, delegates to evaluation service, and ensures cleanup.
 *
 * Flow:
 * 1. Validates uploaded files
 * 2. Delegates to evaluationService for processing
 * 3. Returns evaluation report as JSON
 * 4. Always cleans up uploaded files (success or error)
 *
 * @param {EvaluationRequest} req - Express request object with uploaded files
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 *
 * @example
 * // POST /api/evaluate
 * // Content-Type: multipart/form-data
 * // Body: assignment=@file.txt, notebook=@notebook.ipynb
 */

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
