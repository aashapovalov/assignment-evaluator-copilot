/*
function iterates through cell object and cuts code in chunks if cell is too big to analyze it
 */

import {MAX_CELL_LINES} from "../globals";
import { splitLinesWithOverlap } from "./";

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
