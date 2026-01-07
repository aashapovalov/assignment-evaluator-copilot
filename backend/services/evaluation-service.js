import fs from 'fs/promises';
import { mlService } from './ml-service.js';
import { extractChunksFromNotebook } from "../utils/index.js";
import { evidenceService } from './evidence-service.js';
import { scoringService } from './scoring-service.js';

/**
 * @typedef {Object} Timings
 * @property {number} fileRead - Time to read files (ms)
 * @property {number} chunkExtraction - Time to extract chunks (ms)
 * @property {number} rubricCompilation - Time to compile rubric (ms)
 * @property {number} embeddings - Time to generate embeddings (ms)
 * @property {number} evidenceExtraction - Time to extract evidence (ms)
 * @property {number} reportGeneration - Time to generate report (ms)
 * @property {number} total - Total pipeline time (ms)
 */

/**
 * @typedef {Object} EvaluationReport
 * @property {number} overall_score - Overall score (0-100)
 * @property {Object} breakdown - Score breakdown
 * @property {number} breakdown.requirements_met - Number of requirements met
 * @property {number} breakdown.requirements_partial - Number of partial requirements
 * @property {number} breakdown.requirements_missing - Number of missing requirements
 * @property {number} breakdown.critical_failures - Number of critical failures
 * @property {Array<RequirementStatus>} per_requirement_status - Status per requirement
 * @property {string} timestamp - ISO timestamp
 * @property {Timings} _timings - Performance timings
 */

/**
 * @typedef {Object} RequirementStatus
 * @property {string} requirement_id - Unique requirement ID
 * @property {string} description - Requirement description
 * @property {string} category - Requirement category
 * @property {string} status - PASS/PARTIAL/FAIL/UNKNOWN
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} evidence_quote - Code evidence
 * @property {string} feedback - Feedback message
 * @property {number} points_earned - Points earned
 * @property {number} points_possible - Points possible
 */

/**
 * Orchestrates the full evaluation pipeline.
 * Executes 6 stages: file reading, chunk extraction, rubric compilation,
 * embedding generation, evidence extraction, and report generation.
 *
 * @param {Object} options - Evaluation options
 * @param {string} options.assignmentPath - Path to assignment text file (.txt or .md)
 * @param {string} options.notebookPath - Path to Jupyter notebook (.ipynb)
 * @returns {Promise<EvaluationReport>} Complete evaluation report with timings
 * @throws {Error} If files cannot be read or ML service is unavailable
 */
export async function evaluationService({ assignmentPath, notebookPath }) {
  const timings = {};
  const startTime = Date.now();

  console.log('📥 Received evaluation request');

  // 1) Read input files
  const t1 = Date.now();
  const assignmentText = await fs.readFile(assignmentPath, 'utf-8');
  const notebookContent = await fs.readFile(notebookPath, 'utf-8');
  timings.fileRead = Date.now() - t1;

  // 2) Parse notebook + extract chunks
  const t2 = Date.now();
  const notebook = JSON.parse(notebookContent);
  const chunks = extractChunksFromNotebook(notebook);
  timings.chunkExtraction = Date.now() - t2;
  console.log(`📊 Extracted ${chunks.length} chunks from notebook (${timings.chunkExtraction}ms)`);

  // 3) Compile rubric
  const t3 = Date.now();
  console.log('1️⃣ Compiling rubric...');
  const rubric = await mlService.compileRubric(assignmentText);
  timings.rubricCompilation = Date.now() - t3;
  console.log(`✓ Rubric compiled: ${rubric.length} requirements (${timings.rubricCompilation}ms)`);

  // 4) Generate embeddings
  const t4 = Date.now();
  console.log('2️⃣ Generating embeddings...');
  const { embeddings } = await mlService.embedChunks(chunks);
  timings.embeddings = Date.now() - t4;
  console.log(`✓ Generated ${embeddings.length} embeddings (${timings.embeddings}ms)`);

  // 5) Extract evidence per requirement (PARALLEL)
  const t5 = Date.now();
  console.log('3️⃣ Extracting evidence...');
  const evidenceResults = await evidenceService({
    rubric,
    chunks,
    embeddings,
    k: 3,
  });
  timings.evidenceExtraction = Date.now() - t5;
  console.log(`✓ Evidence extracted for ${evidenceResults.length} requirements (${timings.evidenceExtraction}ms)`);

  // 6) Score and build report
  const t6 = Date.now();
  const report = scoringService({
    rubric,
    evidenceResults,
  });
  timings.reportGeneration = Date.now() - t6;

  timings.total = Date.now() - startTime;

  // Log timing breakdown
  console.log('\n⏱️  TIMING BREAKDOWN:');
  console.log(`   File read:            ${timings.fileRead}ms`);
  console.log(`   Chunk extraction:     ${timings.chunkExtraction}ms`);
  console.log(`   Rubric compilation:   ${timings.rubricCompilation}ms`);
  console.log(`   Embeddings:           ${timings.embeddings}ms`);
  console.log(`   Evidence extraction:  ${timings.evidenceExtraction}ms`);
  console.log(`   Report generation:    ${timings.reportGeneration}ms`);
  console.log(`   ────────────────────────────────────`);
  console.log(`   TOTAL:                ${timings.total}ms (${(timings.total / 1000).toFixed(1)}s)\n`);

  // Include timings in report for debugging
  return {
    ...report,
    _timings: timings,
  };
}