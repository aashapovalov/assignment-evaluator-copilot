/*
function iterates through cell object and cuts code in chunks if cell is too big to analyze it
 */

import {MAX_CELL_LINES} from "../globals/index.js";
import { splitLinesWithOverlap } from "./split-lines-with-overlap.js";

/**
 * @typedef {Object} NotebookCell
 * @property {string} cell_type - 'code' or 'markdown'
 * @property {string|Array<string>} source - Cell content (string or array of lines)
 */

/**
 * @typedef {Object} Notebook
 * @property {Array<NotebookCell>} cells - Array of notebook cells
 */

/**
 * @typedef {Object} CodeChunk
 * @property {string} text - Code or markdown text
 * @property {number} cell_index - Index of cell in original notebook
 * @property {string} type - 'code' or 'markdown'
 * @property {number} [start_line] - Starting line number (for split cells)
 * @property {number} [end_line] - Ending line number (for split cells)
 */

/**
 * Extracts semantic chunks from a Jupyter notebook.
 *
 * Processing rules:
 * - Code cells ≤ MAX_CELL_LINES: kept intact
 * - Code cells > MAX_CELL_LINES: split into smaller chunks with overlap
 * - Markdown cells: always kept intact
 * - Empty cells: skipped
 *
 * Large cells are split to prevent context window overflow and improve
 * semantic search accuracy by focusing on smaller, cohesive code blocks.
 *
 * @param {Notebook} notebook - Parsed Jupyter notebook object
 * @returns {Array<CodeChunk>} Array of extracted code chunks with metadata
 *
 * @example
 * const notebook = JSON.parse(fs.readFileSync('notebook.ipynb', 'utf-8'));
 * const chunks = extractChunksFromNotebook(notebook);
 * // Returns: [{ text: "import pandas...", cell_index: 0, type: "code", ... }, ...]
 */

export function extractChunksFromNotebook(notebook) {
  const chunks = [];
  let cellIndex = 0;

  //join array of lines in a string
  for (const cell of notebook.cells) {
    const rawSource = Array.isArray(cell.source) ? cell.source.join('') : (cell.source ?? '');
    const source = rawSource.trim();

    //skip empty cells
    if (!source) {
      cellIndex++;
      continue;
    }

    //define code cells processing logic
    if (cell.cell_type === 'code') {
      // split string into array
      const lineCount = source.split('\n').length;

      //if there is no much code in the cell, we leave it as it is
      if (lineCount <= MAX_CELL_LINES) {
        chunks.push({
          text: source,
          cell_index: cellIndex,
          start_line: 1,
          end_line: lineCount,
          type: 'code'
        });
      } else {
        //if the cell contains too much code, we cut it into chunks
        const sub = splitLinesWithOverlap(source);
        for (const sc of sub) {
          chunks.push({
            text: sc.text,
            cell_index: cellIndex,
            start_line: sc.start_line,
            end_line: sc.end_line,
            type: 'code'
          });
        }
      }
      //markdown cell we leave as it is
    } else if (cell.cell_type === 'markdown') {
      chunks.push({
        text: source,
        cell_index: cellIndex,
        type: 'markdown'
      });
    }

    cellIndex++;
  }

  return chunks;
}
