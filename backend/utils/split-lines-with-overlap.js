/*
Function for extracting chunks of code from big notebook cells to
prevent creation of very general embeddings which are too hard to assess and
compare with requirements
*/
import {CHUNK_OVERLAP, LINES_PER_CHUNK} from "../globals";

export function splitLinesWithOverlap(source) {
  const lines = source.split('\n');
  const chunks = [];

  const step = Math.max(1, LINES_PER_CHUNK - CHUNK_OVERLAP);

  for (let start = 0; start < lines.length; start += step) {
    const end = Math.min(start + LINES_PER_CHUNK, lines.length);
    const text = lines.slice(start, end).join('\n').trim();

    if (text) {
      chunks.push({
        text,
        start_line: start + 1,
        end_line: end
      });
    }

    if (end === lines.length) break;
  }

  return chunks;
}
