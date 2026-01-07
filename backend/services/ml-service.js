import axios from 'axios';

import { config } from '../config/index.js';

/**
 * Axios client for ML service API calls.
 * Configured with base URL from environment and custom timeout.
 */

const mlClient = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @typedef {Object} Requirement
 * @property {string} id - Unique requirement ID
 * @property {string} description - Requirement description
 * @property {number} weight - Weight in scoring (0-1)
 * @property {boolean} critical - Is critical requirement
 * @property {string} category - Requirement category
 */

/**
 * @typedef {Object} CodeChunk
 * @property {string} text - Code or markdown text
 * @property {number} cell_index - Cell index in notebook
 * @property {string} type - 'code' or 'markdown'
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
 * @typedef {Object} SearchResult
 * @property {number} rank - Result rank (1-based)
 * @property {number} index - Chunk index
 * @property {number} score - Similarity score
 * @property {ChunkMetadata} metadata - Chunk metadata
 */

/**
 * @typedef {Object} EvidenceResult
 * @property {string} status - PASS/PARTIAL/FAIL/UNKNOWN
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} evidence_quote - Code evidence quote
 * @property {string} reasoning - Evaluation reasoning
 */

/**
 * ML Service API client.
 * Provides methods for interacting with the Python ML service running on Google Colab.
 */

export const mlService = {
  /**
   * Check ML service health
   */
  async checkHealth() {
    const response = await mlClient.get('/health');
    return response.data;
  },

  /**
   * Compiles rubric from assignment text using template-based parsing.
   *
   * @param {string} assignmentText - Assignment text (.txt or .md content)
   * @returns {Promise<Array<Requirement>>} Array of extracted requirements
   * @throws {Error} If ML service returns error or requirements not found
   */
  async compileRubric(assignmentText) {
    const response = await mlClient.post('/compile-rubric', {
      assignment_text: assignmentText,
    });

    console.log('Rubric compilation response:', JSON.stringify(response.data, null, 2));

    if (!response.data.success) {
      console.error('Rubric compilation failed:', response.data);
      throw new Error(`Rubric compilation failed: ${response.data.error || response.data.raw_response}`);
    }

    return response.data.rubric;
  },

  /**
   * Generates embeddings for code chunks using MiniLM transformer.
   *
   * @param {Array<CodeChunk>} chunks - Array of code chunks
   * @returns {Promise<{embeddings: Array<Array<number>>, dimension: number, count: number}>} Embedding vectors
   * @throws {Error} If ML service fails to generate embeddings
   */
  async embedChunks(chunks) {
    const response = await mlClient.post('/embed-chunks', {
      chunks: chunks.map(c => c.text),
    });

    return {
      embeddings: response.data.embeddings,
      dimension: response.data.dimension,
      count: response.data.count,
    };
  },

  /**
   * Searches for relevant code chunks using FAISS vector similarity.
   *
   * @param {string} query - Search query (requirement description)
   * @param {Array<Array<number>>} embeddings - Pre-computed chunk embeddings
   * @param {Array<ChunkMetadata>} chunksMetadata - Chunk metadata
   * @param {number} k - Number of top results to return
   * @returns {Promise<Array<SearchResult>>} Top-k most similar chunks
   * @throws {Error} If search fails
   */
  async searchChunks(query, embeddings, chunksMetadata, k = 3) {
    const response = await mlClient.post('/search-chunks', {
      query,
      embeddings,
      chunks_metadata: chunksMetadata,
      k,
    });

    return response.data.results;
  },

  /**
   * Extracts evidence from code chunks using rule-based matching.
   * Determines if requirement is met based on keyword matching and patterns.
   *
   * @param {string} requirement - Requirement description
   * @param {Array<string>} chunks - Retrieved code chunks
   * @returns {Promise<EvidenceResult>} Evidence extraction result
   * @throws {Error} If evidence extraction fails
   */
  async extractEvidence(requirement, chunks) {
    const response = await mlClient.post('/extract-evidence', {
      requirement,
      chunks,
    });

    return response.data;
  },
};