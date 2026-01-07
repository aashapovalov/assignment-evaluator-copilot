import { mlService } from './ml-service.js';

/**
 * @typedef {Object} CodeChunk
 * @property {string} text - Code or markdown text
 * @property {number} cell_index - Index of cell in notebook
 * @property {string} type - 'code' or 'markdown'
 * @property {number} [start_line] - Starting line number (for split cells)
 * @property {number} [end_line] - Ending line number (for split cells)
 */

/**
 * @typedef {Object} ChunkMetadata
 * @property {number} index - Index in chunks array
 * @property {number} cell_index - Original cell index
 * @property {string} type - 'code' or 'markdown'
 * @property {number} [start_line] - Starting line number
 * @property {number} [end_line] - Ending line number
 */

/**
 * @typedef {Object} Requirement
 * @property {string} id - Unique requirement ID (e.g., "REQ_1")
 * @property {string} description - Requirement description
 * @property {number} weight - Weight in final score (0-1)
 * @property {boolean} critical - Whether requirement is critical
 * @property {string} category - Requirement category
 */

/**
 * @typedef {Object} EvidenceResult
 * @property {string} requirement_id - Requirement ID
 * @property {string} requirement_description - Requirement description
 * @property {string} status - PASS/PARTIAL/FAIL/UNKNOWN
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} evidence_quote - Extracted code evidence
 * @property {string} reasoning - Explanation of evaluation
 */

/**
 * Extract evidence for all requirements in parallel.
 * For each requirement:
 * - Retrieves top-k relevant chunks using vector search
 * - Evaluates if requirement is met using ML service
 * - Returns status, confidence, and evidence
 *
 * @param {Object} options - Evidence extraction options
 * @param {Array<Requirement>} options.rubric - Array of requirements to evaluate
 * @param {Array<CodeChunk>} options.chunks - Extracted code chunks from notebook
 * @param {Array<Array<number>>} options.embeddings - Vector embeddings for chunks
 * @param {number} [options.k=3] - Number of top chunks to retrieve per requirement
 * @returns {Promise<Array<EvidenceResult>>} Evidence results for all requirements
 * @throws {Error} If ML service call fails
 */

export async function evidenceService({ rubric, chunks, embeddings, k = 3 }) {
  const chunksMetadata = chunks.map((chunk, index) => ({
    index: index,
    cell_index: chunk.cell_index,
    type: chunk.type,
    start_line: chunk.start_line,
    end_line: chunk.end_line,
  }));

  console.log(`   Processing ${rubric.length} requirements in parallel...`);

  // Create array of promises - all execute simultaneously
  const evidencePromises = rubric.map(async (requirement, reqIndex) => {
    const reqStart = Date.now();

    try {
      // Search for relevant chunks
      const searchResults = await mlService.searchChunks(
          requirement.description,
          embeddings,
          chunksMetadata,
          k
      );

      // Get top chunks
      const topChunks = searchResults
          .map(result => chunks[result.index]?.text)
          .filter(Boolean);

      // Extract evidence
      const evidence = await mlService.extractEvidence(
          requirement.description,
          topChunks
      );

      const reqTime = Date.now() - reqStart;
      console.log(`   [${reqIndex + 1}/${rubric.length}] ${requirement.description.substring(0, 40)}... ✓ ${evidence.status} (${reqTime}ms)`);

      return {
        requirement_id: requirement.id,
        requirement_description: requirement.description,
        ...evidence,
      };
    } catch (error) {
      console.error(`   [${reqIndex + 1}/${rubric.length}] ✗ Error: ${error.message}`);

      // Return fallback on error
      return {
        requirement_id: requirement.id,
        requirement_description: requirement.description,
        status: 'UNKNOWN',
        confidence: 0,
        evidence_quote: '',
        reasoning: `Error: ${error.message}`,
      };
    }
  });

  // Wait for ALL promises to complete
  return await Promise.all(evidencePromises);
}