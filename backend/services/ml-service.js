import axios from 'axios';

import { config } from '../config/index.js';

const mlClient = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mlService = {
  /**
   * Check ML service health
   */
  async checkHealth() {
    const response = await mlClient.get('/health');
    return response.data;
  },

  /**
   * Compile rubric from assignment text
   */
  async compileRubric(assignmentText) {
    const response = await mlClient.post('/compile-rubric', {
      assignment_text: assignmentText,
    });

    if (!response.data.success) {
      throw new Error('Rubric compilation failed');
    }

    return response.data.rubric;
  },

  /**
   * Generate embeddings for code chunks
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
   * Search for relevant chunks using FAISS
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
   * Extract evidence for a requirement
   */
  async extractEvidence(requirement, chunks) {
    const response = await mlClient.post('/extract-evidence', {
      requirement,
      chunks,
    });

    return response.data;
  },
};