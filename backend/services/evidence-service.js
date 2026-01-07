import { mlService } from './ml-service.js';

/**
 * For each rubric requirement:
 * - retrieve top-k relevant chunks (vector search)
 * - ask ML service to judge PASS/FAIL/PARTIAL with reasoning
 *
 * OPTIMIZED: Processes all requirements in PARALLEL
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