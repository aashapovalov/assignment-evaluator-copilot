import { mlService } from './';

  /**
   * For each rubric requirement:
   * - retrieve top-k relevant chunks (vector search)
   * - ask LLM to judge PASS/FAIL/PARTIAL with reasoning
   */
  export async function evidenceService({ rubric, chunks, embeddings, k = 3 }) {
    const chunksMetadata = chunks.map((chunk, index) => ({
      index: index,
      cell_index: chunk.cell_index,
      type: chunk.type,
      start_line: chunk.start_line,
      end_line: chunk.end_line,
    }));

    const evidenceResults = [];

    for (const requirement of rubric) {
      const searchResults = await mlService.searchChunks(
          requirement.description,
          embeddings,
          chunksMetadata,
          k
      );

      const topChunks = searchResults.map(result => chunks[result.index]?.text).filter(Boolean);

      const evidence = await mlService.extractEvidence(requirement.description, topChunks);

      evidenceResults.push({
        requirement_id: requirement.id,
        requirement_description: requirement.description,
        ...evidence,
      });
    }

    return evidenceResults;
  }
