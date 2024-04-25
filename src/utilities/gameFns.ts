import {
  BoardState,
  CENTER_COL,
  Coord,
  Empty,
  emptyBoard,
  Line,
  LineType,
  LineVictoryObject,
  PlayerColor,
  PlayerToken,
  Red,
  ROW_COUNT,
  Yellow,
} from '../models/gameModels';
import { copy2dArr } from './utils';

export const checkIdxInLine = (line: Line, idx: number, player: PlayerColor): PlayerToken => {
  const lineCopy = [...line];
  lineCopy[idx] = player;
  const result = checkLineForWin(lineCopy);
  return result ? result.player : Empty;
};

export const removeInaccessibleThreats = (threatMap: BoardState): BoardState => {
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

export const getOtherPlayer = (player: PlayerColor) => (player === Red ? Yellow : Red);

// All below untested

export const successCheck = (power: number = 1, chanceToSucceed: number = 1): boolean => {
  if (chanceToSucceed === 1) return true;
  const chanceToFail = (1 - chanceToSucceed) ** power;
  return Math.random() > chanceToFail;
};

export const getEmptyBoardArr = (): BoardState => {
  return [...emptyBoard.map((col) => [...col])] as BoardState;
};

export const matches = (player: PlayerColor) => (val: PlayerToken) => val === Empty || val === player;

export const moveStrToCoord = (moveStr: string) => {
  const [colStr, rowStr] = moveStr.split('');
  const row = Number(rowStr) - 1;
  const col = colStr.toLowerCase().charCodeAt(0) - 97;
  return { row, col };
};

export const coordToMoveStr = (coord: Coord, player: PlayerColor) => {
  let colStr = 'ABCDEFG';
  if (player === PlayerToken.Yellow) colStr = colStr.toLowerCase();
  return colStr[coord.col] + (coord.row + 1);
};
