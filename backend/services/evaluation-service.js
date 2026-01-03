import fs from 'fs/promises';
import { mlService } from './ml-service.js';
import { extractChunksFromNotebook} from "../utils";
import { evidenceService, scoringService } from './';

/**
 * Orchestrates the full evaluation pipeline.
 * Keeps business logic out of controllers.
 */
export async function evaluationService({ assignmentPath, notebookPath }) {
   console.log('📥 Received evaluation request');

    // 1) Read input files
    const assignmentText = await fs.readFile(assignmentPath, 'utf-8');
    const notebookContent = await fs.readFile(notebookPath, 'utf-8');

    // 2) Parse notebook + extract chunks
    const notebook = JSON.parse(notebookContent);
    const chunks = extractChunksFromNotebook(notebook);
    console.log(`📊 Extracted ${chunks.length} chunks from notebook`);

    // 3) Compile rubric
    console.log('1️⃣ Compiling rubric...');
    const rubric = await mlService.compileRubric(assignmentText);
    console.log(`✓ Rubric compiled: ${rubric.length} requirements`);

    // 4) Generate embeddings
    console.log('2️⃣ Generating embeddings...');
    const { embeddings } = await mlService.embedChunks(chunks);
    console.log(`✓ Generated ${embeddings.length} embeddings`);

    // 5) Extract evidence per requirement
    console.log('3️⃣ Extracting evidence...');
    const evidenceResults = await evidenceService.extractForRubric({
      rubric,
      chunks,
      embeddings,
      k: 3,
    });
    console.log(`✓ Evidence extracted for ${evidenceResults.length} requirements`);

    // 6) Score and build report
    return scoringService.buildReport({
      rubric,
      evidenceResults,
    });
  }
