import {
  BoardState,
  CENTER_COL,
  COL_COUNT,
  Column,
  Coord,
  Empty,
  emptyBoard,
  Line,
  LineObj,
  LineType,
  LineVictoryObject,
  PlayerColor,
  PlayerToken,
  Red,
  Row,
  ROW_COUNT,
  Yellow,
} from '../models/gameModels';
import { copy2dArr } from './utils';

export const getCol = (board: BoardState, col: number): Column => [...board[col]] as Column;

export const getRow = (board: BoardState, row: number): Row => board.map((col) => col[row]) as Row;

export const colIdxInBounds = (c: number) => c >= 0 && c < COL_COUNT;
export const rowIdxInBounds = (r: number) => r >= 0 && r < ROW_COUNT;

export const getULDiagonal = (board: BoardState, col: number, row: number): Line => {
  return getULDiagonalObj(board, col, row).line;
};

export const getURDiagonal = (board: BoardState, col: number, row: number): Line => {
  return getURDiagonalObj(board, col, row).line;
};

/**
 * Returns all possible lines in which connect-4 can happen, including rows, columns, and diagonals
 */
export const getAllLines = (board: BoardState): LineObj => {
  let lines: LineObj = { cols: [], rows: [], UL: [], UR: [] };
  for (let i = 0; i < ROW_COUNT; i++) {
    lines.cols.push(getCol(board, i));
    lines.rows.push(getRow(board, i));
    lines.UL.push(getULDiagonal(board, CENTER_COL, i));
    lines.UR.push(getURDiagonal(board, CENTER_COL, i));
  }
  lines.cols.push(getCol(board, COL_COUNT - 1));

  return lines;
};

export const identifyMajorThreats = (board: BoardState): BoardState => {
  const record = getEmptyBoard();

  const checkIdxInLine = (line: Line, idx: number, player: PlayerColor): PlayerToken => {
    const lineCopy = [...line];
    lineCopy[idx] = player;
    const result = checkLineForWin(lineCopy);
    return result ? result.player : Empty;
  };

  const saveResult = (result: PlayerToken, lineType: LineType, lineIdx: number, cellIdx: number): void => {
    if (!result) return;
    const coord = getCoordFromLine(lineType, lineIdx, cellIdx);
    const currentRecord = record[coord.col][coord.row];
    if (!currentRecord) {
      record[coord.col][coord.row] = result;
    } else if (currentRecord === getOtherPlayer(result as PlayerColor)) {
      record[coord.col][coord.row] = PlayerToken.Both;
    }
  };

  const checkAndRecord = (line: Line, lineType: LineType, lineIdx: number) => {
    return (player: PlayerColor, cellIdx: number) => {
      const result = checkIdxInLine(line, cellIdx, player);
      saveResult(result, lineType, lineIdx, cellIdx);
    };
  };

  const removeInaccessibleThreats = (threatMap: BoardState): BoardState => {
    const result = copy2dArr(threatMap) as BoardState;
    for (let col of result) {
      let foundBoth = false;
      for (let r = 0; r < ROW_COUNT; r++) {
        if (foundBoth) {
          col[r] = Empty;
        } else if (col[r] === PlayerToken.Both) {
          foundBoth = true;
        }
      }
    }
    return result;
  };

  const linesObj = getAllLines(board);
  for (let key in linesObj) {
    const lineType = key as LineType;
    const lines = linesObj[lineType as LineType];
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const check = checkAndRecord(line, lineType, i);
      if (line[CENTER_COL] === Empty) {
        check(Red, CENTER_COL);
        check(Yellow, CENTER_COL);
      } else {
        const color = line[CENTER_COL] as PlayerColor;
        for (let cellIdx = 0; cellIdx < line.length; cellIdx++) {
          if (!line[cellIdx]) {
            check(color, cellIdx);
          }
        }
      }
    }
  }

  return removeInaccessibleThreats(record);
};

const getLinesForCoord = (c: Coord, lineObj: LineObj): Line[] => {
  const lines: Line[] = [];
  lines.push(lineObj.rows[c.row]);
  lines.push(lineObj.cols[c.col]);

  const colsFromCenter = CENTER_COL - c.col;

  const urRow = c.row + colsFromCenter;
  if (rowIdxInBounds(urRow)) {
    lines.push(lineObj.UR[urRow]);
  }

  const ulRow = c.row - colsFromCenter;
  if (rowIdxInBounds(ulRow)) {
    lines.push(lineObj.UL[ulRow]);
  }
  return lines;
};

export const getCoordFromLine = (lineType: LineType, lineIdx: number, cellIdx: number): Coord => {
  let col: number;
  let row: number;
  switch (lineType) {
    case 'rows':
      return { col: cellIdx, row: lineIdx };
    case 'cols':
      return { col: lineIdx, row: cellIdx };
    case 'UR':
      col = CENTER_COL - lineIdx + cellIdx;
      row = cellIdx;
      if (lineIdx > CENTER_COL) {
        col += lineIdx - CENTER_COL;
        row += lineIdx - CENTER_COL;
      }
      return { col, row };
    case 'UL':
      col = CENTER_COL + lineIdx - cellIdx;
      row = cellIdx;
      if (lineIdx > CENTER_COL) {
        col -= lineIdx - CENTER_COL;
        row += lineIdx - CENTER_COL;
      }
      return { col, row };
    default:
  }
  throw new Error(`This shouldn't happen`);
};

export const checkLineForWin = (line: Line): LineVictoryObject | null => {
  // assumes line of 7 or less, which works for lines, cols, and all diagonals
  if (line.length < 4 || line[CENTER_COL] === Empty) {
    return null;
  }
  for (let i = 0; i < line.length - 3; i++) {
    if (line[i] !== Empty && line[i + 1] === line[i] && line[i + 2] === line[i] && line[i + 3] === line[i]) {
      const result = { player: line[i], coordinates: [i] };
      for (let j = 1; i + j < line.length && line[i + j] === line[i]; j++) {
        result.coordinates.push(i + j);
      }
      return result;
    }
  }
  return null;
};

export const getULDiagonalObj = (arr: any[][], col: number, row: number): { line: Line; index: number } => {
  const line = [];
  const stepsToBase = Math.min(row, arr.length - 1 - col);
  // then count up while adding each value
  for (let i = stepsToBase * -1; row + i < arr[0].length && col - i >= 0; i++) {
    line.push(arr[col - i][row + i]);
  }

  return { line, index: stepsToBase };
};

export const getURDiagonalObj = (arr: any[][], col: number, row: number): { line: Line; index: number } => {
  const line = [];
  const index = Math.min(row, col);
  // starting from lowest cell in line, add each cell to line arr
  for (let i = index; row - i < arr[0].length && col - i < arr.length; i--) {
    line.push(arr[col - i][row - i]);
  }

  return { line, index };
};

export const getOtherPlayer = (player: PlayerColor) => (player === Red ? Yellow : Red);

// All below untested

export const successCheck = (power: number = 1, chanceToSucceed: number = 1): boolean => {
  if (chanceToSucceed === 1) return true;
  const chanceToFail = (1 - chanceToSucceed) ** power;
  return Math.random() > chanceToFail;
};

export const getEmptyBoard = (): BoardState => {
  return [...emptyBoard.map((col) => [...col])] as BoardState;
};

export const matches = (player: PlayerToken) => (val: PlayerToken) => val === Empty || val === player;

export const countOpportunities = (board: BoardState): { [key in PlayerColor]: number[][] } => {
  const result = {
    [Red]: getEmptyBoard() as number[][],
    [Yellow]: getEmptyBoard() as number[][],
  };
  const lines = getAllLines(board);
  for (let key in lines) {
    const lineType = key as LineType;
    const lineGroup = lines[lineType];
    for (let l = 0; l < lineGroup.length; l++) {
      const line = lineGroup[l];
      for (let i = 0; i < line.length - 3; i++) {
        for (let player of [Red, Yellow] as PlayerColor[]) {
          const match = matches(player);
          if (match(line[i]) && match(line[i + 1]) && match(line[i + 2]) && match(line[i + 3])) {
            const matchCoords = [
              getCoordFromLine(lineType, l, i),
              getCoordFromLine(lineType, l, i + 1),
              getCoordFromLine(lineType, l, i + 2),
              getCoordFromLine(lineType, l, i + 3),
            ];
            for (let coord of matchCoords) {
              if (!!board[coord.col][coord.row]) continue;
              result[player][coord.col][coord.row] += 1;
            }
          }
        }
      }
    }
  }
  return result;
};
